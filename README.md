# <img src="public/favicon.svg" alt="" width="48" height="48" style="vertical-align: middle; margin-right: 8px;"> PasteParty 


An open source web app which offers easily accessible and persistent storage for text and images from your clipboard. Just paste and it's there when and where you need it!


## Screenshot

![PasteParty Screenshot](public/capture2.PNG)

## Features

- ✅ **Paste text or images from clipboard** - Simply paste (Ctrl+V) any text or image content from your clipboard
- ✅ **Persistent storage** - All pastes are saved to the server and persistently displayed on the homepage
- ✅ **100% Local & Private** - Everything stays on your machine. No cloud, no tracking, no third parties
- ✅ **Copy pastes** - Copy any content back to your clipboard (say, from another device)
- ✅ **Delete pastes** - Remove individual pastes or delete all at once
- ✅ **Random theme cycler** - Click the 🎨 button in the top right corner to randomly change the background color theme
- ✅ **Local network access** - Access from any device on your local network
- ✅ **Android Companion App** - Share text and images directly from your Android device to PasteParty via the Android share menu

## Installation

PasteParty runs on Docker Desktop for easy setup. Follow these steps:

### Step 1: Install Docker Desktop

1. **Download Docker Desktop**
   - Visit https://www.docker.com/products/docker-desktop
   - Click "Download for Windows"
   - Run the installer and follow the prompts
   - Restart your computer if prompted

2. **Verify Docker is running**
   - Look for the Docker whale icon in your system tray (bottom-right of screen)
   - If it's not there, open Docker Desktop from your Start menu

### Step 2: Download PasteParty

1. **Download this repository**
   - Click the green "Code" button at the top of this page
   - Select "Download ZIP"
   - Extract the ZIP file to a location you'll remember (e.g., `C:\Users\YourName\PasteParty`)

### Step 3: Start PasteParty

1. **Open PowerShell in the PasteParty folder**
   - Open File Explorer and navigate to your extracted PasteParty folder
   - Click on the address bar at the top (where it shows the folder path)
   - Type `powershell` and press Enter
   - A blue PowerShell window will open

2. **Start the server**
   - In the PowerShell window, type this command and press Enter:
   ```bash
   docker compose up -d
   ```
   - Wait 30-60 seconds for Docker to download and start everything
   - You should see "Container pasteparty Started" ✅

3. **Access PasteParty**
   - Open your web browser
   - Go to: http://localhost:8081
   - You should see the PasteParty homepage!

### Step 4: Access from Other Devices (Optional)

To access from your phone or other computers on your network:

1. **Find your computer's IP address**
   - In the same PowerShell window, type: `ipconfig`
   - Look for "IPv4 Address" (example: 192.168.1.100)

2. **Open on any device**
   - On your phone/tablet/other computer, open a browser
   - Go to: `http://YOUR-IP:8081` (replace YOUR-IP with the number from step 1)
   - Example: http://192.168.1.100:8081

**What you get:**
- Auto-starts when you turn on your computer
- All data saved in the `data` folder (never lost)
- No manual firewall setup needed
- Lightweight and fast (~150MB)

## Managing PasteParty

After installation, you can control PasteParty using these commands. Always run them in PowerShell **in the PasteParty folder**:

### How to open PowerShell in the PasteParty folder:
1. Open File Explorer
2. Navigate to your PasteParty folder
3. Click the address bar at the top
4. Type `powershell` and press Enter

### Common Commands:

**Stop PasteParty:**
```bash
docker compose down
```

**Start PasteParty again:**
```bash
docker compose up -d
```

**Restart PasteParty:**
```bash
docker compose restart
```

**Check if PasteParty is running:**
```bash
docker ps
```
Look for a line with "pasteparty" - if you see it, it's running!

**View logs (troubleshooting):**
```bash
docker compose logs -f
```
Press `Ctrl+C` to exit the logs.

**Need more help?** See [DOCKER.md](DOCKER.md) for detailed Docker instructions and troubleshooting.

## Usage

### Creating a Paste
1. Click in the paste area and press Ctrl+V (Or Click again to begin typing)
2. Click "💾 Save to Party" button
4. Your pastes will appear in the list below

### Viewing Pastes
- All saved pastes are displayed on the homepage in a list
- Each paste shows a preview with its creation date
- Text pastes show the first 200 characters (but all content is saved)
- Image pastes show a thumbnail preview

### Managing Pastes
- **Delete**: Click "🗑️ Delete" on any paste to remove it
- **Delete All**: Click "🗑️ Clear Party" to remove all pastes at once

### Customizing Theme
- **Random Theme**: Click the 🎨 button in the top right corner to generate a new random pastel gradient background
- **Theme Persistence**: Your chosen theme is automatically saved to the server and will persist across page refreshes and different devices accessing the same server
- **Soft Colors**: Themes use modern, soft pastel colors for a pleasant visual experience

## Network Access

**Good news!** Your PasteParty server is automatically accessible from any device on your home network (phones, tablets, other computers). No configuration needed!

### How to access from other devices:

1. **Find your computer's IP address**
   - Open PowerShell (see instructions above)
   - Type: `ipconfig` and press Enter
   - Look for "IPv4 Address" (it will look like: 192.168.1.100)

2. **Access from any device**
   - On your phone/tablet/other computer, open a web browser
   - Type: `http://YOUR-IP:8081` (replace YOUR-IP with the number you found)
   - Example: If your IP is 192.168.1.100, go to `http://192.168.1.100:8081`

**Note:** Both devices must be on the same WiFi network.

## Auto-Start on Boot

Want PasteParty to start automatically when you turn on your computer?

