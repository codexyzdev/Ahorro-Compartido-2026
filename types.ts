
export interface SavingSlot {
  id: number;
  targetAmount: number;
  currentAmount: number;
  isCompleted: boolean;
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  affectedSlots: number[];
  note?: string;
}

export interface SavingsState {
  slots: SavingSlot[];
  history: Transaction[];
  coupleNames: {
    partner1: string;
    partner2: string;
  };
  purpose?: string;
}
