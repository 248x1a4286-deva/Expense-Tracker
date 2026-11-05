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
  Share2,
  Check,
} from 'lucide-react';

interface ExpenseDetailsViewProps {
  expense: ExpenseItem | undefined;
  currencySymbol: string;
  onDelete: (id: string) => void;
  onBack: () => void;
}

export const ExpenseDetailsView: React.FC<ExpenseDetailsViewProps> = ({
  expense,
  currencySymbol,
  onDelete,
  onBack,
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  if (!expense) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-[#F8F9FA]">
        <p className="text-sm font-semibold text-slate-700">Expense not found or was removed.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-[#1A237E] text-white text-xs font-semibold rounded-xl"
        >
          Back to Transactions
        </button>
      </div>
    );
  }

  const dateObj = new Date(expense.date);
  const formattedFullDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = dateObj.toLocaleTimeString('en-US', {
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
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-[#1A237E] text-white shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1 rounded-lg hover:bg-white/10 transition active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-base font-bold">Expense Details</h1>
        </div>
        <button
          onClick={() => setShowConfirmDelete(true)}
          title="Delete Expense"
          className="p-1.5 rounded-lg hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 transition active:scale-95"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Hero Header */}
      <div className="flex flex-col items-center justify-center py-7 px-4 bg-gradient-to-b from-[#1A237E] to-[#283593] text-white rounded-b-3xl shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-teal-300 mb-3 shadow-inner">
          {getCategoryIcon(expense.category, 26)}
        </div>
        <div className="text-3xl font-bold tracking-tight">
          {currencySymbol}
          {expense.amount.toFixed(2)}
        </div>
        <div className="mt-1.5 px-3 py-0.5 rounded-full bg-teal-400/20 border border-teal-300/30 text-teal-200 text-xs font-bold tracking-wider uppercase">
          {expense.category}
        </div>
      </div>

      {/* Metadata Cards */}
      <div className="p-4 space-y-3 flex-1">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs divide-y divide-slate-100">
          {/* Note */}
          <div className="py-2.5 first:pt-0">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              <FileText size={14} className="text-[#1A237E]" />
              <span>Description / Note</span>
            </div>
            <div className="text-sm font-semibold text-slate-800 leading-snug break-words">
              {expense.note}
            </div>
          </div>

          {/* Date */}
          <div className="py-2.5">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              <Calendar size={14} className="text-[#1A237E]" />
              <span>Transaction Date</span>
            </div>
            <div className="text-xs font-semibold text-slate-800">{formattedFullDate}</div>
          </div>

          {/* Time */}
          <div className="py-2.5">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              <Clock size={14} className="text-[#1A237E]" />
              <span>Timestamp</span>
            </div>
            <div className="text-xs font-semibold text-slate-800">{formattedTime}</div>
          </div>

          {/* UUID ID */}
          <div className="py-2.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              <div className="flex items-center gap-2">
                <QrCode size={14} className="text-[#1A237E]" />
                <span>Transaction ID</span>
              </div>
              <button
                onClick={handleCopyId}
                className="text-[10px] text-teal-700 hover:underline flex items-center gap-1 font-bold lowercase"
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
            <div className="text-[11px] font-mono text-slate-600 bg-slate-50 p-2 rounded-lg break-all border border-slate-100">
              {expense.id}
            </div>
          </div>

          {/* Storage Information */}
          <div className="py-2.5 last:pb-0">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              <HardDrive size={14} className="text-[#1A237E]" />
              <span>Persistence Layer</span>
            </div>
            <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Local Device Storage (Survives Reloads)
            </div>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="w-full py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition active:scale-[0.99]"
        >
          Back to Recent Transactions
        </button>
      </div>

      {/* Delete Confirmation Dialog */}
      {showConfirmDelete && (
        <div className="absolute inset-0 z-40 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-[280px] bg-white rounded-2xl p-5 shadow-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Delete Expense?</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Are you sure you want to permanently delete "{expense.note}"? This will update your total and category calculations.
            </p>
            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(expense.id);
                  onBack();
                }}
                className="px-3.5 py-1.5 text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 rounded-lg shadow-sm transition"
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
