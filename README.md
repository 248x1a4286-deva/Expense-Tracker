# Expense Tracker – Flutter Android Application

[![Flutter](https://img.shields.io/badge/Flutter-3.35+-02569B?logo=flutter&logoColor=white)](https://flutter.dev)
[![Dart](https://img.shields.io/badge/Dart-3.3+-0175C2?logo=dart&logoColor=white)](https://dart.dev)
[![State Management](https://img.shields.io/badge/Provider-6.1.2-green)](https://pub.dev/packages/provider)
[![Platform](https://img.shields.io/badge/Platform-Android-3DDC84?logo=android&logoColor=white)](https://android.com)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

**Project Topic:** Personal Finance & Expense Management for Android  
**Course Programme:** Flutter Application Development Programme Group Project  
**Target Platform:** Android (Compatible with Android 5.0+ / API 21 through Android 15 / API 34)

---

## 📱 Application Overview

**Expense Tracker** is a full-featured, production-ready personal expense management mobile application engineered for Android using Flutter and Dart. Designed with modern Material 3 aesthetics and an intuitive financial dashboard, the app enables users to easily record, categorize, track, and analyze their daily expenditures.

All financial data is persistently saved to local device storage using `SharedPreferences` and JSON serialization, ensuring users' financial records remain intact across application restarts without relying on third-party cloud services or internet connectivity.

---

## ✨ Key Features

1. **Dashboard Overview (Screen 1):**
   - Cumulative total spending metrics.
   - Current month expenditure monitoring.
   - Real-time transaction counter and quick category breakdown.
   - Chronological list of recent expenses with category icons, amounts, and dates.
   - Full support for 4 core states: Loading, Error with Retry, Empty State, and Data List.

2. **Add Expense Form (Screen 2):**
   - Real-time form validation: amount verification, non-empty rules, positive numeric ranges ($0.01 – $1,000,000).
   - Category picker: *Food, Transport, Shopping, Education, Entertainment, Healthcare, Bills, Other*.
   - Interactive Material 3 Date Picker with automatic current date default.
   - Description/note validation (min 2 characters, max 120 characters).
   - Duplicate submission protection with feedback SnackBars.

3. **Detailed Expense Breakdown (Screen 3):**
   - In-depth transaction review with unique Transaction UUID.
   - Full timestamp, payment categorization, and unconstrained notes.
   - Record deletion with confirmation dialog.

4. **Analytics & Category Summary (Screen 4):**
   - Category-wise expense distribution with animated progress bars.
   - Calculated percentage share of total spending per category.
   - Identification of the highest spending category.
   - Average transaction size calculator.
   - Fully reactive updates driven by `ChangeNotifier`.

---

## 🛠️ Technologies Used

- **Framework:** Flutter (v3.35.0+)
- **Language:** Dart with Sound Null Safety
- **Architecture:** Provider Pattern (`ChangeNotifier`)
- **Local Storage:** `shared_preferences: ^2.3.2` with JSON encoding/decoding
- **Formatting & Utilities:** `intl: ^0.19.0`, `uuid: ^4.5.1`
- **UI System:** Material 3 with single seed-based dynamic `ColorScheme` (Seed: Deep Navy Blue `#1A237E`)

---

## 📂 Project Folder Structure

```
expense_tracker/
├── .github/
│   └── workflows/
│       └── build_apk.yml            # Automated CI/CD for APK build & tests
├── android/                         # Native Android Gradle configuration
│   ├── app/
│   │   ├── build.gradle             # Android build setup (minSdk 21, targetSdk 34)
│   │   └── src/main/
│   │       └── AndroidManifest.xml  # Android application manifest
├── lib/
│   ├── main.dart                    # Application entry point with ChangeNotifierProvider
│   ├── models/
│   │   └── expense.dart             # Expense data model with toJson/fromJson
│   ├── services/
│   │   └── expense_storage_service.dart # Local SharedPreferences persistence service
│   ├── providers/
│   │   └── expense_provider.dart    # Central state manager (ChangeNotifier)
│   ├── screens/
│   │   ├── home_screen.dart         # Screen 1: Dashboard and Recent Transactions
│   │   ├── add_expense_screen.dart  # Screen 2: Validated Expense Creation Form
│   │   ├── expense_details_screen.dart # Screen 3: Transaction Detail & Deletion
│   │   └── expense_summary_screen.dart # Screen 4: Analytics and Spending Summary
│   ├── widgets/
│   │   ├── category_icon.dart       # Themed category icons
│   │   ├── expense_card.dart        # Individual expense list item
│   │   ├── stat_summary_card.dart   # Dashboard KPI card
│   │   ├── empty_state_view.dart    # Friendly zero-data illustration
│   │   └── error_state_view.dart    # Error boundary with retry action
│   └── theme/
│       └── app_theme.dart           # Unified Material 3 seed color theme
├── test/
│   └── widget_test.dart             # Flutter widget and state verification tests
├── defect_log.md                    # Verified QA defect log
├── pubspec.yaml                     # Dependencies and assets configuration
└── README.md                        # Documentation
```

---

## 📸 Screenshots

| 1. Dashboard & List Screen | 2. Add Expense Form Screen | 3. Expense Details Screen | 4. Summary & Analytics Screen |
| :---: | :---: | :---: | :---: |
| ![Screen 1: Dashboard & List](public/screenshots/screen1_home.jpg) | ![Screen 2: Add Expense Form](public/screenshots/screen2_add.jpg) | ![Screen 3: Expense Details](public/screenshots/screen3_details.jpg) | ![Screen 4: Summary & Analytics](public/screenshots/screen4_summary.jpg) |

---

## 🚀 Installation & Running

### Prerequisites
- Flutter SDK (version 3.35 or newer) installed and added to your `PATH`.
- Android Studio / VS Code with Flutter and Dart extensions.
- Android Emulator or physical Android device with USB debugging enabled.

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/expense-tracker.git
   cd expense-tracker
   ```

2. **Install project dependencies:**
   ```bash
   flutter pub get
   ```

3. **Run automated widget tests:**
   ```bash
   flutter test
   ```

4. **Launch the application on an Android device or emulator:**
   ```bash
   flutter run
   ```

5. **Generate an Android Release APK:**
   ```bash
   flutter build apk --release
   ```
   The generated APK will be located at:
   `build/app/outputs/flutter-apk/app-release.apk`

---

## 👥 Team Members & Contributions

| Member Name | Role | Key Contributions |
| :--- | :--- | :--- |
| **M. Deva** | Lead Flutter Engineer & Architecture | • `ExpenseProvider` state architecture using `ChangeNotifier`<br>• `ExpenseStorageService` persistent device storage using `SharedPreferences`<br>• `Expense` data model JSON serialization/deserialization<br>• Automated Flutter widget testing suite (`test/widget_test.dart`) |
| **Srikanth** | UI/UX Designer & Mobile Developer | • Screen 1 (Home Dashboard) and Screen 3 (Expense Details) UI design<br>• Screen 2 (Add Expense) form validation and date picker integration<br>• Screen 4 (Expense Summary & Analytics) category breakdown & progress bars<br>• QA testing, defect logging (`defect_log.md`), and Material 3 theme configuration |

---

## 📄 License
This project is open-source under the Apache License 2.0.