1. **Open Docker Desktop**
   - Click the Docker whale icon in your system tray (bottom-right)
   - Click the gear/settings icon ⚙️ at the top

2. **Enable auto-start**
   - In the "General" tab, check the box: ✅ "Start Docker Desktop when you log in"
   - Click "Apply & Restart"

Now PasteParty will automatically be available every time you start your computer!

## Android Companion App

PasteParty includes a companion Android app that allows you to share text and images directly from your Android device to your PasteParty server.

### Features
- 📱 **Share from any app** - Share text and images from Gallery, Chrome, Notes, or any app that supports sharing
- ⚙️ **Simple configuration** - Just set your PasteParty server URL once
- 🎯 **One-tap sharing** - Select "PasteParty Companion" from the Android share menu
- 📋 **Automatic posting** - Shared content automatically appears on your PasteParty homepage

### Installation Options

You have two options to get the Android app:

#### Option 1: Download Pre-built APK (Easiest)

1. **Download the latest release**
   - Go to [GitHub Releases](https://github.com/richard1912/PasteParty/releases)
   - Download `PasteParty-Companion-v1.0.0-debug.apk` from the latest release
   - Transfer the APK to your Android device

2. **Install on Android device**
   - Enable "Install from Unknown Sources" in your Android settings
   - Open the APK file and install it

#### Option 2: Build from Source

**Prerequisites:**

1. **Java Development Kit (JDK) 17 or higher**
   - Required for Android development (JRE alone is not sufficient)
   - Install from: https://adoptium.net/
   - Set `JAVA_HOME` environment variable to JDK path

2. **Gradle** (optional - will be auto-downloaded)
   - If not installed, the build process will download Gradle 8.2 automatically

**Build Steps:**

1. **Navigate to the companion app directory**
   ```bash
   cd PasteParty-Companion
   ```

2. **Generate Gradle wrapper (if needed)**
   ```bash
   gradle wrapper
   ```
   - Creates `gradlew` (Unix/Mac) and `gradlew.bat` (Windows)
   - Uses Gradle 8.2 as specified in project configuration

3. **Build the debug APK**
   ```bash
   # On Windows
   .\gradlew.bat assembleDebug
   
   # On Unix/Linux/Mac
   ./gradlew assembleDebug
   ```

4. **Find your APK**
   - Location: `app/build/outputs/apk/debug/app-debug.apk`
   - Size: ~30MB

5. **Install on device**
   - Transfer APK to Android device
   - Enable "Install from Unknown Sources" in Android settings
   - Open APK and install

### Configuration

1. **Configure Server URL**
   - Open the PasteParty Companion app on your device
   - Enter your PasteParty server URL (e.g., `http://192.168.1.100:8081`)
   - Make sure your server is running and accessible from your device
   - Tap "Save"

2. **Start Sharing**
   - Open any app (Gallery, Chrome, Notes, etc.)
   - Tap the share button
   - Select "PasteParty Companion" from the share menu
   - Your content will be sent to PasteParty automatically!

### Requirements
- Android 7.0 (API 24) or higher
- PasteParty server running and accessible from your device (same network or public IP)

See `PasteParty-Companion/README.md` for more technical details.

## Storage

Pastes are stored as JSON files in the `data/` directory. Each paste is saved with:
- Content (text or base64-encoded image)
- Type (text or image)
- Creation timestamp
- Unique ID (used internally for management)

Theme settings are stored in `data/settings.json` and persist across all sessions and devices accessing the same server.

## Privacy & Security

**Your data never leaves your machine.** PasteParty is completely self-hosted and runs locally:
- ✅ No cloud services or external servers
- ✅ No analytics or tracking
- ✅ No internet connection required
- ✅ All data stored locally in the `./data/` folder
- ✅ You have full control over your data

Perfect for sensitive information, passwords, code snippets, or anything you want to keep private.

## Technical Details

- **Platform**: Docker (Alpine Linux + Node.js 20)
- **Port**: 8081 (default)
- **Backend**: Node.js with Express
- **Storage**: File-based (JSON files in `./data/` directory, persisted via Docker volume)
- **Frontend**: Vanilla JavaScript with a colorful, modern UI
- **API**: RESTful API for paste operations
- **Image Size**: ~150MB
- **Memory Usage**: ~200MB RAM

## API Endpoints

- `POST /api/paste` - Create a new paste
- `GET /api/pastes` - Get all pastes (displayed on homepage)
- `GET /api/paste/:id` - Get a specific paste (internal use for copy functionality)
- `DELETE /api/paste/:id` - Delete a specific paste
- `DELETE /api/pastes` - Delete all pastes
- `GET /api/settings/theme` - Get the current theme setting
- `POST /api/settings/theme` - Save a new theme setting


## Project Structure

```
PasteParty/
├── data/                 # Stored pastes (JSON files) - persisted volume
├── public/               # Frontend files
│   ├── index.html        # Main HTML file
│   ├── app.js           # Frontend JavaScript
│   └── style.css        # Styling
├── PasteParty-Companion/ # Android companion app
│   ├── app/             # Android app source code
│   └── README.md        # Android app documentation
├── server.js            # Express server
├── package.json         # Dependencies
├── Dockerfile           # Docker image definition
├── docker-compose.yml   # Docker compose configuration
├── .dockerignore        # Docker build exclusions
├── DOCKER.md            # Docker quick reference guide
└── README.md            # This file
```

## Requirements

- Docker Desktop for Windows
- ~200MB available disk space (for Docker image + data)

## Repository Information

- **Repository URL**: https://github.com/richard1912/PasteParty.git
- **Current Branch**: develop

Happy pasting! 🎉📋
