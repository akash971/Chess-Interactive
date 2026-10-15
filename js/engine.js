// Embedded Chess AI Engine: Minimax with Alpha-Beta Pruning & Piece-Square Tables
// Supports selectable difficulty: Level 1 Novice, Level 2 Intermediate, Level 3 Club Player

class ChessEngine {
  constructor() {
    this.pieceValues = {
      p: 100,
      n: 320,
      b: 330,
      r: 500,
      q: 900,
      k: 20000
    };

    // Classical Piece-Square Tables (White perspective; flipped for Black)
    this.pawnPST = [
      [  0,  0,  0,  0,  0,  0,  0,  0],
      [ 50, 50, 50, 50, 50, 50, 50, 50],
      [ 10, 10, 20, 30, 30, 20, 10, 10],
      [  5,  5, 10, 25, 25, 10,  5,  5],
      [  0,  0,  0, 20, 20,  0,  0,  0],
      [  5, -5,-10,  0,  0,-10, -5,  5],
      [  5, 10, 10,-20,-20, 10, 10,  5],
      [  0,  0,  0,  0,  0,  0,  0,  0]
    ];

    this.knightPST = [
      [-50,-40,-30,-30,-30,-30,-40,-50],
      [-40,-20,  0,  0,  0,  0,-20,-40],
      [-30,  0, 10, 15, 15, 10,  0,-30],
      [-30,  5, 15, 20, 20, 15,  5,-30],
      [-30,  0, 15, 20, 20, 15,  0,-30],
      [-30,  5, 10, 15, 15, 10,  5,-30],
      [-40,-20,  0,  5,  5,  0,-20,-40],
      [-50,-40,-30,-30,-30,-30,-40,-50]
    ];

    this.bishopPST = [
      [-20,-10,-10,-10,-10,-10,-10,-20],
      [-10,  0,  0,  0,  0,  0,  0,-10],
      [-10,  0,  5, 10, 10,  5,  0,-10],
      [-10,  5,  5, 10, 10,  5,  5,-10],
      [-10,  0, 10, 10, 10, 10,  0,-10],
      [-10, 10, 10, 10, 10, 10, 10,-10],
      [-10,  5,  0,  0,  0,  0,  5,-10],
      [-20,-10,-10,-10,-10,-10,-10,-20]
    ];

    this.rookPST = [
      [  0,  0,  0,  0,  0,  0,  0,  0],
      [  5, 10, 10, 10, 10, 10, 10,  5],
      [ -5,  0,  0,  0,  0,  0,  0, -5],
      [ -5,  0,  0,  0,  0,  0,  0, -5],
      [ -5,  0,  0,  0,  0,  0,  0, -5],
      [ -5,  0,  0,  0,  0,  0,  0, -5],
      [ -5,  0,  0,  0,  0,  0,  0, -5],
      [  0,  0,  0,  5,  5,  0,  0,  0]
    ];

    this.queenPST = [
      [-20,-10,-10, -5, -5,-10,-10,-20],
      [-10,  0,  0,  0,  0,  0,  0,-10],
      [-10,  0,  5,  5,  5,  5,  0,-10],
      [ -5,  0,  5,  5,  5,  5,  0, -5],
      [  0,  0,  5,  5,  5,  5,  0, -5],
      [-10,  5,  5,  5,  5,  5,  0,-10],
      [-10,  0,  5,  0,  0,  0,  0,-10],
      [-20,-10,-10, -5, -5,-10,-10,-20]
    ];

    this.kingMiddlePST = [
      [-30,-40,-40,-50,-50,-40,-40,-30],
      [-30,-40,-40,-50,-50,-40,-40,-30],
      [-30,-40,-40,-50,-50,-40,-40,-30],
      [-30,-40,-40,-50,-50,-40,-40,-30],
      [-20,-30,-30,-40,-40,-30,-20,-20],
      [-10,-20,-20,-20,-20,-20,-20,-10],
      [ 20, 20,  0,  0,  0,  0, 20, 20],
      [ 20, 30, 10,  0,  0, 10, 30, 20]
    ];
  }

