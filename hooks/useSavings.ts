
import { useState, useEffect, useMemo, useCallback } from 'react';
import { SavingsState, Transaction, SavingSlot } from '../types';
import { STORAGE_KEY, INITIAL_SLOTS, GOAL_AMOUNT, TOTAL_SLOTS, GOAL_YEAR } from '../constants';

const EMOTIONAL_MESSAGES = [
  "¡Lo estáis logrando!",
  "¡Un paso más cerca de vuestro sueño!",
  "¡Qué gran equipo sois!",
  "¡Vuestra meta está cada vez más cerca!",
  "¡Ahorrar juntos es el mejor plan!",
  "¡Cada sobre lleno es una victoria!",
  "¡Seguid así, pareja imparable!"
];

export const useSavings = () => {
  const [state, setState] = useState<SavingsState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return {
      slots: INITIAL_SLOTS,
      history: [],
      coupleNames: { partner1: 'Tú', partner2: 'Tu Pareja' }
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const totalSaved = useMemo(() => 
    state.slots.reduce((acc, slot) => acc + slot.currentAmount, 0), 
    [state.slots]
  );

  const remainingToGoal = GOAL_AMOUNT - totalSaved;
  const completedSlotsCount = useMemo(() => 
    state.slots.filter(s => s.isCompleted).length, 
    [state.slots]
  );
  
  const progressPercent = (totalSaved / GOAL_AMOUNT) * 100;
  const isChallengeComplete = completedSlotsCount === TOTAL_SLOTS;

  const daysLeft = useMemo(() => {
    const today = new Date();
    const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const deadline = new Date(GOAL_YEAR, 11, 31);
    
    if (todayNormalized > deadline) return 0;
    const diffTime = deadline.getTime() - todayNormalized.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, []);

  const groupedHistory = useMemo(() => {
    const groups: { [key: string]: { transactions: Transaction[], total: number } } = {};
    state.history.forEach(t => {
      const date = new Date(t.date);
      const key = date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
      if (!groups[key]) groups[key] = { transactions: [], total: 0 };
      groups[key].transactions.push(t);
      groups[key].total += t.amount;
    });
    return groups;
  }, [state.history]);

  const handleDeposit = useCallback((amount: number) => {
    let remaining = amount;
    const newSlots = [...state.slots];
    const affectedSlots: number[] = [];

    const exactMatch = newSlots.find(s => s.id === amount && !s.isCompleted && s.currentAmount === 0);
    if (exactMatch) {
      exactMatch.currentAmount = amount;
      exactMatch.isCompleted = true;
      exactMatch.lastUpdated = new Date().toISOString();
      affectedSlots.push(exactMatch.id);
      remaining = 0;
    } else {
      const partialSlots = newSlots.filter(s => !s.isCompleted && s.currentAmount > 0).sort((a, b) => a.id - b.id);
      for (const slot of partialSlots) {
        if (remaining <= 0) break;
        const toAdd = Math.min(remaining, slot.targetAmount - slot.currentAmount);
        slot.currentAmount += toAdd;
        if (slot.currentAmount >= slot.targetAmount) slot.isCompleted = true;
        slot.lastUpdated = new Date().toISOString();
        if (!affectedSlots.includes(slot.id)) affectedSlots.push(slot.id);
        remaining -= toAdd;
      }
      if (remaining > 0) {
        const emptySlots = newSlots.filter(s => !s.isCompleted && s.currentAmount === 0).sort((a, b) => a.id - b.id);
        for (const slot of emptySlots) {
          if (remaining <= 0) break;
          const toAdd = Math.min(remaining, slot.targetAmount);
          slot.currentAmount += toAdd;
          if (slot.currentAmount >= slot.targetAmount) slot.isCompleted = true;
          slot.lastUpdated = new Date().toISOString();
          if (!affectedSlots.includes(slot.id)) affectedSlots.push(slot.id);
          remaining -= toAdd;
        }
      }
    }

    if (affectedSlots.length > 0) {
      const newTransaction: Transaction = {
        id: crypto.randomUUID(),
        amount: amount,
        date: new Date().toISOString(),
        affectedSlots: affectedSlots
      };
      setState(prev => ({
        ...prev,
        slots: newSlots,
        history: [newTransaction, ...prev.history].slice(0, 200)
      }));
      return { 
        success: true, 
        message: `${EMOTIONAL_MESSAGES[Math.floor(Math.random() * EMOTIONAL_MESSAGES.length)]} +$${amount}`,
        affectedSlots
      };
    }
    return { success: false, message: "No se pudo procesar el depósito.", affectedSlots: [] };
  }, [state.slots]);

  const updateNames = (partner1: string, partner2: string) => {
    setState(prev => ({ ...prev, coupleNames: { partner1, partner2 } }));
  };

  const updateLogo = (base64: string) => {
    setState(prev => ({ ...prev, customLogo: base64 }));
  };

  return {
    state,
    totalSaved,
    remainingToGoal,
    completedSlotsCount,
    progressPercent,
    isChallengeComplete,
    daysLeft,
    groupedHistory,
    handleDeposit,
    updateNames,
    updateLogo
  };
};
