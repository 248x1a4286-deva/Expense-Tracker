# Expense Tracker – Defect Log

This document records the defects identified during functional, unit, and UI testing of the Expense Tracker Flutter application, along with resolution details and verification statuses.

---

### Defect #1: Negative and Zero Amount Validation Bypass
- **Defect ID:** DEF-001
- **Severity:** High
- **Component:** `AddExpenseScreen` (`lib/screens/add_expense_screen.dart`)
- **Description:** Users were initially able to input negative numbers or `0.00` into the expense amount field, which corrupted total spending calculations and distorted category metrics.
- **Steps to Reproduce:**
  1. Launch the app and tap the "+" Floating Action Button on the Home screen.
  2. In the "Expense Amount" field, enter `-25.00` or `0.00`.
  3. Fill out the note and select a category.
  4. Tap "Save Expense".
- **Expected Behaviour:** The form validator should flag amounts $\le 0$ with the message: *"Amount must be greater than zero."* and block submission.
- **Actual Behaviour:** The negative value was parsed and inserted into the `ExpenseProvider` list, causing the total expenses card to subtract funds.
- **Resolution:** Updated `TextFormField.validator` with `parsed <= 0` guard check and upper boundary protection (`parsed > 1000000`).
- **Status:** **FIXED** (Verified with unit & widget tests).

---

### Defect #2: Rapid Double-Tap Causing Duplicate Expense Records
- **Defect ID:** DEF-002
- **Severity:** Medium
- **Component:** `AddExpenseScreen` (`lib/screens/add_expense_screen.dart`)
- **Description:** Tapping the "Save Expense" button rapidly multiple times triggered concurrent asynchronous calls to `ExpenseProvider.addExpense()`, generating two duplicate expense records with distinct IDs for the same transaction.
- **Steps to Reproduce:**
  1. Open the "Add Expense" screen.
  2. Enter valid amount `$15.00` and note `"Lunch"`.
  3. Rapidly double-tap the "Save Expense" button.
- **Expected Behaviour:** Only one transaction should be created and saved; the submit button should immediately enter a disabled/loading state upon the first tap.
- **Actual Behaviour:** Two duplicate records appeared in the recent transactions list on the Home screen.
- **Resolution:** Added `_isSubmitting` boolean state guard that disables the button and displays a progress spinner during submission.
- **Status:** **FIXED** (Verified).

---

### Defect #3: Long Expense Notes Overflowing Transaction Cards
- **Defect ID:** DEF-003
- **Severity:** Low
- **Component:** `ExpenseCard` (`lib/widgets/expense_card.dart`)
- **Description:** Long description text entered by the user caused a render overflow warning in the transaction list row on compact screen devices.
- **Steps to Reproduce:**
  1. Add an expense with a description exceeding 60 characters (e.g. *"Grocery shopping at the local farmers market including apples, oranges, bread, milk, and cheese"*).
  2. View the recent transaction list on the Home screen.
- **Expected Behaviour:** The card should gracefully truncate the text with an ellipsis (`TextOverflow.ellipsis`) and restrict it to a single line, reserving the full text for the Details Screen.
- **Actual Behaviour:** RenderFlex overflowed by 18 pixels on small screen viewports.
- **Resolution:** Configured `maxLines: 1` and `overflow: TextOverflow.ellipsis` on `ExpenseCard`, allowing `ExpenseDetailsScreen` to render the unconstrained multiline description.
- **Status:** **FIXED** (Verified).

---

### Defect #4: Category Percentage Division by Zero on Empty Data
- **Defect ID:** DEF-004
- **Severity:** Medium
- **Component:** `ExpenseProvider` (`lib/providers/expense_provider.dart`) & `ExpenseSummaryScreen`
- **Description:** On fresh install or after clearing all expenses, opening the Summary Screen calculated `(amount / totalExpenses) * 100` where `totalExpenses == 0`, yielding `NaN` or runtime format exceptions.
- **Steps to Reproduce:**
  1. Clear all saved data or launch app with an empty storage state.
  2. Tap the Analytics icon in the top AppBar to navigate to `ExpenseSummaryScreen`.
- **Expected Behaviour:** Display an empty summary placeholder or return an empty map for `categoryPercentages` without arithmetic exceptions.
- **Actual Behaviour:** Percentage text rendered as `NaN%` and progress bars threw layout errors.
- **Resolution:** Added guard `if (total == 0) return {};` in `ExpenseProvider.categoryPercentages` and implemented an empty summary card in `ExpenseSummaryScreen`.
- **Status:** **FIXED** (Verified).

---

### Defect #5: Deleted Expense Null Pointer in Details Screen
- **Defect ID:** DEF-005
- **Severity:** Low
- **Component:** `ExpenseDetailsScreen` (`lib/screens/expense_details_screen.dart`)
- **Description:** When an expense was deleted from the Details screen while listening to `ExpenseProvider`, the `firstWhere` selector threw a `StateError: No element` before navigation popped.
- **Steps to Reproduce:**
  1. Open an expense detail screen.
  2. Tap the Trash icon and confirm deletion.
- **Expected Behaviour:** Smooth deletion with SnackBar notification and safe pop back to the Home screen.
- **Actual Behaviour:** Red error screen flashed momentarily before the pop animation finished.
- **Resolution:** Wrapped `firstWhere` in a `try-catch` returning a fallback empty view if the item is removed, ensuring clean animation disposal.
- **Status:** **FIXED** (Verified).
