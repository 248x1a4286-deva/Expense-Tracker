/// Expense Model representing a single transaction record.
/// Handles JSON serialization for persistent local device storage.
class Expense {
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

  /// Factory constructor to deserialize an Expense from a JSON map.
  factory Expense.fromJson(Map<String, dynamic> json) {
    return Expense(
      id: json['id'] as String,
      amount: (json['amount'] as num).toDouble(),
      category: json['category'] as String,
      date: DateTime.parse(json['date'] as String),
      note: json['note'] as String,
    );
  }

  /// Converts this Expense instance to a JSON map for storage.
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'amount': amount,
      'category': category,
      'date': date.toIso8601String(),
      'note': note,
    };
  }

  /// Creates a copy of this Expense with optional field updates.
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
      other is Expense &&
          runtimeType == other.runtimeType &&
          id == other.id;

  @override
  int get hashCode => id.hashCode;
}
