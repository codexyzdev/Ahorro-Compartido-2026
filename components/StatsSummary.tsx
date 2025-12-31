import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, CheckCircle2, Calendar } from 'lucide-react';
import { MagicNumber } from './MagicNumber';
import { GOAL_AMOUNT } from '../constants';

interface StatsSummaryProps {
    totalSaved: number;
    progressPercent: number;
    completedSlotsCount: number;
    daysLeft: number;
    purpose: string;
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({
    totalSaved,
    progressPercent,
    completedSlotsCount,
    daysLeft,
    purpose,
}) => {
    return (
        <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute -right-8 -top-8 p-8 opacity-[0.03] pointer-events-none rotate-12">
                <TrendingUp size={240} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                    <p className="text-slate-500 text-[10px] font-black uppercase mb-1">Ahorro total</p>
                    <div className="flex items-baseline gap-2">
                        <MagicNumber value={totalSaved.toLocaleString()} prefix="$" className="text-4xl font-black text-slate-900" />
                        <span className="text-slate-400 font-medium text-lg">/ ${GOAL_AMOUNT.toLocaleString()}</span>
                    </div>
                    <div className="mt-8 space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                            <span>Progreso de {purpose}</span>
                            <span className="text-rose-600 font-bold">{progressPercent.toFixed(1)}%</span>
                        </div>
                        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-rose-500 to-amber-400 rounded-full shadow-sm"
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-center shadow-inner group">
                        <p className="text-slate-400 text-[10px] font-black uppercase mb-1 transition-colors group-hover:text-emerald-500">Sobres Listos</p>
                        <div className="flex items-center justify-center gap-2">
                            <CheckCircle2 size={18} className="text-emerald-500" />
                            <MagicNumber value={completedSlotsCount} className="text-2xl font-black" />
                        </div>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-center shadow-inner group">
                        <p className="text-slate-400 text-[10px] font-black uppercase mb-1 transition-colors group-hover:text-amber-500">Días Restantes</p>
                        <div className="flex items-center justify-center gap-2">
                            <Calendar size={18} className="text-amber-500" />
                            <MagicNumber value={daysLeft} className="text-2xl font-black" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
