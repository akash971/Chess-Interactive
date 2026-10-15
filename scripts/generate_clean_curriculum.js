const fs = require('fs');
const Chess = require('../js/chess.min.js').Chess;

// Helper to test and create a validated level
function makeLevel(id, tier, tierName, category, title, fen, playerColor, solution, objective, dialogue, hint, hintSquares, explanation, mistakeFeedback) {
  const c = new Chess();
  if (!c.load(fen)) {
    throw new Error(`Level ${id} (${title}): Invalid FEN '${fen}'`);
  }
  if (c.turn() !== playerColor) {
    throw new Error(`Level ${id} (${title}): turn is ${c.turn()} but playerColor is ${playerColor}`);
  }
  const testC = new Chess(fen);
  for (const mv of solution) {
    const res = testC.move(mv, { sloppy: true });
    if (!res) {
      throw new Error(`Level ${id} (${title}): Illegal move '${mv}' in FEN '${testC.fen()}'. Legal moves: ${testC.moves().join(', ')}`);
    }
  }
  return {
    id,
    tier,
    tierName,
    category,
    title,
    fen,
    playerColor,
    solution,
    objective,
    dialogue,
    hint,
    hintSquares,
    explanation,
    mistakeFeedback
  };
}

const levels = [];

// ==========================================
// TIER 1: FUNDAMENTALS (Levels 0 - 20)
// ==========================================
levels.push(makeLevel(
  0, 1, "Tier 1: Fundamentals", "Pawn Mechanics", "The Single Push",
  "8/8/8/8/8/8/4P3/4K2k w - - 0 1", "w", ["e3"],
  "White to move: Push the pawn forward one square to e3.",
  "Welcome to GrandmasterPath! The pawn is the foot soldier of your chess army. Pawns advance straight forward one square at a time.",
  "Click the pawn on e2 and step forward to e3.", ["e2", "e3"],
  "Excellent! The pawn advances straight forward one square. Pawns can never step backwards.",
  "Pawns move forward vertically. Try advancing from e2 to e3."
));

levels.push(makeLevel(
  1, 1, "Tier 1: Fundamentals", "Pawn Mechanics", "The Double Push",
  "8/8/8/8/8/8/4P3/4K2k w - - 0 1", "w", ["e4"],
  "White to move: Leap the pawn forward two squares to e4.",
  "On its very first move from the second rank, a pawn has a superpower: it can jump two squares forward!",
  "Click the pawn on e2 and advance directly to e4.", ["e2", "e4"],
  "Well done! The double push lets you claim central space immediately right from your opening move.",
  "From the starting square on rank 2, your pawn can leap two squares forward to e4."
));

levels.push(makeLevel(
  2, 1, "Tier 1: Fundamentals", "Pawn Mechanics", "Diagonal Capturing",
  "8/8/8/3p4/4P3/8/8/4K2k w - - 0 1", "w", ["exd5"],
  "White to move: Capture the black pawn on d5.",
  "Pawns move straight forward, but they CAPTURE diagonally forward one square! Take Black's d5 pawn.",
  "Your e4 pawn captures diagonally to d5.", ["e4", "d5"],
  "Brilliant! Pawns capture diagonally forward into the enemy's path, removing opposing pieces.",
  "Pawns capture diagonally, not straight ahead. Strike the pawn on d5!"
));

levels.push(makeLevel(
  3, 1, "Tier 1: Fundamentals", "Knight Movement", "The Knight's Leap",
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "w", ["Nf3"],
  "White to move: Leap your kingside knight over your pawns to f3.",
  "The Knight is the only piece on the board that can jump over other pieces! It moves in an 'L' shape: two squares straight and one square to the side.",
  "Move the knight from g1 to f3.", ["g1", "f3"],
  "Terrific! The Knight leaps right over the pawn wall on g2 and controls the vital central squares d4 and e5.",
  "The Knight on g1 moves in an L-shape to f3. Leap over the pawns!"
));

levels.push(makeLevel(
  4, 1, "Tier 1: Fundamentals", "Knight Movement", "Central Knight Outpost",
  "8/8/8/3p4/8/5N2/8/4K2k w - - 0 1", "w", ["Nd4"],
  "White to move: Jump your knight to the active central square d4.",
  "A knight on the rim is dim, but a knight in the center dominates 8 different squares! Move to d4.",
  "Hop the knight from f3 to d4.", ["f3", "d4"],
  "Splendid! In the center (d4), the knight exerts maximum influence and attacks Black's d5 pawn.",
  "Calculate the L-shape from f3: 2 squares left and 1 square up leads directly to d4."
));

levels.push(makeLevel(
  5, 1, "Tier 1: Fundamentals", "Bishop Movement", "The Bishop's Diagonal",
  "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1", "w", ["Bc4"],
  "White to move: Develop the light-squared bishop to c4.",
  "Bishops glide diagonally along uninterrupted lines of the same color. With e4 pushed, your light-squared bishop has an open highway to c4.",
  "Move your bishop on f1 along the light diagonal to c4.", ["f1", "c4"],
  "Perfect! Bc4 points like an arrow right at Black's vulnerable f7 square.",
  "Bishops move diagonally. Slide from f1 along the diagonal to c4."
));

levels.push(makeLevel(
  6, 1, "Tier 1: Fundamentals", "Bishop Movement", "Long-Range Bishop Snipe",
  "8/1p6/8/8/8/5B2/8/4K2k w - - 0 1", "w", ["Bxb7"],
  "White to move: Capture the distant pawn on b7 with your bishop.",
  "Bishops act as long-range snipers. When a diagonal is completely open, a bishop can strike across the entire board!",
  "Strike from f3 all the way up the diagonal to b7.", ["f3", "b7"],
  "Bullseye! The bishop's long-range diagonal power can catch unguarded pieces across the board.",
  "Trace the long dark diagonal from f3 straight to b7."
));

levels.push(makeLevel(
  7, 1, "Tier 1: Fundamentals", "Rook Movement", "Rook Back-Rank Strike",
  "8/8/8/8/8/8/4R3/4K2k w - - 0 1", "w", ["Re8#"],
  "White to move: Deliver checkmate on the 8th rank with your rook.",
  "Rooks move horizontally and vertically as far as the path is open. Penetrate Black's back rank on e8!",
  "Slide your rook straight up the e-file from e2 to e8.", ["e2", "e8"],
  "Checkmate! The rook controls the entire 8th rank, and the black king has no escape square.",
  "Rooks march straight along ranks and files. Push the rook to e8!"
));

levels.push(makeLevel(
  8, 1, "Tier 1: Fundamentals", "Rook Movement", "The Rook Barrier",
  "8/8/8/8/8/2k5/8/R3K3 w - - 0 1", "w", ["Ra3+"],
  "White to move: Check the black king on the 3rd rank with your rook.",
  "Rooks can cut off ranks to trap the opposing king or deliver powerful lateral checks.",
  "Slide your rook on a1 up the a-file to a3.", ["a1", "a3"],
  "Awesome! Checking along the rank forces the black king to retreat further.",
  "Use the rook on a1 to deliver a horizontal check from a3."
));

levels.push(makeLevel(
  9, 1, "Tier 1: Fundamentals", "Queen Movement", "The Queen's Omnipotence",
  "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2", "w", ["Qh5"],
  "White to move: Move your queen aggressively to h5.",
  "The Queen is the most powerful piece on the board! She combines the full powers of both the Rook and the Bishop, moving in any straight line.",
  "Slide your queen on d1 diagonally out to h5.", ["d1", "h5"],
  "Great move! From h5, the Queen creates double pressure on Black's e5 pawn and f7 square.",
  "The Queen moves diagonally from d1 through f3 to h5."
));

levels.push(makeLevel(
  10, 1, "Tier 1: Fundamentals", "Checkmate", "The Scholar's Mate Finish",
  "r1bqkb1r/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4", "w", ["Qxf7#"],
  "White to move: Deliver checkmate on f7 with your queen.",
  "The f7 pawn is Black's Achilles' heel because it is only defended by the King. Supported by your Bishop on c4, deliver the killer blow!",
  "Capture the pawn on f7 with your queen.", ["h5", "f7"],
  "Checkmate! The Queen attacks the King at point-blank range, and the King cannot capture because the Queen is protected by the Bishop on c4.",
  "Capture f7 with your Queen! The King is trapped."
));

levels.push(makeLevel(
  11, 1, "Tier 1: Fundamentals", "King Movement", "The King's Realm",
  "8/8/8/8/8/4K3/8/7k w - - 0 1", "w", ["Ke4"],
  "White to move: Step your king forward into the center on e4.",
  "The King is the most important piece—if he is checkmated, the game ends! The King moves one square at a time in any direction.",
  "Step your king from e3 to e4.", ["e3", "e4"],
  "Solid! In the endgame, the King transforms from a vulnerable leader into a powerful offensive combatant.",
  "The King moves one square in any direction. Step forward to e4."
));

