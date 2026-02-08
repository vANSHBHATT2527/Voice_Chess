from chess_engine import ChessEngine
from speech_input import SpeechInput
from speech_output import SpeechOutput
import time

engine = ChessEngine()
speech_in = SpeechInput()
speech_out = SpeechOutput()

def parse_move(text):
    text = text.replace(" ", "")
    if len(text) == 4:
        return text
    return None

speech_out.speak("Welcome to Voice Chess")

while True:
    text = speech_in.listen()

    if text is None:
        text = input("Voice not detected. Enter move (e2e4): ").lower()

    if text in ["exit", "quit"]:
        speech_out.speak("Goodbye")
        break

    if text == "reset":
        engine.reset()
        speech_out.speak("Board reset")
        continue

    move = parse_move(text)
    if not move or not engine.make_player_move(move):
        speech_out.speak("Invalid move")
        continue

    speech_out.speak("Move accepted")

    comp_move = engine.make_computer_move()
    if comp_move:
        speech_out.speak("Computer moved")

    status = engine.status()
    if status:
        speech_out.speak(status)
        break

    time.sleep(0.3)
