
import { SavingSlot } from './types';

export const TOTAL_SLOTS = 100;
export const GOAL_YEAR = 2026;
export const STORAGE_KEY = 'ahorro_compartido_v1';

export const INITIAL_SLOTS: SavingSlot[] = Array.from({ length: TOTAL_SLOTS }, (_, i) => ({
  id: i + 1,
  targetAmount: i + 1,
  currentAmount: 0,
  isCompleted: false,
  lastUpdated: new Date().toISOString(),
}));

export const GOAL_AMOUNT = (TOTAL_SLOTS * (TOTAL_SLOTS + 1)) / 2; // $5,050
