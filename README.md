# Health Helper - Your Personal Health Assistant

A comprehensive health application built for hackathons with advanced features including symptom checking, doctor finding, health reminders, and multi-language support.

## 🌟 Features

### Core Features
- **Symptom Checker**: AI-powered symptom analysis with preliminary health insights
- **Doctor Finder**: Locate nearby healthcare professionals with Google Maps integration
- **Health Reminders**: Set medication, water intake, and exercise reminders
- **Emergency Contacts**: Quick access to regional emergency numbers

### Unique Features
- **Multi-Language Support**: Available in English, Spanish, Hindi, and French
- **Image Analysis**: Upload images for basic health checks using Teachable Machine AI
- **Offline Mode**: Access health tips and emergency contacts without internet
- **Progressive Web App**: Install on mobile devices for native app experience
- **Real-time Notifications**: Push notifications for health reminders

## 🚀 Tech Stack

### Frontend
- **HTML5/CSS3/JavaScript**: Modern web technologies
- **Progressive Web App**: Service worker for offline functionality
- **Responsive Design**: Mobile-first approach with Flexbox/Grid
- **Font Awesome**: Beautiful icons and UI elements

### Backend
- **Node.js**: Server runtime
- **Express.js**: Web framework
- **Multer**: File upload handling
- **Node-cron**: Scheduled tasks for reminders

### APIs & Services
- **Google Maps API**: Doctor location services
- **Teachable Machine**: Image analysis for health checks
- **Web Notifications API**: Push notifications
- **Geolocation API**: User location services

### Database Options
- **Firebase**: Real-time database (recommended)
- **MongoDB**: Document database alternative

## 📱 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Google Maps API key
- Firebase project (optional)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd health-helper
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

5. **Access the app**
   - Open http://localhost:5000 in your browser
   - The app will automatically open the client interface

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## 🔧 Configuration

### Required API Keys

1. **Google Maps API**
   - Enable Maps JavaScript API
   - Enable Places API
   - Enable Directions API

2. **Teachable Machine Model**
   - Train a model at teachablemachine.withgoogle.com
   - Export the model and get the URL

3. **Firebase (Optional)**
   - Create a Firebase project
   - Enable Firestore database
   - Download service account key

### Environment Variables

```env
PORT=5000
GOOGLE_MAPS_API_KEY=your_api_key
FIREBASE_PROJECT_ID=your_project_id
TEACHABLE_MACHINE_MODEL_URL=your_model_url
```

## 📚 API Documentation

### Symptom Checker
```javascript
POST /api/symptoms/check
{
  "symptoms": ["headache", "fever"],
  "language": "en"
}
```

### Doctor Search
```javascript
GET /api/doctors/nearby?specialty=cardiology&radius=5
```

### Health Reminders
```javascript
POST /api/reminders
{
  "type": "medication",
  "title": "Take blood pressure medication",
  "time": "08:00",
  "frequency": "daily"
}
```

### Emergency Contacts
```javascript
GET /api/emergency/US
```

## 🎨 Customization

### Adding New Languages
1. Update the language selector in `client/index.html`
2. Add translations in `client/script.js`
3. Update API responses to support new language

### Adding New Symptoms
1. Update `server/routes/symptoms.js`
2. Add new symptom data to the database
3. Update the symptom suggestions endpoint

### Customizing UI Theme
1. Modify CSS variables in `client/styles.css`
2. Update the color scheme in `:root` selector
3. Customize component styles as needed

## 🔒 Security Features

- Input validation and sanitization
- Rate limiting for API endpoints
- Secure file upload handling
- CORS configuration
- Environment variable protection

## 📱 Mobile Features

- Touch-friendly interface
- Swipe gestures support
- Camera integration for image upload
- GPS location services
- Push notifications
- Offline functionality

## 🧪 Testing

### Manual Testing Checklist
- [ ] Symptom checker functionality
- [ ] Image upload and analysis
- [ ] Doctor search and location
- [ ] Reminder creation and notifications
- [ ] Emergency contact access
- [ ] Offline mode functionality
- [ ] Multi-language support
- [ ] Mobile responsiveness

### Automated Testing (Future Enhancement)
```bash
npm test
```

## 🚀 Deployment Options

### Heroku
```bash
git push heroku main
```

### Netlify (Frontend only)
```bash
npm run build
# Deploy dist folder to Netlify
```

### Docker
```dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the API endpoints

## 🏆 Hackathon Tips

### Presentation Points
- Emphasize unique features (multi-language, image analysis, offline mode)
- Demonstrate real-world use cases
- Show mobile responsiveness
- Highlight accessibility features

### Demo Script
1. Show symptom checker with image upload
2. Demonstrate doctor finder with location
3. Set up health reminders
4. Show emergency contacts
5. Test offline functionality
6. Switch between languages

### Future Enhancements
- AI chatbot integration
- Telemedicine video calls
- Health data analytics
- Wearable device integration
- Social features for health communities

---

Built with ❤️ for improving global healthcare accessibility