levels.push(makeLevel(
  12, 1, "Tier 1: Fundamentals", "Escaping Check", "Eliminating the Threat",
  "8/8/8/8/8/8/4r3/4K2k w - - 0 1", "w", ["Kxe2"],
  "White to move: Get out of check by capturing the attacker on e2.",
  "When your King is attacked, you are in CHECK. You have 3 ways out: Move the King, Block the check, or Capture the attacker!",
  "Capture the checking rook on e2 with your king.", ["e1", "e2"],
  "Outstanding! Eliminating the checking piece is often the most decisive way to escape check.",
  "Your King on e1 can directly capture the rook on e2!"
));

levels.push(makeLevel(
  13, 1, "Tier 1: Fundamentals", "Checkmate vs Stalemate", "Checkmate, Not Stalemate!",
  "7k/5Q2/6K1/8/8/8/8/8 w - - 0 1", "w", ["Qg7#"],
  "White to move: Deliver checkmate on g7 without accidentally causing stalemate.",
  "STALEMATE happens when the opponent has no legal moves and is NOT in check, resulting in a draw. You must give check to deliver CHECKMATE!",
  "Move the queen to g7 with check and mate.", ["f7", "g7"],
  "Checkmate! The King is under direct attack and has nowhere to run. A fatal mistake would have been moving to e7 or f8 causing a draw.",
  "Deliver checkmate directly on g7 supported by your king on g6."
));

levels.push(makeLevel(
  14, 1, "Tier 1: Fundamentals", "Castling", "Kingside Castling (0-0)",
  "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4", "w", ["O-O"],
  "White to move: Castle kingside (0-0) to safeguard your king.",
  "Castling is the special move where your King jumps two squares toward the corner and the Rook hops over him! It protects the King and activates the Rook.",
  "Move your king on e1 two squares right to g1.", ["e1", "g1"],
  "Superb! Castling tucks your king safely behind three pawns and brings your h1 rook into the center.",
  "Castle kingside by moving the king two squares to g1."
));

levels.push(makeLevel(
  15, 1, "Tier 1: Fundamentals", "Castling", "Queenside Castling (0-0-0)",
  "r3k2r/pppq1ppp/2np1n2/2b1p3/4P3/2NP1N2/PPPBQPPP/R3K2R w KQkq - 0 1", "w", ["O-O-O"],
  "White to move: Castle queenside (0-0-0).",
  "You can also castle on the queenside! The King moves two squares to c1, and the a1 rook jumps to d1.",
  "Move your king on e1 two squares left to c1.", ["e1", "c1"],
  "Brilliant! Queenside castling immediately puts your Rook on the central d-file, ready to attack.",
  "Move your king two squares left from e1 to c1 to castle queenside."
));

levels.push(makeLevel(
  16, 1, "Tier 1: Fundamentals", "Special Rules", "En Passant: In Passing",
  "8/8/8/3Pp3/8/8/8/4K2k w - e6 0 1", "w", ["dxe6"],
  "White to move: Execute the En Passant capture on e6.",
  "En Passant ('in passing'): When Black pushes a pawn 2 squares past your 5th-rank pawn, you can capture it diagonally behind on the very next turn!",
  "Capture diagonally behind to e6 with your d5 pawn.", ["d5", "e6"],
  "Fantastic! En Passant prevents enemy pawns from bypassing your pawn's attack by jumping two squares.",
  "Capture diagonally on e6 as if the black pawn had only moved one square."
));

levels.push(makeLevel(
  17, 1, "Tier 1: Fundamentals", "Pawn Promotion", "Crowning a Queen",
  "8/4P3/8/8/8/8/8/4K2k w - - 0 1", "w", ["e8=Q"],
  "White to move: Push your pawn to e8 and promote to a Queen.",
  "When a pawn marches all the way to the 8th rank, it undergoes PROMOTION! It can transform into a Queen, Rook, Bishop, or Knight.",
  "Push your pawn to e8 and choose the Queen.", ["e7", "e8"],
  "Magnificent! A humble foot soldier has transformed into the most powerful piece in chess.",
  "Advance the pawn from e7 to e8 to promote."
));

levels.push(makeLevel(
  18, 1, "Tier 1: Fundamentals", "Material Values", "Piece Value Math: Knight vs Pawn",
  "8/8/8/3n4/4P3/8/8/4K2k w - - 0 1", "w", ["exd5"],
  "White to move: Capture the 3-point knight with your 1-point pawn.",
  "Piece point values: Pawn = 1, Knight = 3, Bishop = 3, Rook = 5, Queen = 9. Capturing a knight with a pawn is a massive +2 material gain!",
  "Capture the black knight on d5 with your pawn on e4.", ["e4", "d5"],
  "Well calculated! Trading 1 point for 3 points creates an overwhelming material advantage.",
  "Take the black knight on d5 with your e4 pawn."
));

levels.push(makeLevel(
  19, 1, "Tier 1: Fundamentals", "Material Values", "Winning the Exchange",
  "8/8/8/4B3/8/8/8/r3K2k w - - 0 1", "w", ["Bxa1"],
  "White to move: Capture the black rook on a1 with your bishop.",
  "Winning 'the Exchange' means trading a minor piece (Bishop/Knight = 3) for a major piece (Rook = 5), netting +2 points.",
  "Slice down the diagonal from e5 to capture the rook on a1.", ["e5", "a1"],
  "Crisp calculation! You trade a 3-point bishop for a 5-point rook, putting you firmly ahead.",
  "Use your bishop on e5 to capture the black rook on a1."
));

levels.push(makeLevel(
  20, 1, "Tier 1: Fundamentals", "Material Preservation", "Defending the High Value Queen",
  "8/8/8/8/4r3/8/4Q3/4K2k w - - 0 1", "w", ["Qxe4"],
  "White to move: Don't lose your 9-point Queen—capture the hanging rook!",
  "Never trade a 9-point Queen for lesser pieces without justification. Black's rook on e4 is undefended. Take it!",
  "Capture the attacker on e4 with your Queen.", ["e2", "e4"],
  "Outstanding! Instead of fleeing, you eliminated the threat and snatched a free 5-point rook.",
  "The rook on e4 is completely undefended. Capture it with your queen!"
));

// ==========================================
// TIER 2: OPENING PRINCIPLES & BOARD VISION (Levels 21 - 40)
// ==========================================
levels.push(makeLevel(
  21, 2, "Tier 2: Opening Principles", "Center Control", "The Golden Opening Step: 1. e4",
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "w", ["e4"],
  "White to move: Stake your claim on the center with 1. e4.",
  "The battle in the opening is fought over the 4 central squares: e4, d4, e5, d5. 1. e4 stakes a claim and frees your Queen and Bishop.",
  "Push your king's pawn two squares to e4.", ["e2", "e4"],
  "Classical mastery! 1. e4 opens paths for both your light-squared bishop and queen while staking out d5 and f5.",
  "Play 1. e4 to start the game with ideal central control."
));

levels.push(makeLevel(
  22, 2, "Tier 2: Opening Principles", "Center Control", "The Ideal Pawn Duo: 2. d4",
  "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2", "w", ["d4"],
  "White to move: Establish the classical central pawn duo with d4.",
  "Whenever allowed, setting up pawns on e4 and d4 side-by-side provides the ultimate shield and space advantage.",
  "Advance your queen's pawn two squares to d4.", ["d2", "d4"],
  "Powerful! Pawns on e4 and d4 control c5, d5, e5, and f5, suffocating Black's pieces.",
  "Push the d-pawn to d4 to seize complete command of the board."
));

levels.push(makeLevel(
  23, 2, "Tier 2: Opening Principles", "Minor Piece Development", "Knights Before Bishops",
  "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2", "w", ["Nf3"],
  "White to move: Develop your kingside knight to f3.",
  "An ancient chess golden rule: 'Develop knights before bishops.' Knights have fewer natural squares, and f3 attacks Black's e5 pawn with tempo!",
  "Leap your g1 knight to f3.", ["g1", "f3"],
  "Excellent! Nf3 develops a piece, pressures e5, and prepares kingside castling.",
  "Develop the g1 knight to f3 to attack e5."
));

levels.push(makeLevel(
  24, 2, "Tier 2: Opening Principles", "Minor Piece Development", "Active Bishop Scope: Bc4",
  "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3", "w", ["Bc4"],
  "White to move: Place your bishop on the aggressive c4 square.",
  "Don't hide your bishops behind your own pawns. Deploying Bc4 puts immediate pressure on Black's sensitive f7 pawn.",
  "Slide your f1 bishop diagonally to c4.", ["f1", "c4"],
  "Grandmaster standard! Bc4 is the cornerstone of the Italian Game, aiming at f7.",
  "Develop your bishop to c4 along the open diagonal."
));

