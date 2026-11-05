import React, { useState } from 'react';
import { ExpenseItem, ExpenseCategory, EmulatorState } from '../../types';
import {
  Utensils,
  Bus,
  ShoppingBag,
  GraduationCap,
  Film,
  HeartPulse,
  Receipt,
  Shapes,
  Plus,
  BarChart3,
  Wallet,
  Calendar,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface HomeScreenViewProps {
  expenses: ExpenseItem[];
  currencySymbol: string;
  emulatorState: EmulatorState;
  onNavigateToAdd: () => void;
  onNavigateToSummary: () => void;
  onSelectExpense: (id: string) => void;
  onRetry: () => void;
}

export const getCategoryIcon = (category: ExpenseCategory, size = 18, className = '') => {
  switch (category) {
    case 'Food':
      return <Utensils size={size} className={className} />;
    case 'Transport':
      return <Bus size={size} className={className} />;
    case 'Shopping':
      return <ShoppingBag size={size} className={className} />;
    case 'Education':
      return <GraduationCap size={size} className={className} />;
    case 'Entertainment':
      return <Film size={size} className={className} />;
    case 'Healthcare':
      return <HeartPulse size={size} className={className} />;
    case 'Bills':
      return <Receipt size={size} className={className} />;
    case 'Other':
    default:
      return <Shapes size={size} className={className} />;
  }
};

export const getCategoryColor = (category: ExpenseCategory) => {
  switch (category) {
    case 'Food':
      return { bg: 'bg-amber-50 text-amber-700', border: 'border-amber-200' };
    case 'Transport':
      return { bg: 'bg-sky-50 text-sky-700', border: 'border-sky-200' };
    case 'Shopping':
      return { bg: 'bg-purple-50 text-purple-700', border: 'border-purple-200' };
    case 'Education':
      return { bg: 'bg-indigo-50 text-indigo-700', border: 'border-indigo-200' };
    case 'Entertainment':
      return { bg: 'bg-rose-50 text-rose-700', border: 'border-rose-200' };
    case 'Healthcare':
      return { bg: 'bg-emerald-50 text-emerald-700', border: 'border-emerald-200' };
    case 'Bills':
      return { bg: 'bg-orange-50 text-orange-700', border: 'border-orange-200' };
    case 'Other':
    default:
      return { bg: 'bg-slate-50 text-slate-700', border: 'border-slate-200' };
  }
};

export const HomeScreenView: React.FC<HomeScreenViewProps> = ({
  expenses,
  currencySymbol,
  emulatorState,
  onNavigateToAdd,
  onNavigateToSummary,
  onSelectExpense,
  onRetry,
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  // Calculations matching Flutter ExpenseProvider
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);

  const now = new Date();
  const currentMonthExpenses = expenses
    .filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    })
    .reduce((sum, item) => sum + item.amount, 0);

  // Highest spending category
  const categoryTotals: Record<string, number> = {};
  expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  let highestCategory = 'None';
  let highestAmount = 0;
  Object.entries(categoryTotals).forEach(([cat, amt]) => {
    if (amt > highestAmount) {
      highestAmount = amt;
      highestCategory = cat;
    }
  });

  const filteredExpenses =
    selectedCategoryFilter === 'All'
      ? expenses
      : expenses.filter((e) => e.category === selectedCategoryFilter);

  // Render State 1: Loading
  if (emulatorState === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-[#F8F9FA]">
        <div className="w-12 h-12 border-4 border-[#1A237E]/20 border-t-[#1A237E] rounded-full animate-spin mb-4" />
        <h3 className="text-base font-semibold text-slate-800">Loading your expenses...</h3>
        <p className="text-xs text-slate-500 mt-1">Reading SharedPreferences local storage</p>
      </div>
    );
  }

  // Render State 2: Error with Retry
  if (emulatorState === 'error') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-[#F8F9FA]">
        <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={32} />
        </div>
        <h3 className="text-base font-bold text-slate-900">Oops! Failed to load data</h3>
        <p className="text-xs text-slate-500 mt-2 max-w-[260px]">
          Could not read records from local device storage. Please tap retry to reload.
        </p>
        <button
          onClick={onRetry}
          className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-[#1A237E] text-white text-xs font-semibold rounded-xl hover:bg-[#151c65] transition shadow-sm"
        >
          <RefreshCw size={14} />
          Retry Connection
        </button>
      </div>
    );
  }

  // Render State 3: Empty State
  const isEmpty = expenses.length === 0 || emulatorState === 'empty';

  return (
    <div className="relative flex flex-col h-full bg-[#F8F9FA] overflow-y-auto">
      {/* Flutter AppBar */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-[#1A237E] text-white shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-teal-300">
            <Wallet size={16} />
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight">Expense Tracker</h1>
            <p className="text-[10px] text-teal-200">Flutter • Provider • Local Storage</p>
          </div>
        </div>
        <button
          onClick={onNavigateToSummary}
          title="View Expense Analytics"
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition active:scale-95"
        >
          <BarChart3 size={18} />
        </button>
      </div>

      {/* Financial Overview Header */}
      <div className="p-4 bg-gradient-to-b from-[#1A237E]/8 to-transparent">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span className="font-medium text-slate-700">Financial Overview</span>
          <span className="font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60">
            {expenses.length} {expenses.length === 1 ? 'Transaction' : 'Transactions'}
          </span>
        </div>

        {/* Hero Card: Total Spending */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1A237E] to-[#283593] text-white shadow-md mb-3">
          <div className="flex items-center justify-between text-xs text-blue-200">
            <span className="font-medium tracking-wide text-[11px] uppercase">Total Expenses</span>
            <Wallet size={16} className="text-teal-300" />
          </div>
          <div className="text-2xl font-bold tracking-tight mt-1">
            {currencySymbol}
            {totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-blue-200/80 mt-1 flex items-center gap-1.5">
            <TrendingUp size={12} className="text-teal-300" />
            Lifetime cumulative spending
          </div>
        </div>

        {/* Two Sub-KPI Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-semibold uppercase tracking-wider text-[10px]">This Month</span>
              <Calendar size={13} className="text-[#1A237E]" />
            </div>
            <div className="text-base font-bold text-slate-800 mt-1">
              {currencySymbol}
              {currentMonthExpenses.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Current billing cycle</div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Top Category</span>
              <span className="w-2 h-2 rounded-full bg-teal-500" />
            </div>
            <div className="text-base font-bold text-teal-700 mt-1 truncate">
              {highestCategory}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {highestAmount > 0 ? `${currencySymbol}${highestAmount.toFixed(0)} spent` : 'No data'}
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      {!isEmpty && (
        <div className="px-4 pb-2">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {['All', 'Food', 'Transport', 'Shopping', 'Education', 'Entertainment', 'Healthcare', 'Bills', 'Other'].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`text-xs px-3 py-1 rounded-full whitespace-nowrap font-medium transition ${
                    selectedCategoryFilter === cat
                      ? 'bg-[#1A237E] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* List Header */}
      <div className="flex items-center justify-between px-4 pt-2 pb-1">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Recent Transactions {filteredExpenses.length > 0 && `(${filteredExpenses.length})`}
        </h2>
        <button
          onClick={onNavigateToSummary}
          className="text-xs font-semibold text-[#1A237E] hover:underline"
        >
          View Summary
        </button>
      </div>

      {/* Main List Content */}
      <div className="px-4 pb-20 flex-1">
        {isEmpty ? (
          /* Empty State View */
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-[#1A237E]/10 flex items-center justify-center text-[#1A237E] mb-3">
              <Wallet size={30} />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No Expenses Recorded Yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-[240px] leading-relaxed">
              Start tracking your daily expenses. Tap the button below to add your first transaction.
            </p>
            <button
              onClick={onNavigateToAdd}
              className="mt-4 flex items-center gap-1.5 px-4 py-2 bg-[#1A237E] text-white text-xs font-semibold rounded-xl hover:bg-[#151c65] transition shadow-sm"
            >
              <Plus size={14} />
              Add Your First Expense
            </button>
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No expenses found in "{selectedCategoryFilter}".
          </div>
        ) : (
          /* Actual Expense List Items */
          <div className="space-y-2 mt-1">
            {filteredExpenses.map((expense) => {
              const colors = getCategoryColor(expense.category);
              const dateObj = new Date(expense.date);
              const formattedDate = dateObj.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={expense.id}
                  onClick={() => onSelectExpense(expense.id)}
                  className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-[#1A237E]/40 hover:shadow-sm cursor-pointer transition active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colors.bg}`}
                    >
                      {getCategoryIcon(expense.category, 18)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-800 truncate">
                        {expense.note}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                        <span className="font-medium text-teal-700">{expense.category}</span>
                        <span>·</span>
                        <span>{formattedDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 pl-2">
                    <div className="text-right">
                      <div className="text-xs font-bold text-[#1A237E]">
                        {currencySymbol}
                        {expense.amount.toFixed(2)}
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-300" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={onNavigateToAdd}
        className="absolute bottom-4 right-4 z-10 flex items-center gap-2 px-4 py-3 bg-[#00897B] text-white text-xs font-bold rounded-2xl shadow-lg hover:bg-[#00796B] transition-transform active:scale-95"
        style={{
          boxShadow: '0 4px 14px 0 rgba(0, 137, 123, 0.45)',
        }}
      >
        <Plus size={18} />
        <span>Add Expense</span>
      </button>
    </div>
  );
};
