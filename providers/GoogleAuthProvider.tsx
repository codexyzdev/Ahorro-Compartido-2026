import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';

const CLIENT_ID = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID;

export function GoogleAuthProvider({ children }: { children: React.ReactNode }) {
    if (!CLIENT_ID) {
        console.warn("VITE_GOOGLE_CLIENT_ID no está definido en el archivo .env");
    }

    return (
        <GoogleOAuthProvider clientId={CLIENT_ID || ''}>
            {children}
        </GoogleOAuthProvider>
    );
}
