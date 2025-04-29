class GameSelector {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.setupVoiceRecognition();
    }

    async setupVoiceRecognition() {
        try {
            // First, check and request microphone permission
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop()); // Stop the stream after getting permission

            if ('webkitSpeechRecognition' in window) {
                this.recognition = new webkitSpeechRecognition();
                this.recognition.continuous = true;
                this.recognition.interimResults = false;
                this.recognition.lang = 'en-US';

                this.recognition.onresult = (event) => {
                    const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
                    this.processCommand(command);
                };

                this.recognition.onend = () => {
                    if (this.isListening) {
                        this.restartRecognition();
                    }
                };

                this.recognition.onerror = (event) => {
                    console.error('Speech recognition error:', event.error);
                    if (event.error === 'no-speech') {
                        this.restartRecognition();
                    }
                };

                // Start listening after successful setup
                await this.startListening();
            }
        } catch (err) {
            console.error('Microphone permission denied:', err);
            // You might want to show some UI element to indicate that voice commands are not available
        }
    }

    async startListening() {
        if (this.recognition) {
            try {
                this.isListening = true;
                await this.recognition.start();
            } catch (err) {
                console.error('Error starting recognition:', err);
                this.isListening = false;
            }
        }
    }

    stopListening() {
        if (this.recognition) {
            this.isListening = false;
            this.recognition.stop();
        }
    }

    async restartRecognition() {
        if (this.isListening) {
            try {
                this.recognition.stop();
                await new Promise(resolve => setTimeout(resolve, 200));
                await this.recognition.start();
            } catch (err) {
                console.error('Error restarting recognition:', err);
                this.isListening = false;
            }
        }
    }

    processCommand(command) {
        console.log('Received command:', command);
        
        if (command.includes('chess')) {
            window.location.href = 'index.html';
        } else if (command.includes('memory')) {
            // Placeholder for memory game
            alert('Memory game coming soon!');
        } else if (command.includes('home') || command.includes('back')) {
            // Already on home page, could add additional functionality here
        }
    }
}

// Initialize the game selector when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new GameSelector();
}); 