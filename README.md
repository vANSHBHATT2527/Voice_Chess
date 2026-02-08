# ♟️ Voice Chess

Voice Chess is an accessibility-focused chess application that supports both
**voice-based gameplay (CLI)** and a **visual desktop interface (GUI)**.

The project demonstrates speech recognition, game logic, desktop UI design,
and robust system design by separating voice and GUI modes for stability.

---

## 🚀 Features

### 🎤 Voice Chess (CLI Mode)
- Play chess using voice commands
- Text fallback when voice input is unavailable
- Legal move validation using `python-chess`
- Audio feedback using text-to-speech
- Designed for accessibility

### ♟️ Visual Chess (GUI Mode)
- Desktop GUI using Tkinter
- Live chess board with Unicode pieces
- Computer opponent (random legal moves)
- Last-move highlighting
- Move history panel
- Stable, non-blocking interface

---

## 🧠 Tech Stack
- Python
- python-chess
- SpeechRecognition
- PyAudio
- pyttsx3
- Tkinter (standard library)

---

## 📁 Project Structure
voice-chess/
├── mainV.py # Voice Chess (CLI mode)
├── mainG.py # Visual Chess (GUI mode)
├── chess_engine.py # Core chess logic
├── speech_input.py # Speech recognition
├── speech_output.py # Text-to-speech
├── requirements.txt
└── README.md


---

## ▶️ How to Run

### 1️⃣ Create and activate virtual environment
```bash
python -m venv venv
venv\Scripts\activate    # Windows
2️⃣ Install dependencies
pip install -r requirements.txt
🎤 Run Voice Chess (CLI)
python mainV.py
    Speak commands like:
    move from e two to e four
    reset
    exit
If voice is not detected, you can type moves like:
    e2e4

♟️ Run Visual Chess (GUI)
python mainG.py


Click Play Move

Enter moves in terminal (e.g. e2e4)

See your move and computer move on the board
🧩 Design Decision (Important)

Voice input is implemented in CLI mode only.
The GUI version intentionally avoids microphone access to prevent thread-safety
issues on Windows with PyAudio and Tkinter.

🔮 Future Improvements
    Smarter AI (Stockfish)
    Full voice support using browser-based speech APIs
    Undo / restart functionality
    Improved UI styling

## ⚙️ Installation & Setup

```bash
git clone https://github.com/your-username/voice-chess.git
cd voice-chess
pip install -r requirements.txt
python main.py
