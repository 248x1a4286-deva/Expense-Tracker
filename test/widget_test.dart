import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:expense_tracker/models/expense.dart';
import 'package:expense_tracker/providers/expense_provider.dart';
import 'package:expense_tracker/services/expense_storage_service.dart';
import 'package:expense_tracker/screens/home_screen.dart';
import 'package:expense_tracker/screens/add_expense_screen.dart';
import 'package:expense_tracker/theme/app_theme.dart';

/// Mock in-memory storage service for test isolation
class MockExpenseStorageService extends ExpenseStorageService {
  List<Expense> storedExpenses = [];

  @override
  Future<List<Expense>> loadExpenses() async {
    return List.from(storedExpenses);
  }

  @override
  Future<bool> saveExpenses(List<Expense> expenses) async {
    storedExpenses = List.from(expenses);
    return true;
  }

  @override
  Future<bool> clearAllExpenses() async {
    storedExpenses.clear();
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

  Widget createTestWidget(Widget child) {
    return ChangeNotifierProvider<ExpenseProvider>.value(
      value: expenseProvider,
      child: MaterialApp(
        theme: AppTheme.lightTheme,
        home: child,
      ),
    );
  }

  group('Expense Tracker Widget & Unit Tests', () {
    testWidgets('1. Displaying the home screen and app title', (WidgetTester tester) async {
      await tester.pumpWidget(createTestWidget(const HomeScreen()));
      await tester.pumpAndSettle();

      // Verify AppBar title is present
      expect(find.text('Expense Tracker'), findsOneWidget);
      // Verify Total Expenses card label is present
      expect(find.text('TOTAL EXPENSES'), findsOneWidget);
      // Verify Add Expense FAB is present
      expect(find.byType(FloatingActionButton), findsOneWidget);
    });

    testWidgets('2. Showing the friendly empty expense state when no records exist',
        (WidgetTester tester) async {
      await tester.pumpWidget(createTestWidget(const HomeScreen()));
      await tester.pumpAndSettle();

      // Verify Empty state message is shown
      expect(find.text('No Expenses Recorded Yet'), findsOneWidget);
      expect(find.text('Add Your First Expense'), findsOneWidget);
    });

    testWidgets('3. Validating the expense form fields with invalid/empty input',
        (WidgetTester tester) async {
      await tester.pumpWidget(createTestWidget(const AddExpenseScreen()));
      await tester.pumpAndSettle();

      // Tap the Save button without entering amount or note
      final saveButton = find.byType(ElevatedButton);
      expect(saveButton, findsOneWidget);
      await tester.tap(saveButton);
      await tester.pumpAndSettle();

      // Verify validation error messages are rendered
      expect(find.text('Please enter an expense amount.'), findsOneWidget);
      expect(find.text('Please provide a short description or note.'), findsOneWidget);
    });

    testWidgets('4. Adding an expense successfully updates state and list',
        (WidgetTester tester) async {
      await tester.pumpWidget(createTestWidget(const AddExpenseScreen()));
      await tester.pumpAndSettle();

      // Enter valid amount
      final amountField = find.byType(TextFormField).first;
      await tester.enterText(amountField, '45.50');

      // Enter valid description
      final noteField = find.byType(TextFormField).last;
      await tester.enterText(noteField, 'Campus Textbook');

      // Submit the form
      final saveButton = find.byType(ElevatedButton);
      await tester.tap(saveButton);
      await tester.pumpAndSettle();

      // Verify provider has recorded the expense
      expect(expenseProvider.expenses.length, equals(1));
      expect(expenseProvider.expenses.first.amount, equals(45.50));
      expect(expenseProvider.expenses.first.note, equals('Campus Textbook'));
      expect(expenseProvider.totalExpenses, equals(45.50));
    });
  });
}
