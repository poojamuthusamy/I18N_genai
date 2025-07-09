const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
const cron = require('node-cron');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Routes
app.use('/api/symptoms', require('./routes/symptoms'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/reminders', require('./routes/reminders'));
app.use('/api/emergency', require('./routes/emergency'));
app.use('/api/tips', require('./routes/tips'));

// Image upload endpoint
app.post('/api/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }
  
  // Here you would integrate with Teachable Machine API
  // For now, returning mock response
  res.json({
    success: true,
    filename: req.file.filename,
    analysis: {
      condition: 'Normal skin condition detected',
      confidence: 0.85,
      recommendations: [
        'Maintain good hygiene',
        'Stay hydrated',
        'Consult a dermatologist if symptoms persist'
      ]
    }
  });
});

// Health reminders cron job
cron.schedule('0 */2 * * *', () => {
  console.log('Sending water reminder notifications...');
  // Implement notification logic here
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});