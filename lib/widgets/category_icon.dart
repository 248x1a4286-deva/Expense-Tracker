import 'package:flutter/material.dart';

/// Renders a thematic category icon enclosed in a rounded soft container
class CategoryIcon extends StatelessWidget {
  final String category;
  final double size;

  const CategoryIcon({
    super.key,
    required this.category,
    this.size = 24.0,
  });

  static IconData getIconData(String category) {
    switch (category.toLowerCase()) {
      case 'food':
        return Icons.restaurant;
      case 'transport':
        return Icons.directions_bus;
      case 'shopping':
        return Icons.shopping_bag;
      case 'education':
        return Icons.school;
      case 'entertainment':
        return Icons.movie;
      case 'healthcare':
        return Icons.local_hospital;
      case 'bills':
        return Icons.receipt_long;
      case 'other':
      default:
        return Icons.category;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final iconData = getIconData(category);

    return Container(
      width: size + 20,
      height: size + 20,
      decoration: BoxDecoration(
        color: theme.colorScheme.primaryContainer.withOpacity(0.4),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Center(
        child: Icon(
          iconData,
          size: size,
          color: theme.colorScheme.primary,
        ),
      ),
    );
  }
}
