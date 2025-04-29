🎙️ Voice-Controlled Chess

A voice-activated chess game for enthusiasts who want to play hands-free using speech commands. This project integrates Python, Flask, speech recognition, and a browser-based chessboard to let users make moves through voice input. It's designed for developers, students, or hobbyists interested in combining artificial intelligence, web development, and game logic in an interactive way. 🚀 Deployment Steps (Localhost)

Follow these steps to set up and run the Voice Chess project from GitHub:

📥 Clone the Repository
Open a terminal or command prompt and run:

bash Copy Edit git clone https://github.com/vANSHBHATT2527/Voice_Chess.git cd Voice_Chess 2. 🐍 Set Up a Virtual Environment (Recommended) This keeps your dependencies isolated:

bash Copy Edit

For Windows
python -m venv venv venv\Scripts\activate

For macOS/Linux
python3 -m venv venv source venv/bin/activate 3. 📦 Install Python Dependencies Install all required packages:

bash Copy Edit pip install -r requirements.txt If requirements.txt is missing or incomplete, install manually:

bash Copy Edit pip install flask speechrecognition pyaudio python-chess ⚠️ Note: On some systems, you may need to install PyAudio using system-level tools. For Windows, use a wheel from https://www.lfd.uci.edu/~gohlke/pythonlibs/#pyaudio

▶️ Run the Flask App
Start the voice-controlled chess server:

bash Copy Edit python chess_game.py You should see output like:

csharp Copy Edit

Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
🌐 Open in Browser
Go to your browser and visit:

arduino Copy Edit http://localhost:5000 You’ll see the web-based chessboard UI where you can begin interacting via voice commands.

🧠 Give Microphone Access
Make sure your browser and system allow microphone access, as voice commands rely on it.
