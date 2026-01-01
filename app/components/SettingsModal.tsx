
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  coupleNames: { partner1: string; partner2: string };
  purpose: string;
  onUpdateNames: (p1: string, p2: string) => void;
  onUpdatePurpose: (purpose: string) => void;
}

export const SettingsModal: React.FC<Props> = ({
  isOpen, onClose, coupleNames, purpose, onUpdateNames, onUpdatePurpose
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="bg-white w-full max-w-md rounded-3xl shadow-2xl relative z-10 overflow-hidden border border-white/20"
          >
            <div className="p-6 border-b bg-slate-50 flex justify-between items-center">
              <h3 className="font-serif text-xl font-bold">Configuración</h3>
              <button onClick={onClose} className="hover:bg-slate-200 p-1.5 rounded-full transition-colors">
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Names Section */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vuestros Nombres</p>
                <div className="space-y-3">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-400 transition-colors" size={18} />
                    <input
                      type="text"
                      value={coupleNames.partner1}
                      onChange={(e) => onUpdateNames(e.target.value, coupleNames.partner2)}
                      className="w-full bg-slate-50 border border-slate-200 py-3.5 pl-11 pr-4 rounded-2xl font-bold focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/50 outline-none transition-all"
                    />
                  </div>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-400 transition-colors" size={18} />
                    <input
                      type="text"
                      value={coupleNames.partner2}
                      onChange={(e) => onUpdateNames(coupleNames.partner1, e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 py-3.5 pl-11 pr-4 rounded-2xl font-bold focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/50 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Purpose Section */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Propósito del Reto</p>
                <div className="relative group">
                  <div className="absolute left-4 top-4 text-slate-300 group-focus-within:text-rose-400 transition-colors">
                    <Sparkles size={18} />
                  </div>
                  <textarea
                    value={purpose}
                    onChange={(e) => onUpdatePurpose(e.target.value)}
                    placeholder="Ej: Nuestro primer viaje juntos"
                    className="w-full bg-slate-50 border border-slate-200 py-3.5 pl-11 pr-4 rounded-2xl font-bold focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/50 outline-none transition-all resize-none h-24"
                  />
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-black transition-all active:scale-95"
              >
                Guardar Cambios
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
