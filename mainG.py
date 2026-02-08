import tkinter as tk
import chess
from chess_engine import ChessEngine

engine = ChessEngine()
move_history = []

root = tk.Tk()
root.title("Visual Chess")

main_frame = tk.Frame(root)
main_frame.pack(padx=10, pady=10)

board_frame = tk.Frame(main_frame)
board_frame.grid(row=0, column=0, padx=10)

side_frame = tk.Frame(main_frame)
side_frame.grid(row=0, column=1, sticky="n")

status_label = tk.Label(root, text="Your move", font=("Arial", 14))
status_label.pack(pady=5)

history_label = tk.Label(side_frame, text="Move History", font=("Arial", 12, "bold"))
history_label.pack()

history_box = tk.Text(side_frame, height=18, width=25)
history_box.pack()

PIECES = {
    'r':'♜','n':'♞','b':'♝','q':'♛','k':'♚','p':'♟',
    'R':'♖','N':'♘','B':'♗','Q':'♕','K':'♔','P':'♙','.' :' '
}

def draw_board():
    for w in board_frame.winfo_children():
        w.destroy()

    board = engine.get_board()
    last_move = engine.get_last_move()

    highlight = set()
    if last_move:
        highlight.add(last_move.from_square)
        highlight.add(last_move.to_square)

    for r in range(8):
        for c in range(8):
            sq = chess.square(c, 7 - r)
            piece = board.piece_at(sq)
            char = piece.symbol() if piece else '.'

            bg = "white" if (r + c) % 2 == 0 else "gray"
            if sq in highlight:
                bg = "lightgreen"

            tk.Label(
                board_frame,
                text=PIECES[char],
                font=("Arial", 32),
                width=2,
                height=1,
                bg=bg
            ).grid(row=r, column=c)

def update_history():
    history_box.delete("1.0", tk.END)
    for m in move_history:
        history_box.insert(tk.END, m + "\n")

def play_turn():
    text = input("Enter move (e2e4): ").lower()
    text = text.replace(" ", "")

    if len(text) != 4 or not engine.make_player_move(text):
        status_label.config(text="Invalid move")
        return

    move_history.append(f"Player: {text}")
    draw_board()
    update_history()

    comp_move = engine.make_computer_move()
    if comp_move:
        move_history.append(f"Computer: {comp_move}")
        draw_board()
        update_history()

    status = engine.status()
    status_label.config(text=status if status else "Your move")

draw_board()
tk.Button(root, text="Play Move", command=play_turn, font=("Arial", 12)).pack(pady=10)
root.mainloop()