levels.push(makeLevel(
  25, 2, "Tier 2: Opening Principles", "King Safety", "Castling Within 5 Moves",
  "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 5", "w", ["O-O"],
  "White to move: Safeguard your king by castling kingside.",
  "Never leave your king stranded in the center! The center will open up as pieces clash. Castle early to safety.",
  "Move the king two squares to g1 to castle.", ["e1", "g1"],
  "Superb! Your king is safely tucked away behind the f2-g2-h2 pawn shield.",
  "Castle kingside now: move King from e1 to g1."
));

levels.push(makeLevel(
  26, 2, "Tier 2: Opening Principles", "Opening Efficiency", "Don't Move the Same Piece Twice",
  "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4", "w", ["Nc3"],
  "White to move: Develop your b1 knight to c3 instead of wasting moves.",
  "Every tempo counts! Beginners often waste time moving an already developed piece. Instead, bring your remaining army into play.",
  "Develop your unused knight on b1 to c3.", ["b1", "c3"],
  "Textbook development! All your minor pieces are entering the fray harmoniously.",
  "Bring out your queenside knight to c3."
));

levels.push(makeLevel(
  27, 2, "Tier 2: Opening Principles", "Punishing Inaccuracies", "Punishing Premature Queen Attacks",
  "rnb1kbnr/pppp1ppp/8/4p3/4P2q/8/PPPP1PPP/RNBQKBNR w KQkq - 1 2", "w", ["Nf3"],
  "White to move: Develop your knight to f3 while kicking the queen.",
  "Black brought their queen out on move 2 (Qh4). Punish this! Develop your knight to f3 with tempo, forcing the queen to run.",
  "Move your knight from g1 to f3 to attack the black queen.", ["g1", "f3"],
  "Brilliant! You gain a free developing tempo while Black must waste time retreating their queen.",
  "Attack the intruder on h4 by developing your knight to f3."
));

levels.push(makeLevel(
  28, 2, "Tier 2: Opening Principles", "Threat Defense", "Neutralizing Scholar's Mate",
  "r1bqkb1r/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 4 3", "b", ["g6"],
  "Black to move: Defend against White's Qxf7# checkmate threat with g6.",
  "White is aiming for an immediate Scholar's mate with Qxf7#! Shut down the queen's laser diagonal with g6.",
  "Push your g7 pawn to g6 to block the queen.", ["g7", "g6"],
  "Crushing defense! 3... g6 blocks the queen and attacks her simultaneously, turning the tables.",
  "Push g7 to g6 to shield your king and kick the white queen."
));

levels.push(makeLevel(
  29, 2, "Tier 2: Opening Principles", "Threat Defense", "Repelling the Fried Liver Attack",
  "r1bqkb1r/pppp1ppp/2n2n2/4p1N1/2B1P3/8/PPPP1PPP/RNBQK2R b KQkq - 4 4", "b", ["d5"],
  "Black to move: Counter White's dual attack on f7 with the central strike d5!",
  "White has loaded up both Bishop and Knight on your f7 pawn. Do NOT panic—strike back in the center with 4... d5!",
  "Push your pawn from d7 to d5 to sever the bishop's line.", ["d7", "d5"],
  "Masterclass! 4... d5 cuts the bishop's line of sight to f7 and strikes at White's central foundation.",
  "Block White's bishop diagonal by pushing your pawn to d5!"
));

levels.push(makeLevel(
  30, 2, "Tier 2: Opening Principles", "King Weakness", "Executing Fool's Mate",
  "rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 2", "b", ["Qh4#"],
  "Black to move: Deliver Fool's Mate in 2 moves on h4.",
  "White pushed their f and g pawns recklessly, fatally exposing the e1-h4 diagonal to their King. Punish this blunder immediately!",
  "Swoop in with your queen to h4 for checkmate.", ["d8", "h4"],
  "Checkmate! The shortest possible chess game: 2 moves. Moving the f-pawn early fatally exposes the king.",
  "Fly your queen from d8 diagonally to h4 to deliver mate."
));

levels.push(makeLevel(
  31, 2, "Tier 2: Opening Principles", "Punishing Inaccuracies", "Punishing Damiano's Defense: 3. Nxe5!",
  "rnbqkbnr/pppp2pp/5p2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3", "w", ["Nxe5"],
  "White to move: Shatter Black's position with the classical sacrifice 3. Nxe5!",
  "Black defended their e5 pawn with 2... f6?, fatally exposing their king's diagonal. Strike with 3. Nxe5!",
  "Capture the e5 pawn with your knight on f3.", ["f3", "e5"],
  "Brilliant! If Black plays 3... fxe5, 4. Qh5+ Ke7 5. Qxe5+ wins by force.",
  "Take the e5 pawn with your knight to initiate the crushing attack."
));

levels.push(makeLevel(
  32, 2, "Tier 2: Opening Principles", "Board Vision", "Board Vision: The Hanging Knight",
  "r1bqkb1r/pppp1ppp/8/4n3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1", "w", ["Nxe5"],
  "White to move: Spot and capture the unprotected black knight on e5.",
  "Always ask yourself: 'Which pieces are undefended?' The knight on e5 has zero defenders. Snatch it!",
  "Capture e5 with your f3 knight.", ["f3", "e5"],
  "Clean kill! Unprotected pieces are the #1 cause of tactical losses at all levels.",
  "Take the free knight on e5 with your knight on f3."
));

levels.push(makeLevel(
  33, 2, "Tier 2: Opening Principles", "Board Vision", "Board Vision: The Loose Bishop",
  "r1bqkbnr/pppp1ppp/2n5/8/3b4/5N2/PPPPPPPP/RNBQKB1R w KQkq - 2 3", "w", ["Nxd4"],
  "White to move: Capture Black's hanging bishop on d4.",
  "A loose piece is like a sitting duck. The bishop ventured into d4 with no protection. Eliminate it!",
  "Capture d4 with your knight on f3.", ["f3", "d4"],
  "Great vision! Taking undefended pieces tilts the balance immediately in your favor.",
  "The bishop on d4 is unguarded. Take it with your f3 knight."
));

levels.push(makeLevel(
  34, 2, "Tier 2: Opening Principles", "Solid Development", "Fortifying the Center: d6",
  "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 b kq - 2 5", "b", ["d6"],
  "Black to move: Solidify your center and open your c8 bishop with d6.",
  "Pawn structure provides the backbone of your army. Playing d6 supports e5 and frees your light-squared bishop.",
  "Advance your pawn on d7 one square to d6.", ["d7", "d6"],
  "Solid positional chess! Your central pawns form an impenetrable chain.",
  "Push the d7 pawn to d6 to solidify the center."
));

levels.push(makeLevel(
  35, 2, "Tier 2: Opening Principles", "Center Control", "Preparing the Avalanche: 4. c3",
  "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4", "w", ["c3"],
  "White to move: Play c3 to support a broad central breakthrough on d4.",
  "The Italian Game (Giuoco Piano): White plays 4. c3 to prepare pushing d2-d4 with full pawn support, aiming to conquer the entire center.",
  "Push your c2 pawn forward one square to c3.", ["c2", "c3"],
  "Deep strategy! 4. c3 lays the foundation for an unstoppable central push.",
  "Push the c-pawn to c3 to prepare d4."
));

levels.push(makeLevel(
  36, 2, "Tier 2: Opening Principles", "Central Breaks", "The Central Break: 5. d4!",
  "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R w KQkq - 0 5", "w", ["d4"],
  "White to move: Unleash the prepared central break d4!",
  "Having supported the break with c3, strike hard in the center! Push d4 to attack Black's bishop and claim the center.",
  "Push your d-pawn to d4.", ["d2", "d4"],
  "Devastating! Black's bishop must retreat and White's central superiority is established.",
  "Strike the center with d4!"
));

levels.push(makeLevel(
  37, 2, "Tier 2: Opening Principles", "Strategy", "Punishing Flank Moves: Center Dominance",
  "rnbqkbnr/p1pppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2", "w", ["d4"],
  "White to move: Reply to Black's passive 1... a6 with 2. d4.",
  "When your opponent plays passive flank moves that do not contest the center, punish them by occupying the center fully!",
  "Push your d2 pawn to d4.", ["d2", "d4"],
  "Classic principle! Wing pawns cannot match the power of a dominant pawn center.",
  "Seize the full center with 2. d4."
));

levels.push(makeLevel(
  38, 2, "Tier 2: Opening Principles", "Development", "Connecting the Rooks",
  "r2q1rk1/ppp1bppp/2np1n2/4p3/2B1P1b1/2NPBN2/PPP2PPP/R2Q1RK1 w - - 3 8", "w", ["Qd2"],
  "White to move: Move your queen to d2 to connect your rooks along rank 1.",
  "The final step of the opening is 'connecting the rooks'—clearing the back rank so your rooks communicate and protect each other.",
  "Step your queen from d1 to d2.", ["d1", "d2"],
  "Superb coordination! Your rooks are now unified and ready to seize open files.",
  "Step the queen to d2 to clear the back rank."
));

