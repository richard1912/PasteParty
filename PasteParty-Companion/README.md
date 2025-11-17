# PasteParty Companion

Android companion app for PasteParty that allows you to share text and images directly from your Android device to your PasteParty server.

## Features

- Share text from any app via Android's share dialog
- Share images from any app via Android's share dialog
- Simple configuration - just set your PasteParty server URL
- Automatic content detection and sending

## Setup

1. Open the project in Android Studio
2. Build and install on your Android device
3. Open the app and configure your PasteParty server URL (e.g., `http://192.168.1.100:8081`)
4. Start sharing content from any app!

## Usage

1. Open any app that supports sharing (Gallery, Chrome, Notes, etc.)
2. Tap the share button
3. Select "PasteParty Companion" from the share menu
4. Your content will be automatically sent to your PasteParty server

## Requirements

- Android 7.0 (API 24) or higher
- PasteParty server running and accessible from your device

## Building

### Prerequisites

Before building the Android app, ensure you have the following installed:

1. **Java Development Kit (JDK) 17 or higher**
   - Required for Android development
   - Install from: https://adoptium.net/ or use package manager
   - Set `JAVA_HOME` environment variable to JDK path

2. **Android SDK** (optional - Gradle will download required components)
   - If not using Android Studio, install Android SDK command line tools
   - Set `ANDROID_HOME` environment variable if installed manually

### Build Instructions

**Option 1: Using Command Line (Recommended)**

1. **Navigate to project root directory**
   ```bash
   cd PasteParty-Companion
   ```

2. **Generate Gradle wrapper (if gradlew files don't exist)**
   ```bash
   gradle wrapper
   ```
   - This will create `gradlew` (Unix/Linux/Mac) and `gradlew.bat` (Windows)
   - Uses Gradle 8.2 as specified in `gradle/wrapper/gradle-wrapper.properties`

3. **Build the debug APK**
   ```bash
   # On Windows
   .\gradlew.bat assembleDebug
   
   # On Unix/Linux/Mac
   ./gradlew assembleDebug
   ```

4. **Locate the built APK**
   - The APK will be generated at: `app/build/outputs/apk/debug/app-debug.apk`
   - File size: approximately 30MB

**Option 2: Using Android Studio**

1. Open the project in Android Studio
2. Wait for Gradle sync to complete
3. Select `Build > Build Bundle(s) / APK(s) > Build APK(s)`
4. The APK will be generated in the same location as above

## Technical Details

- Built with Kotlin
- Uses OkHttp for network requests
- Supports both text and image sharing
- Handles permissions automatically for Android 13+ (READ_MEDIA_IMAGES) and older versions (READ_EXTERNAL_STORAGE)


