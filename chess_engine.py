import chess
import random

class ChessEngine:
    def __init__(self):
        self.board = chess.Board()
        self.last_move = None  # stores the last move (player or computer)

    def reset(self):
        self.board.reset()
        self.last_move = None

    def make_player_move(self, move_uci):
        """
        Applies a player move if legal.
        Returns True if move is valid, else False.
        """
        try:
            move = chess.Move.from_uci(move_uci)
            if move in self.board.legal_moves:
                self.board.push(move)
                self.last_move = move
                return True
        except Exception:
            pass
        return False

    def make_computer_move(self):
        """
        Makes a random legal move for the computer.
        Returns the move in UCI format.
        """
        moves = list(self.board.legal_moves)
        if moves:
            move = random.choice(moves)
            self.board.push(move)
            self.last_move = move
            return move.uci()
        return None

    def get_board(self):
        """Returns the current chess board."""
        return self.board

    def get_last_move(self):
        """Returns the last move played."""
        return self.last_move

    def status(self):
        """Returns game status if ended."""
        if self.board.is_checkmate():
            return "Checkmate"
        if self.board.is_stalemate():
            return "Stalemate"
        if self.board.is_insufficient_material():
            return "Draw"
        return None
