const express = require('express');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const Message = require('../models/Message');

const router = express.Router();

// Use memory storage — no disk needed, works on any cloud
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// POST / — Create a new secret message
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { text, password } = req.body;

    if (!text && !req.file) {
      return res.status(400).json({ message: 'Must provide either text or an image' });
    }

    let passwordHash = null;
    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(password, salt);
    }

    // Convert image buffer to Base64 so it's stored in MongoDB (works on cloud)
    let imageData = null;
    let imageMime = null;
    if (req.file) {
      imageData = req.file.buffer.toString('base64');
      imageMime = req.file.mimetype;
    }

    const newMessage = new Message({ text, imageData, imageMime, passwordHash });
    await newMessage.save();

    res.status(201).json({ id: newMessage._id });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /:id — Check message status or retrieve it directly if no password is set
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found or has expired' });
    }

    if (message.passwordHash) {
      return res.json({ requiresPassword: true });
    }

    // Return message content directly if no password is set
    const imageDataUri = message.imageData
      ? `data:${message.imageMime};base64,${message.imageData}`
      : null;

    res.json({
      requiresPassword: false,
      text: message.text,
      imageUrl: imageDataUri
    });
  } catch (error) {
    console.error('Error retrieving message status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /:id — Retrieve a secret message with password
router.post('/:id', async (req, res) => {
  try {
    const { password } = req.body;
    const { id } = req.params;

    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found or has expired' });
    }

    // If message doesn't have a password, return it directly
    if (!message.passwordHash) {
      const imageDataUri = message.imageData
        ? `data:${message.imageMime};base64,${message.imageData}`
        : null;

      return res.json({
        text: message.text,
        imageUrl: imageDataUri
      });
    }

    if (!password) {
      return res.status(400).json({ message: 'Password is required to view the message' });
    }

    const isMatch = await bcrypt.compare(password, message.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Return image as a data URI so no separate /uploads request is needed
    const imageDataUri = message.imageData
      ? `data:${message.imageMime};base64,${message.imageData}`
      : null;

    res.json({
      text: message.text,
      imageUrl: imageDataUri
    });
  } catch (error) {
    console.error('Error retrieving message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
