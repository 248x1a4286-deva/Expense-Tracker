import React, { useState, useEffect } from 'react';
import { ExpenseItem } from './types';
import {
  loadStoredExpenses,
  saveStoredExpenses,
  clearStoredExpenses,
  INITIAL_SAMPLE_EXPENSES,
} from './storage';
import { AndroidEmulator } from './components/AndroidEmulator';
import { CodeInspector } from './components/CodeInspector';
import { TestRunner } from './components/TestRunner';
import { DocsViewer } from './components/DocsViewer';
import {
  Smartphone,
  Code2,
  CheckCircle2,
  BookOpen,
  Download,
  Github,
  Wallet,
  Sparkles,
} from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { FLUTTER_FILES } from './flutterSourceFiles';

export default function App() {
  const [activeTab, setActiveTab] = useState<'emulator' | 'code' | 'tests' | 'docs'>('emulator');
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [currencySymbol, setCurrencySymbol] = useState<string>('$');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Initialize data from persistent local storage
  useEffect(() => {
    const loaded = loadStoredExpenses();
    setExpenses(loaded);
  }, []);

  const handleAddExpense = (newExpenseData: Omit<ExpenseItem, 'id'>) => {
    // Generate unique UUID matching Flutter Uuid().v4()
    const newExpense: ExpenseItem = {
      ...newExpenseData,
      id: crypto.randomUUID ? crypto.randomUUID() : `exp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
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

  const handleClearAll = () => {
    clearStoredExpenses();
    setExpenses([]);
  };

  const handleResetDemo = () => {
    saveStoredExpenses(INITIAL_SAMPLE_EXPENSES);
    setExpenses(INITIAL_SAMPLE_EXPENSES);
  };

  const handleDownloadAllZip = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();

      // Add all Flutter files
      FLUTTER_FILES.forEach((f) => {
        zip.file(f.path, f.code);
      });

      // Add AndroidManifest and build.gradle
      zip.file(
        'android/app/src/main/AndroidManifest.xml',
        `<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="com.expensetracker.app">
    <application android:label="Expense Tracker" android:name="\${applicationName}" android:icon="@mipmap/ic_launcher">
        <activity android:name=".MainActivity" android:exported="true" android:launchMode="singleTop">
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
    </application>
</manifest>`
      );

      // Add defect log and readme to zip
      zip.file('README.md', FLUTTER_FILES.find((f) => f.path === 'README.md')?.code || '');
      zip.file('defect_log.md', FLUTTER_FILES.find((f) => f.path === 'defect_log.md')?.code || '');

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'Expense_Tracker_Flutter_Android_Project.zip');
    } catch (e) {
      console.error('Failed to create project ZIP', e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-800 flex flex-col font-sans selection:bg-[#1A237E]/20">
      {/* Top Application Header */}
      <header className="sticky top-0 z-50 bg-[#1A237E] text-white shadow-md border-b border-[#151c65]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-teal-300 shadow-inner">
              <Wallet size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight">Expense Tracker</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-200 border border-teal-300/30 uppercase tracking-wider">
                  Android & Flutter 3.35+
                </span>
              </div>
              <p className="text-xs text-blue-200/80 hidden sm:block">
                Provider State Architecture • SharedPreferences Local Storage • 4 Screens • Material 3
              </p>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleDownloadAllZip}
              disabled={isExporting}
              className="flex items-center gap-2 px-3.5 py-2 bg-[#00897B] hover:bg-[#00796B] text-white text-xs font-semibold rounded-xl shadow-sm transition active:scale-95 disabled:opacity-60"
            >
              <Download size={15} />
              <span className="hidden sm:inline">
                {isExporting ? 'Packaging...' : 'Export Flutter Project (.ZIP)'}
              </span>
              <span className="sm:hidden">Export ZIP</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="bg-[#151c65]/90 border-t border-white/10 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setActiveTab('emulator')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                activeTab === 'emulator'
                  ? 'bg-white text-[#1A237E] shadow-sm'
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <Smartphone size={16} />
              <span>Interactive Android Emulator</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                activeTab === 'code'
                  ? 'bg-white text-[#1A237E] shadow-sm'
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <Code2 size={16} />
              <span>Flutter Source Code (lib/ & tests)</span>
            </button>

            <button
              onClick={() => setActiveTab('tests')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                activeTab === 'tests'
                  ? 'bg-white text-[#1A237E] shadow-sm'
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <CheckCircle2 size={16} />
              <span>Widget Tests (flutter test)</span>
            </button>

            <button
              onClick={() => setActiveTab('docs')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                activeTab === 'docs'
                  ? 'bg-white text-[#1A237E] shadow-sm'
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <BookOpen size={16} />
              <span>README & Defect Log</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center">
        {activeTab === 'emulator' && (
          <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8">
            {/* Left: Interactive Phone Mockup */}
            <div className="shrink-0">
              <AndroidEmulator
                expenses={expenses}
                onAddExpense={handleAddExpense}
                onDeleteExpense={handleDeleteExpense}
                onClearAll={handleClearAll}
                onResetDemo={handleResetDemo}
                currencySymbol={currencySymbol}
                setCurrencySymbol={setCurrencySymbol}
              />
            </div>

            {/* Right: Technical Walkthrough & Verification Cards */}
            <div className="flex-1 w-full max-w-xl space-y-4">
              {/* Feature Verification Checklist Card */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  Mandatory Requirements Compliance
                </h3>

                <div className="space-y-2.5 text-xs text-slate-700">
                  <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      ✓
                    </span>
                    <div>
                      <span className="font-bold text-slate-900">4 Complete Screens:</span>
                      <p className="text-slate-500 mt-0.5">
                        Home/List Screen with 4 states, Add Expense Screen with validation, Expense Details Screen with deletion, and Expense Summary & Analytics Screen.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      ✓
                    </span>
                    <div>
                      <span className="font-bold text-slate-900">Provider & ChangeNotifier Architecture:</span>
                      <p className="text-slate-500 mt-0.5">
                        <code>ExpenseProvider</code> centralizes state, notifying UI listeners without duplicate data structures.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      ✓
                    </span>
                    <div>
                      <span className="font-bold text-slate-900">Persistent Local Device Storage:</span>
                      <p className="text-slate-500 mt-0.5">
                        Every added or deleted expense is saved locally and survives closing and reopening the browser or app.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      ✓
                    </span>
                    <div>
                      <span className="font-bold text-slate-900">Material 3 Theme & Seed Color:</span>
                      <p className="text-slate-500 mt-0.5">
                        Consistent palette generated from Deep Navy Blue (<code>#1A237E</code>) and Teal (<code>#00897B</code>).
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions Guide */}
              <div className="bg-gradient-to-br from-[#1A237E]/5 to-teal-500/5 rounded-2xl p-5 border border-[#1A237E]/10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A237E] mb-2">
                  Interactive Evaluation Guide
                </h4>
                <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
                  <li>
                    Tap <strong>"+" (Add Expense)</strong> in the phone to test form validation (try typing negative numbers or leaving fields empty).
                  </li>
                  <li>
                    Tap any transaction in the list to view the <strong>Expense Details Screen</strong> and test the deletion dialog.
                  </li>
                  <li>
                    Tap the <strong>Analytics icon</strong> in the top-right of the phone AppBar to inspect category progress bars and percentages.
                  </li>
                  <li>
                    Use the <strong>"Test States"</strong> buttons above the phone to test Loading, Error with Retry, and Empty states!
                  </li>
                </ul>
              </div>

              {/* GitHub Clone and APK Build Instruction Card */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Need to clone to your local IDE?</div>
                  <div className="text-[11px] text-slate-500">
                    Run <code className="text-[#1A237E] font-semibold">flutter test</code> or <code className="text-[#1A237E] font-semibold">flutter run</code> directly.
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('code')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                >
                  View Code Tree →
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="w-full">
            <CodeInspector />
          </div>
        )}

        {activeTab === 'tests' && (
          <div className="w-full">
            <TestRunner />
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="w-full">
            <DocsViewer />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Expense Tracker • Flutter Application Development Programme Group Project</span>
          <span className="text-slate-400">Target Platform: Android • State Management: Provider</span>
        </div>
      </footer>
    </div>
  );
}