levels.push(makeLevel(
  39, 2, "Tier 2: Opening Principles", "Board Vision", "Infiltrating the Back Rank",
  "4r1k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1", "w", ["Rd8"],
  "White to move: Pin Black's rook by infiltrating the 8th rank with Rd8.",
  "Notice Black's back rank. When a king has no 'luft' (breathing room), entering the 8th rank creates immediate pins and mate threats.",
  "Advance your rook from d1 to d8.", ["d1", "d8"],
  "Pinning mastery! Black's rook is pinned against their king and cannot escape.",
  "Invade the 8th rank with Rd8."
));

levels.push(makeLevel(
  40, 2, "Tier 2: Opening Principles", "Positional Assessment", "Good Bishop Activity",
  "8/pp2kp2/4p1p1/3pP3/3P4/bP4P1/P4PK1/8 b - - 0 1", "b", ["Bb2"],
  "Black to move: Infiltrate White's camp with Bb2 to target the weak d4 pawn.",
  "A 'good bishop' operates on squares of opposite color to its own pawns. Use your light-squared bishop to attack White's base pawn on d4!",
  "Slide your bishop from a3 down to b2.", ["a3", "b2"],
  "Magnificent positional pressure! The d4 pawn cannot be easily defended.",
  "Infiltrate with Bb2 to attack White's d4 pawn."
));

// ==========================================
// TIER 3: TACTICAL MOTIFS (Levels 41 - 65)
// ==========================================
levels.push(makeLevel(
  41, 3, "Tier 3: Tactical Motifs", "The Fork", "The Royal Knight Fork",
  "r3k2r/ppp2ppp/2n5/3N4/4P3/8/PPP2PPP/R3K2R w KQkq - 0 1", "w", ["Nxc7+"],
  "White to move: Unleash the devastating Knight Fork on c7!",
  "A FORK occurs when a single piece attacks two or more enemy pieces simultaneously. Jump your knight to c7 to check the King and attack the Rook!",
  "Hop your knight from d5 to c7 with check.", ["d5", "c7"],
  "Decisive! The black king must move, leaving the a8 rook ripe for the picking on the next turn.",
  "Hop to c7 to attack both King and Rook at once!"
));

levels.push(makeLevel(
  42, 3, "Tier 3: Tactical Motifs", "The Fork", "The Family Fork: King, Queen & Rook",
  "r1b1k2r/pp1p1ppp/2n1q3/3N4/4P3/8/PPP2PPP/R2QKB1R w KQkq - 0 1", "w", ["Nc7+"],
  "White to move: Play the ultimate 'Family Fork' on c7!",
  "A Family Fork is chess ecstasy! Your knight on d5 can jump into c7, checking the King, skewering the Queen, and eyeing the Rook.",
  "Leap your knight to c7 with check.", ["d5", "c7"],
  "Brutal tactical destruction! Black must move the king, and you capture their queen on e6.",
  "Jump your knight to c7 to fork the entire royal family."
));

levels.push(makeLevel(
  43, 3, "Tier 3: Tactical Motifs", "The Fork", "The Double Pawn Fork",
  "r1bqk2r/ppp2ppp/3b1n2/8/4P3/8/PPP2PPP/RNBQKB1R w KQkq - 0 1", "w", ["e5"],
  "White to move: Push your e-pawn to e5 to fork the knight and bishop!",
  "Pawns make deadly forkers because they are worth so little. Push e5: Black has two minor pieces attacked and can only save one!",
  "Push your e-pawn forward to e5.", ["e4", "e5"],
  "Game over! Black cannot rescue both the knight on f6 and bishop on d6. You win a piece for a pawn.",
  "Push the e-pawn forward to e5 to attack both pieces."
));

levels.push(makeLevel(
  44, 3, "Tier 3: Tactical Motifs", "Double Attack", "The Queen Double Attack",
  "r3k2r/pppn1ppp/8/8/8/8/PPP2PPP/R2QK2R w KQkq - 0 1", "w", ["Qe2+"],
  "White to move: Check the king and double-attack the Nd7 with Qe2+.",
  "Queens excel at double attacks. Step Qe2+: you check the King on e8 while putting direct crossfire on the unprotected knight on d7!",
  "Move your queen to e2 with check.", ["d1", "e2"],
  "Devastating double attack! Black must respond to the check, allowing you to capture the knight on d7.",
  "Deliver check on e2 with your queen."
));

levels.push(makeLevel(
  45, 3, "Tier 3: Tactical Motifs", "The Pin", "The Absolute Pin",
  "r1bqk1nr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3", "w", ["Bb5"],
  "White to move: Play Bb5, absolutely pinning the c6 knight to the black king.",
  "An ABSOLUTE PIN occurs when a piece is pinned against the King. The pinned piece is legally forbidden from moving!",
  "Develop your bishop to b5.", ["f1", "b5"],
  "Masterful! The knight on c6 cannot move an inch because doing so would expose the king to check.",
  "Play Bb5 to execute the Ruy Lopez absolute pin."
));

levels.push(makeLevel(
  46, 3, "Tier 3: Tactical Motifs", "The Pin", "Piling on the Pinned Piece",
  "r1bqk2r/pppp1ppp/2n5/1B6/3PP3/5N2/PP3PPP/RNBQK2R w KQkq - 0 1", "w", ["d5"],
  "White to move: Attack the pinned knight on c6 with d5!",
  "Golden tactical rule: 'PULL PRESSURE ONTO THE PINNED PIECE!' Since the knight on c6 cannot move, push d5 to win it outright.",
  "Push your d4 pawn forward to d5.", ["d4", "d5"],
  "Clinical execution! A pinned piece cannot flee; attacking it with a pawn guarantees winning the piece.",
  "Push d5 to attack the paralyzed knight on c6."
));

levels.push(makeLevel(
  47, 3, "Tier 3: Tactical Motifs", "The Pin", "The Relative Pin",
  "r1bqkb1r/pppp1ppp/2n2n2/4p3/4P3/2NP1N2/PPP2PPP/R1BQKB1R w KQkq - 0 1", "w", ["Bg5"],
  "White to move: Play Bg5, relatively pinning the f6 knight to Black's queen.",
  "A RELATIVE PIN pins a piece to a valuable piece (like the Queen). Moving the piece is legal, but will cause the loss of the queen!",
  "Develop your dark-squared bishop to g5.", ["c1", "g5"],
  "Terrific! If the f6 knight moves, Black loses their queen on d8.",
  "Move your bishop from c1 to g5 to pin the knight to the queen."
));

levels.push(makeLevel(
  48, 3, "Tier 3: Tactical Motifs", "The Skewer", "The Rook Skewer",
  "4k2r/8/8/8/8/8/8/R5K1 w - - 0 1", "w", ["Ra8+"],
  "White to move: Skewer the king and rook with Ra8+.",
  "A SKEWER attacks the King directly; when the King is forced to step aside, the rook behind him is captured!",
  "Slide your rook to a8 to deliver check.", ["a1", "a8"],
  "Devastating skewer! When the king steps away from check, White captures the undefended rook on h8.",
  "Deliver check on a8 with your rook to skewer king and rook."
));

levels.push(makeLevel(
  49, 3, "Tier 3: Tactical Motifs", "The Skewer", "The Bishop Skewer",
  "4r3/8/8/4k3/8/8/8/2B3K1 w - - 0 1", "w", ["Bb2+"],
  "White to move: Deliver a lethal diagonal skewer with Bb2+.",
  "The bishop strikes along the long diagonal! Check the King on e5; when he moves away, capture the rook on e8.",
  "Slide your bishop to b2 to check the king.", ["c1", "b2"],
  "Magnificent skewer! The king is forced off the diagonal, winning the rook for free.",
  "Play Bb2+ to skewer the king and rook."
));

levels.push(makeLevel(
  50, 3, "Tier 3: Tactical Motifs", "Discovered Attack", "The Discovered Attack",
  "r1b1k2r/ppp2ppp/2n5/3q4/3P4/3B1N2/PPP2PPP/R1BQK2R w KQkq - 0 1", "w", ["Bxh7+"],
  "White to move: Unleash a discovered attack on Black's queen with 1. Bxh7+!",
  "A DISCOVERED ATTACK happens when one piece moves, uncovering a devastating threat from a friendly piece behind it!",
  "Sacrifice your bishop on h7 with check to uncover your queen's attack on d5.", ["d3", "h7"],
  "Spectacular! Black must deal with the check on h7, allowing your queen on d1 to capture their queen on d5 next turn.",
  "Play Bxh7+ with check to uncover the attack on Black's queen."
));

levels.push(makeLevel(
  51, 3, "Tier 3: Tactical Motifs", "Discovered Check", "The Lethal Discovered Check",
  "4k3/8/8/4N3/8/8/8/4R1K1 w - - 0 1", "w", ["Nc6+"],
  "White to move: Move your knight to c6 with a discovered check from your rook.",
  "Discovered checks are paralyzing. The piece moving can jump to any square while the king is checked by the piece behind!",
  "Jump your knight to c6 with discovered check.", ["e5", "c6"],
  "Crushing! The black king must react to the rook's check, letting your knight do maximum damage.",
  "Jump your knight to c6 to unleash the discovered check."
));