  // Evaluates board static value from White's perspective (+ = White, - = Black)
  evaluate(chess) {
    if (chess.in_checkmate()) {
      return chess.turn() === 'w' ? -999999 : 999999;
    }
    if (chess.in_draw() || chess.in_stalemate() || chess.in_threefold_repetition()) {
      return 0;
    }

    let score = 0;
    const board = chess.board();

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (!piece) continue;

        const val = this.pieceValues[piece.type] || 0;
        let posVal = 0;

        const pstRow = piece.color === 'w' ? r : 7 - r;
        const pstCol = c;

        switch (piece.type) {
          case 'p': posVal = this.pawnPST[pstRow][pstCol]; break;
          case 'n': posVal = this.knightPST[pstRow][pstCol]; break;
          case 'b': posVal = this.bishopPST[pstRow][pstCol]; break;
          case 'r': posVal = this.rookPST[pstRow][pstCol]; break;
          case 'q': posVal = this.queenPST[pstRow][pstCol]; break;
          case 'k': posVal = this.kingMiddlePST[pstRow][pstCol]; break;
        }

        const total = val + posVal;
        if (piece.color === 'w') {
          score += total;
        } else {
          score -= total;
        }
      }
    }

    return score;
  }

  // Material evaluation only (in pawns, e.g. +3, -1)
  getMaterialBalance(chess) {
    let whiteMat = 0;
    let blackMat = 0;
    const board = chess.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (!piece || piece.type === 'k') continue;
        const pts = { p: 1, n: 3, b: 3, r: 5, q: 9 }[piece.type] || 0;
        if (piece.color === 'w') whiteMat += pts;
        else blackMat += pts;
      }
    }
    return {
      white: whiteMat,
      black: blackMat,
      diff: whiteMat - blackMat
    };
  }

  // Move ordering: checks, captures (MVV-LVA)
  orderMoves(chess, moves) {
    return moves.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;
      if (a.captured) {
        scoreA += (this.pieceValues[a.captured] || 0) * 10 - (this.pieceValues[a.piece] || 0);
      }
      if (b.captured) {
        scoreB += (this.pieceValues[b.captured] || 0) * 10 - (this.pieceValues[b.piece] || 0);
      }
      if (a.promotion) scoreA += 800;
      if (b.promotion) scoreB += 800;
      if (a.san && a.san.includes('+')) scoreA += 50;
      if (b.san && b.san.includes('+')) scoreB += 50;
      return scoreB - scoreA;
    });
  }

  // Quiescence search to avoid horizon blunder
  quiescence(chess, alpha, beta, isMaximizing, depth = 0) {
    const standPat = this.evaluate(chess);
    if (depth >= 3) return standPat;

    if (isMaximizing) {
      if (standPat >= beta) return beta;
      if (standPat > alpha) alpha = standPat;

      const captureMoves = chess.moves({ verbose: true }).filter(m => m.captured);
      this.orderMoves(chess, captureMoves);

      for (const mv of captureMoves) {
        chess.move(mv);
        const score = this.quiescence(chess, alpha, beta, false, depth + 1);
        chess.undo();
        if (score >= beta) return beta;
        if (score > alpha) alpha = score;
      }
      return alpha;
    } else {
      if (standPat <= alpha) return alpha;
      if (standPat < beta) beta = standPat;

      const captureMoves = chess.moves({ verbose: true }).filter(m => m.captured);
      this.orderMoves(chess, captureMoves);

      for (const mv of captureMoves) {
        chess.move(mv);
        const score = this.quiescence(chess, alpha, beta, true, depth + 1);
        chess.undo();
        if (score <= alpha) return alpha;
        if (score < beta) beta = score;
      }
      return beta;
    }
  }

  // Alpha-Beta Minimax search
  minimax(chess, depth, alpha, beta, isMaximizing) {
    if (depth === 0 || chess.game_over()) {
      return this.quiescence(chess, alpha, beta, isMaximizing);
    }

    const legalMoves = chess.moves({ verbose: true });
    this.orderMoves(chess, legalMoves);

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const mv of legalMoves) {
        chess.move(mv);
        const evaluation = this.minimax(chess, depth - 1, alpha, beta, false);
        chess.undo();
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) break; // Beta cut-off
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const mv of legalMoves) {
        chess.move(mv);
        const evaluation = this.minimax(chess, depth - 1, alpha, beta, true);
        chess.undo();
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) break; // Alpha cut-off
      }
      return minEval;
    }
  }

  // Get best move with selectable difficulty
  findBestMove(chess, difficulty = 2) {
    const isWhite = chess.turn() === 'w';
    const moves = chess.moves({ verbose: true });
    if (moves.length === 0) return null;

    // Difficulty configuration
    // 1: Novice (Depth 1, 20% blunder chance)
    // 2: Intermediate (Depth 2, solid)
    // 3: Club Player (Depth 3 with Quiescence search)
    let depth = 2;
    if (difficulty === 1) depth = 1;
    else if (difficulty === 3) depth = 3;

    // Novice slight randomness: occasionally pick random reasonable move
    if (difficulty === 1 && Math.random() < 0.22 && moves.length > 1) {
      const nonHangingMoves = moves.filter(m => !m.captured);
      const pool = nonHangingMoves.length > 0 ? nonHangingMoves : moves;
      const randomMove = pool[Math.floor(Math.random() * pool.length)];
      return { move: randomMove, score: 0, depth: 1 };
    }

    let bestMove = moves[0];
    let bestValue = isWhite ? -Infinity : Infinity;
    this.orderMoves(chess, moves);

    for (const mv of moves) {
      chess.move(mv);
      const evalValue = this.minimax(chess, depth - 1, -Infinity, Infinity, !isWhite);
      chess.undo();

      if (isWhite) {
        if (evalValue > bestValue) {
          bestValue = evalValue;
          bestMove = mv;
        }
      } else {
        if (evalValue < bestValue) {
          bestValue = evalValue;
          bestMove = mv;
        }
      }
    }

    return {
      move: bestMove,
      score: bestValue,
      depth: depth
    };
  }

  // Async wrapper with natural deliberate think delay
  findBestMoveAsync(chess, difficulty = 2, delayMs = 350) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = this.findBestMove(chess, difficulty);
        resolve(result);
      }, delayMs);
    });
  }
}

window.ChessEngine = new ChessEngine();
