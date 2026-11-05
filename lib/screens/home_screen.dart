import 'package:flutter/material.dart';
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

/// Screen 1: Home / Expense List Screen
/// Displays financial overview, recent expense list, handles all 4 states,
/// and provides navigation to Add and Summary screens.
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    // Load expenses on initial launch
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
    final currencyFormat = NumberFormat.currency(symbol: '₹', decimalDigits: 2);

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
          // State 1: Loading Indicator
          if (provider.isLoading) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(
                    color: theme.colorScheme.primary,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Loading your expenses...',
                    style: TextStyle(
                      color: theme.colorScheme.onSurfaceVariant,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            );
          }

          // State 2: Error Message with Retry Button
          if (provider.hasError) {
            return ErrorStateView(
              message: provider.errorMessage ?? 'An unexpected error occurred.',
              onRetry: () => provider.loadExpenses(),
            );
          }

          // State 3: Empty State View
          if (provider.isEmpty) {
            return Column(
              children: [
                _buildHeaderCards(provider, currencyFormat),
                Expanded(
                  child: EmptyStateView(
                    onAddPressed: _navigateToAddExpense,
                  ),
                ),
              ],
            );
          }

          // State 4: Actual Expense List with Dashboard
          return RefreshIndicator(
            onRefresh: () => provider.loadExpenses(),
            color: theme.colorScheme.primary,
            child: CustomScrollView(
              slivers: [
                SliverToBoxAdapter(
                  child: _buildHeaderCards(provider, currencyFormat),
                ),
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Recent Transactions',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: theme.colorScheme.onSurface,
                          ),
                        ),
                        TextButton(
                          onPressed: _navigateToSummary,
                          child: const Text('View Summary'),
                        ),
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
                            MaterialPageRoute(
                              builder: (ctx) => ExpenseDetailsScreen(expenseId: expense.id),
                            ),
                          );
                        },
                      );
                    },
                    childCount: provider.expenses.length,
                  ),
                ),
                const SliverToBoxAdapter(
                  child: SizedBox(height: 80), // Padding for FloatingActionButton
                ),
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
        border: Border(
          bottom: BorderSide(
            color: Theme.of(context).colorScheme.outlineVariant.withOpacity(0.4),
          ),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(
                'Welcome Back',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
              ),
              const Spacer(),
              Text(
                '${provider.transactionCount} transactions',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                  color: Theme.of(context).colorScheme.secondary,
                ),
              ),
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
}
