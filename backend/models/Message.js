const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  text: { type: String, required: false },
  imageData: { type: String, required: false },   // Base64 encoded image
  imageMime: { type: String, required: false },    // e.g. "image/jpeg"
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 604800 } // Auto-delete after 7 days
});

module.exports = mongoose.model('Message', messageSchema);
