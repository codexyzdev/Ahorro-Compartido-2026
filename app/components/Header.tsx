/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Cloud, RefreshCw, LogOut, Settings, History } from 'lucide-react';

interface HeaderProps {
    customLogo?: string;
    partner1: string;
    partner2: string;
    isAuthenticated: boolean;
    isSyncing: boolean;
    lastSyncTime: string | null;
    historyLength: number;
    onLogin: () => void;
    onLogout: () => void;
    onSync: () => void;
    onOpenSettings: () => void;
    onOpenHistory: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    customLogo,
    partner1,
    partner2,
    isAuthenticated,
    isSyncing,
    lastSyncTime,
    historyLength,
    onLogin,
    onLogout,
    onSync,
    onOpenSettings,
    onOpenHistory,
}) => {
    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-3 sm:px-4 py-3 sm:py-4 shadow-sm">
            <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl overflow-hidden flex items-center justify-center border border-slate-100 shadow-sm transition-transform active:scale-95 shrink-0 p-1">
                        {customLogo ? (
                            <img src={customLogo} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                            <img src="/logo.webp" alt="Logo" className="w-full h-full object-contain" />
                        )}
                    </div>
                    <div className="min-w-0">
                        <h1 className="font-serif text-lg sm:text-xl font-bold leading-tight truncate">Reto 2026</h1>
                        <p className="text-[9px] sm:text-[10px] text-slate-500 font-black uppercase tracking-widest truncate">{partner1} & {partner2}</p>
                    </div>
                </div>
                <div className="flex gap-1.5 sm:gap-2 items-center shrink-0">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-1.5 sm:gap-3 bg-slate-50 px-2 sm:px-3 py-1.5 rounded-full border border-slate-100">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black uppercase text-emerald-600 flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="hidden xs:inline">Sincronizado</span>
                                </span>
                                <span className="text-[9px] text-slate-400 hidden sm:inline">
                                    {isSyncing ? 'Sincronizando...' : lastSyncTime ? `Hoy, ${lastSyncTime}` : 'Recién'}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2">
                                <button
                                    onClick={onSync}
                                    disabled={isSyncing}
                                    className={`p-1.5 hover:bg-white rounded-full transition-all ${isSyncing ? 'animate-spin text-emerald-500' : 'text-slate-400 hover:text-emerald-500'}`}
                                    title="Sincronizar ahora"
                                >
                                    <RefreshCw size={14} />
                                </button>
                                <div className="w-px h-4 bg-slate-200" />
                                <button
                                    onClick={onLogout}
                                    className="p-1.5 hover:bg-white rounded-full text-slate-400 hover:text-rose-500 transition-all"
                                    title="Cerrar sesión de Google"
                                >
                                    <LogOut size={14} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={onLogin}
                            className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-3 sm:px-4 py-2 rounded-xl text-[10px] sm:text-xs font-black transition-all active:scale-95 shadow-sm shadow-rose-200"
                        >
                            <Cloud size={14} className="sm:w-4 sm:h-4" />
                            <span className="xs:inline">CONECTAR</span>
                        </button>
                    )}
                    <button onClick={onOpenSettings} className="p-2 sm:p-2.5 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                        <Settings size={18} className="sm:w-5 sm:h-5" />
                    </button>
                    <button onClick={onOpenHistory} className="p-2 sm:p-2.5 hover:bg-slate-100 rounded-full relative transition-colors">
                        <History size={18} className="sm:w-5 sm:h-5 text-slate-600" />
                        {historyLength > 0 && <span className="absolute top-1.5 right-1.5 w-2 sm:w-2.5 h-2 sm:h-2.5 bg-rose-500 rounded-full border-2 border-white" />}
                    </button>
                </div>
            </div>
        </header>
    );
};
