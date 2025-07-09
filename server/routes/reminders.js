const express = require('express');
const router = express.Router();

// In-memory storage for demo (use database in production)
let reminders = [];
let reminderIdCounter = 1;

// Get all reminders
router.get('/', (req, res) => {
  res.json({
    success: true,
    reminders
  });
});

// Create new reminder
router.post('/', (req, res) => {
  const { type, title, time, frequency, enabled = true } = req.body;
  
  if (!type || !title || !time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const reminder = {
    id: reminderIdCounter++,
    type,
    title,
    time,
    frequency,
    enabled,
    createdAt: new Date().toISOString()
  };
  
  reminders.push(reminder);
  
  res.json({
    success: true,
    reminder
  });
});

// Update reminder
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const reminderIndex = reminders.findIndex(r => r.id === id);
  
  if (reminderIndex === -1) {
    return res.status(404).json({ error: 'Reminder not found' });
  }
  
  reminders[reminderIndex] = {
    ...reminders[reminderIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    reminder: reminders[reminderIndex]
  });
});

// Delete reminder
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const reminderIndex = reminders.findIndex(r => r.id === id);
  
  if (reminderIndex === -1) {
    return res.status(404).json({ error: 'Reminder not found' });
  }
  
  reminders.splice(reminderIndex, 1);
  
  res.json({
    success: true,
    message: 'Reminder deleted'
  });
});

module.exports = router;