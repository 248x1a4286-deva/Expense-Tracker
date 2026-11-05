import React, { useState, useEffect } from 'react';
import { ExpenseItem, ScreenType } from './types';
import {
  loadStoredExpenses,
  saveStoredExpenses,
} from './storage';
import { HomeScreenView } from './components/screens/HomeScreenView';
import { AddExpenseView } from './components/screens/AddExpenseView';
import { ExpenseDetailsView } from './components/screens/ExpenseDetailsView';
import { ExpenseSummaryView } from './components/screens/ExpenseSummaryView';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);

  // Load saved expenses from local storage
  useEffect(() => {
    const loaded = loadStoredExpenses();
    setExpenses(loaded);
  }, []);

  const handleAddExpense = (newExpenseData: Omit<ExpenseItem, 'id'>) => {
    const newExpense: ExpenseItem = {
      ...newExpenseData,
      id: crypto.randomUUID
        ? crypto.randomUUID()
        : `exp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    };

    const updated = [newExpense, ...expenses];
    setExpenses(updated);
    saveStoredExpenses(updated);
  };

  const handleDeleteExpense = (id: string) => {
    const updated = expenses.filter((e) => e.id !== id);
    setExpenses(updated);
    saveStoredExpenses(updated);
  };

  const handleSelectExpense = (id: string) => {
    setSelectedExpenseId(id);
    setCurrentScreen('details');
  };

  const selectedExpense = expenses.find((e) => e.id === selectedExpenseId);

  return (
    <div className="min-h-screen w-full bg-[#F8F9FA] flex flex-col font-sans antialiased selection:bg-[#1A237E]/20 text-slate-800">
      <main className="flex-1 flex flex-col">
        {currentScreen === 'home' && (
          <HomeScreenView
            expenses={expenses}
            currencySymbol="₹"
            emulatorState="normal"
            onNavigateToAdd={() => setCurrentScreen('add')}
            onNavigateToSummary={() => setCurrentScreen('summary')}
            onSelectExpense={handleSelectExpense}
          />
        )}

        {currentScreen === 'add' && (
          <AddExpenseView
            currencySymbol="₹"
            onSave={handleAddExpense}
            onBack={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'details' && (
          <ExpenseDetailsView
            expense={selectedExpense}
            currencySymbol="₹"
            onDelete={handleDeleteExpense}
            onBack={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'summary' && (
          <ExpenseSummaryView
            expenses={expenses}
            currencySymbol="₹"
            onBack={() => setCurrentScreen('home')}
          />
        )}
      </main>
    </div>
  );
}
