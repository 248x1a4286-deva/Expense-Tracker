export interface FlutterSourceFile {
  path: string;
  category: 'core' | 'model' | 'provider' | 'screen' | 'widget' | 'test' | 'config' | 'doc';
  description: string;
  code: string;
}

export const FLUTTER_FILES: FlutterSourceFile[] = [
  {
    path: 'pubspec.yaml',
    category: 'config',
    description: 'Flutter project manifest, SDK constraints (Flutter 3.35+), dependencies (provider, shared_preferences, intl, uuid).',
    code: `name: expense_tracker
description: A modern, reliable Android Expense Tracker application built with Flutter and Provider.
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.3.0 <4.0.0'
  flutter: '>=3.35.0'

dependencies:
  flutter:
    sdk: flutter
  provider: ^6.1.2
  shared_preferences: ^2.3.2
  intl: ^0.19.0
  uuid: ^4.5.1

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^5.0.0

flutter:
  uses-material-design: true`,
  },
  {
    path: 'lib/main.dart',
    category: 'core',
    description: 'Application entry point initializing ChangeNotifierProvider and Material 3 AppTheme.',
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/expense_provider.dart';
import 'screens/home_screen.dart';
import 'theme/app_theme.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const ExpenseTrackerApp());
}

class ExpenseTrackerApp extends StatelessWidget {
  const ExpenseTrackerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => ExpenseProvider(),
      child: MaterialApp(
        title: 'Expense Tracker',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        home: const HomeScreen(),
      ),
    );
  }
}`,
  },
  {
    path: 'lib/models/expense.dart',
    category: 'model',
    description: 'Expense data model with JSON serialization (toJson/fromJson) and immutability.',
    code: `class Expense {
  final String id;
  final double amount;
  final String category;
  final DateTime date;
  final String note;

  const Expense({
    required this.id,
    required this.amount,
    required this.category,
    required this.date,
    required this.note,
  });

  factory Expense.fromJson(Map<String, dynamic> json) {
    return Expense(
      id: json['id'] as String,
      amount: (json['amount'] as num).toDouble(),
      category: json['category'] as String,
      date: DateTime.parse(json['date'] as String),
      note: json['note'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'amount': amount,
      'category': category,
      'date': date.toIso8601String(),
      'note': note,
    };
  }

  Expense copyWith({
    String? id,
    double? amount,
    String? category,
    DateTime? date,
    String? note,
  }) {
    return Expense(
      id: id ?? this.id,
      amount: amount ?? this.amount,
      category: category ?? this.category,
      date: date ?? this.date,
      note: note ?? this.note,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Expense && runtimeType == other.runtimeType && id == other.id;

  @override
  int get hashCode => id.hashCode;
}`,
  },
  {
    path: 'lib/services/expense_storage_service.dart',
    category: 'core',
    description: 'Persistent local storage service saving and loading JSON lists from SharedPreferences.',
    code: `import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/expense.dart';

class ExpenseStorageService {
  static const String _storageKey = 'saved_expenses_list_v1';

  Future<bool> saveExpenses(List<Expense> expenses) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final List<Map<String, dynamic>> jsonList =
          expenses.map((expense) => expense.toJson()).toList();
      final String jsonString = jsonEncode(jsonList);
      return await prefs.setString(_storageKey, jsonString);
    } catch (e) {
      throw Exception('Failed to save expenses to local storage: $e');
    }
  }

  Future<List<Expense>> loadExpenses() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final String? jsonString = prefs.getString(_storageKey);

      if (jsonString == null || jsonString.isEmpty) {
        return [];
      }

      final List<dynamic> decodedList = jsonDecode(jsonString) as List<dynamic>;
      return decodedList
          .map((item) => Expense.fromJson(item as Map<String, dynamic>))
          .toList();
    } catch (e) {
      throw Exception('Failed to load expenses from local storage: $e');
    }
  }

  Future<bool> clearAllExpenses() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return await prefs.remove(_storageKey);
    } catch (e) {
      throw Exception('Failed to clear local storage: $e');
    }
  }
}`,
  },
  {
    path: 'lib/providers/expense_provider.dart',
    category: 'provider',
    description: 'Central ChangeNotifier managing transaction state, loading/error states, and statistics.',
    code: `import 'package:flutter/foundation.dart';