levels.push(makeLevel(
  52, 3, "Tier 3: Tactical Motifs", "Double Check", "The Unstoppable Double Check",
  "3k4/8/8/8/3N4/8/8/3R2K1 w - - 0 1", "w", ["Ne6+"],
  "White to move: Deliver a double check with Ne6+!",
  "In a DOUBLE CHECK, both pieces attack the King simultaneously. A double check CANNOT be blocked or captured—the King MUST move!",
  "Hop your knight to e6: both knight and rook give check!", ["d4", "e6"],
  "Masterful! Because two pieces give check at once, the opponent can neither block nor capture. The king is forced to run.",
  "Jump to e6 to check with both the knight and the rook."
));

levels.push(makeLevel(
  53, 3, "Tier 3: Tactical Motifs", "Deflection", "Deflecting the Guardian",
  "5rk1/ppp2ppp/8/8/8/8/PP2QPPP/4R1K1 w - - 0 1", "w", ["Qe8"],
  "White to move: Play Qe8! to deflect or pin Black's defending rook.",
  "DEFLECTION forces an enemy piece away from an essential defensive duty. Infiltrate with Qe8: Black's rook is overloaded!",
  "Invade the 8th rank with your queen on e8.", ["e2", "e8"],
  "Brilliant deflection! If Black takes your queen, White's rook delivers back-rank checkmate.",
  "Push your Queen to e8 to break Black's defense."
));

levels.push(makeLevel(
  54, 3, "Tier 3: Tactical Motifs", "Decoy", "The Decoy Sacrifice",
  "r1bqk2r/pppp1ppp/2n5/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 0 1", "w", ["Bxf7+"],
  "White to move: Play the decoy sacrifice Bxf7+ to strip Black's king of castling rights.",
  "A DECOY lures an enemy piece (especially the King) onto a disastrous poisoned square. Sacrifice your bishop on f7!",
  "Capture f7 with your bishop with check.", ["c4", "f7"],
  "Savage decoy! The Black king is dragged out into the open, loses castling rights, and is exposed to devastating follow-up checks.",
  "Sacrifice on f7 with check to drag the king forward."
));

levels.push(makeLevel(
  55, 3, "Tier 3: Tactical Motifs", "Removing the Defender", "Removing the Defender",
  "r2qk2r/ppp2ppp/5n2/3b4/8/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 0 1", "w", ["Nxd5"],
  "White to move: Remove Black's central bishop by capturing on d5.",
  "When an opponent's key piece is insufficiently protected, eliminate or exchange off the piece to claim the advantage!",
  "Capture the bishop on d5 with your c3 knight.", ["c3", "d5"],
  "Clinical calculation! You eliminate Black's active bishop and seize control of the center.",
  "Capture on d5 with your knight."
));

levels.push(makeLevel(
  56, 3, "Tier 3: Tactical Motifs", "Overloaded Pieces", "Exploiting the Overloaded Defender",
  "2r3k1/5ppp/8/8/8/8/1Q3PPP/2R3K1 w - - 0 1", "w", ["Rxc8+"],
  "White to move: Shatter Black's back rank by capturing the overloaded rook on c8.",
  "An OVERLOADED piece is burdened with defending two critical squares at once. It cannot fulfill both duties!",
  "Capture Black's rook on c8 with your rook.", ["c1", "c8"],
  "Total collapse! Black's back rank was overloaded, leading to immediate checkmate.",
  "Take the rook on c8 to deliver checkmate."
));

levels.push(makeLevel(
  57, 3, "Tier 3: Tactical Motifs", "Checkmate Patterns", "The Classic Back-Rank Mate",
  "6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1", "w", ["Re8#"],
  "White to move: Deliver back-rank checkmate on e8.",
  "When an opponent's King is trapped behind their own wall of pawns without an escape square ('luft'), slide your rook to the 8th rank for mate!",
  "Slide your rook straight to e8 for checkmate.", ["e1", "e8"],
  "Checkmate! The pawns on f7, g7, and h7 act as prison bars, sealing the king's fate.",
  "Push your rook to e8 to deliver mate."
));

levels.push(makeLevel(
  58, 3, "Tier 3: Tactical Motifs", "Checkmate Patterns", "The Legendary Smothered Mate",
  "6rk/6pp/7N/8/8/8/8/Q5K1 w - - 0 1", "w", ["Nf7#"],
  "White to move: Deliver the suffocating Smothered Mate with Nf7#!",
  "SMOTHERED MATE is one of the most stunning patterns in chess. The enemy King is completely choked by his own friendly pieces!",
  "Jump your knight to f7 to deliver mate.", ["h6", "f7"],
  "Poetic checkmate! The black king is trapped by his own rook and pawns. The knight leaps in for the kill.",
  "Jump your knight to f7 to checkmate the smothered king."
));

levels.push(makeLevel(
  59, 3, "Tier 3: Tactical Motifs", "Checkmate Patterns", "The Greek Gift Sacrifice",
  "r1bq1rk1/ppp2ppp/2n1pn2/3p4/2PP4/2NBPN2/PP3PPP/R1BQK2R w KQ - 0 1", "w", ["Bxh7+"],
  "White to move: Obliterate Black's castled king with the Greek Gift 1. Bxh7+!",
  "The GREEK GIFT (Bxh7+) is the most famous attacking sacrifice in chess history. Sacrifice your bishop to rip open the opponent's king!",
  "Capture the h7 pawn with your bishop with check.", ["d3", "h7"],
  "Legendary! Black's king shield is destroyed, opening the door for Ng5+ and Qh5 with an unstoppable assault.",
  "Strike on h7 with your bishop to shatter Black's kingside."
));

levels.push(makeLevel(
  60, 3, "Tier 3: Tactical Motifs", "Checkmate Patterns", "Anastasia's Checkmate",
  "5r1k/4N1p1/8/8/8/R7/8/7K w - - 0 1", "w", ["Rh3#"],
  "White to move: Deliver Anastasia's Checkmate with Rh3#!",
  "In ANASTASIA'S MATE, a knight on e7 controls the escape squares g8 and g6, while a rook delivers the coup de grâce on the open h-file!",
  "Slide your rook along the 3rd rank to h3.", ["a3", "h3"],
  "Pure beauty! The Knight walls off g8 and g6, the g7 pawn blocks the King, and the Rook finishes the job.",
  "Slide your rook to h3 to deliver Anastasia's checkmate."
));

levels.push(makeLevel(
  61, 3, "Tier 3: Tactical Motifs", "Checkmate Patterns", "Boden's Criss-Cross Mate",
  "2kr4/1pp2ppp/8/8/8/8/2B5/B3K3 w - - 0 1", "w", ["Bf5+"],
  "White to move: Slice into Black's camp with Bf5+.",
  "BODEN'S MATE features two bishops cutting criss-crossing diagonals against a king trapped by his own pieces.",
  "Check the black king with Bf5+.", ["c2", "f5"],
  "Sensational! The light and dark diagonals work together like razor blades.",
  "Deliver check along the light diagonal with Bf5+."
));

levels.push(makeLevel(
  62, 3, "Tier 3: Tactical Motifs", "Checkmate Patterns", "The Arabian Mate",
  "7k/8/5N2/8/8/8/8/6RK w - - 0 1", "w", ["Rg8#"],
  "White to move: Deliver the historic Arabian Mate with Rg8#!",
  "The ARABIAN MATE is one of the oldest checkmates in chess, documented over 1,200 years ago! The Knight on f6 protects the Rook and covers the escape square h7.",
  "Move your rook on g1 straight up to g8.", ["g1", "g8"],
  "Checkmate! The Rook and Knight cooperate with mathematical perfection in the corner.",
  "Deliver checkmate on g8 with your rook, protected by the knight."
));

levels.push(makeLevel(
  63, 3, "Tier 3: Tactical Motifs", "Masterpieces", "Paul Morphy's Opera Game Mate",
  "4kb1r/3n1ppp/8/1B6/8/8/8/3R2K1 w k - 0 1", "w", ["Rxd7"],
  "White to move: Channel Paul Morphy and capture the pinned knight on d7!",
  "In Paul Morphy's 1858 Opera Game masterpiece, every single piece was deployed with tempo to crush Black's uncastled king.",
  "Capture the paralyzed knight on d7 with your rook.", ["d1", "d7"],
  "Brilliant! The knight on d7 was pinned by the bishop and could not defend itself.",
  "Capture on d7 with your rook."
));

