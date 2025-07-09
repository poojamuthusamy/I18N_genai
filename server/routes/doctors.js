const express = require('express');
const router = express.Router();

// Mock doctor data
const doctors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'General Medicine',
    rating: 4.8,
    distance: '0.5 km',
    address: '123 Health Street, Medical District',
    phone: '+1-555-0123',
    availability: 'Available now',
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialty: 'Cardiology',
    rating: 4.9,
    distance: '1.2 km',
    address: '456 Heart Avenue, Cardiac Center',
    phone: '+1-555-0456',
    availability: 'Available in 30 mins',
    coordinates: { lat: 40.7589, lng: -73.9851 }
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    specialty: 'Dermatology',
    rating: 4.7,
    distance: '2.1 km',
    address: '789 Skin Care Blvd, Derma Clinic',
    phone: '+1-555-0789',
    availability: 'Available tomorrow',
    coordinates: { lat: 40.7505, lng: -73.9934 }
  }
];

// Find nearby doctors
router.get('/nearby', (req, res) => {
  const { lat, lng, specialty, radius = 5 } = req.query;
  
  let filteredDoctors = doctors;
  
  if (specialty) {
    filteredDoctors = doctors.filter(doctor => 
      doctor.specialty.toLowerCase().includes(specialty.toLowerCase())
    );
  }
  
  // In a real app, you would calculate actual distances using coordinates
  res.json({
    success: true,
    doctors: filteredDoctors,
    total: filteredDoctors.length
  });
});

// Get doctor details
router.get('/:id', (req, res) => {
  const doctor = doctors.find(d => d.id === parseInt(req.params.id));
  
  if (!doctor) {
    return res.status(404).json({ error: 'Doctor not found' });
  }
  
  res.json({
    success: true,
    doctor: {
      ...doctor,
      reviews: [
        { rating: 5, comment: 'Excellent care and very professional' },
        { rating: 4, comment: 'Good doctor, helpful staff' }
      ],
      services: ['Consultation', 'Health Checkup', 'Prescription'],
      languages: ['English', 'Spanish', 'Hindi']
    }
  });
});

module.exports = router;