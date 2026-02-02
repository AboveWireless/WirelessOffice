# WirelessOffice

A native Android starter for the Dillon Tower-inspired BLE companion app.

## Requirements

- Android Studio Hedgehog or newer
- JDK 17

## Run

1. Open the project in Android Studio.
2. Sync Gradle and run the `app` configuration on a device or emulator.

## Architecture notes

- Compose UI with a single-activity navigation graph.
- ViewModels expose immutable UI state backed by repository interfaces.
- Repository implementations are currently in-memory fakes to keep the app runnable while BLE and permissions are wired.

## Reports

- [Dillon Tower APK deconstruction](reports/dillon-tower-apk-deconstruction.md)
