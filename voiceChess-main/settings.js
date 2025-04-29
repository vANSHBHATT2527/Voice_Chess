class AccessibilitySettings {
    constructor() {
        this.settings = {
            speechRate: 'normal',
            selectedVoice: '',
            vibrationEnabled: true,
            vibrationIntensity: 'medium'
        };
        this.recognition = null;
        this.isListening = false;
        this.loadSettings();
        this.setupEventListeners();
        this.setupVoiceRecognition();
        this.loadVoices();
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('accessibilitySettings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
            this.updateUI();
        }
    }

    saveSettings() {
        localStorage.setItem('accessibilitySettings', JSON.stringify(this.settings));
        this.showSaveConfirmation();
    }

    showSaveConfirmation() {
        const saveBtn = document.getElementById('save-settings');
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '<span class="icon">✓</span> Settings Saved!';
        saveBtn.style.backgroundColor = '#2ecc71';
        
        setTimeout(() => {
            saveBtn.innerHTML = originalText;
            saveBtn.style.backgroundColor = '';
        }, 2000);
    }

    updateUI() {
        // Update speech rate buttons
        document.querySelectorAll('.rate-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.rate === this.settings.speechRate);
        });
        document.getElementById('speech-rate-value').textContent = 
            this.settings.speechRate.charAt(0).toUpperCase() + this.settings.speechRate.slice(1);

        // Update voice select
        const voiceSelect = document.getElementById('voice-select');
        if (voiceSelect && this.settings.selectedVoice) {
            voiceSelect.value = this.settings.selectedVoice;
        }

        // Update vibration toggle
        document.getElementById('vibration-toggle').checked = this.settings.vibrationEnabled;

        // Update intensity buttons
        document.querySelectorAll('.intensity-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.intensity === this.settings.vibrationIntensity);
        });
        document.getElementById('vibration-intensity-value').textContent = 
            this.settings.vibrationIntensity.charAt(0).toUpperCase() + this.settings.vibrationIntensity.slice(1);
    }

    loadVoices() {
        const voiceSelect = document.getElementById('voice-select');
        
        // Function to populate voices
        const populateVoices = () => {
            const voices = speechSynthesis.getVoices();
            voiceSelect.innerHTML = '<option value="">Select a voice</option>';
            
            voices.forEach(voice => {
                const option = document.createElement('option');
                option.value = voice.name;
                option.textContent = `${voice.name} (${voice.lang})`;
                option.selected = voice.name === this.settings.selectedVoice;
                voiceSelect.appendChild(option);
            });
        };

        // Initial population
        populateVoices();

        // Handle dynamic voice loading
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = populateVoices;
        }
    }

    async setupVoiceRecognition() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());

            if ('webkitSpeechRecognition' in window) {
                this.recognition = new webkitSpeechRecognition();
                this.recognition.continuous = true;
                this.recognition.interimResults = false;
                this.recognition.lang = 'en-US';

                this.recognition.onresult = (event) => {
                    const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
                    this.processVoiceCommand(command);
                };

                this.recognition.onend = () => {
                    if (this.isListening) {
                        this.recognition.start();
                    }
                };

                this.startListening();
            }
        } catch (err) {
            console.error('Microphone permission denied:', err);
        }
    }

    startListening() {
        if (this.recognition && !this.isListening) {
            this.isListening = true;
            this.recognition.start();
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.isListening = false;
            this.recognition.stop();
        }
    }

    processVoiceCommand(command) {
        console.log('Processing command:', command);

        if (command.includes('speed')) {
            if (command.includes('slow')) {
                this.settings.speechRate = 'slow';
            } else if (command.includes('fast')) {
                this.settings.speechRate = 'fast';
            } else if (command.includes('normal')) {
                this.settings.speechRate = 'normal';
            }
        } else if (command.includes('vibration')) {
            if (command.includes('on')) {
                this.settings.vibrationEnabled = true;
            } else if (command.includes('off')) {
                this.settings.vibrationEnabled = false;
            } else if (command.includes('high')) {
                this.settings.vibrationIntensity = 'high';
            } else if (command.includes('low')) {
                this.settings.vibrationIntensity = 'low';
            } else if (command.includes('medium')) {
                this.settings.vibrationIntensity = 'medium';
            }
        } else if (command.includes('save')) {
            this.saveSettings();
        }

        this.updateUI();
    }

    setupEventListeners() {
        // Speech rate buttons
        document.querySelectorAll('.rate-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.settings.speechRate = btn.dataset.rate;
                this.updateUI();
            });
        });

        // Voice select
        document.getElementById('voice-select').addEventListener('change', (e) => {
            this.settings.selectedVoice = e.target.value;
        });

        // Vibration toggle
        document.getElementById('vibration-toggle').addEventListener('change', (e) => {
            this.settings.vibrationEnabled = e.target.checked;
        });

        // Intensity buttons
        document.querySelectorAll('.intensity-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.settings.vibrationIntensity = btn.dataset.intensity;
                this.updateUI();
            });
        });

        // Save button
        document.getElementById('save-settings').addEventListener('click', () => {
            this.saveSettings();
        });
    }
}

// Initialize settings when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AccessibilitySettings();
}); 