levels.push(makeLevel(
  64, 3, "Tier 3: Tactical Motifs", "Tactical Concepts", "The Clearance Sacrifice",
  "r1b2rk1/ppp2ppp/8/3q4/8/3B4/PPP2PPP/R2Q1RK1 w - - 0 1", "w", ["Bxh7+"],
  "White to move: Play the clearance sacrifice Bxh7+ to win Black's queen!",
  "A CLEARANCE SACRIFICE vacates a square, rank, or diagonal so that a more powerful piece behind can strike with maximum impact.",
  "Sacrifice your bishop on h7 with check.", ["d3", "h7"],
  "Unbelievable tactic! Sacrificing the bishop clears the d-file so your queen snaps up Black's queen on d5.",
  "Play Bxh7+ to clear the d-file for your queen."
));

levels.push(makeLevel(
  65, 3, "Tier 3: Tactical Motifs", "Advanced Tactics", "The Shocking Zwischenzug",
  "r1bqk2r/ppp2ppp/2n5/3P4/1b2n3/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 0 1", "w", ["dxc6"],
  "White to move: Unleash the in-between pawn capture 1. dxc6!",
  "ZWISCHENZUG ('in-between move'): Instead of making the expected passive defensive move, play an unexpected attacking intermediate move that ruins the opponent's calculation!",
  "Capture the black knight on c6 with your d-pawn.", ["d5", "c6"],
  "Masterful! Instead of passively defending against the pin, you counter-attack by capturing their knight on c6.",
  "Capture on c6 with your d5 pawn."
));

// ==========================================
// TIER 4: POSITIONAL & STRATEGIC MASTERY (Levels 66 - 85)
// ==========================================
levels.push(makeLevel(
  66, 4, "Tier 4: Positional Mastery", "Pawn Structure", "Creating a Passed Pawn",
  "8/8/1p6/1P6/8/8/P7/4K2k w - - 0 1", "w", ["a4"],
  "White to move: Push a4 to create an unstoppable passed pawn.",
  "A PASSED PAWN has no opposing pawns in front or on adjacent files to block its march to the 8th rank. As GM Nimzowitsch said: 'A passed pawn is a criminal which should be kept under lock and key!'",
  "Advance your a2 pawn to a4.", ["a2", "a4"],
  "Textbook strategy! Your outside passed pawn will march down the board and force promotion.",
  "Advance the a-pawn to a4 to create your runner."
));

levels.push(makeLevel(
  67, 4, "Tier 4: Positional Mastery", "Pawn Structure", "Rolling Connected Passed Pawns",
  "8/8/8/8/8/2PP4/8/4K2k w - - 0 1", "w", ["d4"],
  "White to move: Advance d4 to set the connected passed pawns in motion.",
  "CONNECTED PASSED PAWNS protect each other as they advance. When rolled forward in tandem, they overpower even enemy rooks!",
  "Advance your d3 pawn to d4.", ["d3", "d4"],
  "Superb technique! Connected passers support one another and restrict enemy pieces.",
  "Push the d-pawn to d4 to start the rolling pawn steamroller."
));

levels.push(makeLevel(
  68, 4, "Tier 4: Positional Mastery", "Pawn Structure", "Targeting Doubled Pawns",
  "r4rk1/pp1b1ppp/4p3/2p1P3/2p5/2P1P3/PP3PPP/R3KB1R w KQ - 0 1", "w", ["Bxc4"],
  "White to move: Capture Black's doubled, isolated c4 pawn with your bishop.",
  "DOUBLED PAWNS cannot protect each other and are prone to being blockaded and captured. Snatch the weak front pawn!",
  "Take the doubled c4 pawn with your bishop on f1.", ["f1", "c4"],
  "Crisp positional play! You eliminate Black's weak structural defect and pocket a clean pawn.",
  "Capture the c4 pawn with your light-squared bishop."
));

levels.push(makeLevel(
  69, 4, "Tier 4: Positional Mastery", "Pawn Structure", "Piling on the Backward Pawn",
  "r2r2k1/pp2bppp/3p1n2/4p3/4P3/2N1B3/PPP2PPP/R2R2K1 w - - 0 1", "w", ["Nd5"],
  "White to move: Occupy the hole in front of Black's backward pawn with Nd5!",
  "A BACKWARD PAWN cannot advance safely and leaves a juicy 'hole' directly in front of it. Plant your knight firmly on d5!",
  "Jump your knight from c3 into the outpost on d5.", ["c3", "d5"],
  "Grandmaster positional masterclass! A knight stationed on an outpost in front of a backward pawn paralyzes the opponent's position.",
  "Plant your knight into the d5 hole."
));

levels.push(makeLevel(
  70, 4, "Tier 4: Positional Mastery", "Pawn Structure", "The Isolated Queen's Pawn Break: d5!",
  "r2q1rk1/pp2bppp/2n1pn2/8/3P4/2N2N2/PP2BPPP/R1BQR1K1 w - - 0 1", "w", ["d5"],
  "White to move: Unleash the thematic IQP dynamic break with 1. d5!",
  "An Isolated Queen's Pawn (IQP) is a dynamic weapon! The player with the IQP must strike with d5 before the opponent can blockade it.",
  "Push your d4 pawn forward to d5.", ["d4", "d5"],
  "Classic Tarrasch/Botvinnik dynamism! The d5 break opens lines for all your attacking pieces.",
  "Shatter Black's blockade with d5!"
));

levels.push(makeLevel(
  71, 4, "Tier 4: Positional Mastery", "Piece Placement", "Seizing the Open File",
  "r2r2k1/pp3ppp/8/8/8/8/PP3PPP/R4RK1 w - - 0 1", "w", ["Rfd1"],
  "White to move: Contest the open d-file with Rfd1.",
  "Rooks belong on open files. When a file has no pawns, rush your rooks there to control the gateway into enemy territory.",
  "Slide your f1 rook to d1.", ["f1", "d1"],
  "Flawless! Controlling the open file is the prerequisite for invading the opponent's back ranks.",
  "Occupy the open d-file with Rfd1."
));

levels.push(makeLevel(
  72, 4, "Tier 4: Positional Mastery", "Piece Placement", "Rook on the 7th Rank",
  "5rk1/pp3ppp/8/8/8/8/PP3PPP/3R2K1 w - - 0 1", "w", ["Rd7"],
  "White to move: Infiltrate Black's 7th rank with Rd7!",
  "A Rook on the 7th rank is a devastating monster! It attacks enemy pawns from the side and traps the enemy king on the back rank.",
  "Invade the 7th rank by moving your rook to d7.", ["d1", "d7"],
  "Dominant! The 7th-rank rook attacks the b7 pawn and paralyzes Black's entire defense.",
  "Invade the 7th rank with Rd7."
));

levels.push(makeLevel(
  73, 4, "Tier 4: Positional Mastery", "Piece Placement", "Pigs on the Seventh: Doubled Rooks",
  "5rk1/pp1R1ppp/8/8/8/8/PP3PPP/4R1K1 w - - 0 1", "w", ["Ree7"],
  "White to move: Double your rooks on the 7th rank with Ree7!",
  "Chess masters lovingly call doubled rooks on the 7th 'Blind Pigs' because they devour everything in sight! Double your rooks on the 7th rank.",
  "Advance your e1 rook up to e7.", ["e1", "e7"],
  "Total devastation! Doubled 7th-rank rooks are almost always completely winning.",
  "Bring your second rook to e7."
));

levels.push(makeLevel(
  74, 4, "Tier 4: Positional Mastery", "Outposts", "The Eternal Knight Outpost",
  "r1b2rk1/pp3ppp/2n1pn2/3p4/3P4/2N2N2/PPP2PPP/R1BQKB1R w KQ - 0 1", "w", ["Ne5"],
  "White to move: Anchor your knight on the dominant e5 outpost.",
  "An OUTPOST is a square on the 4th, 5th, or 6th rank that cannot be attacked by enemy pawns. Plant your knight firmly on e5!",
  "Hop your f3 knight into e5.", ["f3", "e5"],
  "Colossal outpost! Supported by the d4 pawn, the knight on e5 radiates pressure in all directions.",
  "Occupy the e5 outpost with your knight."
));

levels.push(makeLevel(
  75, 4, "Tier 4: Positional Mastery", "Attacking King", "The King Hunt",
  "r1bq1rk1/pppp1ppp/2n5/4p1N1/2B1P3/8/PPPP1PPP/RNBQK2R w KQ - 0 1", "w", ["Qh5"],
  "White to move: Launch the King Hunt with Qh5!",
  "When the enemy king's defensive shield is weakened, coordinate your Queen and minor pieces to deliver relentless threats.",
  "Bring your queen to h5.", ["d1", "h5"],
  "Deadly coordination! White creates unstoppable dual mating threats on f7 and h7.",
  "Deploy your queen to h5."
));

levels.push(makeLevel(
  76, 4, "Tier 4: Positional Mastery", "Prophylaxis", "Prophylaxis: The Art of Prevention",
  "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 1 5", "w", ["h3"],
  "White to move: Play the prophylactic pawn move h3 to stop ...Bg4.",
  "PROPHYLAXIS (championed by Aron Nimzowitsch) is the art of anticipating and preventing your opponent's plans before they happen!",
  "Push your h2 pawn to h3.", ["h2", "h3"],
  "Prophylactic brilliance! By playing h3, you permanently stop Black from pinning your f3 knight with ...Bg4.",
  "Play h3 to prevent Black's annoying bishop pin."
));

