import 'package:flutter/material.dart';

/// Stat card used on the Home and Summary dashboards to present metrics
class StatSummaryCard extends StatelessWidget {
  final String title;
  final String value;
  final String? subtitle;
  final IconData icon;
  final bool isPrimary;

  const StatSummaryCard({
    super.key,
    required this.title,
    required this.value,
    this.subtitle,
    required this.icon,
    this.isPrimary = false,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final bgColor = isPrimary ? theme.colorScheme.primary : theme.colorScheme.surface;
    final textColor = isPrimary ? theme.colorScheme.onPrimary : theme.colorScheme.onSurface;
    final subtextColor = isPrimary
        ? theme.colorScheme.onPrimary.withOpacity(0.8)
        : theme.colorScheme.onSurfaceVariant;

    return Card(
      elevation: isPrimary ? 3 : 1,
      color: bgColor,
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                    color: subtextColor,
                  ),
                ),
                Icon(
                  icon,
                  size: 20,
                  color: isPrimary ? theme.colorScheme.secondaryContainer : theme.colorScheme.primary,
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              value,
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: textColor,
                letterSpacing: -0.5,
              ),
            ),
            if (subtitle != null) ...[
              const SizedBox(height: 4),
              Text(
                subtitle!,
                style: TextStyle(
                  fontSize: 12,
                  color: subtextColor,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
