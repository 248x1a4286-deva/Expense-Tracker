import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/expense.dart';

/// Service responsible for local device persistence of expense records.
/// Uses SharedPreferences to serialize/deserialize data to JSON.
class ExpenseStorageService {
  static const String _storageKey = 'saved_expenses_list_v1';

  /// Saves the complete list of expenses to device local storage.
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

  /// Loads all saved expenses from device local storage.
  /// Returns an empty list if no data has been saved yet.
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

  /// Clears all stored expense records from the device.
  Future<bool> clearAllExpenses() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return await prefs.remove(_storageKey);
    } catch (e) {
      throw Exception('Failed to clear local storage: $e');
    }
  }
}
