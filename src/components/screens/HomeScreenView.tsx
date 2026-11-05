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
  PieChart,
} from 'lucide-react';

interface HomeScreenViewProps {
  expenses: ExpenseItem[];
  currencySymbol?: string;
  emulatorState?: EmulatorState;
  onNavigateToAdd: () => void;
  onNavigateToSummary: () => void;
  onSelectExpense: (id: string) => void;
  onRetry?: () => void;
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
  currencySymbol = '₹',
  emulatorState = 'normal',
  onNavigateToAdd,
  onNavigateToSummary,
  onSelectExpense,
  onRetry = () => {},
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  // Total expenses calculation
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);

  // Current month calculation
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

  const sortedCategories = Object.entries(categoryTotals)
    .filter(([_, amt]) => amt > 0)
    .sort((a, b) => b[1] - a[1]);

  const filteredExpenses =
    selectedCategoryFilter === 'All'
      ? expenses
      : expenses.filter((e) => e.category === selectedCategoryFilter);

  // Render State 1: Loading
  if (emulatorState === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] p-8 text-center bg-[#F8F9FA]">
        <div className="w-12 h-12 border-4 border-[#1A237E]/20 border-t-[#1A237E] rounded-full animate-spin mb-4" />
        <h3 className="text-base font-semibold text-slate-800">Loading your expenses...</h3>
        <p className="text-xs text-slate-500 mt-1">Reading local device storage</p>
      </div>
    );
  }

  // Render State 2: Error with Retry
  if (emulatorState === 'error') {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] p-8 text-center bg-[#F8F9FA]">
        <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={32} />
        </div>
        <h3 className="text-base font-bold text-slate-900">Oops! Failed to load data</h3>
        <p className="text-xs text-slate-500 mt-2 max-w-[260px]">
          Could not read records from local device storage.
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

  const isEmpty = expenses.length === 0 || emulatorState === 'empty';

  return (
    <div className="relative flex flex-col h-full bg-[#F8F9FA] overflow-y-auto">
      {/* App Bar (Responsive for Mobile & PC) */}
      <div className="sticky top-0 z-20 bg-[#1A237E] text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-teal-300">
              <Wallet size={18} />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold leading-tight tracking-tight">Expense Tracker</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Add Expense Button */}
            <button
              onClick={onNavigateToAdd}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-[#00897B] hover:bg-[#00796B] text-white text-xs font-semibold rounded-lg shadow-xs transition active:scale-95"
            >
              <Plus size={16} />
              <span>Add Expense</span>
            </button>

            {/* Analytics Screen Navigation Button */}
            <button
              onClick={onNavigateToSummary}
              title="View Expense Analytics"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition active:scale-95"
            >
              <BarChart3 size={17} />
              <span className="hidden sm:inline">Analytics</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto w-full p-4 sm:p-6 flex-1 flex flex-col">
        {/* KPI Summary Cards Grid (1 col on mobile, 3 cols on PC) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {/* Hero Card: Total Spending */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#1A237E] to-[#283593] text-white shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-blue-200">
                <span className="font-semibold uppercase tracking-wider text-[10px]">Total Expenses</span>
                <Wallet size={16} className="text-teal-300" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold tracking-tight mt-1.5">
                {currencySymbol}
                {totalExpenses.toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
            <div className="text-[11px] text-blue-200/80 mt-2 flex items-center gap-1.5">
              <TrendingUp size={13} className="text-teal-300" />
              <span>Across {expenses.length} total transactions</span>
            </div>
          </div>

          {/* KPI 2: This Month */}
          <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold uppercase tracking-wider text-[10px]">This Month</span>
                <Calendar size={15} className="text-[#1A237E]" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-800 mt-1.5">
                {currencySymbol}
                {currentMonthExpenses.toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
            <div className="text-[11px] text-slate-400 mt-2">Current billing cycle</div>
          </div>

          {/* KPI 3: Top Category */}
          <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold uppercase tracking-wider text-[10px]">Top Category</span>
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-teal-700 mt-1.5 truncate">
                {highestCategory}
              </div>
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              {highestAmount > 0
                ? `${currencySymbol}${highestAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} spent`
                : 'No expenses yet'}
            </div>
          </div>
        </div>

        {/* Responsive Content: 1 column on mobile, 2 columns on PC (lg) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          {/* Left/Main Column: Category Filters & Transactions List */}
          <div className="lg:col-span-2 flex flex-col">
            {/* Category Filter Chips */}
            {!isEmpty && (
              <div className="mb-3">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                  {['All', 'Food', 'Transport', 'Shopping', 'Education', 'Entertainment', 'Healthcare', 'Bills', 'Other'].map(
                    (cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategoryFilter(cat)}
                        className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition cursor-pointer ${
                          selectedCategoryFilter === cat
                            ? 'bg-[#1A237E] text-white shadow-xs'
                            : 'bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50'
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
            <div className="flex items-center justify-between py-2">
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700">
                Recent Transactions {filteredExpenses.length > 0 && `(${filteredExpenses.length})`}
              </h2>
              <button
                onClick={onNavigateToSummary}
                className="text-xs font-semibold text-[#1A237E] hover:underline cursor-pointer"
              >
                View Full Analytics →
              </button>
            </div>

            {/* Main List */}
            <div className="flex-1 pb-16 sm:pb-4">
              {isEmpty ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-2xl border border-slate-200">
                  <div className="w-16 h-16 rounded-full bg-[#1A237E]/10 flex items-center justify-center text-[#1A237E] mb-3">
                    <Wallet size={30} />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-800">No Expenses Recorded Yet</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-[280px] leading-relaxed">
                    Track your daily expenses in Indian Rupee (₹). Tap the button below to add your first expense.
                  </p>
                  <button
                    onClick={onNavigateToAdd}
                    className="mt-4 flex items-center gap-1.5 px-4 py-2.5 bg-[#1A237E] text-white text-xs font-semibold rounded-xl hover:bg-[#151c65] transition shadow-sm cursor-pointer"
                  >
                    <Plus size={14} />
                    Add Your First Expense
                  </button>
                </div>
              ) : filteredExpenses.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
                  No expenses found in "{selectedCategoryFilter}".
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredExpenses.map((expense) => {
                    const colors = getCategoryColor(expense.category);
                    const dateObj = new Date(expense.date);
                    const formattedDate = dateObj.toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });

                    return (
                      <div
                        key={expense.id}
                        onClick={() => onSelectExpense(expense.id)}
                        className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-[#1A237E]/50 hover:shadow-sm cursor-pointer transition active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colors.bg}`}
                          >
                            {getCategoryIcon(expense.category, 18)}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                              {expense.note}
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                              <span className="font-medium text-teal-700">{expense.category}</span>
                              <span>·</span>
                              <span>{formattedDate}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 pl-3">
                          <div className="text-right">
                            <div className="text-xs sm:text-sm font-bold text-[#1A237E]">
                              {currencySymbol}
                              {expense.amount.toLocaleString('en-IN', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </div>
                          </div>
                          <ChevronRight size={15} className="text-slate-300" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column on PC (lg screens): Spending Distribution Preview */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <PieChart size={16} className="text-[#1A237E]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Category Spending
                  </h3>
                </div>
                <button
                  onClick={onNavigateToSummary}
                  className="text-[11px] text-[#00897B] font-semibold hover:underline"
                >
                  View All
                </button>
              </div>

              {sortedCategories.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No expenses to summarize yet.
                </div>
              ) : (
                <div className="space-y-3.5">
                  {sortedCategories.slice(0, 5).map(([cat, amt]) => {
                    const percentage = totalExpenses > 0 ? (amt / totalExpenses) * 100 : 0;
                    const isTop = cat === highestCategory;

                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-700">{cat}</span>
                            {isTop && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold uppercase">
                                Top
                              </span>
                            )}
                          </div>
                          <div className="font-bold text-slate-800 text-[11px]">
                            {currencySymbol}
                            {amt.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                            <span className="text-slate-400 ml-1 font-normal">
                              ({percentage.toFixed(0)}%)
                            </span>
                          </div>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isTop ? 'bg-[#1A237E]' : 'bg-[#00897B]'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Quick Add Expense Action Box on PC */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <button
                  onClick={onNavigateToAdd}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#1A237E] hover:bg-[#151c65] text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-[0.99] cursor-pointer"
                >
                  <Plus size={15} />
                  <span>Record New Expense</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Floating Action Button (shown on mobile, hidden on PC where top/sidebar buttons exist) */}
      <button
        onClick={onNavigateToAdd}
        className="sm:hidden fixed bottom-5 right-5 z-30 flex items-center gap-2 px-4 py-3 bg-[#00897B] text-white text-xs font-bold rounded-2xl shadow-xl hover:bg-[#00796B] transition-transform active:scale-95 cursor-pointer"
        style={{
          boxShadow: '0 4px 16px 0 rgba(0, 137, 123, 0.45)',
        }}
      >
        <Plus size={18} />
        <span>Add Expense</span>
      </button>
    </div>
  );
};
