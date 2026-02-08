import streamlit as st
import streamlit.components.v1 as components
import chess
import random

# ---------------- PAGE CONFIG ----------------
st.set_page_config(
    page_title="Play Chess",
    page_icon="♟️",
    layout="centered"
)

# ---------------- SESSION STATE ----------------
if "board" not in st.session_state:
    st.session_state.board = chess.Board()
    st.session_state.history = []
    st.session_state.last_move = None

board = st.session_state.board

# ---------------- PIECES ----------------
PIECES = {
    'r':'♜','n':'♞','b':'♝','q':'♛','k':'♚','p':'♟',
    'R':'♖','N':'♘','B':'♗','Q':'♕','K':'♔','P':'♙'
}

# ---------------- DRAW BOARD ----------------
def draw_board():
    html = """
    <style>
    * { transition: none !important; }
    table {
        border-collapse: collapse;
        margin: auto;
    }
    td {
        width: 56px;
        height: 56px;
        text-align: center;
        font-size: 34px;
        font-family: "Segoe UI Symbol";
        user-select: none;
    }
    .light { background-color: #eeeed2; }
    .dark { background-color: #769656; }
    .highlight { background-color: #baca44 !important; }
    </style>

    <table>
    """

    for r in range(8):
        html += "<tr>"
        for c in range(8):
            sq = chess.square(c, 7 - r)
            piece = board.piece_at(sq)
            symbol = PIECES[piece.symbol()] if piece else ""

            cls = "light" if (r + c) % 2 == 0 else "dark"
            if st.session_state.last_move and sq in (
                st.session_state.last_move.from_square,
                st.session_state.last_move.to_square
            ):
                cls = "highlight"

            html += f'<td class="{cls}">{symbol}</td>'
        html += "</tr>"

    html += "</table>"

    components.html(html, height=520)

# ---------------- UI ----------------
st.title("Play Chess")
st.caption("Chess.com–inspired live demo (optimized Streamlit)")

# ---------------- MOVE FORM ----------------
with st.form("move_form"):
    move = st.text_input("Enter your move (e2e4)", placeholder="e2e4")
    submitted = st.form_submit_button("Play Move")

# ---------------- MOVE LOGIC ----------------
if submitted:
    try:
        move = move.replace(" ", "")
        user_move = chess.Move.from_uci(move)

        if user_move in board.legal_moves:
            board.push(user_move)
            st.session_state.last_move = user_move
            st.session_state.history.append(f"Player: {move}")

            if not board.is_game_over():
                legal_moves = list(board.legal_moves)
                comp_move = random.choice(legal_moves)
                board.push(comp_move)
                st.session_state.last_move = comp_move
                st.session_state.history.append(f"Computer: {comp_move.uci()}")

        else:
            st.warning("Invalid move")

    except Exception:
        st.warning("Invalid move format")

# ---------------- RESET ----------------
if st.button("Reset Game"):
    st.session_state.board = chess.Board()
    st.session_state.history = []
    st.session_state.last_move = None

# ✅ BOARD RENDERED AFTER STATE UPDATES
draw_board()

# ---------------- GAME STATUS ----------------
if board.is_checkmate():
    st.success("Checkmate!")
elif board.is_stalemate():
    st.info("Stalemate!")
elif board.is_insufficient_material():
    st.info("Draw!")

# ---------------- MOVE HISTORY ----------------
st.subheader("Move History")
for m in st.session_state.history:
    st.write(m)