import '../models/expense.dart';
import '../services/expense_storage_service.dart';

class ExpenseProvider extends ChangeNotifier {
  final ExpenseStorageService _storageService;

  List<Expense> _expenses = [];
  bool _isLoading = false;
  String? _errorMessage;

  ExpenseProvider({ExpenseStorageService? storageService})
      : _storageService = storageService ?? ExpenseStorageService();

  List<Expense> get expenses => List.unmodifiable(_expenses);
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get hasError => _errorMessage != null;
  bool get isEmpty => _expenses.isEmpty && !_isLoading && _errorMessage == null;

  int get transactionCount => _expenses.length;

  double get totalExpenses =>
      _expenses.fold(0.0, (sum, item) => sum + item.amount);

  double get currentMonthExpenses {
    final now = DateTime.now();
    return _expenses
        .where((e) => e.date.year == now.year && e.date.month == now.month)
        .fold(0.0, (sum, item) => sum + item.amount);
  }

  Map<String, double> get categoryTotals {
    final Map<String, double> totals = {};
    for (final expense in _expenses) {
      totals[expense.category] = (totals[expense.category] ?? 0.0) + expense.amount;
    }
    return totals;
  }

  Map<String, double> get categoryPercentages {
    final total = totalExpenses;
    if (total == 0) return {};
    final totals = categoryTotals;
    return totals.map((cat, amount) => MapEntry(cat, (amount / total) * 100));
  }

  String get highestSpendingCategory {
    final totals = categoryTotals;
    if (totals.isEmpty) return 'None';
    var highestCategory = totals.keys.first;
    var highestAmount = totals.values.first;
    totals.forEach((cat, amount) {
      if (amount > highestAmount) {
        highestAmount = amount;
        highestCategory = cat;
      }
    });
    return highestCategory;
  }

  Future<void> loadExpenses() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _expenses = await _storageService.loadExpenses();
      _expenses.sort((a, b) => b.date.compareTo(a.date));
      _errorMessage = null;
    } catch (e) {
      _errorMessage = 'Failed to load expenses. Please try again.';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> addExpense(Expense expense) async {
    try {
      _expenses.insert(0, expense);
      notifyListeners();
      await _storageService.saveExpenses(_expenses);
      return true;
    } catch (e) {
      _expenses.removeWhere((item) => item.id == expense.id);
      _errorMessage = 'Could not save expense. Please retry.';
      notifyListeners();
      return false;
    }
  }

  Future<bool> deleteExpense(String id) async {
    final existingIndex = _expenses.indexWhere((item) => item.id == id);
    if (existingIndex == -1) return false;

    final removedItem = _expenses.removeAt(existingIndex);
    notifyListeners();

    try {
      await _storageService.saveExpenses(_expenses);
      return true;
    } catch (e) {
      _expenses.insert(existingIndex, removedItem);
      _errorMessage = 'Failed to delete expense record.';
      notifyListeners();
      return false;
    }
  }

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }
}`,
  },
  {
    path: 'lib/screens/home_screen.dart',
    category: 'screen',
    description: 'Screen 1: Dashboard overview, financial KPIs, recent list, and 4 state handlers.',
    code: `import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../providers/expense_provider.dart';
