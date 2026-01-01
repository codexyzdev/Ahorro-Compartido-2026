import { useState, useCallback, useEffect, useRef } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import { findDataFile, downloadFile, uploadFile } from '../services/drive';
import { SavingsState } from '../types';

export function useDriveSync(currentState: SavingsState, onPullSuccess: (newState: SavingsState) => void, onResetState: () => void) {
    const { data: session, status } = useSession();
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
    const [isDirty, setIsDirty] = useState(false);

    const isAuthenticated = status === "authenticated";
    const accessToken = session?.accessToken;

    const lastStateRef = useRef<string>(JSON.stringify(currentState));

    // 1. Efecto para detectar cambios locales y marcar como "sucio"
    useEffect(() => {
        const currentStateStr = JSON.stringify(currentState);
        if (currentStateStr !== lastStateRef.current) {
            setIsDirty(true);
            lastStateRef.current = currentStateStr;
        }
    }, [currentState]);

    // 2. Función para descargar desde Drive (Pull)
    const syncFromDrive = useCallback(async () => {
        if (!accessToken) return;

        try {
            setIsSyncing(true);
            const file = await findDataFile(accessToken);

            if (file) {
                console.log('📂 Archivo encontrado en Drive, descargando...');
                const cloudData = await downloadFile(file.id, accessToken);

                // Actualizar el estado local a través del callback
                onPullSuccess(cloudData);

                // Actualizar referencia para evitar re-sincreonización inmediata (Push)
                lastStateRef.current = JSON.stringify(cloudData);
                setIsDirty(false);
                setLastSyncTime(new Date().toLocaleTimeString());
            } else {
                console.log('🆕 No existe archivo en Drive, se creará uno nuevo en el próximo guardado.');
            }
        } catch (error: unknown) {
            console.error('Error en syncFromDrive:', error);
            if (error instanceof Error && error.message === 'AUTH_EXPIRED') {
                signIn("google"); // Forzar re-login si el token expiró
            }
        } finally {
            setIsSyncing(true); // Pequeño delay visual
            setTimeout(() => setIsSyncing(false), 500);
        }
    }, [onPullSuccess, accessToken]);

    // 3. Función para subir a Drive (Push)
    const syncToDrive = useCallback(async () => {
        if (!isAuthenticated || !isDirty || !accessToken) return;

        try {
            setIsSyncing(true);
            const file = await findDataFile(accessToken);
            await uploadFile(file?.id || null, currentState, accessToken);

            setIsDirty(false);
            setLastSyncTime(new Date().toLocaleTimeString());
            console.log('☁️ Sincronización exitosa con Drive (Push)');
        } catch (error: unknown) {
            console.error('Error en syncToDrive:', error);
            if (error instanceof Error && error.message === 'AUTH_EXPIRED') {
                signIn("google");
            }
        } finally {
            setIsSyncing(false);
        }
    }, [isAuthenticated, isDirty, currentState, accessToken]);

    // 4. Wrapper para Login
    const login = () => signIn("google");

    // 5. Wrapper para Logout
    const logout = () => {
        signOut();
        onResetState();
    };

    // 6. Verificar sesión al cargar (Pull inicial)
    useEffect(() => {
        if (isAuthenticated && accessToken) {
            syncFromDrive();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, accessToken]); // Solo cuando cambia el estado de auth

    // 7. Intervalo de 30 segundos para guardado automático (Push)
    useEffect(() => {
        if (!isAuthenticated) return;

        const interval = setInterval(() => {
            if (isDirty) {
                syncToDrive();
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [isAuthenticated, isDirty, syncToDrive]);

    // 8. Sincronización inmediata al salir o cambiar de pestaña
    useEffect(() => {
        if (!isAuthenticated) return;

        const handleExiting = () => {
            if (isDirty) {
                console.log('🚀 Intentando guardado de emergencia antes de salir...');
                syncToDrive();
            }
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                handleExiting();
            }
        };

        window.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('beforeunload', handleExiting);

        return () => {
            window.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', handleExiting);
        };
    }, [isAuthenticated, isDirty, syncToDrive]);

    return {
        login,
        logout,
        isAuthenticated,
        isSyncing,
        lastSyncTime,
        isDirty,
        syncFromDrive,
        syncToDrive
    };
}
