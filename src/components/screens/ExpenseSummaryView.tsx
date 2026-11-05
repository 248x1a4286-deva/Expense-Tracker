import React from 'react';
import { ExpenseItem, ExpenseCategory } from '../../types';
import { getCategoryIcon } from './HomeScreenView';
import {
  ArrowLeft,
  PieChart,
  Calendar,
  Wallet,
  Award,
  CircleDollarSign,
} from 'lucide-react';

interface ExpenseSummaryViewProps {
  expenses: ExpenseItem[];
  currencySymbol?: string;
  onBack: () => void;
}

export const ExpenseSummaryView: React.FC<ExpenseSummaryViewProps> = ({
  expenses,
  currencySymbol = '₹',
  onBack,
}) => {
  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);

  const now = new Date();
  const currentMonthExpenses = expenses
    .filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    })
    .reduce((sum, item) => sum + item.amount, 0);

  // Category totals
  const categoryMap: Record<ExpenseCategory, number> = {
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
    if (categoryMap[item.category] !== undefined) {
      categoryMap[item.category] += item.amount;
    } else {
      categoryMap['Other'] += item.amount;
    }
  });

  const activeCategories = Object.entries(categoryMap)
    .filter(([_, amt]) => amt > 0)
    .sort((a, b) => b[1] - a[1]);

  const highestCategory =
    activeCategories.length > 0 ? activeCategories[0][0] : 'None';
  const highestAmount =
    activeCategories.length > 0 ? activeCategories[0][1] : 0;

  const averageTransaction =
    expenses.length > 0 ? totalSpent / expenses.length : 0;

  return (
    <div className="relative flex flex-col h-full bg-[#F8F9FA] overflow-y-auto">
      {/* Top AppBar */}
      <div className="sticky top-0 z-20 bg-[#1A237E] text-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-1 rounded-lg hover:bg-white/10 transition active:scale-95 cursor-pointer"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-base sm:text-lg font-bold">Expense Analytics</h1>
          </div>
          <span className="text-xs text-teal-200 font-medium">Monthly Breakdown</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 space-y-4 sm:space-y-6 flex-1 flex flex-col">
        {/* KPI Summary Cards Grid (Responsive: 1 col on mobile, 3 cols on PC) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#1A237E] text-white shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-blue-200">
                <span className="font-semibold uppercase tracking-wider text-[10px]">Total Expenditure</span>
                <Wallet size={16} className="text-teal-300" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold mt-1.5">
                {currencySymbol}
                {totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="text-[11px] text-blue-200/80 mt-2">
              Across {expenses.length} recorded transactions
            </div>
          </div>

          <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-[10px] uppercase">This Month</span>
                <Calendar size={15} className="text-[#1A237E]" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-800 mt-1.5">
                {currencySymbol}
                {currentMonthExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="text-[10px] text-slate-400 mt-2">Active period spending</div>
          </div>

          <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-[10px] uppercase">Top Category</span>
                <Award size={15} className="text-teal-600" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-teal-700 mt-1.5 truncate">
                {highestCategory}
              </div>
            </div>
            <div className="text-[10px] text-slate-400 mt-2">
              {highestAmount > 0
                ? `${currencySymbol}${highestAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                : 'No data'}
            </div>
          </div>
        </div>

        {/* Category Breakdown Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PieChart size={18} className="text-[#1A237E]" />
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800">
                Category Spending Distribution
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-semibold">
              {activeCategories.length} categories active
            </span>
          </div>

          {activeCategories.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No expenses recorded yet to generate analytics.
            </div>
          ) : (
            <div className="space-y-4">
              {activeCategories.map(([cat, amt]) => {
                const percentage = totalSpent > 0 ? (amt / totalSpent) * 100 : 0;
                const isTop = cat === highestCategory;

                return (
                  <div key={cat} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                          {getCategoryIcon(cat as ExpenseCategory, 14)}
                        </div>
                        <span className="font-semibold text-slate-800">{cat}</span>
                        {isTop && (
                          <span className="text-[9px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold uppercase">
                            Highest
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">
                          {currencySymbol}
                          {amt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
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
        </div>

        {/* Average Transaction Card */}
        {expenses.length > 0 && (
          <div className="flex items-center gap-3.5 p-4 bg-teal-50/70 border border-teal-200/80 rounded-2xl text-xs sm:text-sm text-teal-900">
            <CircleDollarSign size={22} className="text-teal-700 shrink-0" />
            <div>
              <div className="font-bold">
                Average Transaction Size: {currencySymbol}{averageTransaction.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-[11px] text-teal-700/90 mt-0.5">
                Calculated across all {expenses.length} transactions stored on device.
              </div>
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="pt-2">
          <button
            onClick={onBack}
            className="w-full py-3 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 transition active:scale-[0.99] cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