levels.push(makeLevel(
  77, 4, "Tier 4: Positional Mastery", "Bishop Pair", "The Bishop Pair in an Open Board",
  "r4rk1/pp3ppp/8/8/8/2B2B2/PPP2PPP/R4RK1 w - - 0 1", "w", ["Bxb7"],
  "White to move: Snipe Black's queenside with Bxb7 using your bishop pair.",
  "The BISHOP PAIR is worth more than the sum of its parts (~0.5 pawn bonus). Slicing across open diagonals, they control both color complexes.",
  "Capture the b7 pawn with your f3 bishop.", ["f3", "b7"],
  "Ruthless execution! The bishop pair slices open Black's camp and captures key pawns.",
  "Capture the b7 pawn with your bishop."
));

levels.push(makeLevel(
  78, 4, "Tier 4: Positional Mastery", "Minor Piece Domination", "Dominant Knight vs Bad Bishop",
  "8/1p1b1k2/p1p1p1p1/P1PpPp1p/1P3P1P/4NKP1/8/8 w - - 0 1", "w", ["Nc2"],
  "White to move: Reroute your knight toward the d6 weakness via Nc2.",
  "When an opponent's pawns are locked on the color of their own bishop, the bishop is 'bad' (blind). Maneuver your agile knight to conquer the board!",
  "Step your knight from e3 to c2.", ["e3", "c2"],
  "Superb rerouting! The knight will travel to a3, b4, or d4 and completely dominate Black's passive bishop.",
  "Reroute your knight toward c2."
));

levels.push(makeLevel(
  79, 4, "Tier 4: Positional Mastery", "Pawn Breaks", "The Kingside Pawn Break: f4!",
  "r1bq1rk1/pp1nbppp/2p1pn2/3p4/3PP3/2NB1N2/PPP2PPP/R1BQ1RK1 w - - 0 1", "w", ["e5"],
  "White to move: Push e5 to seize kingside space and evict Black's knight.",
  "A PAWN BREAK transforms the tension of the game. Push e5 to kick Black's f6 knight and open a devastating kingside attack!",
  "Push your e4 pawn to e5.", ["e4", "e5"],
  "Crushing space advantage! Evicting the knight from f6 leaves Black's king defenseless against future sacrifices.",
  "Push the e4 pawn to e5."
));

levels.push(makeLevel(
  80, 4, "Tier 4: Positional Mastery", "Pawn Levers", "Shattering the Chain: The c5 Lever",
  "r1bq1rk1/pp1n1ppp/2p1pn2/8/2PP4/2PB1N2/P4PPP/R1BQR1K1 w - - 0 1", "w", ["c5"],
  "White to move: Lock Black's queenside and claim space with c5!",
  "A PAWN LEVER challenges the opponent's pawn chain. Advance c5 to secure a queenside bind and clamp down on Black's counterplay.",
  "Push your c4 pawn to c5.", ["c4", "c5"],
  "Masterful clamp! The c5 pawn restricts Black's minor pieces from accessing natural central squares.",
  "Advance the c-pawn to c5."
));

levels.push(makeLevel(
  81, 4, "Tier 4: Positional Mastery", "Space Advantage", "The Space Advantage Squeeze",
  "r2q1rk1/pp1nbppp/2p1pn2/3p4/3PP3/2N2N2/PPP2PPP/R1BQR1K1 w - - 0 1", "w", ["e5"],
  "White to move: Seize massive space with e5, suffocating Black's pieces.",
  "A SPACE ADVANTAGE gives your pieces freedom of movement while cramming the opponent into a cramped defensive bunker. Claim territory with e5!",
  "Advance your pawn to e5.", ["e4", "e5"],
  "Textbook space squeeze! Black is forced into passivity.",
  "Push to e5 to claim territory."
));

levels.push(makeLevel(
  82, 4, "Tier 4: Positional Mastery", "King Centralization", "Endgame King Centralization",
  "8/pp3kpp/8/8/8/4P3/PP3PPP/4K3 w - - 0 1", "w", ["Ke2"],
  "White to move: Centralize your king with Ke2.",
  "In the middlegame, hide your King. In the ENDGAME, activate your King! With queens off the board, march your King directly toward the center.",
  "Step your king forward to e2.", ["e1", "e2"],
  "Essential endgame technique! The king is an active fighting piece that must participate in controlling key squares.",
  "Step your king to e2."
));

levels.push(makeLevel(
  83, 4, "Tier 4: Positional Mastery", "Simplification", "Liquidating into a Won Endgame",
  "r4rk1/5ppp/8/8/8/8/5PPP/R4RK1 w - - 0 1", "w", ["Rxa8"],
  "White to move: Liquidate pieces by capturing the rook on a8.",
  "When ahead in material or entering a favorable pawn structure, SIMPLIFY! Trading off pieces reduces the opponent's counterplay.",
  "Exchange rooks by capturing on a8.", ["a1", "a8"],
  "Crisp liquidation! As Capablanca taught: simplify the position when ahead to secure an effortless victory.",
  "Capture the rook on a8."
));

levels.push(makeLevel(
  84, 4, "Tier 4: Positional Mastery", "Pawn Structure", "The Carlsbad Minority Attack",
  "r1bq1rk1/pp1nbppp/2p1pn2/8/2PP4/2N2N2/PP2BPPP/R1BQ1RK1 w - - 0 1", "w", ["b4"],
  "White to move: Launch the Minority Attack with 1. b4!",
  "THE MINORITY ATTACK: White uses two pawns (a & b) to attack Black's three pawns (a, b, c), creating a permanent isolated or backward pawn weakness on c6!",
  "Advance your b2 pawn two squares to b4.", ["b2", "b4"],
  "Brilliant strategic plan! 1. b4 followed by b5 will shatter Black's queenside pawn structure.",
  "Push the b-pawn to b4 to initiate the attack."
));

levels.push(makeLevel(
  85, 4, "Tier 4: Positional Mastery", "The Blockade", "The Art of the Blockade",
  "8/8/4k3/4p3/8/4KN2/8/8 w - - 0 1", "w", ["Ke4"],
  "White to move: Establish an ironclad blockade on e4 with your King.",
  "BLOCKADE: A passed or isolated pawn must be firmly stopped in its tracks. Station your king directly in front of the pawn on e4!",
  "Step your king to e4 directly in front of the black pawn.", ["e3", "e4"],
  "Impenetrable blockade! The enemy pawn is frozen, and Black has zero winning chances.",
  "Step your king to e4 to blockade the pawn."
));

// ==========================================
// TIER 5: ENDGAME & MASTER TECHNIQUES (Levels 86 - 100)
// ==========================================
levels.push(makeLevel(
  86, 5, "Tier 5: Endgame Mastery", "King & Pawn Endgames", "The Direct Opposition",
  "8/8/8/4k3/8/3K4/8/8 w - - 0 1", "w", ["Ke3"],
  "White to move: Take the direct vertical opposition with Ke3.",
  "OPPOSITION: Placing your King directly opposite the enemy King with one square between them on the same file. The side that just moved holds the opposition!",
  "Move your king to e3 directly facing the black king on e5.", ["d3", "e3"],
  "Masterful! Taking opposition forces the opponent's king to give ground.",
  "Step to e3 to seize the opposition."
));

levels.push(makeLevel(
  87, 5, "Tier 5: Endgame Mastery", "King & Pawn Endgames", "Distant Opposition",
  "8/4k3/8/8/8/8/4K3/8 w - - 0 1", "w", ["Ke3"],
  "White to move: Seize the distant opposition with Ke3.",
  "DISTANT OPPOSITION: Keeping an odd number of squares (3 or 5) between the kings. Step Ke3: you maintain the invisible magnetic connection!",
  "Step your king forward to e3.", ["e2", "e3"],
  "Pure endgame science! By maintaining distant opposition, you guarantee winning the direct opposition when the kings meet.",
  "Step to e3 to maintain the odd-number spacing."
));

levels.push(makeLevel(
  88, 5, "Tier 5: Endgame Mastery", "Endgame Calculation", "The Rule of the Square",
  "8/8/8/8/8/1p6/8/4K2k w - - 0 1", "w", ["Kd2"],
  "White to move: Step into the square of the pawn with Kd2.",
  "THE RULE OF THE SQUARE: Draw a diagonal from the pawn to the promotion rank to visualize a square. If your King can step inside the square, the pawn CANNOT escape!",
  "Step your king to d2 inside the pawn's square.", ["e1", "d2"],
  "Flawless calculation! Your king is inside the square and will catch the pawn before it promotes.",
  "Step to d2 to enter the square of the pawn."
));

