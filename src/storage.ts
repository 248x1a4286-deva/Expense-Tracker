import { ExpenseItem, ExpenseCategory } from './types';

const STORAGE_KEY = 'saved_expenses_list_v1';

export const INITIAL_SAMPLE_EXPENSES: ExpenseItem[] = [
  {
    id: 'e1a2b3c4-5d6e-7f8a-9b0c-1d2e3f4a5b6c',
    amount: 350.00,
    category: 'Food',
    date: new Date().toISOString(),
    note: 'College Canteen Lunch & Chai',
  },
  {
    id: 'f2b3c4d5-6e7f-8a9b-0c1d-2e3f4a5b6c7d',
    amount: 500.00,
    category: 'Transport',
    date: new Date(Date.now() - 86400000).toISOString(),
    note: 'Metro Pass & Auto Fare',
  },
  {
    id: 'a3c4d5e6-7f8a-9b0c-1d2e-3f4a5b6c7d8e',
    amount: 1450.00,
    category: 'Education',
    date: new Date(Date.now() - 172800000).toISOString(),
    note: 'Engineering Textbooks & Stationery',
  },
  {
    id: 'b4d5e6f7-8a9b-0c1d-2e3f-4a5b6c7d8e9f',
    amount: 420.00,
    category: 'Entertainment',
    date: new Date(Date.now() - 259200000).toISOString(),
    note: 'Weekend Cinema & Popcorn',
  },
  {
    id: 'c5e6f7a8-9b0c-1d2e-3f4a-5b6c7d8e9f0a',
    amount: 2150.00,
    category: 'Shopping',
    date: new Date(Date.now() - 345600000).toISOString(),
    note: 'D-Mart Supermarket Groceries',
  },
];

export const loadStoredExpenses = (): ExpenseItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First run default
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_EXPENSES));
      return INITIAL_SAMPLE_EXPENSES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (e) {
    console.error('Error loading stored expenses', e);
    return [];
  }
};

export const saveStoredExpenses = (expenses: ExpenseItem[]): boolean => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    return true;
  } catch (e) {
    console.error('Error saving expenses', e);
    return false;
  }
};

export const clearStoredExpenses = (): boolean => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (e) {
    return false;
  }
};

export const calculateTotals = (expenses: ExpenseItem[]) => {
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);

  const now = new Date();
  const currentMonthTotal = expenses
    .filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    })
    .reduce((sum, item) => sum + item.amount, 0);

  const categoryTotals: Record<ExpenseCategory, number> = {
    Food: 0,
    Transport: 0,
    Shopping: 0,
    Education: 0,
    Entertainment: 0,
    Healthcare: 0,
    Bills: 0,
    Other: 0,
  };

  expenses.forEach((item) => {
    if (categoryTotals[item.category] !== undefined) {
      categoryTotals[item.category] += item.amount;
    } else {
      categoryTotals['Other'] += item.amount;
    }
  });

  let highestCategory: ExpenseCategory = 'Other';
  let highestAmount = -1;

  Object.entries(categoryTotals).forEach(([cat, amt]) => {
    if (amt > highestAmount) {
      highestAmount = amt;
      highestCategory = cat as ExpenseCategory;
    }
  });

  return {
    total,
    currentMonthTotal,
    categoryTotals,
    highestCategory: total === 0 ? 'None' : highestCategory,
    highestAmount: total === 0 ? 0 : highestAmount,
  };
};