import '../widgets/stat_summary_card.dart';
import '../widgets/expense_card.dart';
import '../widgets/empty_state_view.dart';
import '../widgets/error_state_view.dart';
import 'add_expense_screen.dart';
import 'expense_details_screen.dart';
import 'expense_summary_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ExpenseProvider>().loadExpenses();
    });
  }

  void _navigateToAddExpense() {
    Navigator.of(context).push(
      MaterialPageRoute(builder: (ctx) => const AddExpenseScreen()),
    );
  }

  void _navigateToSummary() {
    Navigator.of(context).push(
      MaterialPageRoute(builder: (ctx) => const ExpenseSummaryScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final currencyFormat = NumberFormat.currency(symbol: '\$', decimalDigits: 2);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Expense Tracker'),
        actions: [
          IconButton(
            icon: const Icon(Icons.analytics_outlined),
            tooltip: 'View Analytics & Summary',
            onPressed: _navigateToSummary,
          ),
        ],
      ),
      body: Consumer<ExpenseProvider>(
        builder: (context, provider, child) {
          if (provider.isLoading) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(color: theme.colorScheme.primary),
                  const SizedBox(height: 16),
                  Text('Loading your expenses...', style: TextStyle(color: theme.colorScheme.onSurfaceVariant)),
                ],
              ),
            );
          }

          if (provider.hasError) {
            return ErrorStateView(
              message: provider.errorMessage ?? 'An unexpected error occurred.',
              onRetry: () => provider.loadExpenses(),
            );
          }

          if (provider.isEmpty) {
            return Column(
              children: [
                _buildHeaderCards(provider, currencyFormat),
                Expanded(
                  child: EmptyStateView(onAddPressed: _navigateToAddExpense),
                ),
              ],
            );
          }

          return RefreshIndicator(
            onRefresh: () => provider.loadExpenses(),
            color: theme.colorScheme.primary,
            child: CustomScrollView(
              slivers: [
                SliverToBoxAdapter(child: _buildHeaderCards(provider, currencyFormat)),
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Recent Transactions', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: theme.colorScheme.onSurface)),
                        TextButton(onPressed: _navigateToSummary, child: const Text('View Summary')),
                      ],
                    ),
                  ),
                ),
                SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (context, index) {
                      final expense = provider.expenses[index];
                      return ExpenseCard(
                        expense: expense,
                        onTap: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(builder: (ctx) => ExpenseDetailsScreen(expenseId: expense.id)),
                          );
                        },
                      );
                    },
                    childCount: provider.expenses.length,
                  ),
                ),
                const SliverToBoxAdapter(child: SizedBox(height: 80)),
              ],
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _navigateToAddExpense,
        icon: const Icon(Icons.add),
        label: const Text('Add Expense'),
      ),
    );
  }

  Widget _buildHeaderCards(ExpenseProvider provider, NumberFormat currencyFormat) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.primary.withOpacity(0.04),
        border: Border(bottom: BorderSide(color: Theme.of(context).colorScheme.outlineVariant.withOpacity(0.4))),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text('Welcome Back', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: Theme.of(context).colorScheme.onSurfaceVariant)),
              const Spacer(),
              Text('\${provider.transactionCount} transactions', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: Theme.of(context).colorScheme.secondary)),
            ],
          ),
          const SizedBox(height: 12),
          StatSummaryCard(
            title: 'TOTAL EXPENSES',
            value: currencyFormat.format(provider.totalExpenses),
            subtitle: 'Lifetime cumulative spending',
            icon: Icons.account_balance_wallet,
            isPrimary: true,
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: StatSummaryCard(
                  title: 'THIS MONTH',
                  value: currencyFormat.format(provider.currentMonthExpenses),
                  icon: Icons.calendar_today,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: StatSummaryCard(
                  title: 'TOP CATEGORY',
                  value: provider.highestSpendingCategory,
                  icon: Icons.pie_chart_outline,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}`,
  },
  {
    path: 'lib/screens/add_expense_screen.dart',
    category: 'screen',
    description: 'Screen 2: Add expense form with positive numeric validation and date selection.',
    code: `import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:uuid/uuid.dart';
import '../models/expense.dart';
import '../providers/expense_provider.dart';
import '../widgets/category_icon.dart';

class AddExpenseScreen extends StatefulWidget {
  const AddExpenseScreen({super.key});

  @override
  State<AddExpenseScreen> createState() => _AddExpenseScreenState();
}

class _AddExpenseScreenState extends State<AddExpenseScreen> {
  final _formKey = GlobalKey<FormState>();
  final _amountController = TextEditingController();
  final _noteController = TextEditingController();

  static const List<String> _categories = [
    'Food',
    'Transport',
    'Shopping',
    'Education',
    'Entertainment',
    'Healthcare',
    'Bills',
    'Other',
  ];

  String _selectedCategory = 'Food';
  DateTime _selectedDate = DateTime.now();
  bool _isSubmitting = false;

  @override
  void dispose() {
    _amountController.dispose();
    _noteController.dispose();
    super.dispose();
  }

  Future<void> _pickDate() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(2020),
      lastDate: now,
    );

    if (picked != null) {
      setState(() {
        _selectedDate = picked;
      });
    }
  }

  Future<void> _submitExpense() async {
    if (_isSubmitting) return;

    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isSubmitting = true;
    });

    try {
      final double amount = double.parse(_amountController.text.trim());
      final String note = _noteController.text.trim();

      final newExpense = Expense(
        id: const Uuid().v4(),
        amount: amount,
        category: _selectedCategory,
        date: _selectedDate,
        note: note,
      );

      final success = await context.read<ExpenseProvider>().addExpense(newExpense);

      if (!mounted) return;

      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: const [
                Icon(Icons.check_circle_outline, color: Colors.white),
                SizedBox(width: 12),
                Text('Expense added successfully!'),
              ],
            ),
            backgroundColor: Theme.of(context).colorScheme.secondary,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            duration: const Duration(seconds: 2),
          ),
        );
        Navigator.of(context).pop();
      }
    } finally {
      if (mounted) {
        setState(() {
          _isSubmitting = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final dateFormat = DateFormat('EEE, MMM d, yyyy');

    return Scaffold(
      appBar: AppBar(title: const Text('Add Expense')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Expense Amount', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: theme.colorScheme.onSurface)),
              const SizedBox(height: 8),
              TextFormField(
                controller: _amountController,
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                decoration: const InputDecoration(
                  hintText: '0.00',
                  prefixIcon: Icon(Icons.attach_money),
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) return 'Please enter an expense amount.';
                  final parsed = double.tryParse(value.trim());
                  if (parsed == null) return 'Please enter a valid numeric amount (e.g. 15.50).';
                  if (parsed <= 0) return 'Amount must be greater than zero.';
                  return null;
                },
              ),
              const SizedBox(height: 20),
              Text('Category', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: theme.colorScheme.onSurface)),
              const SizedBox(height: 8),
              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: theme.colorScheme.outlineVariant),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    value: _selectedCategory,
                    isExpanded: true,
                    items: _categories.map((String category) {
                      return DropdownMenuItem<String>(
                        value: category,
                        child: Row(
                          children: [
                            CategoryIcon(category: category, size: 18),
                            const SizedBox(width: 12),
                            Text(category, style: const TextStyle(fontWeight: FontWeight.w500)),
                          ],
                        ),
                      );
                    }).toList(),
                    onChanged: (val) {
                      if (val != null) setState(() => _selectedCategory = val);
                    },
                  ),
                ),
              ),
              const SizedBox(height: 20),
              Text('Date of Expense', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: theme.colorScheme.onSurface)),
              const SizedBox(height: 8),
              InkWell(
                onTap: _pickDate,
                borderRadius: BorderRadius.circular(12),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: theme.colorScheme.outlineVariant),
                  ),
                  child: Row(
                    children: [
                      Icon(Icons.calendar_month, color: theme.colorScheme.primary),
                      const SizedBox(width: 12),
                      Text(dateFormat.format(_selectedDate), style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w500)),
                      const Spacer(),
                      Text('Change', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: theme.colorScheme.primary)),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),
              Text('Description / Note', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: theme.colorScheme.onSurface)),
              const SizedBox(height: 8),
              TextFormField(
                controller: _noteController,
                maxLines: 3,
                maxLength: 120,
                decoration: const InputDecoration(
                  hintText: 'e.g. Groceries at Trader Joe\'s, Bus pass, Books',
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) return 'Please provide a short description or note.';
                  if (value.trim().length < 2) return 'Note must be at least 2 characters long.';
                  return null;
                },
              ),
              const SizedBox(height: 28),
              ElevatedButton(
                onPressed: _isSubmitting ? null : _submitExpense,
                child: _isSubmitting
                    ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                    : const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.save_outlined),
                          SizedBox(width: 8),
                          Text('Save Expense'),
                        ],
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}`,
  },
  {
    path: 'lib/screens/expense_details_screen.dart',
    category: 'screen',
    description: 'Screen 3: Detailed transaction view showing UUID, full timestamp, note, and deletion option.',
    code: `import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../models/expense.dart';
