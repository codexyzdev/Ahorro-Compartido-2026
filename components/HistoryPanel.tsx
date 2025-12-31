
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, X, Layers, Calendar } from 'lucide-react';
import { Transaction } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  groupedHistory: { [key: string]: { transactions: Transaction[], total: number } };
}

export const HistoryPanel: React.FC<Props> = ({ isOpen, onClose, groupedHistory }) => {
  const monthKeys = Object.keys(groupedHistory);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-40" 
          />
          <motion.div 
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }} 
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-50 rounded-lg">
                  <History size={20} className="text-rose-500" />
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900">Nuestra Trayectoria</h3>
              </div>
              <button 
                onClick={onClose} 
                className="text-slate-400 hover:text-rose-500 p-2 active:scale-90 transition-transform"
              >
                <X size={28} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-12 scroll-smooth">
              {monthKeys.length === 0 ? (
                <div className="text-center py-20 opacity-30">
                  <History size={64} className="mx-auto mb-4 stroke-1" />
                  <p className="font-black uppercase tracking-widest text-xs">Vuestro viaje empieza aquí</p>
                </div>
              ) : (
                monthKeys.map((month) => {
                  const data = groupedHistory[month];
                  return (
                    <div key={month} className="space-y-6">
                      <div className="flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm py-3 z-10 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-slate-400" />
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-4 py-1.5 rounded-full">
                            {month}
                          </h4>
                        </div>
                        <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-4 py-1.5 rounded-full border border-rose-100 shadow-sm">
                          INGRESADO: ${data.total.toLocaleString()}
                        </span>
                      </div>

                      <div className="space-y-6 ml-3 border-l-2 border-slate-100 pl-8 py-2">
                        {data.transactions.map((t) => (
                          <div key={t.id} className="relative group">
                            {/* Punto de la línea de tiempo */}
                            <div className="absolute -left-[41.5px] top-2.5 w-4 h-4 rounded-full bg-white border-[3px] border-rose-500 ring-4 ring-white shadow-sm transition-transform group-hover:scale-125 z-10" />
                            
                            <motion.div 
                              whileHover={{ y: -2 }}
                              className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-rose-300 hover:shadow-md transition-all group shadow-sm"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <p className="text-2xl font-black text-slate-900 leading-none">${t.amount.toLocaleString()}</p>
                                  <p className="text-[10px] text-slate-400 font-black uppercase mt-2 tracking-wider">
                                    {new Date(t.date).toLocaleDateString('es-ES', { day: 'numeric', weekday: 'long' })}
                                  </p>
                                </div>
                                <div className="bg-slate-50 p-2 rounded-xl text-slate-300 group-hover:text-rose-400 transition-colors">
                                  <Layers size={16} />
                                </div>
                              </div>
                              <div className="mt-4 pt-4 border-t border-slate-50 flex flex-wrap gap-2">
                                {t.affectedSlots.map(id => (
                                  <span 
                                    key={id} 
                                    className="bg-slate-50 text-[10px] font-black text-slate-500 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all"
                                  >
                                    #{id}
                                  </span>
                                ))}
                              </div>
                            </motion.div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