levels.push(makeLevel(
  89, 5, "Tier 5: Endgame Mastery", "King Maneuvers", "King Triangulation: Zugzwang",
  "8/8/8/4k3/8/3K4/4P3/8 w - - 0 1", "w", ["e4"],
  "White to move: Push e4 to force Black into Zugzwang.",
  "ZUGZWANG: The German word for 'compulsion to move.' Any move Black makes will worsen their position! Push e4 to force Black's king backward.",
  "Push your e-pawn forward to e4.", ["e2", "e4"],
  "Decisive! Black's king must yield ground, allowing your king to penetrate and win.",
  "Push the e-pawn to e4."
));

levels.push(makeLevel(
  90, 5, "Tier 5: Endgame Mastery", "King Maneuvers", "Shouldering the Enemy King",
  "8/8/8/4k3/8/5K2/6P1/8 w - - 0 1", "w", ["Kg4"],
  "White to move: Shoulder the black king away with Kg4.",
  "SHOULDERING: Using your king's physical body as a wall to block the enemy king from reaching the passed pawn.",
  "Step your king to g4.", ["f3", "g4"],
  "Supreme technique! By shouldering Black's king to the left, your g-pawn has a clear, escorted path to promotion.",
  "Step to g4 to box out Black's king."
));

levels.push(makeLevel(
  91, 5, "Tier 5: Endgame Mastery", "Rook Endgames", "The Lucena Position: Building the Bridge",
  "3K1k2/3P4/8/8/8/8/8/r2R4 w - - 0 1", "w", ["Rd4"],
  "White to move: Play Rd4! to begin building the Lucena Bridge.",
  "THE LUCENA POSITION is the Holy Grail of rook endgames. White builds 'The Bridge' on the 4th rank (Rd4) so the rook can shield the king from vertical checks!",
  "Lift your rook to d4.", ["d1", "d4"],
  "Masterpiece! The rook on the 4th rank prepares to interpose on d4, ensuring the pawn safely promotes to a Queen.",
  "Move your rook to d4 to build the bridge."
));

levels.push(makeLevel(
  92, 5, "Tier 5: Endgame Mastery", "Rook Endgames", "The Philidor Defense: Third Rank Cut",
  "8/8/8/8/8/1r6/4P3/4K2k b - - 0 1", "b", ["Rb6"],
  "Black to move: Cut off the White king along the 6th rank with Rb6!",
  "THE PHILIDOR DEFENSE: In rook + pawn endgames, keep your rook on the 6th rank to prevent the enemy king from advancing. Once the pawn pushes, drop your rook to the back rank to check from behind!",
  "Slide your rook to b6.", ["b3", "b6"],
  "Immortal defense! The 6th-rank barrier guarantees a draw against any player in the world.",
  "Place your rook on b6 to hold the 6th rank."
));

levels.push(makeLevel(
  93, 5, "Tier 5: Endgame Mastery", "Conversion Checkmates", "Checkmate with King & Queen vs King",
  "7k/8/6K1/8/8/8/8/7Q w - - 0 1", "w", ["Qh7#"],
  "White to move: Deliver checkmate with Qh7#.",
  "With King and Queen, box the enemy king to the edge of the board. Bring your king close for support, then deliver checkmate right in the king's face!",
  "Move the queen to h7 right next to the king.", ["h1", "h7"],
  "Checkmate! The Queen delivers point-blank checkmate guarded by the King on g6.",
  "Deliver mate on h7 with your queen."
));

levels.push(makeLevel(
  94, 5, "Tier 5: Endgame Mastery", "Conversion Checkmates", "Checkmate with King & Rook vs King",
  "k7/8/1K6/8/8/8/8/7R w - - 0 1", "w", ["Rh8#"],
  "White to move: Deliver checkmate on the back rank with Rh8#!",
  "With King and Rook, use the King to control the three escape squares on the adjacent rank, then swing your Rook down the back rank for checkmate!",
  "Slide your rook up the h-file to h8.", ["h1", "h8"],
  "Checkmate! The White King controls a7, b7, and c7, leaving the Black King with nowhere to run.",
  "Deliver checkmate on h8 with your rook."
));

levels.push(makeLevel(
  95, 5, "Tier 5: Endgame Mastery", "Conversion Checkmates", "The Two Bishops Checkmate",
  "k7/8/1K6/8/8/8/2B5/B7 w - - 0 1", "w", ["Be4+"],
  "White to move: Check the cornered king with Be4+.",
  "Two bishops operate as a lethal criss-cross scissor! Drive the enemy king into the corner, trap him with one bishop, and deliver the execution with the other.",
  "Check the black king with Be4+.", ["c2", "e4"],
  "Sensational! The light-squared bishop delivers check, forcing Black's king into the fatal corner square a8.",
  "Deliver check along the long diagonal with Be4+."
));

levels.push(makeLevel(
  96, 5, "Tier 5: Endgame Mastery", "Endgame Oddities", "The Wrong Bishop & Rook Pawn",
  "k7/8/K7/8/8/8/1B5P/8 w - - 0 1", "w", ["h4"],
  "White to move: Push your passed h-pawn to h4 toward promotion.",
  "KNOW YOUR ENDGAME THEORY: A rook pawn + bishop is a DRAW if the bishop does not control the promotion square and the defender reaches the corner. Here, push h4 to win!",
  "Advance your h-pawn to h4.", ["h2", "h4"],
  "Well played! Advancing your pawn secures the win.",
  "Push the h-pawn to h4."
));

levels.push(makeLevel(
  97, 5, "Tier 5: Endgame Mastery", "Legendary Studies", "Richard Réti's Endgame Miracle (1921)",
  "7K/8/8/2p4P/8/8/8/k7 w - - 0 1", "w", ["Kg7"],
  "White to move: Play the miraculous study move 1. Kg7!",
  "Richard Réti's 1921 masterpiece is the most celebrated endgame study in history. White appears completely lost, but 1. Kg7 chases BOTH pawns simultaneously via diagonal geometry!",
  "Step your king diagonally toward the center with Kg7.", ["h8", "g7"],
  "PURE GENIUS! From g7, the king simultaneously threatens to assist the h-pawn and intercept the c-pawn, miraculously holding the draw.",
  "Play the legendary study move Kg7!"
));

levels.push(makeLevel(
  98, 5, "Tier 5: Endgame Mastery", "Queen vs Pawn", "Queen vs Pawn on the 7th Rank",
  "8/8/8/8/8/3k4/4p3/4K1Q1 w - - 0 1", "w", ["Qg3+"],
  "White to move: Check Black's king with Qg3+ to force it away from the pawn.",
  "Against a center pawn on the 7th rank, the Queen repeatedly checks the king until forcing the king in front of its own pawn, giving your king time to march up and assist!",
  "Deliver check on g3 with your queen.", ["g1", "g3"],
  "Masterful technique! The Queen's checks systematically strip Black of tempo.",
  "Check on g3 with your queen."
));

levels.push(makeLevel(
  99, 5, "Tier 5: Endgame Mastery", "Master Combinations", "The Immortal Endgame Sacrifice",
  "8/ppp5/8/PPP5/8/8/8/4K2k w - - 0 1", "w", ["b6"],
  "White to move: Unleash the legendary pawn breakthrough 1. b6!!",
  "THE IMMORTAL PAWN BREAKTHROUGH: 1. b6!! sacrifices a pawn to shatter Black's defense. Whether Black takes with axb6 or cxb6, White pushes the opposite pawn to crown a new Queen!",
  "Thrust your middle pawn forward to b6!!", ["b5", "b6"],
  "MAGNIFICENT! 1. b6!! forces a passed pawn through sheer geometric brilliance. One of chess's greatest tactical breakthroughs.",
  "Play the immortal pawn breakthrough b6!!"
));

levels.push(makeLevel(
  100, 5, "Tier 5: Endgame Mastery", "The Grandmaster Trial", "Level 100: The Grandmaster Coronation",
  "2r3k1/1p3ppp/p7/3N4/8/8/PPP2PPP/4R1K1 w - - 0 1", "w", ["Ne7+"],
  "White to move: Deliver the final Grandmaster strike with Ne7+!",
  "CONGRATULATIONS ON REACHING LEVEL 100! You stand at the pinnacle of GrandmasterPath. Deliver the royal knight fork to claim your Grandmaster Title!",
  "Jump your knight into e7 with check.", ["d5", "e7"],
  "GRANDMASTER TITLE EARNED! You have completed all 100 levels of GrandmasterPath. You possess the tactical vision, strategic depth, and endgame precision of a true chess master!",
  "Hop your knight into e7 with check to complete the trial!"
));

console.log(`Generated and validated all ${levels.length} levels!`);
const code = `// GrandmasterPath Curriculum - Levels 0 to 100
// Verified and strictly validated with chess.js
window.CurriculumLevels = ${JSON.stringify(levels, null, 2)};
`;

fs.writeFileSync('js/curriculum.js', code);
console.log('Successfully wrote js/curriculum.js!');
