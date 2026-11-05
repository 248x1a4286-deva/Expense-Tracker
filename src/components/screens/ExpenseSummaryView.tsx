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
  Info,
} from 'lucide-react';

interface ExpenseSummaryViewProps {
  expenses: ExpenseItem[];
  currencySymbol: string;
  onBack: () => void;
}

export const ExpenseSummaryView: React.FC<ExpenseSummaryViewProps> = ({
  expenses,
  currencySymbol,
  onBack,
}) => {
  // Provider-style calculations
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

  // Filter only categories with > 0 spending and sort descending
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
      <div className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 bg-[#1A237E] text-white shadow-md">
        <button
          onClick={onBack}
          className="p-1 rounded-lg hover:bg-white/10 transition active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-base font-bold">Expense Analytics</h1>
      </div>

      <div className="p-4 space-y-4 flex-1">
        {/* KPI Cards */}
        <div className="p-4 rounded-2xl bg-[#1A237E] text-white shadow-md">
          <div className="flex items-center justify-between text-xs text-blue-200">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Total Expenditure</span>
            <Wallet size={16} className="text-teal-300" />
          </div>
          <div className="text-2xl font-bold mt-1">
            {currencySymbol}
            {totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-blue-200/80 mt-1">
            Across {expenses.length} recorded {expenses.length === 1 ? 'transaction' : 'transactions'}
          </div>
        </div>

        {/* 2-Column Metrics */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-[10px] uppercase">This Month</span>
              <Calendar size={13} className="text-[#1A237E]" />
            </div>
            <div className="text-base font-bold text-slate-800 mt-1">
              {currencySymbol}
              {currentMonthExpenses.toFixed(2)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Active period</div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-[10px] uppercase">Top Category</span>
              <Award size={13} className="text-teal-600" />
            </div>
            <div className="text-base font-bold text-teal-700 mt-1 truncate">
              {highestCategory}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {highestAmount > 0 ? `${currencySymbol}${highestAmount.toFixed(2)}` : 'No data'}
            </div>
          </div>
        </div>

        {/* Category-wise Breakdown with Progress Bars */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <PieChart size={16} className="text-[#1A237E]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Category Spending Distribution
              </h2>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold">
              {activeCategories.length} active
            </span>
          </div>

          {activeCategories.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No expenses recorded yet to generate analytics.
            </div>
          ) : (
            <div className="space-y-3.5">
              {activeCategories.map(([cat, amt]) => {
                const percentage = totalSpent > 0 ? (amt / totalSpent) * 100 : 0;
                const isTop = cat === highestCategory;

                return (
                  <div key={cat} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                          {getCategoryIcon(cat as ExpenseCategory, 13)}
                        </div>
                        <span className="font-semibold text-slate-800">{cat}</span>
                        {isTop && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold uppercase">
                            Highest
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">
                          {currencySymbol}
                          {amt.toFixed(2)}
                        </span>
                        <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
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
          <div className="flex items-center gap-3 p-3.5 bg-teal-50/70 border border-teal-200/80 rounded-xl text-xs text-teal-900">
            <CircleDollarSign size={20} className="text-teal-700 shrink-0" />
            <div>
              <div className="font-bold">Average Ticket Size: {currencySymbol}{averageTransaction.toFixed(2)}</div>
              <div className="text-[11px] text-teal-700 mt-0.5">
                Calculated across all {expenses.length} transactions stored on device.
              </div>
            </div>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={onBack}
          className="w-full py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition active:scale-[0.99]"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};
