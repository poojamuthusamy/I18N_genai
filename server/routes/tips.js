const express = require('express');
const router = express.Router();

// Health tips database
const healthTips = {
  general: [
    {
      id: 1,
      title: 'Stay Hydrated',
      content: 'Drink at least 8 glasses of water daily to maintain proper hydration.',
      category: 'general',
      language: 'en'
    },
    {
      id: 2,
      title: 'Regular Exercise',
      content: 'Aim for at least 30 minutes of moderate exercise 5 days a week.',
      category: 'fitness',
      language: 'en'
    },
    {
      id: 3,
      title: 'Balanced Diet',
      content: 'Include fruits, vegetables, whole grains, and lean proteins in your diet.',
      category: 'nutrition',
      language: 'en'
    }
  ],
  mental_health: [
    {
      id: 4,
      title: 'Practice Mindfulness',
      content: 'Take 10 minutes daily for meditation or deep breathing exercises.',
      category: 'mental_health',
      language: 'en'
    },
    {
      id: 5,
      title: 'Quality Sleep',
      content: 'Aim for 7-9 hours of quality sleep each night for better mental health.',
      category: 'mental_health',
      language: 'en'
    }
  ],
  nutrition: [
    {
      id: 6,
      title: 'Eat Rainbow Colors',
      content: 'Include colorful fruits and vegetables to get diverse nutrients.',
      category: 'nutrition',
      language: 'en'
    },
    {
      id: 7,
      title: 'Limit Processed Foods',
      content: 'Reduce intake of processed and packaged foods high in sodium and sugar.',
      category: 'nutrition',
      language: 'en'
    }
  ]
};

// Get tips by category
router.get('/:category', (req, res) => {
  const category = req.params.category;
  const tips = healthTips[category];
  
  if (!tips) {
    return res.status(404).json({ 
      error: 'Category not found',
      available_categories: Object.keys(healthTips)
    });
  }
  
  res.json({
    success: true,
    category,
    tips,
    total: tips.length
  });
});

// Get all tips
router.get('/', (req, res) => {
  const allTips = Object.values(healthTips).flat();
  
  res.json({
    success: true,
    tips: allTips,
    categories: Object.keys(healthTips),
    total: allTips.length
  });
});

// Get random tip
router.get('/random', (req, res) => {
  const allTips = Object.values(healthTips).flat();
  const randomTip = allTips[Math.floor(Math.random() * allTips.length)];
  
  res.json({
    success: true,
    tip: randomTip
  });
});

module.exports = router;