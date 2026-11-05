import React, { useState } from 'react';
import { ExpenseItem } from '../../types';
import { getCategoryIcon } from './HomeScreenView';
import {
  ArrowLeft,
  Trash2,
  Calendar,
  Clock,
  QrCode,
  FileText,
  HardDrive,
  Check,
} from 'lucide-react';

interface ExpenseDetailsViewProps {
  expense: ExpenseItem | undefined;
  currencySymbol?: string;
  onDelete: (id: string) => void;
  onBack: () => void;
}

export const ExpenseDetailsView: React.FC<ExpenseDetailsViewProps> = ({
  expense,
  currencySymbol = '₹',
  onDelete,
  onBack,
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  if (!expense) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8 text-center bg-[#F8F9FA]">
        <p className="text-sm font-semibold text-slate-700">Expense not found or was removed.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-[#1A237E] text-white text-xs font-semibold rounded-xl cursor-pointer"
        >
          Back to Transactions
        </button>
      </div>
    );
  }

  const dateObj = new Date(expense.date);
  const formattedFullDate = dateObj.toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = dateObj.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const handleCopyId = () => {
    navigator.clipboard.writeText(expense.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 1500);
  };

  return (
    <div className="relative flex flex-col h-full bg-[#F8F9FA] overflow-y-auto">
      {/* Top AppBar */}
      <div className="sticky top-0 z-20 bg-[#1A237E] text-white shadow-md">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-1 rounded-lg hover:bg-white/10 transition active:scale-95 cursor-pointer"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-base sm:text-lg font-bold">Expense Details</h1>
          </div>
          <button
            onClick={() => setShowConfirmDelete(true)}
            title="Delete Expense"
            className="p-1.5 rounded-lg hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 transition active:scale-95 cursor-pointer"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Main Content Area (Responsive) */}
      <div className="flex-1 max-w-2xl mx-auto w-full p-4 sm:p-6 flex flex-col justify-center">
        {/* Hero Card */}
        <div className="flex flex-col items-center justify-center py-8 px-4 bg-gradient-to-b from-[#1A237E] to-[#283593] text-white rounded-3xl shadow-sm mb-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-teal-300 mb-3 shadow-inner">
            {getCategoryIcon(expense.category, 26)}
          </div>
          <div className="text-3xl sm:text-4xl font-bold tracking-tight">
            {currencySymbol}
            {expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 px-3.5 py-0.5 rounded-full bg-teal-400/20 border border-teal-300/30 text-teal-200 text-xs font-bold tracking-wider uppercase">
            {expense.category}
          </div>
        </div>

        {/* Details Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs divide-y divide-slate-100 mb-4">
          {/* Note */}
          <div className="py-3 first:pt-0">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              <FileText size={14} className="text-[#1A237E]" />
              <span>Description / Note</span>
            </div>
            <div className="text-sm sm:text-base font-semibold text-slate-800 leading-snug break-words">
              {expense.note}
            </div>
          </div>

          {/* Date */}
          <div className="py-3">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              <Calendar size={14} className="text-[#1A237E]" />
              <span>Transaction Date</span>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-800">{formattedFullDate}</div>
          </div>

          {/* Time */}
          <div className="py-3">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              <Clock size={14} className="text-[#1A237E]" />
              <span>Timestamp</span>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-800">{formattedTime}</div>
          </div>

          {/* Transaction ID */}
          <div className="py-3">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              <div className="flex items-center gap-2">
                <QrCode size={14} className="text-[#1A237E]" />
                <span>Transaction ID</span>
              </div>
              <button
                onClick={handleCopyId}
                className="text-[10px] text-teal-700 hover:underline flex items-center gap-1 font-bold lowercase cursor-pointer"
              >
                {copiedId ? (
                  <>
                    <Check size={11} className="text-teal-600" /> copied
                  </>
                ) : (
                  'copy id'
                )}
              </button>
            </div>
            <div className="text-[11px] font-mono text-slate-600 bg-slate-50 p-2.5 rounded-lg break-all border border-slate-100">
              {expense.id}
            </div>
          </div>

          {/* Storage Information */}
          <div className="py-3 last:pb-0">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              <HardDrive size={14} className="text-[#1A237E]" />
              <span>Persistence Layer</span>
            </div>
            <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Local Device Storage (Persistent)
            </div>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="w-full py-3 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 transition active:scale-[0.99] cursor-pointer"
        >
          Back to Recent Transactions
        </button>
      </div>

      {/* Delete Confirmation Dialog */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 sm:p-6 shadow-2xl border border-slate-200">
            <h3 className="text-sm sm:text-base font-bold text-slate-900">Delete Expense?</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Are you sure you want to permanently delete "{expense.note}" ({currencySymbol}{expense.amount.toFixed(2)})? This cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2.5 mt-5">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(expense.id);
                  onBack();
                }}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 rounded-lg shadow-sm transition cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
