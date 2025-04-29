class ChessGame {
    constructor() {
        this.chess = new Chess();
        this.selectedSquare = null;
        this.validMoves = [];
        this.isListening = false;
        this.recognition = null;
        this.initializeBoard();
        this.setupEventListeners();
        this.updateUI();
    }

    async setupVoiceRecognition() {
        try {
            // First, check and request microphone permission
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop()); // Stop the stream after getting permission

            if ('webkitSpeechRecognition' in window) {
                this.recognition = new webkitSpeechRecognition();
                this.recognition.continuous = true;
                this.recognition.interimResults = true;
                this.recognition.lang = 'en-US';

                this.recognition.onstart = () => {
                    this.isListening = true;
                    document.getElementById('mic-btn').classList.add('listening');
                    document.getElementById('mic-btn').textContent = '🎤 Listening...';
                    document.getElementById('voice-status').textContent = 'Voice command: On';
                };

                this.recognition.onend = () => {
                    this.isListening = false;
                    document.getElementById('mic-btn').classList.remove('listening');
                    document.getElementById('mic-btn').textContent = '🎤 Start Voice Command';
                    document.getElementById('voice-status').textContent = 'Voice command: Off';
                };

                this.recognition.onresult = (event) => {
                    const transcript = Array.from(event.results)
                        .map(result => result[0].transcript)
                        .join('');
                    
                    document.getElementById('voice-command').textContent = transcript;
                    this.processVoiceCommand(transcript);
                };

                this.recognition.onerror = (event) => {
                    console.error('Speech recognition error:', event.error);
                    document.getElementById('voice-status').textContent = `Error: ${event.error}`;
                    this.isListening = false;
                    document.getElementById('mic-btn').classList.remove('listening');
                    document.getElementById('mic-btn').textContent = '🎤 Start Voice Command';
                };
            } else {
                document.getElementById('voice-status').textContent = 'Voice recognition not supported in this browser';
                document.getElementById('mic-btn').disabled = true;
            }
        } catch (err) {
            console.error('Microphone permission denied:', err);
            document.getElementById('voice-status').textContent = 'Microphone access denied';
            document.getElementById('mic-btn').disabled = true;
        }
    }

    processVoiceCommand(command) {
        command = command.toLowerCase().trim();
        
        // Handle reset command
        if (command.includes('reset') || command.includes('new game')) {
            this.resetGame();
            return;
        }

        // Handle castling
        if (command.includes('castle')) {
            let move;
            if (command.includes('kingside') || command.includes('short')) {
                move = this.chess.turn() === 'w' ? 'e1g1' : 'e8g8';
            } else if (command.includes('queenside') || command.includes('long')) {
                move = this.chess.turn() === 'w' ? 'e1c1' : 'e8c8';
            }
            
            if (move && this.chess.move(move)) {
                this.updateUI();
                this.checkGameStatus();
            }
            return;
        }

        // Parse regular moves
        const words = command.split(' ');
        let fromSquare = null;
        let toSquare = null;

        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            if (word === 'from' && i + 1 < words.length) {
                fromSquare = words[i + 1];
            } else if (word === 'to' && i + 1 < words.length) {
                toSquare = words[i + 1];
            }
        }

        if (fromSquare && toSquare) {
            const move = {
                from: fromSquare,
                to: toSquare
            };

            if (this.chess.move(move)) {
                this.updateUI();
                this.checkGameStatus();
            }
        }
    }

    initializeBoard() {
        const chessBoard = document.getElementById('chess-board');
        chessBoard.innerHTML = '';

        for (let rank = 0; rank < 8; rank++) {
            for (let file = 0; file < 8; file++) {
                const square = document.createElement('div');
                square.className = `square ${(rank + file) % 2 === 0 ? 'white' : 'black'}`;
                square.dataset.square = this.getSquareNotation(file, rank);
                chessBoard.appendChild(square);
            }
        }
    }

    getSquareNotation(file, rank) {
        return String.fromCharCode(97 + file) + (8 - rank);
    }

    setupEventListeners() {
        const squares = document.querySelectorAll('.square');
        squares.forEach(square => {
            square.addEventListener('click', () => this.handleSquareClick(square));
        });

        document.getElementById('reset-btn').addEventListener('click', () => this.resetGame());
        
        const micBtn = document.getElementById('mic-btn');
        micBtn.addEventListener('click', async () => {
            if (!this.recognition) {
                await this.setupVoiceRecognition();
            }
            
            if (this.isListening) {
                this.recognition.stop();
            } else if (this.recognition) {
                try {
                    await this.recognition.start();
                } catch (err) {
                    console.error('Error starting recognition:', err);
                    document.getElementById('voice-status').textContent = 'Error starting voice recognition';
                }
            }
        });
    }

    handleSquareClick(square) {
        const squareNotation = square.dataset.square;
        const piece = this.chess.get(squareNotation);

        // If no piece is selected and clicked square has a piece of current turn's color
        if (!this.selectedSquare && piece && piece.color === this.chess.turn()) {
            this.selectSquare(square);
        }
        // If a piece is already selected
        else if (this.selectedSquare) {
            const move = {
                from: this.selectedSquare,
                to: squareNotation
            };

            if (this.validMoves.some(m => m.to === squareNotation)) {
                this.makeMove(move);
            } else if (piece && piece.color === this.chess.turn()) {
                this.selectSquare(square);
            } else {
                this.clearSelection();
            }
        }
    }

    selectSquare(square) {
        this.clearSelection();
        this.selectedSquare = square.dataset.square;
        square.classList.add('selected');

        // Get valid moves for the selected piece
        this.validMoves = this.chess.moves({
            square: this.selectedSquare,
            verbose: true
        });

        // Highlight valid moves
        this.validMoves.forEach(move => {
            const targetSquare = document.querySelector(`[data-square="${move.to}"]`);
            targetSquare.classList.add('valid-move');
        });
    }

    clearSelection() {
        if (this.selectedSquare) {
            document.querySelector(`[data-square="${this.selectedSquare}"]`).classList.remove('selected');
            this.validMoves.forEach(move => {
                document.querySelector(`[data-square="${move.to}"]`).classList.remove('valid-move');
            });
        }
        this.selectedSquare = null;
        this.validMoves = [];
    }

    makeMove(move) {
        this.chess.move(move);
        this.clearSelection();
        this.updateUI();
        this.checkGameStatus();
    }

    updateUI() {
        // Update turn indicator
        document.getElementById('turn-indicator').textContent = `Current Turn: ${this.chess.turn() === 'w' ? 'White' : 'Black'}`;

        // Update pieces on board
        for (let rank = 0; rank < 8; rank++) {
            for (let file = 0; file < 8; file++) {
                const square = document.querySelector(`[data-square="${this.getSquareNotation(file, rank)}"]`);
                const piece = this.chess.get(this.getSquareNotation(file, rank));
                
                // Clear previous piece
                square.innerHTML = '';
                
                if (piece) {
                    const pieceElement = document.createElement('div');
                    pieceElement.className = 'piece';
                    pieceElement.textContent = this.getPieceSymbol(piece);
                    pieceElement.style.color = piece.color === 'w' ? '#fff' : '#000';
                    square.appendChild(pieceElement);
                }
            }
        }
    }

    getPieceSymbol(piece) {
        const symbols = {
            'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚',
            'P': '♙', 'N': '♘', 'B': '♗', 'R': '♖', 'Q': '♕', 'K': '♔'
        };
        return symbols[piece.type.toUpperCase()];
    }

    checkGameStatus() {
        const statusElement = document.getElementById('game-status');
        if (this.chess.isCheckmate()) {
            statusElement.textContent = `Checkmate! ${this.chess.turn() === 'w' ? 'Black' : 'White'} wins!`;
        } else if (this.chess.isDraw()) {
            if (this.chess.isStalemate()) {
                statusElement.textContent = 'Stalemate!';
            } else if (this.chess.isThreefoldRepetition()) {
                statusElement.textContent = 'Draw by threefold repetition!';
            } else if (this.chess.isInsufficientMaterial()) {
                statusElement.textContent = 'Draw due to insufficient material!';
            } else {
                statusElement.textContent = 'Draw!';
            }
        } else if (this.chess.isCheck()) {
            statusElement.textContent = 'Check!';
        } else {
            statusElement.textContent = '';
        }
    }

    resetGame() {
        this.chess.reset();
        this.clearSelection();
        this.updateUI();
        document.getElementById('game-status').textContent = '';
        document.getElementById('voice-command').textContent = '';
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ChessGame();
}); 