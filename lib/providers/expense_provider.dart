import 'package:flutter/foundation.dart';
import '../models/expense.dart';
import '../services/expense_storage_service.dart';

/// Application state provider managing expense records, asynchronous storage,
/// error handling, and aggregated financial calculations.
class ExpenseProvider extends ChangeNotifier {
  final ExpenseStorageService _storageService;

  List<Expense> _expenses = [];
  bool _isLoading = false;
  String? _errorMessage;

  ExpenseProvider({ExpenseStorageService? storageService})
      : _storageService = storageService ?? ExpenseStorageService();

  // Getters
  List<Expense> get expenses => List.unmodifiable(_expenses);
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get hasError => _errorMessage != null;
  bool get isEmpty => _expenses.isEmpty && !_isLoading && _errorMessage == null;

  /// Total count of recorded transactions
  int get transactionCount => _expenses.length;

  /// Sum of all expense amounts
  double get totalExpenses {
    return _expenses.fold(0.0, (sum, item) => sum + item.amount);
  }

  /// Sum of expenses recorded in the current calendar month
  double get currentMonthExpenses {
    final now = DateTime.now();
    return _expenses
        .where((e) => e.date.year == now.year && e.date.month == now.month)
        .fold(0.0, (sum, item) => sum + item.amount);
  }

  /// Map of category name to sum of expenses in that category
  Map<String, double> get categoryTotals {
    final Map<String, double> totals = {};
    for (final expense in _expenses) {
      totals[expense.category] = (totals[expense.category] ?? 0.0) + expense.amount;
    }
    return totals;
  }

  /// Percentage of total spending for each category
  Map<String, double> get categoryPercentages {
    final total = totalExpenses;
    if (total == 0) return {};
    final totals = categoryTotals;
    return totals.map((cat, amount) => MapEntry(cat, (amount / total) * 100));
  }

  /// Returns the category with highest total spending, or "None" if empty
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

  /// Fetches saved expenses from local storage, updating loading & error states
  Future<void> loadExpenses() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _expenses = await _storageService.loadExpenses();
      // Sort newest first
      _expenses.sort((a, b) => b.date.compareTo(a.date));
      _errorMessage = null;
    } catch (e) {
      _errorMessage = 'Failed to load expenses. Please try again.';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Adds a new expense record and saves it persistently to local storage
  Future<bool> addExpense(Expense expense) async {
    try {
      _expenses.insert(0, expense); // Place newest at beginning
      notifyListeners();
      await _storageService.saveExpenses(_expenses);
      return true;
    } catch (e) {
      // Revert if saving fails
      _expenses.removeWhere((item) => item.id == expense.id);
      _errorMessage = 'Could not save expense. Please retry.';
      notifyListeners();
      return false;
    }
  }

  /// Deletes an expense by its unique ID and updates persistent storage
  Future<bool> deleteExpense(String id) async {
    final existingIndex = _expenses.indexWhere((item) => item.id == id);
    if (existingIndex == -1) return false;

    final removedItem = _expenses.removeAt(existingIndex);
    notifyListeners();

    try {
      await _storageService.saveExpenses(_expenses);
      return true;
    } catch (e) {
      // Rollback on failure
      _expenses.insert(existingIndex, removedItem);
      _errorMessage = 'Failed to delete expense record.';
      notifyListeners();
      return false;
    }
  }

  /// Clears any current error message
  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }
}