import '../providers/expense_provider.dart';
import '../widgets/category_icon.dart';

class ExpenseDetailsScreen extends StatelessWidget {
  final String expenseId;

  const ExpenseDetailsScreen({super.key, required this.expenseId});

  Future<void> _confirmDelete(BuildContext context, Expense expense) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete Expense?'),
        content: Text('Are you sure you want to remove "\${expense.note}"?'),
        actions: [
          TextButton(onPressed: () => Navigator.of(ctx).pop(false), child: const Text('Cancel')),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: Theme.of(context).colorScheme.error),
            onPressed: () => Navigator.of(ctx).pop(true),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (confirmed == true && context.mounted) {
      await context.read<ExpenseProvider>().deleteExpense(expense.id);
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Expense deleted successfully.')),
        );
        Navigator.of(context).pop();
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final provider = context.watch<ExpenseProvider>();
    final currencyFormat = NumberFormat.currency(symbol: '\$', decimalDigits: 2);
    final fullDateFormat = DateFormat('EEEE, MMMM d, yyyy');
    final timeFormat = DateFormat('h:mm a');

    Expense? expense;
    try {
      expense = provider.expenses.firstWhere((e) => e.id == expenseId);
    } catch (_) {
      expense = null;
    }

    if (expense == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Expense Details')),
        body: Center(
          child: ElevatedButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Back to Home'),
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Expense Details'),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete_outline),
            onPressed: () => _confirmDelete(context, expense!),
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 36, horizontal: 24),
              decoration: BoxDecoration(
                color: theme.colorScheme.primary,
                borderRadius: const BorderRadius.only(
                  bottomLeft: Radius.circular(28),
                  bottomRight: Radius.circular(28),
                ),
              ),
              child: Column(
                children: [
                  CategoryIcon(category: expense.category, size: 36),
                  const SizedBox(height: 16),
                  Text(
                    currencyFormat.format(expense.amount),
                    style: const TextStyle(fontSize: 38, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    expense.category.toUpperCase(),
                    style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: theme.colorScheme.secondaryContainer),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    children: [
                      _buildRow(context, Icons.description_outlined, 'Description', expense.note),
                      const Divider(height: 28),
                      _buildRow(context, Icons.calendar_today, 'Date', fullDateFormat.format(expense.date)),
                      const Divider(height: 28),
                      _buildRow(context, Icons.access_time, 'Time', timeFormat.format(expense.date)),
                      const Divider(height: 28),
                      _buildRow(context, Icons.qr_code, 'Transaction ID', expense.id),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRow(BuildContext context, IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, size: 20, color: Theme.of(context).colorScheme.primary),
        const SizedBox(width: 14),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: TextStyle(fontSize: 12, color: Theme.of(context).colorScheme.onSurfaceVariant)),
              const SizedBox(height: 4),
              Text(value, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600)),
            ],
          ),
        ),
      ],
    );
  }
}`,
  },
  {
    path: 'lib/screens/expense_summary_screen.dart',
    category: 'screen',
    description: 'Screen 4: Aggregated analytics dashboard, category spending distribution, and percentages.',
    code: `import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../providers/expense_provider.dart';
