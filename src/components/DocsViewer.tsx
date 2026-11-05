import React, { useState } from 'react';
import {
  BookOpen,
  Bug,
  CheckCircle2,
  Users,
  FileText,
  Image as ImageIcon,
  ShieldCheck,
  Download,
  ExternalLink,
} from 'lucide-react';

export const DocsViewer: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<'screenshots' | 'readme' | 'defects'>('screenshots');

  const screenshots = [
    {
      id: 'screen-1',
      title: 'Screen 1: Home Dashboard & Expense List',
      description: 'Features Lifetime Total Expenses card ($215.69), This Month card ($147.20), Top Category (Food), and categorized transaction list with teal FAB.',
      image: '/screenshots/screen1_home.jpg',
      aspect: '9:16',
      badge: 'Screen 1',
    },
    {
      id: 'screen-2',
      title: 'Screen 2: Add Expense Form',
      description: 'Features verified amount field ($45.50), Category grid with Food highlighted, Date picker, description textarea, and Save Expense button.',
      image: '/screenshots/screen2_add.jpg',
      aspect: '9:16',
      badge: 'Screen 2',
    },
    {
      id: 'screen-3',
      title: 'Screen 3: Expense Details Screen',
      description: 'Displays hero category header with $14.50, description, full date, timestamp, transaction UUID, and local storage persistence badge.',
      image: '/screenshots/screen3_details.jpg',
      aspect: '9:16',
      badge: 'Screen 3',
    },
    {
      id: 'screen-4',
      title: 'Screen 4: Expense Summary & Analytics',
      description: 'Calculates total expenditure, highest spending category (Food), category-wise breakdown with progress bars, percentages, and average transaction size ($43.14).',
      image: '/screenshots/screen4_summary.jpg',
      aspect: '9:16',
      badge: 'Screen 4',
    },
  ];

  const defects = [
    {
      id: 'DEF-001',
      title: 'Negative and Zero Amount Validation Bypass',
      severity: 'High',
      component: 'AddExpenseScreen',
      status: 'Fixed',
      description: 'Form allowed negative numbers which corrupted total spending calculations.',
      fix: 'Added boundary validation in TextFormField validator: parsed <= 0 and parsed > 1000000.',
    },
    {
      id: 'DEF-002',
      title: 'Rapid Double-Tap Duplicate Expense Records',
      severity: 'Medium',
      component: 'AddExpenseScreen',
      status: 'Fixed',
      description: 'Rapidly tapping Save triggered concurrent async writes producing two duplicate transactions.',
      fix: 'Implemented _isSubmitting boolean guard to lock button during async Provider commit.',
    },
    {
      id: 'DEF-003',
      title: 'Long Expense Notes Overflowing Transaction Cards',
      severity: 'Low',
      component: 'ExpenseCard',
      status: 'Fixed',
      description: 'Long notes overflowed RenderFlex in transaction list cards on compact screens.',
      fix: 'Configured maxLines: 1 with TextOverflow.ellipsis, leaving full text to Detail screen.',
    },
    {
      id: 'DEF-004',
      title: 'Category Percentage Division by Zero on Empty Data',
      severity: 'Medium',
      component: 'ExpenseProvider & SummaryScreen',
      status: 'Fixed',
      description: 'Empty list caused 0/0 resulting in NaN% display and rendering issues in progress bars.',
      fix: 'Added if (total == 0) return {}; guard in categoryPercentages getter.',
    },
    {
      id: 'DEF-005',
      title: 'Deleted Expense Null Pointer in Details Screen',
      severity: 'Low',
      component: 'ExpenseDetailsScreen',
      status: 'Fixed',
      description: 'Deleting an item caused firstWhere to throw StateError before navigator popped.',
      fix: 'Wrapped element lookup in try-catch fallback handling before route transition completes.',
    },
  ];

  return (
    <div className="flex flex-col h-[750px] bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Header Tabs */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white border-b border-slate-800">
        <div className="flex items-center gap-3">
          <BookOpen size={20} className="text-teal-400" />
          <div>
            <h2 className="text-sm font-bold">Project Deliverables & Documentation</h2>
            <p className="text-[11px] text-slate-400">Team: M. Deva & Srikanth • Screenshots • README • Defect Log</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveDoc('screenshots')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeDoc === 'screenshots'
                ? 'bg-[#1A237E] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon size={14} />
            <span>App Screenshots ({screenshots.length})</span>
          </button>
          <button
            onClick={() => setActiveDoc('readme')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeDoc === 'readme'
                ? 'bg-[#1A237E] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText size={14} />
            <span>README.md</span>
          </button>
          <button
            onClick={() => setActiveDoc('defects')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeDoc === 'defects'
                ? 'bg-[#1A237E] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bug size={14} />
            <span>Defect Log ({defects.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 text-slate-800">
        {/* TAB 1: SCREENSHOTS */}
        {activeDoc === 'screenshots' && (
          <div className="space-y-6">
            <div className="p-4 bg-gradient-to-r from-[#1A237E] to-[#283593] text-white rounded-xl flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">Android Application Screenshots</h3>
                <p className="text-xs text-blue-100 mt-0.5">
                  Visual screenshots for group submission, project report, and demonstration presentation.
                </p>
              </div>
              <div className="text-xs bg-white/10 px-3 py-1 rounded-lg font-medium text-teal-200">
                Team: M. Deva & Srikanth
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {screenshots.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col"
                >
                  <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1A237E]/10 text-[#1A237E] uppercase tracking-wider">
                      {item.badge}
                    </span>
                    <a
                      href={item.image}
                      download={`${item.id}.jpg`}
                      className="text-xs text-[#00897B] font-semibold flex items-center gap-1 hover:underline"
                    >
                      <Download size={13} />
                      Save
                    </a>
                  </div>

                  <div className="relative bg-slate-900 aspect-[9/16] overflow-hidden flex items-center justify-center group">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <a
                      href={item.image}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5"
                    >
                      <ExternalLink size={16} />
                      View Full Size
                    </a>
                  </div>

                  <div className="p-3.5 flex-1 flex flex-col justify-between bg-white">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: DEFECT LOG */}
        {activeDoc === 'defects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div>
                <h3 className="text-sm font-bold text-emerald-900">All 5 Reported Defects Verified and Resolved</h3>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Audited against input edge cases, async concurrency, and device screen boundaries.
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-xs">
                100% FIXED
              </span>
            </div>

            <div className="space-y-4">
              {defects.map((d) => (
                <div key={d.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition shadow-xs">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                        {d.id}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">{d.title}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        {d.severity}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 size={11} /> {d.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mt-3 pt-3 border-t border-slate-200/80">
                    <div>
                      <span className="font-semibold text-slate-500 text-[11px] uppercase tracking-wider block mb-1">
                        Defect Description & Impact:
                      </span>
                      <p className="text-slate-700 leading-relaxed">{d.description}</p>
                      <p className="text-[11px] text-slate-400 mt-1 font-mono">Component: {d.component}</p>
                    </div>

                    <div>
                      <span className="font-semibold text-emerald-700 text-[11px] uppercase tracking-wider block mb-1">
                        Resolution & Verification:
                      </span>
                      <p className="text-slate-700 leading-relaxed">{d.fix}</p>
                      <p className="text-[11px] text-emerald-600 mt-1 font-semibold flex items-center gap-1">
                        <ShieldCheck size={12} /> Verified via Flutter widget test suite
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: README */}
        {activeDoc === 'readme' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* README Hero */}
            <div className="p-6 bg-gradient-to-r from-[#1A237E] to-[#283593] text-white rounded-2xl shadow-sm">
              <h1 className="text-2xl font-bold">Expense Tracker – Android Flutter Application</h1>
              <p className="text-sm text-blue-100 mt-2 leading-relaxed">
                Complete mobile application engineered for Android following the Flutter Application Development Programme Group Project Specification.
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-4 text-xs">
                <span className="bg-white/10 px-2.5 py-1 rounded-md">Flutter 3.35+</span>
                <span className="bg-white/10 px-2.5 py-1 rounded-md">Provider 6.1.2</span>
                <span className="bg-white/10 px-2.5 py-1 rounded-md">SharedPreferences</span>
                <span className="bg-white/10 px-2.5 py-1 rounded-md">Sound Null Safety</span>
                <span className="bg-white/10 px-2.5 py-1 rounded-md">Material 3 Seed: #1A237E</span>
              </div>
            </div>

            {/* Team Members & Contributions Table */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Users size={16} className="text-[#1A237E]" />
                <h2 className="text-sm font-bold text-slate-900">Team Members & Contributions</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 w-1/4">Member Name</th>
                      <th className="py-2.5 w-1/4">Project Role</th>
                      <th className="py-2.5">Key Contributions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/70">
                    <tr>
                      <td className="py-3 font-bold text-slate-900 text-sm">M. Deva</td>
                      <td className="py-3 font-semibold text-[#1A237E]">Lead Flutter Architecture & State</td>
                      <td className="py-3 text-slate-700 leading-relaxed">
                        • <code>ExpenseProvider</code> architecture extending <code>ChangeNotifier</code>.<br />
                        • <code>ExpenseStorageService</code> persistent local storage via <code>SharedPreferences</code>.<br />
                        • <code>Expense</code> model serialization (<code>toJson</code> / <code>fromJson</code>).<br />
                        • Automated Flutter widget testing suite (<code>test/widget_test.dart</code>).
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 font-bold text-slate-900 text-sm">Srikanth</td>
                      <td className="py-3 font-semibold text-[#00897B]">UI/UX Design & Frontend Engineering</td>
                      <td className="py-3 text-slate-700 leading-relaxed">
                        • Screen 1 (Home Dashboard) and Screen 3 (Expense Details) UI design.<br />
                        • Screen 2 (Add Expense) form validation, currency masks, and date picker.<br />
                        • Screen 4 (Expense Summary & Analytics) category breakdown & progress bars.<br />
                        • QA testing, defect logging (<code>defect_log.md</code>), and Material 3 theme.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Application Overview */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h2 className="text-sm font-bold text-slate-900 mb-2">1. Application Overview</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Allows users to record, manage, organize, and monitor daily expenses with full local device storage persistence. Features real-time state management with Provider and ChangeNotifier, responsive Material 3 layout, comprehensive form validation, and deep-dive analytics.
              </p>
            </div>

            {/* Screen Architecture */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h2 className="text-sm font-bold text-slate-900 mb-3">2. Four Mandatory Screens Implemented</h2>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="font-bold text-[#1A237E]">Screen 1: Home / Expense List</div>
                  <div className="text-slate-600 mt-1">
                    Dashboard KPI cards (total expenses, this month spending, transaction count), recent list, category icons, FAB, 4 state handlers (Loading, Error, Empty, List).
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="font-bold text-[#1A237E]">Screen 2: Add Expense</div>
                  <div className="text-slate-600 mt-1">
                    Validated form with positive amount validation, 8 suggested categories, date picker, character-counted note, duplicate tap prevention, and SnackBar alerts.
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="font-bold text-[#1A237E]">Screen 3: Expense Details</div>
                  <div className="text-slate-600 mt-1">
                    Full description, exact timestamp, category chip, unique transaction UUID, persistent storage status, and deletion confirmation modal.
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="font-bold text-[#1A237E]">Screen 4: Expense Summary</div>
                  <div className="text-slate-600 mt-1">
                    Aggregated total spending, category totals & percentages, animated visual progress bars, highest spending category, and average ticket size.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
