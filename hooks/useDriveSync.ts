import { useGoogleLogin } from '@react-oauth/google';
import { useState, useCallback, useEffect, useRef } from 'react';
import { findDataFile, downloadFile, uploadFile } from '../services/drive';
import { SavingsState } from '../types';

export function useDriveSync(currentState: SavingsState, onPullSuccess: (newState: SavingsState) => void, onResetState: () => void) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
    const [isDirty, setIsDirty] = useState(false);

    const lastStateRef = useRef<string>(JSON.stringify(currentState));
    const syncIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
        try {
            setIsSyncing(true);
            const file = await findDataFile();

            if (file) {
                console.log('📂 Archivo encontrado en Drive, descargando...');
                const cloudData = await downloadFile(file.id);

                // Actualizar el estado local a través del callback
                onPullSuccess(cloudData);

                // Actualizar referencia para evitar re-sincreonización inmediata (Push)
                lastStateRef.current = JSON.stringify(cloudData);
                setIsDirty(false);
                setLastSyncTime(new Date().toLocaleTimeString());
            } else {
                console.log('🆕 No existe archivo en Drive, se creará uno nuevo en el próximo guardado.');
            }
        } catch (error) {
            console.error('Error en syncFromDrive:', error);
        } finally {
            setIsSyncing(true); // Pequeño delay visual
            setTimeout(() => setIsSyncing(false), 500);
        }
    }, [onPullSuccess]);

    // 3. Función para subir a Drive (Push)
    const syncToDrive = useCallback(async () => {
        if (!isAuthenticated || !isDirty) return;

        try {
            setIsSyncing(true);
            const file = await findDataFile();
            await uploadFile(file?.id || null, currentState);

            setIsDirty(false);
            setLastSyncTime(new Date().toLocaleTimeString());
            console.log('☁️ Sincronización exitosa con Drive (Push)');
        } catch (error) {
            console.error('Error en syncToDrive:', error);
        } finally {
            setIsSyncing(false);
        }
    }, [isAuthenticated, isDirty, currentState]);

    // 4. Configurar Login de Google
    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            localStorage.setItem('google_access_token', tokenResponse.access_token);
            setIsAuthenticated(true);
            await syncFromDrive();
        },
        scope: 'https://www.googleapis.com/auth/drive.file',
        onError: () => console.error('Login Fallido')
    });

    const logout = () => {
        localStorage.removeItem('google_access_token');
        localStorage.removeItem('ahorro_shared_data'); // Limpiar datos locales
        setIsAuthenticated(false);
        onResetState(); // Reiniciar estado de la UI
    };

    // 5. Verificar sesión al cargar (Pull inicial)
    useEffect(() => {
        const token = localStorage.getItem('google_access_token');
        if (token) {
            setIsAuthenticated(true);
            syncFromDrive();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Solo al montar

    // 6. Intervalo de 30 segundos para guardado automático (Push)
    useEffect(() => {
        if (!isAuthenticated) return;

        const interval = setInterval(() => {
            if (isDirty) {
                syncToDrive();
            }
        }, 10000); // Reducido a 10 segundos para mayor confiabilidad

        return () => clearInterval(interval);
    }, [isAuthenticated, isDirty, syncToDrive]);

    // 7. Sincronización inmediata al salir o cambiar de pestaña (Visibility API + beforeunload)
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