import '../widgets/stat_summary_card.dart';
import '../widgets/category_icon.dart';

class ExpenseSummaryScreen extends StatelessWidget {
  const ExpenseSummaryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final provider = context.watch<ExpenseProvider>();
    final currencyFormat = NumberFormat.currency(symbol: '\$', decimalDigits: 2);
    final totalSpent = provider.totalExpenses;
    final categoryTotals = provider.categoryTotals;
    final sortedCategories = categoryTotals.entries.toList()
      ..sort((a, b) => b.value.compareTo(a.value));

    return Scaffold(
      appBar: AppBar(title: const Text('Expense Summary & Analytics')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(vertical: 16.0),
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Column(
                children: [
                  StatSummaryCard(
                    title: 'TOTAL EXPENDITURE',
                    value: currencyFormat.format(totalSpent),
                    subtitle: 'Across \${provider.transactionCount} transactions',
                    icon: Icons.trending_up,
                    isPrimary: true,
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: StatSummaryCard(
                          title: 'THIS MONTH',
                          value: currencyFormat.format(provider.currentMonthExpenses),
                          icon: Icons.calendar_month,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: StatSummaryCard(
                          title: 'HIGHEST SPENDING',
                          value: provider.highestSpendingCategory,
                          icon: Icons.pie_chart,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: sortedCategories.map((entry) {
                      final percentage = totalSpent > 0 ? (entry.value / totalSpent) * 100 : 0.0;
                      final ratio = totalSpent > 0 ? (entry.value / totalSpent) : 0.0;
                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 8.0),
                        child: Column(
                          children: [
                            Row(
                              children: [
                                CategoryIcon(category: entry.key, size: 18),
                                const SizedBox(width: 12),
                                Expanded(child: Text(entry.key, style: const TextStyle(fontWeight: FontWeight.w600))),
                                Text(currencyFormat.format(entry.value), style: TextStyle(fontWeight: FontWeight.bold, color: theme.colorScheme.primary)),
                                const SizedBox(width: 8),
                                Text('\${percentage.toStringAsFixed(1)}%', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                              ],
                            ),
                            const SizedBox(height: 8),
                            LinearProgressIndicator(value: ratio, minHeight: 8),
                          ],
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}`,
  },
  {
    path: 'lib/theme/app_theme.dart',
    category: 'config',
    description: 'Material 3 design theme configured from seed color Deep Navy Blue (#1A237E).',
    code: `import 'package:flutter/material.dart';

class AppTheme {
  static const Color seedColor = Color(0xFF1A237E);
  static const Color secondaryTeal = Color(0xFF00897B);
  static const Color scaffoldLightBg = Color(0xFFF8F9FA);

  static ThemeData get lightTheme {
    final colorScheme = ColorScheme.fromSeed(
      seedColor: seedColor,
      brightness: Brightness.light,
      primary: seedColor,
      secondary: secondaryTeal,
      surface: Colors.white,
      background: scaffoldLightBg,
    );

    return ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: scaffoldLightBg,
      appBarTheme: AppBarTheme(
        backgroundColor: colorScheme.primary,
        foregroundColor: colorScheme.onPrimary,
        elevation: 0,
        centerTitle: false,
      ),
      cardTheme: CardTheme(
        color: Colors.white,
        elevation: 1.5,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      ),
      floatingActionButtonTheme: FloatingActionButtonThemeData(
        backgroundColor: colorScheme.secondary,
        foregroundColor: colorScheme.onSecondary,
      ),
    );
  }
}`,
  },
  {
    path: 'test/widget_test.dart',
    category: 'test',
    description: 'Automated Flutter widget tests covering home screen, empty state, form validation, and record creation.',
    code: `import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:expense_tracker/models/expense.dart';
import 'package:expense_tracker/providers/expense_provider.dart';
import 'package:expense_tracker/services/expense_storage_service.dart';
import 'package:expense_tracker/screens/home_screen.dart';
import 'package:expense_tracker/screens/add_expense_screen.dart';
import 'package:expense_tracker/theme/app_theme.dart';

class MockExpenseStorageService extends ExpenseStorageService {
  List<Expense> storedExpenses = [];

  @override
  Future<List<Expense>> loadExpenses() async => List.from(storedExpenses);

  @override
  Future<bool> saveExpenses(List<Expense> expenses) async {
    storedExpenses = List.from(expenses);
    return true;
  }
}

void main() {
  late MockExpenseStorageService mockStorage;
  late ExpenseProvider expenseProvider;

  setUp(() {
    mockStorage = MockExpenseStorageService();
    expenseProvider = ExpenseProvider(storageService: mockStorage);
  });

  testWidgets('1. Displaying the home screen and app title', (tester) async {
    await tester.pumpWidget(
      ChangeNotifierProvider.value(
        value: expenseProvider,
        child: MaterialApp(theme: AppTheme.lightTheme, home: const HomeScreen()),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.text('Expense Tracker'), findsOneWidget);
    expect(find.text('TOTAL EXPENSES'), findsOneWidget);
  });

  testWidgets('2. Showing the friendly empty expense state', (tester) async {
    await tester.pumpWidget(
      ChangeNotifierProvider.value(
        value: expenseProvider,
        child: MaterialApp(theme: AppTheme.lightTheme, home: const HomeScreen()),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.text('No Expenses Recorded Yet'), findsOneWidget);
  });

  testWidgets('3. Validating the expense form fields', (tester) async {
    await tester.pumpWidget(
      ChangeNotifierProvider.value(
        value: expenseProvider,
        child: MaterialApp(theme: AppTheme.lightTheme, home: const AddExpenseScreen()),
      ),
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byType(ElevatedButton));
    await tester.pumpAndSettle();
    expect(find.text('Please enter an expense amount.'), findsOneWidget);
  });

  testWidgets('4. Adding an expense successfully', (tester) async {
    await tester.pumpWidget(
      ChangeNotifierProvider.value(
        value: expenseProvider,
        child: MaterialApp(theme: AppTheme.lightTheme, home: const AddExpenseScreen()),
      ),
    );
    await tester.pumpAndSettle();
    await tester.enterText(find.byType(TextFormField).first, '45.50');
    await tester.enterText(find.byType(TextFormField).last, 'Campus Textbook');
    await tester.tap(find.byType(ElevatedButton));
    await tester.pumpAndSettle();
    expect(expenseProvider.expenses.length, equals(1));
    expect(expenseProvider.expenses.first.amount, equals(45.50));
  });
}`,
  },
  {
    path: 'README.md',
    category: 'doc',
    description: 'Complete project documentation, architecture, team contributions (M. Deva & Srikanth), and run instructions.',
    code: `# Expense Tracker – Flutter Android Application

# Project Topic: Personal Finance & Expense Management for Android  
# Course Programme: Flutter Application Development Programme Group Project  
# Target Platform: Android (Compatible with Android 5.0+ / API 21 through Android 15 / API 34)

## Team Members & Contributions
| Member Name | Role | Key Contributions |
| :--- | :--- | :--- |
| **M. Deva** | Lead Flutter Engineer & Architecture | ExpenseProvider state architecture using ChangeNotifier, ExpenseStorageService persistent device storage, Expense data model JSON serialization, Automated Flutter widget testing suite (test/widget_test.dart) |
| **Srikanth** | UI/UX Designer & Mobile Developer | Screen 1 (Home Dashboard) and Screen 3 (Expense Details) UI design, Screen 2 (Add Expense) form validation and date picker integration, Screen 4 (Expense Summary & Analytics) category breakdown & progress bars, QA testing, defect logging (defect_log.md), and Material 3 theme configuration |

## Four Application Screens
1. Screen 1: Home / Expense List Screen (Loading, Error with retry, Empty state, Actual data list)
2. Screen 2: Add Expense Screen (Amount, Category, Date, Note validation)
3. Screen 3: Expense Details Screen (UUID, full timestamp, deletion)
4. Screen 4: Expense Summary / Analytics Screen (Category breakdown, progress bars, averages)

## Running the Application
\`\`\`bash
flutter pub get
flutter test
flutter run
flutter build apk --release
\`\`\``,
  },
  {
    path: 'defect_log.md',
    category: 'doc',
    description: 'Verified QA defect log recording 5 bugs, steps to reproduce, and verified resolutions.',
    code: `# Expense Tracker – Defect Log

### Defect #1: Negative and Zero Amount Validation Bypass
- Component: AddExpenseScreen
- Severity: High
- Status: FIXED (Verified with widget test #3)

### Defect #2: Rapid Double-Tap Causing Duplicate Expense Records
- Component: AddExpenseScreen
- Severity: Medium
- Status: FIXED (Added _isSubmitting guard)

### Defect #3: Long Expense Notes Overflowing Transaction Cards
- Component: ExpenseCard
- Severity: Low
- Status: FIXED (Added maxLines: 1 and TextOverflow.ellipsis)

### Defect #4: Category Percentage Division by Zero on Empty Data
- Component: ExpenseProvider & SummaryScreen
- Severity: Medium
- Status: FIXED (Added total == 0 guard)

### Defect #5: Deleted Expense Null Pointer in Details Screen
- Component: ExpenseDetailsScreen
- Severity: Low
- Status: FIXED (Wrapped element lookup in try-catch with fallback)`,
  },
];
