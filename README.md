# 🎉 PasteParty 🎉

A fun and colorful web application for pasting text and images from your clipboard with persistent storage. Let's paste some fun!

## Features

- ✅ **Paste text from clipboard** - Simply paste (Ctrl+V) any text content
- ✅ **Paste images from clipboard** - Supports pasting images directly from clipboard
- ✅ **Persistent storage** - All pastes are saved to files and accessible via unique URLs
- ✅ **Fun, colorful party-themed interface** - Bright and cheerful UI
- ✅ **View saved pastes** - Access any saved paste by its unique ID
- ✅ **Delete pastes** - Remove individual pastes or delete all at once
- ✅ **Local and network access** - Runs on your local network for easy access from any device

## Installation

1. **Install Node.js** (if not already installed)
   - Download from https://nodejs.org/
   - Make sure npm is included

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open your browser**
   - Navigate to http://localhost:8081
   - Or use the network IP shown in the console for access from other devices
   - Paste text or images using Ctrl+V

## Usage

### Creating a Paste
1. Click in the paste area or press Ctrl+V
2. Paste your text or image
3. Click "💾 Save to Party" button
4. Your paste will appear in the list below

### Viewing Pastes
- All saved pastes are displayed on the homepage in a list
- Each paste shows a preview with its creation date
- Text pastes show the first 200 characters
- Image pastes show a thumbnail preview

### Managing Pastes
- **Copy**: Click "📋 Copy" on any paste to copy its content to clipboard
- **Delete**: Click "🗑️ Delete" on any paste to remove it
- **Delete All**: Click "🗑️ Clear Party" to remove all pastes at once

## Storage

Pastes are stored as JSON files in the `data/` directory. Each paste is saved with:
- Unique ID (8 characters)
- Content (text or base64-encoded image)
- Type (text or image)
- Creation timestamp

## Technical Details

- **Port**: 8081 (default)
- **Backend**: Node.js with Express
- **Storage**: File-based (JSON files in `data/` directory)
- **Frontend**: Vanilla JavaScript with a colorful, modern UI
- **API**: RESTful API for paste operations

## API Endpoints

- `POST /api/paste` - Create a new paste
- `GET /api/paste/:id` - Get a specific paste (used internally for copy functionality)
- `GET /api/pastes` - Get all pastes
- `DELETE /api/paste/:id` - Delete a specific paste
- `DELETE /api/pastes` - Delete all pastes

## Development

### Using push_updates.bat
- **Double-click** the file or run from command line
- **Follow prompts** for commit messages
- **Automatic handling** - Git add, commit, and push to develop branch

## Project Structure

```
PasteParty/
├── data/                 # Stored pastes (JSON files)
├── public/               # Frontend files
│   ├── index.html        # Main HTML file
│   ├── app.js           # Frontend JavaScript
│   └── style.css        # Styling
├── server.js            # Express server
├── package.json         # Dependencies
├── push_updates.bat     # Git push automation
└── README.md            # This file
```

## Requirements

- Node.js 14+
- npm (comes with Node.js)

## Repository Information

- **Repository URL**: https://github.com/richard1912/PasteParty.git
- **Current Branch**: develop

Happy pasting! 🎉📋
