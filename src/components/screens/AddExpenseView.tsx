import React, { useState } from 'react';
import { ExpenseCategory, ExpenseItem } from '../../types';
import { getCategoryIcon } from './HomeScreenView';
import { ArrowLeft, Calendar, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AddExpenseViewProps {
  currencySymbol?: string;
  onSave: (expense: Omit<ExpenseItem, 'id'>) => void;
  onBack: () => void;
}

const CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transport',
  'Shopping',
  'Education',
  'Entertainment',
  'Healthcare',
  'Bills',
  'Other',
];

export const AddExpenseView: React.FC<AddExpenseViewProps> = ({
  currencySymbol = '₹',
  onSave,
  onBack,
}) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  // Errors state
  const [errors, setErrors] = useState<{ amount?: string; note?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const validate = (): boolean => {
    const newErrors: { amount?: string; note?: string } = {};

    // Amount validation
    if (!amount.trim()) {
      newErrors.amount = 'Please enter an expense amount.';
    } else {
      const parsed = parseFloat(amount.trim());
      if (isNaN(parsed)) {
        newErrors.amount = 'Please enter a valid numeric amount (e.g. 150.00).';
      } else if (parsed <= 0) {
        newErrors.amount = 'Amount must be greater than zero.';
      } else if (parsed > 10000000) {
        newErrors.amount = `Amount cannot exceed ${currencySymbol}1,00,00,000.`;
      }
    }

    // Note validation
    if (!note.trim()) {
      newErrors.note = 'Please provide a short description or note.';
    } else if (note.trim().length < 2) {
      newErrors.note = 'Note must be at least 2 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      onSave({
        amount: parseFloat(parseFloat(amount.trim()).toFixed(2)),
        category,
        date: new Date(date).toISOString(),
        note: note.trim(),
      });

      setShowSuccessToast(true);

      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.8 },
        });
      } catch (_) {}

      setTimeout(() => {
        setIsSubmitting(false);
        onBack();
      }, 700);
    }, 300);
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
            <h1 className="text-base sm:text-lg font-bold">Add Expense</h1>
          </div>
          <span className="text-xs text-teal-200 font-medium">New Transaction</span>
        </div>
      </div>

      {/* Form Container (Responsive: Centered card on PC, full on mobile) */}
      <div className="flex-1 max-w-2xl mx-auto w-full p-4 sm:p-6 flex flex-col justify-center">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Amount Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Expense Amount ({currencySymbol}) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  step="any"
                  inputMode="decimal"
                  placeholder="0.00"
                  autoFocus
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
                  }}
                  className={`w-full pl-9 pr-3 py-3 bg-white rounded-xl border text-base font-semibold text-slate-900 transition focus:outline-none focus:ring-2 ${
                    errors.amount
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-300 focus:border-[#1A237E] focus:ring-[#1A237E]/20'
                  }`}
                />
              </div>
              {errors.amount && (
                <p className="flex items-center gap-1 text-[11px] text-rose-600 font-medium mt-1.5">
                  <AlertCircle size={12} />
                  {errors.amount}
                </p>
              )}

              {/* Rupee denomination presets */}
              <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Presets:</span>
                {['50', '100', '200', '500', '1000', '2000'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setAmount(val);
                      if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:border-[#1A237E] hover:text-[#1A237E] hover:bg-white font-medium transition cursor-pointer"
                  >
                    +{currencySymbol}
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-[11px] sm:text-xs font-medium transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#1A237E] text-white border-[#1A237E] shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`mb-1 ${isSelected ? 'text-teal-300' : 'text-slate-500'}`}>
                        {getCategoryIcon(cat, 18)}
                      </div>
                      <span className="truncate w-full text-center">{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Date of Expense <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Calendar size={16} />
                </span>
                <input
                  type="date"
                  value={date}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-white rounded-xl border border-slate-300 text-sm font-medium text-slate-800 focus:outline-none focus:border-[#1A237E] focus:ring-2 focus:ring-[#1A237E]/20"
                />
              </div>
            </div>

            {/* Description / Note Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Description / Note <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400">{note.length} / 120</span>
              </div>
              <textarea
                rows={3}
                maxLength={120}
                placeholder="e.g. Canteen lunch & tea, Metro card recharge, Books"
                value={note}
                onChange={(e) => {
                  setNote(e.target.value);
                  if (errors.note) setErrors((prev) => ({ ...prev, note: undefined }));
                }}
                className={`w-full p-3 bg-white rounded-xl border text-sm text-slate-800 transition focus:outline-none focus:ring-2 ${
                  errors.note
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-300 focus:border-[#1A237E] focus:ring-[#1A237E]/20'
                }`}
              />
              {errors.note && (
                <p className="flex items-center gap-1 text-[11px] text-rose-600 font-medium mt-1.5">
                  <AlertCircle size={12} />
                  {errors.note}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onBack}
                className="w-1/3 py-3 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#1A237E] hover:bg-[#151c65] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition disabled:opacity-70 active:scale-[0.99] cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving Expense...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Save Expense ({currencySymbol})</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Floating Success Alert */}
      {showSuccessToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2.5 px-5 py-3.5 bg-[#00897B] text-white text-xs font-semibold rounded-xl shadow-xl animate-bounce">
          <CheckCircle2 size={18} />
          <span>Expense of {currencySymbol}{amount} recorded and saved locally!</span>
        </div>
      )}
    </div>
  );
};
