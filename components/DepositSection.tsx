import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, ArrowRight } from 'lucide-react';

interface DepositSectionProps {
    isChallengeComplete: boolean;
    isConfirming: boolean;
    depositAmount: string;
    onDepositAmountChange: (value: string) => void;
    onDepositSubmit: (e: React.FormEvent) => void;
    purpose: string;
    inputContainerRef: React.RefObject<HTMLDivElement>;
}

export const DepositSection: React.FC<DepositSectionProps> = ({
    isChallengeComplete,
    isConfirming,
    depositAmount,
    onDepositAmountChange,
    onDepositSubmit,
    purpose,
    inputContainerRef,
}) => {
    if (isChallengeComplete) {
        return (
            <section className="bg-slate-900 rounded-3xl p-10 text-white text-center shadow-2xl border-4 border-amber-400/20 relative overflow-hidden">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-24 -right-24 p-32 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"
                />
                <Trophy size={64} className="mx-auto mb-6 text-amber-400" />
                <h2 className="text-4xl font-serif font-black mb-3 italic">¡RETO LOGRADO!</h2>
                <p className="text-rose-100 text-lg">Felicidades, lo habéis conseguido juntos.</p>
            </section>
        );
    }

    return (
        <motion.section
            layout
            className={`rounded-3xl p-6 text-white shadow-xl transition-all duration-500 ${isConfirming ? 'bg-emerald-600 shadow-emerald-200' : 'bg-slate-900 shadow-slate-200'}`}
        >
            <form onSubmit={onDepositSubmit} className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-lg font-bold">{isConfirming ? '¿Confirmamos este ahorro?' : `Nuevo aporte a ${purpose || 'nuestro sueño'}`}</h3>
                    <p className="text-xs opacity-70">Ahorro compartido para vuestros planes en 2026.</p>
                </div>
                <div className="flex w-full md:w-auto gap-3" ref={inputContainerRef}>
                    <div className="relative flex-1 md:w-48">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 font-black">$</span>
                        <input
                            type="number"
                            value={depositAmount}
                            onChange={(e) => onDepositAmountChange(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 pl-8 pr-4 text-white font-black outline-none focus:bg-white/20 transition-all text-lg shadow-inner"
                        />
                    </div>
                    <button
                        type="submit"
                        className={`px-8 py-3 rounded-2xl font-black flex items-center gap-2 transition-all active:scale-95 shadow-lg ${isConfirming ? 'bg-white text-emerald-600' : 'bg-rose-500 text-white hover:bg-rose-400'}`}
                    >
                        {isConfirming ? 'Confirmar' : 'Guardar'} <ArrowRight size={20} />
                    </button>
                </div>
            </form>
        </motion.section>
    );
};
