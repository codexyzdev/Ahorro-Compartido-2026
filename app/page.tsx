"use client";

import React, { useState, useRef } from "react";
import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSavings } from "./hooks/useSavings";
import { SlotCard } from "./components/SlotCard";
import { HistoryPanel } from "./components/HistoryPanel";
import { ParticleSystem, Particle } from "./components/ParticleSystem";
import { SettingsModal } from "./components/SettingsModal";
import { Header } from "./components/Header";
import { StatsSummary } from "./components/StatsSummary";
import { DepositSection } from "./components/DepositSection";
import { useDriveSync } from "./hooks/useDriveSync";
import { SavingsState } from "./types";

export default function Home() {
  const {
    state,
    setState,
    totalSaved,
    remainingToGoal,
    completedSlotsCount,
    progressPercent,
    isChallengeComplete,
    daysLeft,
    groupedHistory,
    handleDeposit,
    updateNames,
    updatePurpose,
    resetState,
  } = useSavings();

  const handlePullSuccess = React.useCallback(
    (newState: SavingsState) => {
      setState(newState);
    },
    [setState]
  );

  const {
    login,
    logout,
    isAuthenticated,
    isSyncing,
    lastSyncTime,
    syncToDrive,
  } = useDriveSync(state, handlePullSuccess, resetState);

  const [depositAmount, setDepositAmount] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<"grid" | "stats">("grid");
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "info";
  } | null>(null);
  const [recentlyUpdatedSlots, setRecentlyUpdatedSlots] = useState<number[]>(
    []
  );
  const [particles, setParticles] = useState<Particle[]>([]);

  const inputContainerRef = useRef<HTMLDivElement>(null);

  const triggerParticles = (affectedSlotIds: number[]) => {
    if (!inputContainerRef.current) return;

    const containerRect = inputContainerRef.current.getBoundingClientRect();
    const startX = containerRect.left + containerRect.width / 2;
    const startY = containerRect.top + containerRect.height / 2;

    const newParticles: Particle[] = affectedSlotIds
      .map((id, index) => {
        const slotElement = document.querySelector(`[data-slot-id="${id}"]`);
        if (slotElement) {
          const slotRect = slotElement.getBoundingClientRect();
          return {
            id: `${id}-${Date.now()}-${Math.random()}`,
            startX,
            startY,
            endX: slotRect.left + slotRect.width / 2,
            endY: slotRect.top + slotRect.height / 2,
            delay: index * 0.1,
          };
        }
        return null;
      })
      .filter((p) => p !== null) as Particle[];

    setParticles((prev) => [...prev, ...newParticles]);

    newParticles.forEach((p) => {
      setTimeout(() => {
        const slotId = parseInt(p.id.split("-")[0]);
        setRecentlyUpdatedSlots((prev) => [...new Set([...prev, slotId])]);
        setTimeout(() => {
          setRecentlyUpdatedSlots((prev) => prev.filter((id) => id !== slotId));
        }, 1500);
      }, (p.delay + 0.6) * 1000);
    });

    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParticles.find((np) => np.id === p.id))
      );
    }, 2000);
  };

  const onDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(depositAmount);
    if (isNaN(val) || val <= 0) return;
    if (val > remainingToGoal) {
      setNotification({
        message: `¡Solo faltan $${remainingToGoal.toLocaleString()}!`,
        type: "info",
      });
      return;
    }
    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }
    const result = handleDeposit(val);
    if (result.success) {
      setNotification({ message: result.message, type: "success" });
      setDepositAmount("");
      setIsConfirming(false);
      triggerParticles(result.affectedSlots);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 lg:pb-8 text-slate-900 overflow-x-hidden">
      <ParticleSystem particles={particles} />

      <Header
        customLogo={state.customLogo}
        partner1={state.coupleNames.partner1}
        partner2={state.coupleNames.partner2}
        isAuthenticated={isAuthenticated}
        isSyncing={isSyncing}
        lastSyncTime={lastSyncTime}
        historyLength={state.history.length}
        onLogin={login}
        onLogout={logout}
        onSync={syncToDrive}
        onOpenSettings={() => setShowSettings(true)}
        onOpenHistory={() => setShowHistory(true)}
      />

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={`p-4 rounded-2xl flex items-center gap-3 shadow-lg border ${
                notification.type === "success"
                  ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                  : "bg-blue-50 border-blue-100 text-blue-800"
              }`}
            >
              <Sparkles size={18} className="text-amber-500 animate-pulse" />
              <p className="text-sm font-bold">{notification.message}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <StatsSummary
          totalSaved={totalSaved}
          progressPercent={progressPercent}
          completedSlotsCount={completedSlotsCount}
          daysLeft={daysLeft}
          purpose={state.purpose || ""}
        />

        <DepositSection
          isChallengeComplete={isChallengeComplete}
          isConfirming={isConfirming}
          depositAmount={depositAmount}
          onDepositAmountChange={setDepositAmount}
          onDepositSubmit={onDepositSubmit}
          purpose={state.purpose || ""}
          inputContainerRef={inputContainerRef}
        />

        <div className="space-y-6">
          <div className="flex gap-6 border-b border-slate-200">
            {(["grid", "stats"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-1 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${
                  activeTab === tab
                    ? "text-rose-600"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab === "grid" ? "Tablero" : "Métricas"}
                {activeTab === tab && (
                  <motion.div
                    layoutId="tab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-rose-600 rounded-t-full"
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "grid" ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3"
              >
                {state.slots.map((slot) => (
                  <SlotCard
                    key={slot.id}
                    slot={slot}
                    isRecentlyUpdated={recentlyUpdatedSlots.includes(slot.id)}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="stats"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center shadow-sm">
                  <p className="text-xs font-black text-slate-400 uppercase mb-2">
                    Promedio por sobre
                  </p>
                  <p className="text-3xl font-black text-slate-800">
                    ${(totalSaved / (completedSlotsCount || 1)).toFixed(2)}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center shadow-sm">
                  <p className="text-xs font-black text-slate-400 uppercase mb-2">
                    Meta Pendiente
                  </p>
                  <p className="text-3xl font-black text-rose-600">
                    ${remainingToGoal.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center shadow-sm border-l-rose-500 border-l-4">
                  <p className="text-xs font-black text-rose-500 uppercase mb-2">
                    Eficiencia
                  </p>
                  <p className="text-3xl font-black text-slate-800">
                    {progressPercent.toFixed(1)}%
                  </p>
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
        purpose={state.purpose || ""}
        onUpdateNames={updateNames}
        onUpdatePurpose={updatePurpose}
      />

      <HistoryPanel
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        groupedHistory={groupedHistory}
        purpose={state.purpose || ""}
      />
    </div>
  );
}
