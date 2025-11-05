const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const os = require('os');

const app = express();
const PORT = 8081;
const DATA_DIR = path.join(__dirname, 'data');

// Middleware
app.use(cors());
// Set very large limit (effectively unlimited for practical purposes)
app.use(bodyParser.json({ limit: '1gb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1gb' }));
app.use(express.static('public'));

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Generate a random ID
function generateId() {
  return crypto.randomBytes(6).toString('base64url').substring(0, 8);
}

// Save a paste
app.post('/api/paste', async (req, res) => {
  try {
    const { content, type } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const id = generateId();
    const paste = {
      id,
      content,
      type: type || 'text',
      created: new Date().toISOString()
    };

    const filePath = path.join(DATA_DIR, `${id}.json`);
    await fs.writeFile(filePath, JSON.stringify(paste, null, 2));

    res.json({ id, url: `/paste/${id}` });
  } catch (error) {
    console.error('Error saving paste:', error);
    res.status(500).json({ error: 'Failed to save paste' });
  }
});

// Get a paste
app.get('/api/paste/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const filePath = path.join(DATA_DIR, `${id}.json`);
    
    const data = await fs.readFile(filePath, 'utf8');
    const paste = JSON.parse(data);
    
    res.json(paste);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'Paste not found' });
    }
    console.error('Error reading paste:', error);
    res.status(500).json({ error: 'Failed to read paste' });
  }
});

// Get all pastes
app.get('/api/pastes', async (req, res) => {
  try {
    const files = await fs.readdir(DATA_DIR);
    const pasteFiles = files.filter(file => file.endsWith('.json'));
    
    const pastes = await Promise.all(
      pasteFiles.map(async (file) => {
        const filePath = path.join(DATA_DIR, file);
        const data = await fs.readFile(filePath, 'utf8');
        const paste = JSON.parse(data);
        return paste;
      })
    );
    
    // Sort by creation date (newest first)
    pastes.sort((a, b) => new Date(b.created) - new Date(a.created));
    
    res.json(pastes);
  } catch (error) {
    console.error('Error listing pastes:', error);
    res.status(500).json({ error: 'Failed to list pastes' });
  }
});

// Delete a paste
app.delete('/api/paste/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const filePath = path.join(DATA_DIR, `${id}.json`);
    
    await fs.unlink(filePath);
    res.json({ success: true });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'Paste not found' });
    }
    console.error('Error deleting paste:', error);
    res.status(500).json({ error: 'Failed to delete paste' });
  }
});

// Delete all pastes
app.delete('/api/pastes', async (req, res) => {
  try {
    const files = await fs.readdir(DATA_DIR);
    const pasteFiles = files.filter(file => file.endsWith('.json'));
    
    await Promise.all(
      pasteFiles.map(async (file) => {
        const filePath = path.join(DATA_DIR, file);
        await fs.unlink(filePath);
      })
    );
    
    res.json({ success: true, deleted: pasteFiles.length });
  } catch (error) {
    console.error('Error deleting all pastes:', error);
    res.status(500).json({ error: 'Failed to delete all pastes' });
  }
});

// Serve index.html for root and paste routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/paste/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal (loopback) and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Start server
async function start() {
  await ensureDataDir();
  const localIP = getLocalIP();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Simple Clipboard Paste server running:`);
    console.log(`  Local:   http://localhost:${PORT}`);
    console.log(`  Network: http://${localIP}:${PORT}`);
  });
}

start();


