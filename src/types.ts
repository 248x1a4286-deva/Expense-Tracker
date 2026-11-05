export type ExpenseCategory =
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Education'
  | 'Entertainment'
  | 'Healthcare'
  | 'Bills'
  | 'Other';

export interface ExpenseItem {
  id: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // ISO string
  note: string;
}

export type ScreenType = 'home' | 'add' | 'details' | 'summary';

export type EmulatorState = 'normal' | 'loading' | 'error' | 'empty';
