import chess
import speech_recognition as sr
import threading
import time
import os

# Speech recognition setup
recognizer = sr.Recognizer()
microphone = sr.Microphone()

def clear_screen():
    os.system('clear' if os.name == 'posix' else 'cls')

def print_board(board):
    clear_screen()
    print("\n  a b c d e f g h")
    print("  ---------------")
    for i in range(8):
        print(f"{8-i}|", end=" ")
        for j in range(8):
            piece = board.piece_at(chess.square(j, 7-i))
            if piece is None:
                print(".", end=" ")
            else:
                print(piece.symbol(), end=" ")
        print(f"|{8-i}")
    print("  ---------------")
    print("  a b c d e f g h")
    print(f"\nCurrent turn: {'White' if board.turn else 'Black'}")

def listen_for_move():
    with microphone as source:
        print("\nListening for move...")
        recognizer.adjust_for_ambient_noise(source)
        try:
            audio = recognizer.listen(source, timeout=5)
            text = recognizer.recognize_google(audio)
            print(f"Heard: {text}")
            return text.lower()
        except sr.WaitTimeoutError:
            return None
        except sr.UnknownValueError:
            print("Could not understand audio")
            return None
        except sr.RequestError as e:
            print(f"Could not request results; {e}")
            return None

def parse_move(text):
    if not text:
        return None
    
    # Handle castling
    if "castle" in text:
        if "kingside" in text or "short" in text:
            return "e1g1" if board.turn else "e8g8"
        elif "queenside" in text or "long" in text:
            return "e1c1" if board.turn else "e8c8"
    
    # Parse regular moves
    try:
        words = text.split()
        from_square = None
        to_square = None
        
        for i, word in enumerate(words):
            if word in ['from', 'to']:
                continue
            if len(word) == 2 and word[0] in 'abcdefgh' and word[1] in '12345678':
                if i > 0 and words[i-1] == 'from':
                    from_square = word
                elif i > 0 and words[i-1] == 'to':
                    to_square = word
        
        if from_square and to_square:
            return from_square + to_square
    except:
        pass
    return None

def main():
    global board
    board = chess.Board()
    
    print("Chess game started!")
    print("Speak your moves in the format: 'move from e2 to e4'")
    print("You can also say 'castle kingside' or 'castle queenside'")
    print("Press Ctrl+C to quit, or say 'reset' to reset the board")
    
    # Start listening thread
    listening = True
    def listen_thread():
        while listening:
            move_text = listen_for_move()
            if move_text:
                if move_text.strip().lower() == "reset":
                    board.reset()
                    print_board(board)
                    continue
                    
                move = parse_move(move_text)
                if move and chess.Move.from_uci(move) in board.legal_moves:
                    print(f"Making move: {move}")
                    board.push_uci(move)
                    print_board(board)
                    
                    if board.is_checkmate():
                        print("Checkmate!")
                        return
                    elif board.is_stalemate():
                        print("Stalemate!")
                        return
                    elif board.is_insufficient_material():
                        print("Draw due to insufficient material!")
                        return
                else:
                    print("Invalid move or move not understood")
    
    thread = threading.Thread(target=listen_thread)
    thread.daemon = True
    thread.start()
    
    try:
        print_board(board)
        while True:
            time.sleep(0.1)  # Reduce CPU usage
    except KeyboardInterrupt:
        print("\nGame ended.")
        listening = False

if __name__ == "__main__":
    main() 