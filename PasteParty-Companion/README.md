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

```bash
./gradlew assembleDebug
```

Or open in Android Studio and build from there.

## Technical Details

- Built with Kotlin
- Uses OkHttp for network requests
- Supports both text and image sharing
- Handles permissions automatically for Android 13+ (READ_MEDIA_IMAGES) and older versions (READ_EXTERNAL_STORAGE)


