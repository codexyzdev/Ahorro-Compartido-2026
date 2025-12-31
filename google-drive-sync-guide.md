# Guía de Sincronización con Google Drive - Ahorro Compartido 2026

Este documento detalla la implementación para sincronizar el progreso de la aplicación mediante Google Drive, optimizada para una **cuenta de Google compartida** y con un sistema de **guardado cada 30 segundos**.

## 1. Arquitectura de Sincronización

1. **Cuenta Compartida Única**: Ambos usuarios inician sesión con la **misma cuenta de Google** creada para este propósito. Esto permite visualizar el mismo progreso en cualquier teléfono donde se use dicho correo.
2. **Sincronización al Iniciar (Pull)**: Al loguearse o abrir la app, se descargan automáticamente los últimos datos de Drive.
3. **Guardado Periódico (Push)**: Si hay cambios locales, el sistema sincroniza con la nube **cada 30 segundos** en lugar de hacerlo por cada acción, mejorando la eficiencia y evitando límites de la API.

## 2. Configuración de Google Cloud

1. Crear proyecto en [Google Cloud Console](https://console.cloud.google.com/).
2. Habilitar **Google Drive API**.
3. Crear **OAuth 2.0 Client ID** (Tipo: Web Application).
4. Agregar Orígenes Autorizados (ej: `http://localhost:5173`).
5. Configurar `.env`:
   ```env
   VITE_GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
   ```

## 3. Estructura del Código

### A. Dependencias
```bash
pnpm add @react-oauth/google jwt-decode
```

### B. Servicio Drive (`src/services/drive.ts`)
Maneja la búsqueda, descarga y subida del archivo `ahorro-compartido-2026.json`.

### C. Hook de Sincronización (`src/hooks/useDriveSync.ts`)
Implementa la lógica de intervalo de 30 segundos:
```typescript
// Lógica simplificada del intervalo
useEffect(() => {
  const interval = setInterval(() => {
    if (isAuthenticated && hasChanges) {
      syncToDrive(currentState);
    }
  }, 30000); // 30 segundos
  return () => clearInterval(interval);
}, [isAuthenticated, hasChanges, currentState]);
```

### D. Integración en `useSavings.ts`
El hook de ahorros debe disparar un evento o actualizar un estado de "cambios pendientes" para que `useDriveSync` sepa cuándo subir datos.

## 4. Flujo de Usuario
- **Entrada**: El usuario se loguea. La app dice "Sincronizando..." y descarga el progreso.
- **Acción**: El usuario marca un sobre. El cambio es instantáneo localmente.
- **Espera**: A los 30 segundos, si hubo cambios, se suben a Drive automáticamente.
- **Consistencia**: Si el otro usuario entra, descarga la versión más reciente al iniciar sesión.
