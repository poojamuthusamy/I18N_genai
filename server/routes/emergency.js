const express = require('express');
const router = express.Router();

// Emergency contacts by region/country
const emergencyContacts = {
  'US': {
    emergency: '911',
    poison: '1-800-222-1222',
    suicide: '988',
    domestic_violence: '1-800-799-7233'
  },
  'UK': {
    emergency: '999',
    poison: '111',
    suicide: '116 123',
    domestic_violence: '0808 2000 247'
  },
  'IN': {
    emergency: '112',
    police: '100',
    fire: '101',
    ambulance: '108',
    women_helpline: '1091'
  },
  'CA': {
    emergency: '911',
    poison: '1-844-764-7669',
    suicide: '1-833-456-4566',
    domestic_violence: '1-800-799-7233'
  }
};

// Get emergency numbers by country
router.get('/:country', (req, res) => {
  const country = req.params.country.toUpperCase();
  const contacts = emergencyContacts[country];
  
  if (!contacts) {
    return res.status(404).json({ 
      error: 'Emergency contacts not found for this country',
      available_countries: Object.keys(emergencyContacts)
    });
  }
  
  res.json({
    success: true,
    country,
    contacts,
    disclaimer: 'In case of emergency, call immediately. These numbers are for reference only.'
  });
});

// Get all available countries
router.get('/', (req, res) => {
  res.json({
    success: true,
    available_countries: Object.keys(emergencyContacts),
    total: Object.keys(emergencyContacts).length
  });
});

module.exports = router;