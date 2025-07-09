// Health Helper App JavaScript

class HealthHelper {
    constructor() {
        this.currentSection = 'home';
        this.symptoms = [];
        this.reminders = [];
        this.isOnline = navigator.onLine;
        this.translations = {};
        this.currentLanguage = 'en';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDailyTip();
        this.loadReminders();
        this.loadEmergencyContacts();
        this.setupOfflineMode();
        this.setupServiceWorker();
        this.requestNotificationPermission();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item, [data-section]').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                if (section) {
                    this.showSection(section);
                }
            });
        });

        // Language selector
        document.getElementById('languageSelect').addEventListener('change', (e) => {
            this.changeLanguage(e.target.value);
        });

        // Symptom checker
        document.getElementById('addSymptom').addEventListener('click', () => {
            this.addSymptom();
        });

        document.getElementById('symptomInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addSymptom();
            }
        });

        document.getElementById('checkSymptoms').addEventListener('click', () => {
            this.checkSymptoms();
        });

        // Image upload
        const uploadArea = document.getElementById('uploadArea');
        const imageInput = document.getElementById('imageInput');

        uploadArea.addEventListener('click', () => imageInput.click());
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--primary-color)';
        });
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = 'var(--border-color)';
        });
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--border-color)';
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleImageUpload(files[0]);
            }
        });

        imageInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleImageUpload(e.target.files[0]);
            }
        });

        // Doctor search
        document.getElementById('searchDoctors').addEventListener('click', () => {
            this.searchDoctors();
        });

        // Reminders
        document.getElementById('addReminder').addEventListener('click', () => {
            this.addReminder();
        });

        // Emergency contacts
        document.getElementById('countrySelect').addEventListener('change', (e) => {
            this.loadEmergencyContacts(e.target.value);
        });

        // Online/offline status
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.updateOfflineIndicator();
            this.showToast('Back online!', 'success');
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.updateOfflineIndicator();
            this.showToast('You are offline. Some features may be limited.', 'warning');
        });
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        document.getElementById(sectionName).classList.add('active');

        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        this.currentSection = sectionName;

        // Load section-specific data
        if (sectionName === 'doctors') {
            this.searchDoctors();
        }
    }

    async changeLanguage(language) {
        this.currentLanguage = language;
        // In a real app, you would load translations from a file or API
        this.showToast(`Language changed to ${language}`, 'success');
    }

    addSymptom() {
        const input = document.getElementById('symptomInput');
        const symptom = input.value.trim();

        if (symptom && !this.symptoms.includes(symptom)) {
            this.symptoms.push(symptom);
            this.renderSymptomTags();
            input.value = '';
        }
    }

    removeSymptom(symptom) {
        this.symptoms = this.symptoms.filter(s => s !== symptom);
        this.renderSymptomTags();
    }

    renderSymptomTags() {
        const container = document.getElementById('symptomTags');
        container.innerHTML = this.symptoms.map(symptom => `
            <div class="symptom-tag">
                ${symptom}
                <button onclick="app.removeSymptom('${symptom}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    async checkSymptoms() {
        if (this.symptoms.length === 0) {
            this.showToast('Please add at least one symptom', 'warning');
            return;
        }

        this.showLoading(true);

        try {
            const response = await fetch('/api/symptoms/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    symptoms: this.symptoms,
                    language: this.currentLanguage
                })
            });

            const data = await response.json();
            this.renderSymptomResults(data.results);
        } catch (error) {
            console.error('Error checking symptoms:', error);
            this.showToast('Error checking symptoms. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    renderSymptomResults(results) {
        const container = document.getElementById('symptomResults');
        container.innerHTML = results.map(result => `
            <div class="result-card">
                <div class="result-header">
                    <h3>${result.symptom}</h3>
                    <span class="severity-badge severity-${result.severity}">
                        ${result.severity}
                    </span>
                </div>
                <div class="result-content">
                    <h4>Possible Conditions:</h4>
                    <ul>
                        ${result.possibleConditions.map(condition => `<li>${condition}</li>`).join('')}
                    </ul>
                    <h4>Recommendations:</h4>
                    <ul>
                        ${result.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `).join('');

        // Add disclaimer
        container.innerHTML += `
            <div class="result-card" style="background: rgba(245, 158, 11, 0.1); border-left: 4px solid var(--warning-color);">
                <p><strong>Disclaimer:</strong> This information is for educational purposes only and should not replace professional medical advice. Please consult a healthcare provider for proper diagnosis and treatment.</p>
            </div>
        `;
    }

    async handleImageUpload(file) {
        if (!file.type.startsWith('image/')) {
            this.showToast('Please select an image file', 'error');
            return;
        }

        // Show preview
        const preview = document.getElementById('imagePreview');
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.innerHTML = `<img src="${e.target.result}" alt="Uploaded image">`;
        };
        reader.readAsDataURL(file);

        // Upload to server
        const formData = new FormData();
        formData.append('image', file);

        this.showLoading(true);

        try {
            const response = await fetch('/api/upload-image', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (data.success) {
                this.showImageAnalysisResults(data.analysis);
                this.showToast('Image analyzed successfully!', 'success');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            this.showToast('Error analyzing image. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    showImageAnalysisResults(analysis) {
        const container = document.getElementById('symptomResults');
        container.innerHTML = `
            <div class="result-card">
                <div class="result-header">
                    <h3><i class="fas fa-camera"></i> Image Analysis Results</h3>
                    <span class="severity-badge severity-mild">
                        ${Math.round(analysis.confidence * 100)}% confidence
                    </span>
                </div>
                <div class="result-content">
                    <h4>Analysis:</h4>
                    <p>${analysis.condition}</p>
                    <h4>Recommendations:</h4>
                    <ul>
                        ${analysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    async searchDoctors() {
        const specialty = document.getElementById('specialtyFilter').value;
        const distance = document.getElementById('distanceFilter').value;

        this.showLoading(true);

        try {
            const params = new URLSearchParams();
            if (specialty) params.append('specialty', specialty);
            params.append('radius', distance);

            const response = await fetch(`/api/doctors/nearby?${params}`);
            const data = await response.json();
            
            this.renderDoctors(data.doctors);
        } catch (error) {
            console.error('Error searching doctors:', error);
            this.showToast('Error searching doctors. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    renderDoctors(doctors) {
        const container = document.getElementById('doctorsList');
        container.innerHTML = doctors.map(doctor => `
            <div class="doctor-card">
                <div class="doctor-header">
                    <div class="doctor-info">
                        <h3>${doctor.name}</h3>
                        <div class="doctor-specialty">${doctor.specialty}</div>
                    </div>
                    <div class="doctor-rating">
                        <i class="fas fa-star"></i>
                        <span>${doctor.rating}</span>
                    </div>
                </div>
                <div class="doctor-details">
                    <div class="doctor-detail">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${doctor.distance}</span>
                    </div>
                    <div class="doctor-detail">
                        <i class="fas fa-phone"></i>
                        <span>${doctor.phone}</span>
                    </div>
                    <div class="doctor-detail">
                        <i class="fas fa-clock"></i>
                        <span>${doctor.availability}</span>
                    </div>
                    <div class="doctor-detail">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${doctor.address}</span>
                    </div>
                </div>
                <div class="doctor-actions">
                    <button class="btn btn-primary btn-small" onclick="app.callDoctor('${doctor.phone}')">
                        <i class="fas fa-phone"></i>
                        Call
                    </button>
                    <button class="btn btn-secondary btn-small" onclick="app.getDirections(${doctor.coordinates.lat}, ${doctor.coordinates.lng})">
                        <i class="fas fa-directions"></i>
                        Directions
                    </button>
                </div>
            </div>
        `).join('');
    }

    callDoctor(phone) {
        window.open(`tel:${phone}`);
    }

    getDirections(lat, lng) {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        window.open(url, '_blank');
    }

    async addReminder() {
        const type = document.getElementById('reminderType').value;
        const title = document.getElementById('reminderTitle').value;
        const time = document.getElementById('reminderTime').value;
        const frequency = document.getElementById('reminderFrequency').value;

        if (!title || !time) {
            this.showToast('Please fill in all required fields', 'warning');
            return;
        }

        const reminder = {
            type,
            title,
            time,
            frequency,
            enabled: true
        };

        try {
            const response = await fetch('/api/reminders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reminder)
            });

            const data = await response.json();
            
            if (data.success) {
                this.reminders.push(data.reminder);
                this.renderReminders();
                this.clearReminderForm();
                this.showToast('Reminder added successfully!', 'success');
                this.scheduleNotification(data.reminder);
            }
        } catch (error) {
            console.error('Error adding reminder:', error);
            this.showToast('Error adding reminder. Please try again.', 'error');
        }
    }

    clearReminderForm() {
        document.getElementById('reminderTitle').value = '';
        document.getElementById('reminderTime').value = '';
    }

    async loadReminders() {
        try {
            const response = await fetch('/api/reminders');
            const data = await response.json();
            
            if (data.success) {
                this.reminders = data.reminders;
                this.renderReminders();
            }
        } catch (error) {
            console.error('Error loading reminders:', error);
        }
    }

    renderReminders() {
        const container = document.getElementById('remindersList');
        container.innerHTML = this.reminders.map(reminder => `
            <div class="reminder-card">
                <div class="reminder-info">
                    <h4>${reminder.title}</h4>
                    <div class="reminder-meta">
                        <span><i class="fas fa-clock"></i> ${reminder.time}</span>
                        <span><i class="fas fa-repeat"></i> ${reminder.frequency}</span>
                        <span><i class="fas fa-tag"></i> ${reminder.type}</span>
                    </div>
                </div>
                <div class="reminder-actions">
                    <button class="reminder-toggle ${reminder.enabled ? 'active' : ''}" 
                            onclick="app.toggleReminder(${reminder.id})">
                        <i class="fas fa-${reminder.enabled ? 'bell' : 'bell-slash'}"></i>
                    </button>
                    <button class="reminder-toggle" onclick="app.deleteReminder(${reminder.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    async toggleReminder(id) {
        const reminder = this.reminders.find(r => r.id === id);
        if (!reminder) return;

        reminder.enabled = !reminder.enabled;

        try {
            await fetch(`/api/reminders/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ enabled: reminder.enabled })
            });

            this.renderReminders();
            this.showToast(`Reminder ${reminder.enabled ? 'enabled' : 'disabled'}`, 'success');
        } catch (error) {
            console.error('Error updating reminder:', error);
            this.showToast('Error updating reminder', 'error');
        }
    }

    async deleteReminder(id) {
        if (!confirm('Are you sure you want to delete this reminder?')) return;

        try {
            await fetch(`/api/reminders/${id}`, {
                method: 'DELETE'
            });

            this.reminders = this.reminders.filter(r => r.id !== id);
            this.renderReminders();
            this.showToast('Reminder deleted', 'success');
        } catch (error) {
            console.error('Error deleting reminder:', error);
            this.showToast('Error deleting reminder', 'error');
        }
    }

    async loadEmergencyContacts(country = 'US') {
        try {
            const response = await fetch(`/api/emergency/${country}`);
            const data = await response.json();
            
            if (data.success) {
                this.renderEmergencyContacts(data.contacts);
            }
        } catch (error) {
            console.error('Error loading emergency contacts:', error);
        }
    }

    renderEmergencyContacts(contacts) {
        const container = document.getElementById('emergencyContacts');
        container.innerHTML = Object.entries(contacts).map(([type, number]) => `
            <div class="emergency-card">
                <h3>${type.replace('_', ' ')}</h3>
                <div class="emergency-number">${number}</div>
                <button class="call-button" onclick="app.callEmergency('${number}')">
                    <i class="fas fa-phone"></i>
                    Call Now
                </button>
            </div>
        `).join('');
    }

    callEmergency(number) {
        if (confirm(`Call ${number}?`)) {
            window.open(`tel:${number}`);
        }
    }

    async loadDailyTip() {
        try {
            const response = await fetch('/api/tips/random/tip');
            const data = await response.json();
            
            if (data.success) {
                document.getElementById('dailyTip').innerHTML = `
                    <h4>${data.tip.title}</h4>
                    <p>${data.tip.content}</p>
                `;
            }
        } catch (error) {
            console.error('Error loading daily tip:', error);
            document.getElementById('dailyTip').innerHTML = 'Stay hydrated and maintain a balanced diet!';
        }
    }

    scheduleNotification(reminder) {
        if ('Notification' in window && Notification.permission === 'granted') {
            // In a real app, you would use a more sophisticated scheduling system
            const now = new Date();
            const [hours, minutes] = reminder.time.split(':');
            const reminderTime = new Date();
            reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            
            if (reminderTime <= now) {
                reminderTime.setDate(reminderTime.getDate() + 1);
            }
            
            const timeUntilReminder = reminderTime.getTime() - now.getTime();
            
            setTimeout(() => {
                new Notification('Health Helper Reminder', {
                    body: reminder.title,
                    icon: '/favicon.ico',
                    badge: '/favicon.ico'
                });
            }, timeUntilReminder);
        }
    }

    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    setupOfflineMode() {
        this.updateOfflineIndicator();
        
        // Cache essential data for offline use
        if ('serviceWorker' in navigator) {
            this.cacheEssentialData();
        }
    }

    updateOfflineIndicator() {
        const indicator = document.getElementById('offlineIndicator');
        if (this.isOnline) {
            indicator.classList.remove('offline');
            indicator.innerHTML = '<i class="fas fa-wifi"></i>';
        } else {
            indicator.classList.add('offline');
            indicator.innerHTML = '<i class="fas fa-wifi-slash"></i>';
        }
    }

    async cacheEssentialData() {
        try {
            // Cache health tips for offline use
            const tips = await fetch('/api/tips');
            const tipsData = await tips.json();
            localStorage.setItem('healthTips', JSON.stringify(tipsData));

            // Cache emergency contacts
            const emergency = await fetch('/api/emergency/US');
            const emergencyData = await emergency.json();
            localStorage.setItem('emergencyContacts', JSON.stringify(emergencyData));
        } catch (error) {
            console.error('Error caching data:', error);
        }
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.error('Service Worker registration failed:', error);
                });
        }
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (show) {
            overlay.classList.add('active');
        } else {
            overlay.classList.remove('active');
        }
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type} show`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Initialize the app
const app = new HealthHelper();

// Make app globally available for onclick handlers
window.app = app;