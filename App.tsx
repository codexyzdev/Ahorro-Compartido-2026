
import React, { useState, useRef } from 'react';
import { 
  Heart, TrendingUp, Calendar, History, Settings, Trophy, ArrowRight, Sparkles, CheckCircle2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSavings } from './hooks/useSavings';
import { MagicNumber } from './components/MagicNumber';
import { SlotCard } from './components/SlotCard';
import { HistoryPanel } from './components/HistoryPanel';
import { ParticleSystem, Particle } from './components/ParticleSystem';
import { SettingsModal } from './components/SettingsModal';
import { GOAL_AMOUNT } from './constants';

const App: React.FC = () => {
  const { 
    state, totalSaved, remainingToGoal, completedSlotsCount, 
    progressPercent, isChallengeComplete, daysLeft,
    groupedHistory, handleDeposit, updateNames, updateLogo 
  } = useSavings();

  const [depositAmount, setDepositAmount] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'grid' | 'stats'>('grid');
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info'} | null>(null);
  const [recentlyUpdatedSlots, setRecentlyUpdatedSlots] = useState<number[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  
  const inputContainerRef = useRef<HTMLDivElement>(null);

  const triggerParticles = (affectedSlotIds: number[]) => {
    if (!inputContainerRef.current) return;
    
    const containerRect = inputContainerRef.current.getBoundingClientRect();
    const startX = containerRect.left + containerRect.width / 2;
    const startY = containerRect.top + containerRect.height / 2;

    const newParticles: Particle[] = affectedSlotIds.map((id, index) => {
      const slotElement = document.querySelector(`[data-slot-id="${id}"]`);
      if (slotElement) {
        const slotRect = slotElement.getBoundingClientRect();
        return {
          id: `${id}-${Date.now()}-${Math.random()}`,
          startX,
          startY,
          endX: slotRect.left + slotRect.width / 2,
          endY: slotRect.top + slotRect.height / 2,
          delay: index * 0.1
        };
      }
      return null;
    }).filter(p => p !== null) as Particle[];

    setParticles(prev => [...prev, ...newParticles]);
    
    newParticles.forEach((p) => {
      setTimeout(() => {
        const slotId = parseInt(p.id.split('-')[0]);
        setRecentlyUpdatedSlots(prev => [...new Set([...prev, slotId])]);
        setTimeout(() => {
          setRecentlyUpdatedSlots(prev => prev.filter(id => id !== slotId));
        }, 1500);
      }, (p.delay + 0.6) * 1000);
    });

    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 2000);
  };

  const onDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(depositAmount);
    if (isNaN(val) || val <= 0) return;
    if (val > remainingToGoal) {
      setNotification({ message: `¡Solo faltan $${remainingToGoal.toLocaleString()}!`, type: 'info' });
      return;
    }
    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }
    const result = handleDeposit(val);
    if (result.success) {
      setNotification({ message: result.message, type: 'success' });
      setDepositAmount('');
      setIsConfirming(false);
      triggerParticles(result.affectedSlots);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 lg:pb-8 text-slate-900 overflow-x-hidden">
      <ParticleSystem particles={particles} />

      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-rose-50 rounded-xl overflow-hidden flex items-center justify-center border border-rose-100 shadow-sm transition-transform active:scale-95">
              {state.customLogo ? <img src={state.customLogo} alt="Logo" className="w-full h-full object-cover" /> : <Heart className="text-rose-500 fill-rose-500" size={24} />}
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold leading-tight">Reto 2026</h1>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest truncate">{state.coupleNames.partner1} & {state.coupleNames.partner2}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowSettings(true)} className="p-2.5 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><Settings size={20} /></button>
            <button onClick={() => setShowHistory(true)} className="p-2.5 hover:bg-slate-100 rounded-full relative transition-colors">
              <History size={20} className="text-slate-600" />
              {state.history.length > 0 && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <AnimatePresence>
          {notification && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: -20, scale: 0.95 }} 
              className={`p-4 rounded-2xl flex items-center gap-3 shadow-lg border ${notification.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-blue-50 border-blue-100 text-blue-800'}`}
            >
              <Sparkles size={18} className="text-amber-500 animate-pulse" />
              <p className="text-sm font-bold">{notification.message}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute -right-8 -top-8 p-8 opacity-[0.03] pointer-events-none rotate-12"><TrendingUp size={240} /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase mb-1">Ahorro total</p>
              <div className="flex items-baseline gap-2">
                <MagicNumber value={totalSaved.toLocaleString()} prefix="$" className="text-4xl font-black text-slate-900" />
                <span className="text-slate-400 font-medium text-lg">/ ${GOAL_AMOUNT.toLocaleString()}</span>
              </div>
              <div className="mt-8 space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                  <span>Progreso del viaje</span>
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

        {!isChallengeComplete ? (
          <motion.section 
            layout
            className={`rounded-3xl p-6 text-white shadow-xl transition-all duration-500 ${isConfirming ? 'bg-emerald-600 shadow-emerald-200' : 'bg-slate-900 shadow-slate-200'}`}
          >
            <form onSubmit={onDepositSubmit} className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg font-bold">{isConfirming ? '¿Confirmamos este ahorro?' : 'Nuevo aporte al sueño'}</h3>
                <p className="text-xs opacity-70">Ahorro compartido para vuestro planes en 2026.</p>
              </div>
              <div className="flex w-full md:w-auto gap-3" ref={inputContainerRef}>
                <div className="relative flex-1 md:w-48">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 font-black">$</span>
                  <input 
                    type="number" 
                    value={depositAmount} 
                    onChange={(e) => setDepositAmount(e.target.value)} 
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
        ) : (
          <section className="bg-slate-900 rounded-3xl p-10 text-white text-center shadow-2xl border-4 border-amber-400/20 relative overflow-hidden">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute -top-24 -right-24 p-32 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
            <Trophy size={64} className="mx-auto mb-6 text-amber-400" />
            <h2 className="text-4xl font-serif font-black mb-3 italic">¡RETO LOGRADO!</h2>
            <p className="text-rose-100 text-lg">Felicidades, lo habéis conseguido juntos.</p>
          </section>
        )}

        <div className="space-y-6">
          <div className="flex gap-6 border-b border-slate-200">
            {(['grid', 'stats'] as const).map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                className={`pb-3 px-1 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? 'text-rose-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab === 'grid' ? 'Tablero' : 'Métricas'}
                {activeTab === tab && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-rose-600 rounded-t-full" />}
              </button>
            ))}
          </div>
          
          <AnimatePresence mode="wait">
            {activeTab === 'grid' ? (
              <motion.div key="grid" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
                {state.slots.map(slot => (
                  <SlotCard key={slot.id} slot={slot} isRecentlyUpdated={recentlyUpdatedSlots.includes(slot.id)} />
                ))}
              </motion.div>
            ) : (
              <motion.div key="stats" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center shadow-sm">
                  <p className="text-xs font-black text-slate-400 uppercase mb-2">Promedio por sobre</p>
                  <p className="text-3xl font-black text-slate-800">${(totalSaved / (completedSlotsCount || 1)).toFixed(2)}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center shadow-sm">
                  <p className="text-xs font-black text-slate-400 uppercase mb-2">Meta Pendiente</p>
                  <p className="text-3xl font-black text-rose-600">${remainingToGoal.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center shadow-sm border-l-rose-500 border-l-4">
                  <p className="text-xs font-black text-rose-500 uppercase mb-2">Eficiencia</p>
                  <p className="text-3xl font-black text-slate-800">{progressPercent.toFixed(1)}%</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        coupleNames={state.coupleNames}
        customLogo={state.customLogo}
        onUpdateLogo={updateLogo}
        onUpdateNames={updateNames}
      />

      <HistoryPanel isOpen={showHistory} onClose={() => setShowHistory(false)} groupedHistory={groupedHistory} />
    </div>
  );
};

export default App;
