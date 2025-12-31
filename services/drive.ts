import { SavingsState } from '../types';

interface DriveFile {
    id: string;
    name: string;
    modifiedTime: string;
}

const FILE_NAME = 'ahorro-compartido-2026.json';

export const getAccessToken = (): string | null => {
    return localStorage.getItem('google_access_token');
};

export async function findDataFile(): Promise<DriveFile | null> {
    const token = getAccessToken();
    if (!token) throw new Error('No hay token de acceso');

    const params = new URLSearchParams({
        q: `name='${FILE_NAME}' and trashed=false`,
        fields: 'files(id, name, modifiedTime)',
        spaces: 'drive'
    });

    const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
        if (res.status === 401) {
            localStorage.removeItem('google_access_token');
        }
        throw new Error('Error al buscar el archivo en Drive');
    }

    const data = await res.json();
    return data.files?.[0] || null;
}

export async function downloadFile(fileId: string): Promise<SavingsState> {
    const token = getAccessToken();
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Error al descargar el archivo de Drive');
    return await res.json();
}

export async function uploadFile(fileId: string | null, content: SavingsState): Promise<any> {
    const token = getAccessToken();

    if (fileId) {
        // Actualizar archivo existente (solo contenido)
        const url = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`;
        const res = await fetch(url, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(content)
        });
        if (!res.ok) throw new Error('Error al actualizar el archivo en Drive');
        return await res.json();
    } else {
        // Crear nuevo archivo con metadatos y contenido
        const metadata = {
            name: FILE_NAME,
            mimeType: 'application/json',
            description: 'Estado de ahorro compartido para la app Ahorro 2026'
        };

        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', new Blob([JSON.stringify(content)], { type: 'application/json' }));

        const url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
        const res = await fetch(url, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: form
        });
        if (!res.ok) throw new Error('Error al crear el archivo en Drive');
        return await res.json();
    }
}
