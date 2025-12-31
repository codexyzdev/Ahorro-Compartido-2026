
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { SavingSlot } from '../types';

interface Props {
  slot: SavingSlot;
  isRecentlyUpdated?: boolean;
}

export const SlotCard: React.FC<Props> = ({ slot, isRecentlyUpdated = false }) => {
  const isPartial = slot.currentAmount > 0 && !slot.isCompleted;
  const progress = (slot.currentAmount / slot.targetAmount) * 100;
  
  const glowColor = slot.isCompleted 
    ? "rgba(244, 63, 94, 0.4)" 
    : isPartial 
      ? "rgba(244, 63, 94, 0.2)" 
      : "rgba(203, 213, 225, 0.3)";

  return (
    <motion.div 
      layout 
      data-slot-id={slot.id}
      animate={isRecentlyUpdated ? {
        scale: [1, 1.3, 1],
        rotate: [0, -5, 5, 0],
        boxShadow: [
          `0 0px 0px ${glowColor}`,
          `0 20px 50px ${glowColor}`,
          `0 8px 15px ${glowColor}`
        ],
        transition: { duration: 0.5, ease: "backOut" }
      } : {}}
      whileHover={{ 
        scale: 1.1, 
        boxShadow: `0 12px 30px -5px ${glowColor}, 0 8px 15px -6px ${glowColor}`, 
        zIndex: 10,
        transition: { type: "spring", stiffness: 400, damping: 12 }
      }} 
      className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center border shadow-sm transition-all duration-500 select-none
        ${slot.isCompleted 
          ? 'bg-gradient-to-br from-rose-500 to-rose-600 border-rose-700 text-white ring-2 ring-rose-200' 
          : isPartial 
            ? 'bg-white border-rose-300 text-rose-600 ring-2 ring-rose-50' 
            : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
        }`}
    >
      <AnimatePresence>
        {isRecentlyUpdated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 2.5, 3], rotate: [0, 90, 180] }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          >
            <Sparkles className="text-amber-400 w-full h-full p-2" />
          </motion.div>
        )}
      </AnimatePresence>

      <span className="text-[9px] font-black opacity-40 mb-0.5 tracking-tighter">#{slot.id}</span>
      <span className="text-[13px] font-black leading-none">
        ${slot.isCompleted ? slot.targetAmount : (slot.targetAmount - slot.currentAmount)}
      </span>
      
      {isPartial && (
        <div className="absolute bottom-2 left-2 right-2 h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: `${progress}%` }} 
            className="h-full bg-rose-500 shadow-[0_0_8px_rgba(225,29,72,0.4)]" 
          />
        </div>
      )}
      
      {slot.isCompleted && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-1.5 right-1.5 opacity-60">
          <CheckCircle2 size={12} className="stroke-[3]" />
        </motion.div>
      )}
    </motion.div>
  );
};
