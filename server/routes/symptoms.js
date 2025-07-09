const express = require('express');
const router = express.Router();

// Mock symptom checker data
const symptomDatabase = {
  'headache': {
    possibleConditions: ['Tension headache', 'Migraine', 'Dehydration'],
    recommendations: ['Rest in a dark room', 'Stay hydrated', 'Consider over-the-counter pain relief'],
    severity: 'mild'
  },
  'fever': {
    possibleConditions: ['Viral infection', 'Bacterial infection', 'Heat exhaustion'],
    recommendations: ['Rest and hydration', 'Monitor temperature', 'Seek medical attention if fever persists'],
    severity: 'moderate'
  },
  'chest pain': {
    possibleConditions: ['Heart attack', 'Angina', 'Muscle strain'],
    recommendations: ['Seek immediate medical attention', 'Call emergency services'],
    severity: 'severe'
  }
};

// Symptom checker endpoint
router.post('/check', (req, res) => {
  const { symptoms, language = 'en' } = req.body;
  
  if (!symptoms || symptoms.length === 0) {
    return res.status(400).json({ error: 'No symptoms provided' });
  }

  const results = symptoms.map(symptom => {
    const lowerSymptom = symptom.toLowerCase();
    const match = symptomDatabase[lowerSymptom];
    
    if (match) {
      return {
        symptom,
        ...match,
        language
      };
    }
    
    return {
      symptom,
      possibleConditions: ['Unknown condition'],
      recommendations: ['Consult a healthcare professional'],
      severity: 'unknown'
    };
  });

  res.json({
    success: true,
    results,
    disclaimer: 'This is not a substitute for professional medical advice'
  });
});

// Get symptom suggestions
router.get('/suggestions', (req, res) => {
  const suggestions = Object.keys(symptomDatabase);
  res.json({ suggestions });
});

module.exports = router;