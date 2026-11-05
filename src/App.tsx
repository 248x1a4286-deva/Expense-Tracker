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

  // Load saved expenses from local device storage
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
    <div className="min-h-screen bg-slate-900 md:bg-slate-800 flex items-center justify-center font-sans antialiased">
      {/* Mobile Application Container */}
      <div className="w-full md:max-w-md h-screen md:h-[840px] md:max-h-[95vh] bg-[#F8F9FA] md:rounded-[32px] overflow-hidden shadow-2xl flex flex-col relative md:border md:border-slate-700/60">
        <main className="flex-1 overflow-hidden relative">
          {currentScreen === 'home' && (
            <HomeScreenView
              expenses={expenses}
              currencySymbol="$"
              emulatorState="normal"
              onNavigateToAdd={() => setCurrentScreen('add')}
              onNavigateToSummary={() => setCurrentScreen('summary')}
              onSelectExpense={handleSelectExpense}
              onRetry={() => {}}
            />
          )}

          {currentScreen === 'add' && (
            <AddExpenseView
              currencySymbol="$"
              onSave={handleAddExpense}
              onBack={() => setCurrentScreen('home')}
            />
          )}

          {currentScreen === 'details' && (
            <ExpenseDetailsView
              expense={selectedExpense}
              currencySymbol="$"
              onDelete={handleDeleteExpense}
              onBack={() => setCurrentScreen('home')}
            />
          )}

          {currentScreen === 'summary' && (
            <ExpenseSummaryView
              expenses={expenses}
              currencySymbol="$"
              onBack={() => setCurrentScreen('home')}
            />
          )}
        </main>
      </div>
    </div>
  );
}
