require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const os = require('os');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Allow all origins (needed for phones on same network)
app.use(cors({ origin: '*' }));
app.use(express.json());

// ─── API Routes (must be before the catch-all) ────────────────────────────────

// Helper: get local Wi-Fi IP
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

app.get('/api/ip', (req, res) => {
  res.json({ ip: getLocalIp() });
});

// Uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Message CRUD routes
app.use('/api/message', messageRoutes);

// ─── Serve React Frontend (catch-all MUST be last) ────────────────────────────
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// ─── Start ────────────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Listen on 0.0.0.0 so phones on the same Wi-Fi can reach the server
    app.listen(PORT, '0.0.0.0', () => {
      const ip = getLocalIp();
      console.log(`Server running at:`);
      console.log(`  Local:   http://localhost:${PORT}`);
      console.log(`  Network: http://${ip}:${PORT}  ← scan QR from phones`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });
