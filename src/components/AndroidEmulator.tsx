import React, { useState } from 'react';
import { ExpenseItem, ScreenType, EmulatorState } from '../types';
import { HomeScreenView } from './screens/HomeScreenView';
import { AddExpenseView } from './screens/AddExpenseView';
import { ExpenseDetailsView } from './screens/ExpenseDetailsView';
import { ExpenseSummaryView } from './screens/ExpenseSummaryView';
import {
  Wifi,
  Battery,
  Signal,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Layers,
  Smartphone,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface AndroidEmulatorProps {
  expenses: ExpenseItem[];
  onAddExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
  onDeleteExpense: (id: string) => void;
  onClearAll: () => void;
  onResetDemo: () => void;
  currencySymbol: string;
  setCurrencySymbol: (sym: string) => void;
}

export const AndroidEmulator: React.FC<AndroidEmulatorProps> = ({
  expenses,
  onAddExpense,
  onDeleteExpense,
  onClearAll,
  onResetDemo,
  currencySymbol,
  setCurrencySymbol,
}) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [emulatorState, setEmulatorState] = useState<EmulatorState>('normal');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Current system time for phone status bar
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  });

  const selectedExpense = expenses.find((e) => e.id === selectedExpenseId);

  const handleSelectExpense = (id: string) => {
    setSelectedExpenseId(id);
    setCurrentScreen('details');
  };

  const handleRetry = () => {
    setEmulatorState('loading');
    setTimeout(() => {
      setEmulatorState('normal');
    }, 800);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Emulator Control Bar */}
      <div className="w-full max-w-[420px] mb-3 flex flex-wrap items-center justify-between gap-2 p-2 bg-white rounded-xl border border-slate-200/90 shadow-xs text-xs">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-slate-700 flex items-center gap-1">
            <Smartphone size={14} className="text-[#1A237E]" />
            Test States:
          </span>
          <button
            onClick={() => setEmulatorState('normal')}
            className={`px-2 py-1 rounded-md font-medium transition ${
              emulatorState === 'normal'
                ? 'bg-[#1A237E] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Normal List
          </button>
          <button
            onClick={() => setEmulatorState('error')}
            className={`px-2 py-1 rounded-md font-medium transition ${
              emulatorState === 'error'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Error State
          </button>
          <button
            onClick={() => {
              onClearAll();
              setEmulatorState('normal');
            }}
            className="px-2 py-1 rounded-md font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
          >
            Empty State
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onResetDemo}
            title="Reset with sample transactions"
            className="flex items-center gap-1 px-2 py-1 bg-teal-50 text-teal-700 border border-teal-200 rounded-md font-medium hover:bg-teal-100 transition"
          >
            <Sparkles size={12} />
            <span>Seed Data</span>
          </button>

          <select
            value={currencySymbol}
            onChange={(e) => setCurrencySymbol(e.target.value)}
            className="px-1.5 py-1 bg-slate-100 border border-slate-200 rounded-md text-slate-700 font-semibold focus:outline-none"
          >
            <option value="$">$ USD</option>
            <option value="₹">₹ INR</option>
            <option value="€">€ EUR</option>
            <option value="£">£ GBP</option>
          </select>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen Phone' : 'Enter Fullscreen Phone'}
            className="p-1 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
        </div>
      </div>

      {/* Phone Hardware Mockup Container */}
      <div
        className={`relative transition-all duration-300 ${
          isFullscreen
            ? 'w-full max-w-[480px] h-[840px]'
            : 'w-[370px] h-[720px]'
        } bg-slate-900 rounded-[44px] p-3 shadow-2xl border-4 border-slate-700/80 ring-1 ring-black/20`}
        style={{
          boxShadow: '0 25px 60px -15px rgba(26, 35, 126, 0.25), 0 10px 20px -5px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Phone Speaker & Camera Punch-hole */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center">
          <div className="w-12 h-3.5 bg-black rounded-full flex items-center justify-center gap-1.5 px-2">
            <div className="w-2.5 h-2.5 bg-[#121620] rounded-full ring-1 ring-slate-800" />
            <div className="w-4 h-1 bg-slate-800 rounded-full" />
          </div>
        </div>

        {/* Screen Bezel Inside */}
        <div className="relative w-full h-full bg-[#F8F9FA] rounded-[34px] overflow-hidden flex flex-col select-none">
          {/* Android Status Bar */}
          <div className="h-7 w-full bg-[#1A237E] text-white flex items-center justify-between px-6 pt-1 text-[11px] font-medium z-40 shrink-0">
            <span>{currentTime}</span>
            <div className="flex items-center gap-1.5 opacity-90">
              <Signal size={11} />
              <Wifi size={11} />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px]">98%</span>
                <Battery size={13} />
              </div>
            </div>
          </div>

          {/* Screen Content Router */}
          <div className="flex-1 overflow-hidden relative">
            {currentScreen === 'home' && (
              <HomeScreenView
                expenses={expenses}
                currencySymbol={currencySymbol}
                emulatorState={emulatorState}
                onNavigateToAdd={() => setCurrentScreen('add')}
                onNavigateToSummary={() => setCurrentScreen('summary')}
                onSelectExpense={handleSelectExpense}
                onRetry={handleRetry}
              />
            )}

            {currentScreen === 'add' && (
              <AddExpenseView
                currencySymbol={currencySymbol}
                onSave={onAddExpense}
                onBack={() => setCurrentScreen('home')}
              />
            )}

            {currentScreen === 'details' && (
              <ExpenseDetailsView
                expense={selectedExpense}
                currencySymbol={currencySymbol}
                onDelete={onDeleteExpense}
                onBack={() => setCurrentScreen('home')}
              />
            )}

            {currentScreen === 'summary' && (
              <ExpenseSummaryView
                expenses={expenses}
                currencySymbol={currencySymbol}
                onBack={() => setCurrentScreen('home')}
              />
            )}
          </div>

          {/* Android Navigation Bar (Home Gesture Handle) */}
          <div className="h-5 w-full bg-[#F8F9FA] flex items-center justify-center shrink-0 z-40">
            <div
              onClick={() => setCurrentScreen('home')}
              title="Tap to return to Home"
              className="w-24 h-1 bg-slate-400/80 rounded-full cursor-pointer hover:bg-slate-600 transition"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
