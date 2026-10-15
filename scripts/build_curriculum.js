const fs = require('fs');
const Chess = require('../js/chess.min.js').Chess;

// 101 Levels: Level 0 through Level 100
const rawLevels = [
  // ==========================================
  // TIER 1: FUNDAMENTALS (Levels 0 - 20)
  // ==========================================
  {
    id: 0,
    tier: 1,
    tierName: "Tier 1: Fundamentals",
    category: "Pawn Mechanics",
    title: "The Single Push",
    fen: "8/8/8/8/8/8/4P3/4K2k w - - 0 1",
    playerColor: "w",
    solution: ["e3"],
    objective: "White to move: Push the pawn forward one square to e3.",
    dialogue: "Welcome to GrandmasterPath! The pawn is the foot soldier of your chess army. Pawns advance straight forward one square at a time.",
    hint: "Click the pawn on e2 and step forward to e3.",
    hintSquares: ["e2", "e3"],
    explanation: "Excellent! The pawn advances straight forward one square. Pawns can never step backwards.",
    mistakeFeedback: "Pawns move forward vertically. Try advancing from e2 to e3."
  },
  {
    id: 1,
    tier: 1,
    tierName: "Tier 1: Fundamentals",
    category: "Pawn Mechanics",
    title: "The Double Push",
    fen: "8/8/8/8/8/8/4P3/4K2k w - - 0 1",
    playerColor: "w",
    solution: ["e4"],
    objective: "White to move: Leap the pawn forward two squares to e4.",
    dialogue: "On its very first move from the second rank, a pawn has a superpower: it can jump two squares forward!",
    hint: "Click the pawn on e2 and advance directly to e4.",
    hintSquares: ["e2", "e4"],
    explanation: "Well done! The double push lets you claim central space immediately right from your opening move.",
    mistakeFeedback: "From the starting square on rank 2, your pawn can leap two squares forward to e4."
  },
  {
    id: 2,
    tier: 1,
    tierName: "Tier 1: Fundamentals",
    category: "Pawn Mechanics",
    title: "Diagonal Capturing",
    fen: "8/8/8/3p4/4P3/8/8/4K2k w - - 0 1",
    playerColor: "w",
    solution: ["exd5"],
    objective: "White to move: Capture the black pawn on d5.",
    dialogue: "Pawns move straight forward, but they CAPTURE diagonally forward one square! Take Black's d5 pawn.",
    hint: "Your e4 pawn captures diagonally to d5.",
    hintSquares: ["e4", "d5"],
    explanation: "Brilliant! Pawns capture diagonally forward into the enemy's path, removing opposing pieces.",
    mistakeFeedback: "Pawns capture diagonally, not straight ahead. Strike the pawn on d5!"
  },
  {
    id: 3,
    tier: 1,
    tierName: "Tier 1: Fundamentals",
    category: "Knight Movement",
    title: "The Knight's Leap",
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    playerColor: "w",
    solution: ["Nf3"],
    objective: "White to move: Leap your kingside knight over your pawns to f3.",
    dialogue: "The Knight is the only piece on the board that can jump over other pieces! It moves in an 'L' shape: two squares straight and one square to the side.",
    hint: "Move the knight from g1 to f3.",
    hintSquares: ["g1", "f3"],
    explanation: "Terrific! The Knight leaps right over the pawn wall on g2 and controls the vital central squares d4 and e5.",
    mistakeFeedback: "The Knight on g1 moves in an L-shape to f3. Leap over the pawns!"
  },
  {
    id: 4,
    tier: 1,
    tierName: "Tier 1: Fundamentals",
    category: "Knight Movement",
    title: "Central Knight Outpost",
    fen: "8/8/8/3p4/8/5N2/8/4K2k w - - 0 1",
    playerColor: "w",
    solution: ["Nd4"],
    objective: "White to move: Jump your knight to the active central square d4.",
    dialogue: "A knight on the rim is dim, but a knight in the center dominates 8 different squares! Move to d4.",
    hint: "Hop the knight from f3 to d4.",
    hintSquares: ["f3", "d4"],
    explanation: "Splendid! In the center (d4), the knight exerts maximum influence and attacks Black's d5 pawn.",
    mistakeFeedback: "Calculate the L-shape from f3: 2 squares left and 1 square up leads directly to d4."
  },
  {
    id: 5,
    tier: 1,
    tierName: "Tier 1: Fundamentals",
    category: "Bishop Movement",
    title: "The Bishop's Diagonal",
    fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1",
    playerColor: "w",
    solution: ["Bc4"],
    objective: "White to move: Develop the light-squared bishop to c4.",
    dialogue: "Bishops glide diagonally along uninterrupted lines of the same color. With e4 pushed, your light-squared bishop has an open highway to c4.",
    hint: "Move your bishop on f1 along the light diagonal to c4.",
    hintSquares: ["f1", "c4"],
    explanation: "Perfect! Bc4 points like an arrow right at Black's vulnerable f7 square.",
    mistakeFeedback: "Bishops move diagonally. Slide from f1 along the diagonal to c4."
  },
  {
    id: 6,
    tier: 1,
    tierName: "Tier 1: Fundamentals",
    category: "Bishop Movement",
    title: "Long-Range Bishop Snipe",
    fen: "8/1p6/8/8/8/5B2/8/4K2k w - - 0 1",
    playerColor: "w",
    solution: ["Bxb7"],
    objective: "White to move: Capture the distant pawn on b7 with your bishop.",
    dialogue: "Bishops act as long-range snipers. When a diagonal is completely open, a bishop can strike across the entire board!",
    hint: "Strike from f3 all the way up the diagonal to b7.",
    hintSquares: ["f3", "b7"],
    explanation: "Bullseye! The bishop's long-range diagonal power can catch unguarded pieces across the board.",
    mistakeFeedback: "Trace the long dark diagonal from f3 straight to b7."
  },
  {
    id: 7,
    tier: 1,
    tierName: "Tier 1: Fundamentals",
    category: "Rook Movement",
    title: "Rook Back-Rank Strike",
    fen: "8/8/8/8/8/8/4R3/4K2k w - - 0 1",
    playerColor: "w",
    solution: ["Re8#"],
    objective: "White to move: Deliver checkmate on the 8th rank with your rook.",
    dialogue: "Rooks move horizontally and vertically as far as the path is open. Penetrate Black's back rank on e8!",
    hint: "Slide your rook straight up the e-file from e2 to e8.",
    hintSquares: ["e2", "e8"],
    explanation: "Checkmate! The rook controls the entire 8th rank, and the black king has no escape square.",
    mistakeFeedback: "Rooks march straight along ranks and files. Push the rook to e8!"
  },
  {
    id: 8,
    tier: 1,
    tierName: "Tier 1: Fundamentals",
    category: "Rook Movement",
    title: "The Rook Barrier",
    fen: "8/8/8/8/8/2k5/8/R3K3 w - - 0 1",
    playerColor: "w",
    solution: ["Ra3+"],
    objective: "White to move: Check the black king on the 3rd rank with your rook.",
    dialogue: "Rooks can cut off ranks to trap the opposing king or deliver powerful lateral checks.",
    hint: "Slide your rook on a1 up the a-file to a3.",
    hintSquares: ["a1", "a3"],
    explanation: "Awesome! Checking along the rank forces the black king to retreat further.",
    mistakeFeedback: "Use the rook on a1 to deliver a horizontal check from a3."
  },
  {
    id: 9,
    tier: 1,
    tierName: "Tier 1: Fundamentals",
    category: "Queen Movement",
    title: "The Queen's Omnipotence",
    fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
    playerColor: "w",
    solution: ["Qh5"],
    objective: "White to move: Move your queen aggressively to h5.",
    dialogue: "The Queen is the most powerful piece on the board! She combines the full powers of both the Rook and the Bishop, moving in any straight line.",
    hint: "Slide your queen on d1 diagonally out to h5.",
    hintSquares: ["d1", "h5"],
    explanation: "Great move! From h5, the Queen creates double pressure on Black's e5 pawn and f7 square.",
    mistakeFeedback: "The Queen moves diagonally from d1 through f3 to h5."
  },
  {
    id: 10,
    tier: 1,
    tierName: "Tier 1: Fundamentals",
    category: "Checkmate",
    title: "The Scholar's Mate Finish",
    fen: "r1bqkb1r/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4",
    playerColor: "w",
    solution: ["Qxf7#"],
    objective: "White to move: Deliver checkmate on f7 with your queen.",
    dialogue: "The f7 pawn is Black's Achilles' heel because it is only defended by the King. Supported by your Bishop on c4, deliver the killer blow!",
    hint: "Capture the pawn on f7 with your queen.",
    hintSquares: ["h5", "f7"],
    explanation: "Checkmate! The Queen attacks the King at point-blank range, and the King cannot capture because the Queen is protected by the Bishop on c4.",
    mistakeFeedback: "Capture f7 with your Queen! The King is trapped."
  },
  {
    id: 11,
    tier: 1,
    tierName: "Tier 1: Fundamentals",
    category: "King Movement",
    title: "The King's Realm",
    fen: "8/8/8/8/8/4K3/8/7k w - - 0 1",
    playerColor: "w",
    solution: ["Ke4"],
    objective: "White to move: Step your king forward into the center on e4.",
    dialogue: "The King is the most important piece—if he is checkmated, the game ends! The King moves one square at a time in any direction.",
    hint: "Step your king from e3 to e4.",
    hintSquares: ["e3", "e4"],
    explanation: "Solid! In the endgame, the King transforms from a vulnerable leader into a powerful offensive combatant.",
    mistakeFeedback: "The King moves one square in any direction. Step forward to e4."
  },
  {
    id: 12,
    tier: 1,
    tierName: "Tier 1: Fundamentals",
    category: "Escaping Check",
    title: "Eliminating the Threat",
    fen: "8/8/8/8/8/8/4r3/4K2k w - - 0 1",
    playerColor: "w",
    solution: ["Kxe2"],
    objective: "White to move: Get out of check by capturing the attacker on e2.",
    dialogue: "When your King is attacked, you are in CHECK. You have 3 ways out: Move the King, Block the check, or Capture the attacker!",
    hint: "Capture the checking rook on e2 with your king.",
    hintSquares: ["e1", "e2"],
    explanation: "Outstanding! Eliminating the checking piece is often the most decisive way to escape check.",
    mistakeFeedback: "Your King on e1 can directly capture the rook on e2!"
  },
  {
    id: 13,
    tier: 1,
    tierName: "Tier 1: Fundamentals",
    category: "Checkmate vs Stalemate",
    title: "Checkmate, Not Stalemate!",
    fen: "7k/5Q2/6K1/8/8/8/8/8 w - - 0 1",
    playerColor: "w",
    solution: ["Qg7#"],
    objective: "White to move: Deliver checkmate on g7 without accidentally causing stalemate.",
    dialogue: "STALEMATE happens when the opponent has no legal moves and is NOT in check, resulting in a draw. You must give check to deliver CHECKMATE!",
    hint: "Move the queen to g7 with check and mate.",
    hintSquares: ["f7", "g7"],
    explanation: "Checkmate! The King is under direct attack and has nowhere to run. A fatal mistake would have been moving to e7 or f8 causing a draw.",
    mistakeFeedback: "Deliver checkmate directly on g7 supported by your king on g6."
  },
  {
    id: 14,
    tier: 1,
    tierName: "Tier 1: Fundamentals",
    category: "Castling",
    title: "Kingside Castling (0-0)",
    fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
    playerColor: "w",
    solution: ["O-O"],
    objective: "White to move: Castle kingside (0-0) to safeguard your king.",
    dialogue: "Castling is the special move where your King jumps two squares toward the corner and the Rook hops over him! It protects the King and activates the Rook.",
    hint: "Move your king on e1 two squares right to g1.",
    hintSquares: ["e1", "g1"],
    explanation: "Superb! Castling tucks your king safely behind three pawns and brings your h1 rook into the center.",
    mistakeFeedback: "Castle kingside by moving the king two squares to g1."
  },
  {
    id: 15,
    tier: 1,
    tierName: "Tier 1: Fundamentals",
    category: "Castling",
    title: "Queenside Castling (0-0-0)",
    fen: "r3k2r/pppq1ppp/2np1n2/2b1p3/4P3/2NP1N2/PPPBQPPP/R3K2R w KQkq - 0 1",
    playerColor: "w",
    solution: ["O-O-O"],
    objective: "White to move: Castle queenside (0-0-0).",
    dialogue: "You can also castle on the queenside! The King moves two squares to c1, and the a1 rook jumps to d1.",
    hint: "Move your king on e1 two squares left to c1.",
    hintSquares: ["e1", "c1"],
    explanation: "Brilliant! Queenside castling immediately puts your Rook on the central d-file, ready to attack.",
    mistakeFeedback: "Move your king two squares left from e1 to c1 to castle queenside."
  },
  {
    id: 16,
    tier: 1,
    tierName: "Tier 1: Fundamentals",
    category: "Special Rules",
    title: "En Passant: In Passing",
    fen: "8/8/8/3Pp3/8/8/8/4K2k w - e6 0 1",
    playerColor: "w",
    solution: ["dxe6"],
    objective: "White to move: Execute the En Passant capture on e6.",
    dialogue: "En Passant ('in passing'): When Black pushes a pawn 2 squares past your 5th-rank pawn, you can capture it diagonally behind on the very next turn!",
    hint: "Capture diagonally behind to e6 with your d5 pawn.",
    hintSquares: ["d5", "e6"],
    explanation: "Fantastic! En Passant prevents enemy pawns from bypassing your pawn's attack by jumping two squares.",
    mistakeFeedback: "Capture diagonally on e6 as if the black pawn had only moved one square."
  },
  {
    id: 17,
    tier: 1,
    tierName: "Tier 1: Fundamentals",
    category: "Pawn Promotion",
    title: "Crowning a Queen",
    fen: "8/4P3/8/8/8/8/8/4K2k w - - 0 1",
    playerColor: "w",
    solution: ["e8=Q"],
    objective: "White to move: Push your pawn to e8 and promote to a Queen.",
    dialogue: "When a pawn marches all the way to the 8th rank, it undergoes PROMOTION! It can transform into a Queen, Rook, Bishop, or Knight.",
    hint: "Push your pawn to e8 and choose the Queen.",
    hintSquares: ["e7", "e8"],
    explanation: "Magnificent! A humble foot soldier has transformed into the most powerful piece in chess.",
    mistakeFeedback: "Advance the pawn from e7 to e8 to promote."
  },
  {
    id: 18,
    tier: 1,
    tierName: "Tier 1: Fundamentals",
    category: "Material Values",
    title: "Piece Value Math: Knight vs Pawn",
    fen: "8/8/8/3n4/4P3/8/8/4K2k w - - 0 1",
    playerColor: "w",
    solution: ["exd5"],
    objective: "White to move: Capture the 3-point knight with your 1-point pawn.",
    dialogue: "Piece point values: Pawn = 1, Knight = 3, Bishop = 3, Rook = 5, Queen = 9. Capturing a knight with a pawn is a massive +2 material gain!",
    hint: "Capture the black knight on d5 with your pawn on e4.",
    hintSquares: ["e4", "d5"],
    explanation: "Well calculated! Trading 1 point for 3 points creates an overwhelming material advantage.",
    mistakeFeedback: "Take the black knight on d5 with your e4 pawn."
  },
  {
    id: 19,
    tier: 1,
    tierName: "Tier 1: Fundamentals",
    category: "Material Values",
    title: "Winning the Exchange",
    fen: "8/8/8/4B3/8/8/8/r3K2k w - - 0 1",
    playerColor: "w",
    solution: ["Bxa1"],
    objective: "White to move: Capture the black rook on a1 with your bishop.",
    dialogue: "Winning 'the Exchange' means trading a minor piece (Bishop/Knight = 3) for a major piece (Rook = 5), netting +2 points.",
    hint: "Slice down the diagonal from e5 to capture the rook on a1.",
    hintSquares: ["e5", "a1"],
    explanation: "Crisp calculation! You trade a 3-point bishop for a 5-point rook, putting you firmly ahead.",
    mistakeFeedback: "Use your bishop on e5 to capture the black rook on a1."
  },
  {
    id: 20,
    tier: 1,
    tierName: "Tier 1: Fundamentals",
    category: "Material Preservation",
    title: "Defending the High Value Queen",
    fen: "8/8/8/8/4r3/8/4Q3/4K2k w - - 0 1",
    playerColor: "w",
    solution: ["Qxe4"],
    objective: "White to move: Don't lose your 9-point Queen—capture the hanging rook!",
    dialogue: "Never trade a 9-point Queen for lesser pieces without justification. Black's rook on e4 is undefended. Take it!",
    hint: "Capture the attacker on e4 with your Queen.",
    hintSquares: ["e2", "e4"],
    explanation: "Outstanding! Instead of fleeing, you eliminated the threat and snatched a free 5-point rook.",
    mistakeFeedback: "The rook on e4 is completely undefended. Capture it with your queen!"
  },

  // ==========================================
  // TIER 2: OPENING PRINCIPLES & BOARD VISION (Levels 21 - 40)
  // ==========================================
  {
    id: 21,
    tier: 2,
    tierName: "Tier 2: Opening Principles",
    category: "Center Control",
    title: "The Golden Opening Step: 1. e4",
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    playerColor: "w",
    solution: ["e4"],
    objective: "White to move: Stake your claim on the center with 1. e4.",
    dialogue: "The battle in the opening is fought over the 4 central squares: e4, d4, e5, d5. 1. e4 stakes a claim and frees your Queen and Bishop.",
    hint: "Push your king's pawn two squares to e4.",
    hintSquares: ["e2", "e4"],
    explanation: "Classical mastery! 1. e4 opens paths for both your light-squared bishop and queen while staking out d5 and f5.",
    mistakeFeedback: "Play 1. e4 to start the game with ideal central control."
  },
  {
    id: 22,
    tier: 2,
    tierName: "Tier 2: Opening Principles",
    category: "Center Control",
    title: "The Ideal Pawn Duo: 2. d4",
    fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
    playerColor: "w",
    solution: ["d4"],
    objective: "White to move: Establish the classical central pawn duo with d4.",
    dialogue: "Whenever allowed, setting up pawns on e4 and d4 side-by-side provides the ultimate shield and space advantage.",
    hint: "Advance your queen's pawn two squares to d4.",
    hintSquares: ["d2", "d4"],
    explanation: "Powerful! Pawns on e4 and d4 control c5, d5, e5, and f5, suffocating Black's pieces.",
    mistakeFeedback: "Push the d-pawn to d4 to seize complete command of the board."
  },
  {
    id: 23,
    tier: 2,
    tierName: "Tier 2: Opening Principles",
    category: "Minor Piece Development",
    title: "Knights Before Bishops",
    fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
    playerColor: "w",
    solution: ["Nf3"],
    objective: "White to move: Develop your kingside knight to f3.",
    dialogue: "An ancient chess golden rule: 'Develop knights before bishops.' Knights have fewer natural squares, and f3 attacks Black's e5 pawn with tempo!",
    hint: "Leap your g1 knight to f3.",
    hintSquares: ["g1", "f3"],
    explanation: "Excellent! Nf3 develops a piece, pressures e5, and prepares kingside castling.",
    mistakeFeedback: "Develop the g1 knight to f3 to attack e5."
  },
  {
    id: 24,
    tier: 2,
    tierName: "Tier 2: Opening Principles",
    category: "Minor Piece Development",
    title: "Active Bishop Scope: Bc4",
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
    playerColor: "w",
    solution: ["Bc4"],
    objective: "White to move: Place your bishop on the aggressive c4 square.",
    dialogue: "Don't hide your bishops behind your own pawns. Deploying Bc4 puts immediate pressure on Black's sensitive f7 pawn.",
    hint: "Slide your f1 bishop diagonally to c4.",
    hintSquares: ["f1", "c4"],
    explanation: "Grandmaster standard! Bc4 is the cornerstone of the Italian Game, aiming at f7.",
    mistakeFeedback: "Develop your bishop to c4 along the open diagonal."
  },
  {
    id: 25,
    tier: 2,
    tierName: "Tier 2: Opening Principles",
    category: "King Safety",
    title: "Castling Within 5 Moves",
    fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 5",
    playerColor: "w",
    solution: ["O-O"],
    objective: "White to move: Safeguard your king by castling kingside.",
    dialogue: "Never leave your king stranded in the center! The center will open up as pieces clash. Castle early to safety.",
    hint: "Move the king two squares to g1 to castle.",
    hintSquares: ["e1", "g1"],
    explanation: "Superb! Your king is safely tucked away behind the f2-g2-h2 pawn shield.",
    mistakeFeedback: "Castle kingside now: move King from e1 to g1."
  },
  {
    id: 26,
    tier: 2,
    tierName: "Tier 2: Opening Principles",
    category: "Opening Efficiency",
    title: "Don't Move the Same Piece Twice",
    fen: "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
    playerColor: "w",
    solution: ["Nc3"],
    objective: "White to move: Develop your b1 knight to c3 instead of wasting moves.",
    dialogue: "Every tempo counts! Beginners often waste time moving an already developed piece. Instead, bring your remaining army into play.",
    hint: "Develop your unused knight on b1 to c3.",
    hintSquares: ["b1", "c3"],
    explanation: "Textbook development! All your minor pieces are entering the fray harmoniously.",
    mistakeFeedback: "Bring out your queenside knight to c3."
  },
  {
    id: 27,
    tier: 2,
    tierName: "Tier 2: Opening Principles",
    category: "Punishing Inaccuracies",
    title: "Punishing Premature Queen Attacks",
    fen: "rnb1kbnr/pppp1ppp/8/4p3/4P2q/8/PPPP1PPP/RNBQKBNR w KQkq - 1 2",
    playerColor: "w",
    solution: ["Nf3"],
    objective: "White to move: Develop your knight to f3 while kicking the queen.",
    dialogue: "Black brought their queen out on move 2 (Qh4). Punish this! Develop your knight to f3 with tempo, forcing the queen to run.",
    hint: "Move your knight from g1 to f3 to attack the black queen.",
    hintSquares: ["g1", "f3"],
    explanation: "Brilliant! You gain a free developing tempo while Black must waste time retreating their queen.",
    mistakeFeedback: "Attack the intruder on h4 by developing your knight to f3."
  },
  {
    id: 28,
    tier: 2,
    tierName: "Tier 2: Opening Principles",
    category: "Threat Defense",
    title: "Neutralizing Scholar's Mate",
    fen: "r1bqkb1r/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 4 3",
    playerColor: "b",
    solution: ["g6"],
    objective: "Black to move: Defend against White's Qxf7# checkmate threat with g6.",
    dialogue: "White is aiming for an immediate Scholar's mate with Qxf7#! Shut down the queen's laser diagonal with g6.",
    hint: "Push your g7 pawn to g6 to block the queen.",
    hintSquares: ["g7", "g6"],
    explanation: "Crushing defense! 3... g6 blocks the queen and attacks her simultaneously, turning the tables.",
    mistakeFeedback: "Push g7 to g6 to shield your king and kick the white queen."
  },
  {
    id: 29,
    tier: 2,
    tierName: "Tier 2: Opening Principles",
    category: "Threat Defense",
    title: "Repelling the Fried Liver Attack",
    fen: "r1bqkb1r/pppp1ppp/2n2n2/4p1N1/2B1P3/8/PPPP1PPP/RNBQK2R b KQkq - 4 4",
    playerColor: "b",
    solution: ["d5"],
    objective: "Black to move: Counter White's dual attack on f7 with the central strike d5!",
    dialogue: "White has loaded up both Bishop and Knight on your f7 pawn. Do NOT panic—strike back in the center with 4... d5!",
    hint: "Push your pawn from d7 to d5 to sever the bishop's line.",
    hintSquares: ["d7", "d5"],
    explanation: "Masterclass! 4... d5 cuts the bishop's line of sight to f7 and strikes at White's central foundation.",
    mistakeFeedback: "Block White's bishop diagonal by pushing your pawn to d5!"
  },
  {
    id: 30,
    tier: 2,
    tierName: "Tier 2: Opening Principles",
    category: "King Weakness",
    title: "Executing Fool's Mate",
    fen: "rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 2",
    playerColor: "b",
    solution: ["Qh4#"],
    objective: "Black to move: Deliver Fool's Mate in 2 moves on h4.",
    dialogue: "White pushed their f and g pawns recklessly, fatally exposing the e1-h4 diagonal to their King. Punish this blunder immediately!",
    hint: "Swoop in with your queen to h4 for checkmate.",
    hintSquares: ["d8", "h4"],
    explanation: "Checkmate! The shortest possible chess game: 2 moves. Moving the f-pawn early fatally exposes the king.",
    mistakeFeedback: "Fly your queen from d8 diagonally to h4 to deliver mate."
  },
  {
    id: 31,
    tier: 2,
    tierName: "Tier 2: Opening Principles",
    category: "Punishing Inaccuracies",
    title: "Punishing Damiano's Defense: 3. Nxe5!",
    fen: "rnbqkbnr/pppp2pp/5p2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3",
    playerColor: "w",
    solution: ["Nxe5"],
    objective: "White to move: Shatter Black's position with the classical sacrifice 3. Nxe5!",
    dialogue: "Black defended their e5 pawn with 2... f6?, fatally exposing their king's diagonal. Strike with 3. Nxe5!",
    hint: "Capture the e5 pawn with your knight on f3.",
    hintSquares: ["f3", "e5"],
    explanation: "Brilliant! If Black plays 3... fxe5, 4. Qh5+ Ke7 5. Qxe5+ wins by force.",
    mistakeFeedback: "Take the e5 pawn with your knight to initiate the crushing attack."
  },
  {
    id: 32,
    tier: 2,
    tierName: "Tier 2: Opening Principles",
    category: "Board Vision",
    title: "Board Vision: The Hanging Knight",
    fen: "r1bqkb1r/pppp1ppp/8/4n3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1",
    playerColor: "w",
    solution: ["Nxe5"],
    objective: "White to move: Spot and capture the unprotected black knight on e5.",
    dialogue: "Always ask yourself: 'Which pieces are undefended?' The knight on e5 has zero defenders. Snatch it!",
    hint: "Capture e5 with your f3 knight.",
    hintSquares: ["f3", "e5"],
    explanation: "Clean kill! Unprotected pieces are the #1 cause of tactical losses at all levels.",
    mistakeFeedback: "Take the free knight on e5 with your knight on f3."
  },
  {
    id: 33,
    tier: 2,
    tierName: "Tier 2: Opening Principles",
    category: "Board Vision",
    title: "Board Vision: The Loose Bishop",
    fen: "r1bqkbnr/pppp1ppp/2n5/8/3b4/5N2/PPPPPPPP/RNBQKB1R w KQkq - 2 3",
    playerColor: "w",
    solution: ["Nxd4"],
    objective: "White to move: Capture Black's hanging bishop on d4.",
    dialogue: "A loose piece is like a sitting duck. The bishop ventured into d4 with no protection. Eliminate it!",
    hint: "Capture d4 with your knight on f3.",
    hintSquares: ["f3", "d4"],
    explanation: "Great vision! Taking undefended pieces tilts the balance immediately in your favor.",
    mistakeFeedback: "The bishop on d4 is unguarded. Take it with your f3 knight."
  },
  {
    id: 34,
    tier: 2,
    tierName: "Tier 2: Opening Principles",
    category: "Solid Development",
    title: "Fortifying the Center: d6",
    fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 b kq - 2 5",
    playerColor: "b",
    solution: ["d6"],
    objective: "Black to move: Solidify your center and open your c8 bishop with d6.",
    dialogue: "Pawn structure provides the backbone of your army. Playing d6 supports e5 and frees your light-squared bishop.",
    hint: "Advance your pawn on d7 one square to d6.",
    hintSquares: ["d7", "d6"],
    explanation: "Solid positional chess! Your central pawns form an impenetrable chain.",
    mistakeFeedback: "Push the d7 pawn to d6 to solidify the center."
  },
  {
    id: 35,
    tier: 2,
    tierName: "Tier 2: Opening Principles",
    category: "Center Control",
    title: "Preparing the Avalanche: 4. c3",
    fen: "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
    playerColor: "w",
    solution: ["c3"],
    objective: "White to move: Play c3 to support a broad central breakthrough on d4.",
    dialogue: "The Italian Game (Giuoco Piano): White plays 4. c3 to prepare pushing d2-d4 with full pawn support, aiming to conquer the entire center.",
    hint: "Push your c2 pawn forward one square to c3.",
    hintSquares: ["c2", "c3"],
    explanation: "Deep strategy! 4. c3 lays the foundation for an unstoppable central push.",
    mistakeFeedback: "Push the c-pawn to c3 to prepare d4."
  },
  {
    id: 36,
    tier: 2,
    tierName: "Tier 2: Opening Principles",
    category: "Central Breaks",
    title: "The Central Break: 5. d4!",
    fen: "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R w KQkq - 0 5",
    playerColor: "w",
    solution: ["d4"],
    objective: "White to move: Unleash the prepared central break d4!",
    dialogue: "Having supported the break with c3, strike hard in the center! Push d4 to attack Black's bishop and claim the center.",
    hint: "Push your d-pawn to d4.",
    hintSquares: ["d2", "d4"],
    explanation: "Devastating! Black's bishop must retreat and White's central superiority is established.",
    mistakeFeedback: "Strike the center with d4!"
  },
  {
    id: 37,
    tier: 2,
    tierName: "Tier 2: Opening Principles",
    category: "Strategy",
    title: "Punishing Flank Moves: Center Dominance",
    fen: "rnbqkbnr/p1pppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
    playerColor: "w",
    solution: ["d4"],
    objective: "White to move: Reply to Black's passive 1... a6 with 2. d4.",
    dialogue: "When your opponent plays passive flank moves that do not contest the center, punish them by occupying the center fully!",
    hint: "Push your d2 pawn to d4.",
    hintSquares: ["d2", "d4"],
    explanation: "Classic principle! Wing pawns cannot match the power of a dominant pawn center.",
    mistakeFeedback: "Seize the full center with 2. d4."
  },
  {
    id: 38,
    tier: 2,
    tierName: "Tier 2: Opening Principles",
    category: "Development",
    title: "Connecting the Rooks",
    fen: "r2q1rk1/ppp1bppp/2np1n2/4p3/2B1P1b1/2NPBN2/PPP2PPP/R2Q1RK1 w - - 3 8",
    playerColor: "w",
    solution: ["Qd2"],
    objective: "White to move: Move your queen to d2 to connect your rooks along rank 1.",
    dialogue: "The final step of the opening is 'connecting the rooks'—clearing the back rank so your rooks communicate and protect each other.",
    hint: "Step your queen from d1 to d2.",
    hintSquares: ["d1", "d2"],
    explanation: "Superb coordination! Your rooks are now unified and ready to seize open files.",
    mistakeFeedback: "Step the queen to d2 to clear the back rank."
  },
  {
    id: 39,
    tier: 2,
    tierName: "Tier 2: Opening Principles",
    category: "Board Vision",
    title: "Infiltrating the Back Rank",
    fen: "4r1k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1",
    playerColor: "w",
    solution: ["Rd8"],
    objective: "White to move: Pin Black's rook by infiltrating the 8th rank with Rd8.",
    dialogue: "Notice Black's back rank. When a king has no 'luft' (breathing room), entering the 8th rank creates immediate pins and mate threats.",
    hint: "Advance your rook from d1 to d8.",
    hintSquares: ["d1", "d8"],
    explanation: "Pinning mastery! Black's rook is pinned against their king and cannot escape.",
    mistakeFeedback: "Invade the 8th rank with Rd8."
  },
  {
    id: 40,
    tier: 2,
    tierName: "Tier 2: Opening Principles",
    category: "Positional Assessment",
    title: "Good Bishop Activity",
    fen: "8/pp2kp2/4p1p1/3pP3/3P4/bP4P1/P4PK1/8 b - - 0 1",
    playerColor: "b",
    solution: ["Bb2"],
    objective: "Black to move: Infiltrate White's camp with Bb2 to target the weak d4 pawn.",
    dialogue: "A 'good bishop' operates on squares of opposite color to its own pawns. Use your light-squared bishop to attack White's base pawn on d4!",
    hint: "Slide your bishop from a3 down to b2.",
    hintSquares: ["a3", "b2"],
    explanation: "Magnificent positional pressure! The d4 pawn cannot be easily defended.",
    mistakeFeedback: "Infiltrate with Bb2 to attack White's d4 pawn."
  },

  // ==========================================
  // TIER 3: TACTICAL MOTIFS (Levels 41 - 65)
  // ==========================================
  {
    id: 41,
    tier: 3,
    tierName: "Tier 3: Tactical Motifs",
    category: "The Fork",
    title: "The Royal Knight Fork",
    fen: "r1b1k2r/pppp1ppp/2n5/4P3/1b1q4/2N5/PPPN1PPP/R2QKB1R w KQkq - 0 1", // Let's give clean royal fork:
    // Better classic royal fork:
    fen: "r3k2r/ppp2ppp/8/4N3/1b2q3/8/PP3PPP/R1BQKB1R w KQkq - 0 1",
    // Even cleaner:
    fen: "r1b1k2r/pppp1Npp/8/4p3/2Bnq3/8/PPPP2PP/RNBQ2KR w kq - 0 1",
    // Simplest unmistakable knight fork:
    fen: "r3k2r/pppq1ppp/3p1n2/2b1p3/2BnP3/2NP1N2/PPP2PPP/R1BQK2R b KQkq - 0 1",
    // Let's create pristine knight fork: King on e8, Queen on d8 / c7:
    fen: "r3k3/pp4pp/8/8/4N3/8/PPPP1PPP/R3K2R w KQq - 0 1", // need a target
    // Classic fork: King on e8, Rook on a8 or Queen on d8
    fen: "r2qk2r/ppp2ppp/2n5/3pP3/3Pn3/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 0 1",
    // Let's provide direct tactical positions:
    fen: "r3k2r/ppp2ppp/8/3q4/4N3/8/PPP2PPP/R2QKB1R w KQkq - 0 1",
    // Fork King on e8 and Queen on d8:
    fen: "r2qk2r/ppp1bppp/8/4N3/8/8/PPPP1PPP/R1BQK2R w KQkq - 0 1",
    // Let's give an undeniable King+Rook fork on c7:
    fen: "r3k2r/ppp2ppp/2n5/3N4/4P3/8/PPP2PPP/R3K2R w KQkq - 0 1",
    solution: ["Nxc7+"],
    objective: "White to move: Unleash the devastating Knight Fork on c7!",
    dialogue: "A FORK occurs when a single piece attacks two or more enemy pieces simultaneously. Jump your knight to c7 to check the King and attack the Rook!",
    hint: "Hop your knight from d5 to c7 with check.",
    hintSquares: ["d5", "c7"],
    explanation: "Decisive! The black king must move, leaving the a8 rook ripe for the picking on the next turn.",
    mistakeFeedback: "Hop to c7 to attack both King and Rook at once!"
  },
  {
    id: 42,
    tier: 3,
    tierName: "Tier 3: Tactical Motifs",
    category: "The Fork",
    title: "The Family Fork: King, Queen & Rook",
    fen: "r1b1k2r/pp1p1ppp/2n1q3/3N4/4P3/8/PPP2PPP/R2QKB1R w KQkq - 0 1",
    playerColor: "w",
    solution: ["Nc7+"],
    objective: "White to move: Play the ultimate 'Family Fork' on c7!",
    dialogue: "A Family Fork is chess ecstasy! Your knight on d5 can jump into c7, checking the King, skewering the Queen, and eyeing the Rook.",
    hint: "Leap your knight to c7 with check.",
    hintSquares: ["d5", "c7"],
    explanation: "Brutal tactical destruction! Black must move the king, and you capture their queen on e6.",
    mistakeFeedback: "Jump your knight to c7 to fork the entire royal family."
  },
  {
    id: 43,
    tier: 3,
    tierName: "Tier 3: Tactical Motifs",
    category: "The Fork",
    title: "The Double Pawn Fork",
    fen: "r1bqk2r/ppp2ppp/2n5/3np3/1bB5/2PP1N2/PP3PPP/RNBQK2R w KQkq - 0 1", // need a clean pawn fork e.g. d5 or e5
    fen: "r1bqk2r/ppp2ppp/2n5/3np3/8/3P1N2/PPP1BPPP/RNBQK2R w KQkq - 0 1",
    // Classical pawn fork: Black has pieces on c6 and e6 or White pushes d5:
    fen: "r1bqk2r/ppp2ppp/2n1pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 1",
    // Pure pawn fork: White pawn on e4 pushes to e5 forking Nf6 and Bd6:
    fen: "r1bqk2r/ppp2ppp/2nb1n2/4p3/4P3/3P1N2/PPP1BPPP/RNBQ1RK1 w kq - 0 1",
    // Let's make it a clean, decisive fork:
    fen: "r1bqk2r/ppp2ppp/3b1n2/8/4P3/8/PPP2PPP/RNBQKB1R w KQkq - 0 1",
    solution: ["e5"],
    objective: "White to move: Push your e-pawn to e5 to fork the knight and bishop!",
    dialogue: "Pawns make deadly forkers because they are worth so little. Push e5: Black has two minor pieces attacked and can only save one!",
    hint: "Push your e-pawn forward to e5.",
    hintSquares: ["e4", "e5"],
    explanation: "Game over! Black cannot rescue both the knight on f6 and bishop on d6. You win a piece for a pawn.",
    mistakeFeedback: "Push the e-pawn forward to e5 to attack both pieces."
  },
  {
    id: 44,
    tier: 3,
    tierName: "Tier 3: Tactical Motifs",
    category: "Double Attack",
    title: "The Queen Double Attack",
    fen: "r1bqk1nr/pppp1ppp/2n5/2b1p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 4 4", // Queen check e.g. Qa4+
    // Classic Scandinavian / Center game double attack:
    fen: "r1bqk1nr/pppp1ppp/2n5/8/1b2P3/2N5/PPP2PPP/R1BQKBNR w KQkq - 1 5",
    // Direct Queen check winning a piece:
    fen: "r1bqk1nr/pp1p1ppp/2n5/2b1p3/4P3/8/PPPPQPPP/RNB1KBNR w KQkq - 2 4",
    // Classical Qa4+ fork King and loose bishop on c4/c5:
    fen: "rnbqk1nr/ppp2ppp/8/3pp3/1b1P4/5N2/PPP1PPPP/RNBQKB1R w KQkq - 0 1",
    // Even cleaner: King on e8, Bishop on c4 hanging, White plays Qa4+:
    fen: "rnb1k1nr/ppp2ppp/8/3q4/1b6/2N5/PPP1PPPP/R1BQKBNR w KQkq - 0 1",
    // Let's give the purest Qa4+ double attack:
    fen: "r1bqk1nr/pppp1ppp/2n5/4p3/1b6/3P1N2/PPP1PPPP/RNBQKB1R w KQkq - 1 3",
    // No, Qa4+ when bishop is loose on c5:
    fen: "r1bqk1nr/pppp1ppp/2n5/2b5/4P3/8/PPP2PPP/RNBQKBNR w KQkq - 1 4",
    // Let's make an open board Qa4+ checking Ke8 and attacking an unprotected knight on c6:
    fen: "r1bqk2r/pp1p1ppp/2n2n2/4p3/4P3/2P2N2/P1P2PPP/R1BQKB1R w KQkq - 1 7",
    // Simplest unmistakable Queen fork:
    fen: "r2qk2r/ppp2ppp/8/3n4/8/8/PPP2PPP/R1BQK2R w KQkq - 0 1", // Qe2+ forks
    fen: "r3k2r/pppn1ppp/8/8/8/8/PPP2PPP/R2QK2R w KQkq - 0 1", // Qe2+ checks Ke8 and attacks Nd7
    // Let's use Qe2+ or Qa4+:
    fen: "r3k2r/pppn1ppp/8/8/8/8/PPP2PPP/R2QK2R w KQkq - 0 1",
    solution: ["Qe2+"],
    objective: "White to move: Check the king and double-attack the Nd7 with Qe2+.",
    dialogue: "Queens excel at double attacks. Step Qe2+: you check the King on e8 while putting direct crossfire on the unprotected knight on d7!",
    hint: "Move your queen to e2 with check.",
    hintSquares: ["d1", "e2"],
    explanation: "Devastating double attack! Black must respond to the check, allowing you to capture the knight on d7.",
    mistakeFeedback: "Deliver check on e2 with your queen."
  },
  {
    id: 45,
    tier: 3,
    tierName: "Tier 3: Tactical Motifs",
    category: "The Pin",
    title: "The Absolute Pin",
    fen: "r1bqk2r/pppp1ppp/2n2n2/4p3/1b2P3/2NP1N2/PPP2PPP/R1BQKB1R w KQkq - 1 5", // Black has pinned Nc3 to Ke1
    // Let's have White execute the pin:
    fen: "r1bqk2r/pppp1ppp/2n5/4p3/4P3/3P1N2/PPP2PPP/RNBQKB1R w KQkq - 1 4",
    // White pins Black knight to King:
    fen: "r1bqk1nr/pppp1ppp/2n5/4p3/1b2P3/3P1N2/PPP2PPP/RNBQKB1R b KQkq - 1 3",
    // Direct White Bb5 absolute pin on Nc6:
    fen: "r1bqk1nr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
    solution: ["Bb5"],
    objective: "White to move: Play Bb5, absolutely pinning the c6 knight to the black king.",
    dialogue: "An ABSOLUTE PIN occurs when a piece is pinned against the King. The pinned piece is legally forbidden from moving!",
    hint: "Develop your bishop to b5.",
    hintSquares: ["f1", "b5"],
    explanation: "Masterful! The knight on c6 cannot move an inch because doing so would expose the king to check.",
    mistakeFeedback: "Play Bb5 to execute the Ruy Lopez absolute pin."
  },
  {
    id: 46,
    tier: 3,
    tierName: "Tier 3: Tactical Motifs",
    category: "The Pin",
    title: "Piling on the Pinned Piece",
    fen: "r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1",
    // Attacking the pinned piece:
    fen: "r1bqk2r/pppp1ppp/2n5/1B2P3/8/5N2/PPP2PPP/RNBQK2R w KQkq - 0 1",
    // Let's have d5 attack the pinned knight on c6:
    fen: "r1bqk2r/pppp1ppp/2n5/1B6/3PP3/5N2/PP3PPP/RNBQK2R w KQkq - 0 1",
    solution: ["d5"],
    objective: "White to move: Attack the pinned knight on c6 with d5!",
    dialogue: "Golden tactical rule: 'PULL PRESSURE ONTO THE PINNED PIECE!' Since the knight on c6 cannot move, push d5 to win it outright.",
    hint: "Push your d4 pawn forward to d5.",
    hintSquares: ["d4", "d5"],
    explanation: "Clinical execution! A pinned piece cannot flee; attacking it with a pawn guarantees winning the piece.",
    mistakeFeedback: "Push d5 to attack the paralyzed knight on c6."
  },
  {
    id: 47,
    tier: 3,
    tierName: "Tier 3: Tactical Motifs",
    category: "The Pin",
    title: "The Relative Pin",
    fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/4P3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 4 4",
    solution: ["Bg5"],
    objective: "White to move: Play Bg5, relatively pinning the f6 knight to Black's queen.",
    dialogue: "A RELATIVE PIN pins a piece to a valuable piece (like the Queen). Moving the piece is legal, but will cause the loss of the queen!",
    hint: "Develop your dark-squared bishop to g5.",
    hintSquares: ["c1", "g5"],
    explanation: "Terrific! If the f6 knight moves, Black loses their queen on d8.",
    mistakeFeedback: "Move your bishop from c1 to g5 to pin the knight to the queen."
  },
  {
    id: 48,
    tier: 3,
    tierName: "Tier 3: Tactical Motifs",
    category: "The Skewer",
    title: "The Rook Skewer",
    fen: "4k2r/8/8/8/8/8/8/4R1K1 w - - 0 1", // Re1+ skewers Ke8 and Rh8
    solution: ["Re1+"],
    objective: "White to move: Skewer Black's king and rook with Re1+.",
    dialogue: "A SKEWER is an inverted pin: the more valuable piece is in front! Attack the King on e1; when he steps aside, the piece behind is lost.",
    hint: "Check the black king along the e-file with Re1+.",
    hintSquares: ["e1", "e1"], // rook on e1? let's make rook on a1:
    fen: "4k2r/8/8/8/8/8/8/R5K1 w - - 0 1",
    // Ra8+ skewers Ke8 and Rh8:
    solution: ["Ra8+"],
    objective: "White to move: Skewer the king and rook with Ra8+.",
    dialogue: "A SKEWER attacks the King directly; when the King is forced to step aside, the rook behind him is captured!",
    hint: "Slide your rook to a8 to deliver check.",
    hintSquares: ["a1", "a8"],
    explanation: "Devastating skewer! When the king steps away from check, White captures the undefended rook on h8.",
    mistakeFeedback: "Deliver check on a8 with your rook to skewer king and rook."
  },
  {
    id: 49,
    tier: 3,
    tierName: "Tier 3: Tactical Motifs",
    category: "The Skewer",
    title: "The Queen Skewer",
    fen: "7k/7r/8/8/8/8/8/Q5K1 w - - 0 1", // Qh8+ skewers Kh8 and Rh7? No, Qh8+ captures
    // Clean Queen skewer: King on e8, Queen on e1 skewers Ke8 and loose piece:
    fen: "4k3/4r3/8/8/8/8/8/4Q1K1 w - - 0 1", // absolute pin
    // Bishop skewer: King on e5, Rook on e8, Bishop checks on f4:
    fen: "4r3/8/8/4k3/8/8/8/2B3K1 w - - 0 1",
    // Bb2+ skewers Ke5 and Re8:
    solution: ["Bb2+"],
    objective: "White to move: Deliver a lethal diagonal skewer with Bb2+.",
    dialogue: "The bishop strikes along the long diagonal! Check the King on e5; when he moves away, capture the rook on e8.",
    hint: "Slide your bishop to b2 to check the king.",
    hintSquares: ["c1", "b2"],
    explanation: "Magnificent skewer! The king is forced off the diagonal, winning the rook for free.",
    mistakeFeedback: "Play Bb2+ to skewer the king and rook."
  },
  {
    id: 50,
    tier: 3,
    tierName: "Tier 3: Tactical Motifs",
    category: "Discovered Attack",
    title: "The Discovered Attack",
    fen: "r1bqk2r/ppp2ppp/2n5/3p4/1b1Pn3/2NB1N2/PPP2PPP/R1BQK2R w KQkq - 0 1",
    // Classic discovered attack: Bxh7+ discovering Queen against Queen:
    fen: "r1b1k2r/ppp2ppp/2n5/3q4/3P4/3B1N2/PP1Q1PPP/R3K2R w KQkq - 0 1", // Qd2 and Qd5
    // Better: White Bishop on d3, White Queen on d1, Black Queen on d5:
    fen: "r1b1k2r/ppp2ppp/2n5/3q4/3P4/3B1N2/PPP2PPP/R1BQK2R w KQkq - 0 1",
    // If White plays Bxh7+, Black king or rook must respond, but queen on d1 sees Qd5:
    solution: ["Bxh7+"],
    objective: "White to move: Unleash a discovered attack on Black's queen with 1. Bxh7+!",
    dialogue: "A DISCOVERED ATTACK happens when one piece moves, uncovering a devastating threat from a friendly piece behind it!",
    hint: "Sacrifice your bishop on h7 with check to uncover your queen's attack on d5.",
    hintSquares: ["d3", "h7"],
    explanation: "Spectacular! Black must deal with the check on h7, allowing your queen on d1 to capture their queen on d5 next turn.",
    mistakeFeedback: "Play Bxh7+ with check to uncover the attack on Black's queen."
  },
  {
    id: 51,
    tier: 3,
    tierName: "Tier 3: Tactical Motifs",
    category: "Discovered Check",
    title: "The Lethal Discovered Check",
    fen: "4k3/8/8/4N3/8/8/8/4R1K1 w - - 0 1",
    // White knight moves with discovered check:
    fen: "4k3/8/8/4N3/8/8/8/4R1K1 w - - 0 1",
    // Nf7+ or Nc6+ discovering check from the rook on e1:
    solution: ["Nc6+"],
    objective: "White to move: Move your knight to c6 with a discovered check from your rook.",
    dialogue: "Discovered checks are paralyzing. The piece moving can jump to any square while the king is checked by the piece behind!",
    hint: "Jump your knight to c6 with discovered check.",
    hintSquares: ["e5", "c6"],
    explanation: "Crushing! The black king must react to the rook's check, letting your knight do maximum damage.",
    mistakeFeedback: "Jump your knight to c6 to unleash the discovered check."
  },
  {
    id: 52,
    tier: 3,
    tierName: "Tier 3: Tactical Motifs",
    category: "Double Check",
    title: "The Unstoppable Double Check",
    fen: "r1bqk2r/pppp1Npp/2n5/4p3/2B1n3/8/PPPP2PP/RNBQ1RK1 b kq - 0 7", // No, White to move double check:
    // Reti double check mate: White Bishop on g5, Rook on d1, Black King on e8:
    fen: "rn2k2r/ppp2ppp/4b3/8/1bPP4/8/PP3PPP/R1B1KBNR w KQkq - 1 9", // No
    // Clean double check: White Rook on e1, Knight on e5, Black King on e8:
    fen: "4k3/4b3/8/4N3/8/8/8/4R1K1 w - - 0 1",
    // Nc6+ is discovered check. For DOUBLE check: both moving piece and uncovered piece give check!
    // Example: White King on g1, Rook on d1, Knight jumps to e7 or f6 checking King on d8 / e8:
    fen: "3k4/8/8/8/3N4/8/8/3R2K1 w - - 0 1", // Ne6+ double check!
    solution: ["Ne6+"],
    objective: "White to move: Deliver a double check with Ne6+!",
    dialogue: "In a DOUBLE CHECK, both pieces attack the King simultaneously. A double check CANNOT be blocked or captured—the King MUST move!",
    hint: "Hop your knight to e6: both knight and rook give check!",
    hintSquares: ["d4", "e6"],
    explanation: "Masterful! Because two pieces give check at once, the opponent can neither block nor capture. The king is forced to run.",
    mistakeFeedback: "Jump to e6 to check with both the knight and the rook."
  },
  {
    id: 53,
    tier: 3,
    tierName: "Tier 3: Tactical Motifs",
    category: "Deflection",
    title: "Deflecting the Guardian",
    fen: "5rk1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1",
    // Deflection: Black rook defends back rank mate:
    fen: "3r2k1/5ppp/8/8/8/8/1Q3PPP/4R1K1 w - - 0 1", // Qb6 or similar
    // Classic deflection: Queen sacrifices to deflect rook defending 8th rank:
    fen: "5rk1/ppp2ppp/8/8/8/8/PP2QPPP/4R1K1 w - - 0 1", // Qe8!
    solution: ["Qe8"],
    objective: "White to move: Play Qe8! to deflect or pin Black's defending rook.",
    dialogue: "DEFLECTION forces an enemy piece away from an essential defensive duty. Infiltrate with Qe8: Black's rook is overloaded!",
    hint: "Invade the 8th rank with your queen on e8.",
    hintSquares: ["e2", "e8"],
    explanation: "Brilliant deflection! If Black takes your queen, White's rook delivers back-rank checkmate.",
    mistakeFeedback: "Push your Queen to e8 to break Black's defense."
  },
  {
    id: 54,
    tier: 3,
    tierName: "Tier 3: Tactical Motifs",
    category: "Decoy",
    title: "The Decoy Sacrifice",
    fen: "r1bqk2r/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
    // Decoy King to f7:
    fen: "r1bqk2r/pppp1ppp/2n5/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 0 1",
    solution: ["Bxf7+"],
    objective: "White to move: Play the decoy sacrifice Bxf7+ to strip Black's king of castling rights.",
    dialogue: "A DECOY lures an enemy piece (especially the King) onto a disastrous poisoned square. Sacrifice your bishop on f7!",
    hint: "Capture f7 with your bishop with check.",
    hintSquares: ["c4", "f7"],
    explanation: "Savage decoy! The Black king is dragged out into the open, loses castling rights, and is exposed to devastating follow-up checks.",
    mistakeFeedback: "Sacrifice on f7 with check to drag the king forward."
  },
  {
    id: 55,
    tier: 3,
    tierName: "Tier 3: Tactical Motifs",
    category: "Removing the Defender",
    title: "Removing the Defender",
    fen: "r1bqk2r/ppp2ppp/2n2n2/3p4/1b1P4/2N2N2/PPP1BPPP/R1BQK2R w KQkq - 0 1",
    // Classic: White Bishop captures Nf6, removing the defender of e5 or d5:
    fen: "r1bqk2r/ppp2ppp/2n2n2/3pp3/1b1PP3/2N2N2/PPP1BPPP/R1BQK2R w KQkq - 0 1",
    // Simplest: Black bishop on c5 defended by knight on d7:
    fen: "r2qk2r/pppnbppp/4p3/2b5/4P3/5N2/PPP2PPP/RNBQ1RK1 w kq - 0 1",
    // White knight on f3, Black pawn on e5 defended by knight on c6:
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
    // Let's create an unmistakable piece win by removing the defender:
    // Knight on c6 defends e5 pawn. White plays Bb5 pinning or Bxc6 removing it:
    fen: "r1bqk2r/pppp1ppp/2n5/4p3/1b2P3/2NP1N2/PPP2PPP/R1BQKB1R w KQkq - 1 5",
    // Direct capture: Black knight on f6 defends Queen on d8 or pawn on d5:
    fen: "r1bqkb1r/pppp1ppp/5n2/4p3/3nP3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 4 4",
    // Let's give: White plays Bxf6, removing defender of hanging piece:
    fen: "r1bqk2r/ppp2ppp/5n2/3p4/1b6/2N1PN2/PPP1BPPP/R1BQK2R w KQkq - 0 1",
    // Even cleaner: Black bishop on e4 defended by knight on f6. White takes knight:
    fen: "r2qk2r/ppp2ppp/5n2/8/4b3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 1",
    solution: ["Nxe4"], // knight on c3 captures e4 directly
    // Let's make removal of defender explicit:
    // White Bishop on g5 takes Nf6, leaving Black's queen or e5 undefended:
    fen: "r1bqk2r/ppp2ppp/2n2n2/4p3/4P3/2N2N2/PPP1BPPP/R1BQK2R w KQkq - 0 1", // need a target
    // Clean removal of defender: Black Queen on e7 defended by Rook on e8.
    // Let's give: Black bishop on d5 defended by knight on c6. White captures knight:
    fen: "r2qk2r/ppp2ppp/2n5/3b4/8/2B5/PPP2PPP/R2QKBNR w KQkq - 0 1",
    // White plays Bxg7 or Bxg7?
    // Let's make it crystal clear: Black knight on f6 defends Queen on d7. White plays Bxf6:
    fen: "r3k2r/pppq1ppp/5n2/8/8/2N5/PPP2PPP/R1BQK2R w KQkq - 0 1",
    // If White plays Qxd7+ Kxd7, simple trade.
    // What about Black knight on f6 defends black bishop on d5?
    fen: "r2qk2r/ppp2ppp/5n2/3b4/8/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 0 1",
    solution: ["Nxd5"],
    objective: "White to move: Remove Black's central bishop by capturing on d5.",
    dialogue: "When an opponent's key piece is insufficiently protected, eliminate or exchange off the piece to claim the advantage!",
    hint: "Capture the bishop on d5 with your c3 knight.",
    hintSquares: ["c3", "d5"],
    explanation: "Clinical calculation! You eliminate Black's active bishop and seize control of the center.",
    mistakeFeedback: "Capture on d5 with your knight."
  },
  {
    id: 56,
    tier: 3,
    tierName: "Tier 3: Tactical Motifs",
    category: "Overloaded Pieces",
    title: "Exploiting the Overloaded Defender",
    fen: "5rk1/ppp2ppp/8/8/8/8/PPP1QPPP/4R1K1 w - - 0 1",
    // Overloaded piece: Queen defends both c8 mate and something else:
    fen: "2r3k1/5ppp/8/8/8/8/1Q3PPP/2R3K1 w - - 0 1",
    solution: ["Rxc8+"],
    objective: "White to move: Shatter Black's back rank by capturing the overloaded rook on c8.",
    dialogue: "An OVERLOADED piece is burdened with defending two critical squares at once. It cannot fulfill both duties!",
    hint: "Capture Black's rook on c8 with your rook.",
    hintSquares: ["c1", "c8"],
    explanation: "Total collapse! Black's back rank was overloaded, leading to immediate checkmate.",
    mistakeFeedback: "Take the rook on c8 to deliver checkmate."
  },
  {
    id: 57,
    tier: 3,
    tierName: "Tier 3: Tactical Motifs",
    category: "Checkmate Patterns",
    title: "The Classic Back-Rank Mate",
    fen: "3r2k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1",
    // Back rank mate:
    fen: "6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1",
    solution: ["Re8#"],
    objective: "White to move: Deliver back-rank checkmate on e8.",
    dialogue: "When an opponent's King is trapped behind their own wall of pawns without an escape square ('luft'), slide your rook to the 8th rank for mate!",
    hint: "Slide your rook straight to e8 for checkmate.",
    hintSquares: ["e1", "e8"],
    explanation: "Checkmate! The pawns on f7, g7, and h7 act as prison bars, sealing the king's fate.",
    mistakeFeedback: "Push your rook to e8 to deliver mate."
  },
  {
    id: 58,
    tier: 3,
    tierName: "Tier 3: Tactical Motifs",
    category: "Checkmate Patterns",
    title: "The Legendary Smothered Mate",
    // Philidor's Legacy setup: White Queen on c4, Knight on f7/g5, Black King on h8, Rook on f8
    // Step 1: Qg8+! Rxg8 2. Nf7#
    fen: "6rk/6pp/7N/8/8/8/8/Q5K1 w - - 0 1",
    solution: ["Nf7#"],
    objective: "White to move: Deliver the suffocating Smothered Mate with Nf7#!",
    dialogue: "SMOTHERED MATE is one of the most stunning patterns in chess. The enemy King is completely choked by his own friendly pieces!",
    hint: "Jump your knight to f7 to deliver mate.",
    hintSquares: ["h6", "f7"],
    explanation: "Poetic checkmate! The black king is trapped by his own rook and pawns. The knight leaps in for the kill.",
    mistakeFeedback: "Jump your knight to f7 to checkmate the smothered king."
  },
  {
    id: 59,
    tier: 3,
    tierName: "Tier 3: Tactical Motifs",
    category: "Checkmate Patterns",
    title: "The Greek Gift Sacrifice",
    fen: "r1bq1rk1/ppp2ppp/2n1pn2/3p4/2PP4/2NBPN2/PP3PPP/R1BQK2R w KQ - 0 1",
    // Greek gift: White plays Bxh7+!
    solution: ["Bxh7+"],
    objective: "White to move: Obliterate Black's castled king with the Greek Gift 1. Bxh7+!",
    dialogue: "The GREEK GIFT (Bxh7+) is the most famous attacking sacrifice in chess history. Sacrifice your bishop to rip open the opponent's king!",
    hint: "Capture the h7 pawn with your bishop with check.",
    hintSquares: ["d3", "h7"],
    explanation: "Legendary! Black's king shield is destroyed, opening the door for Ng5+ and Qh5 with an unstoppable assault.",
    mistakeFeedback: "Strike on h7 with your bishop to shatter Black's kingside."
  },
  {
    id: 60,
    tier: 3,
    tierName: "Tier 3: Tactical Motifs",
    category: "Checkmate Patterns",
    title: "Anastasia's Checkmate",
    // White Knight on e7, Black King on h8, pawns on g7/h7 open file
    fen: "5r1k/4N1pp/8/8/8/8/8/R6K w - - 0 1",
    // Or Rook on h-file delivering mate:
    fen: "7k/4N1p1/8/8/8/8/8/R6K w - - 0 1",
    // Ra8 or Rh1#? If King on h7, Knight on e7 seals g8 and g6:
    fen: "7k/4N1p1/7p/8/8/8/8/R6K w - - 0 1",
    // Classic Anastasia: Knight on e7 cuts g8 and g6, White Rook delivers mate on h-file!
    // FEN with open h-file:
    fen: "r4r1k/4N1p1/8/8/8/8/8/7R w - - 0 1",
    solution: ["Rxh8#"], // wait, rook on h1 captures on h8 or Rh3/Rh5?
    // Let's make it: White Rook on a3 moves to h3#:
    fen: "5r1k/4N1p1/8/8/8/R7/8/7K w - - 0 1",
    solution: ["Rh3#"],
    objective: "White to move: Deliver Anastasia's Checkmate with Rh3#!",
    dialogue: "In ANASTASIA'S MATE, a knight on e7 controls the escape squares g8 and g6, while a rook delivers the coup de grâce on the open h-file!",
    hint: "Slide your rook along the 3rd rank to h3.",
    hintSquares: ["a3", "h3"],
    explanation: "Pure beauty! The Knight walls off g8 and g6, the g7 pawn blocks the King, and the Rook finishes the job.",
    mistakeFeedback: "Slide your rook to h3 to deliver Anastasia's checkmate."
  },
  {
    id: 61,
    tier: 3,
    tierName: "Tier 3: Tactical Motifs",
    category: "Checkmate Patterns",
    title: "Boden's Criss-Cross Mate",
    // Boden's mate: two criss-crossing bishops checkmate king trapped by pawn
    fen: "2kr4/ppp2ppp/8/8/8/8/2B5/B3K3 w - - 0 1", // need Ba6# and Bf5#
    // Classic Boden: King on c8, pawns on b7, d7:
    fen: "2kr4/1pp2ppp/8/8/8/8/2B5/B3K3 w - - 0 1",
    solution: ["Bf5+"],
    objective: "White to move: Slice into Black's camp with Bf5+.",
    dialogue: "BODEN'S MATE features two bishops cutting criss-crossing diagonals against a king trapped by his own pieces.",
    hint: "Check the black king with Bf5+.",
    hintSquares: ["c2", "f5"],
    explanation: "Sensational! The light and dark diagonals work together like razor blades.",
    mistakeFeedback: "Deliver check along the light diagonal with Bf5+."
  },
  {
    id: 62,
    tier: 3,
    tierName: "Tier 3: Tactical Motifs",
    category: "Checkmate Patterns",
    title: "The Arabian Mate",
    // Knight on f6, Rook delivering mate on h7 / g8 against King in corner (h8)
    fen: "7k/8/5N2/8/8/8/8/6RK w - - 0 1",
    solution: ["Rg8#"],
    objective: "White to move: Deliver the historic Arabian Mate with Rg8#!",
    dialogue: "The ARABIAN MATE is one of the oldest checkmates in chess, documented over 1,200 years ago! The Knight on f6 protects the Rook and covers the escape square h7.",
    hint: "Move your rook on g1 straight up to g8.",
    hintSquares: ["g1", "g8"],
    explanation: "Checkmate! The Rook and Knight cooperate with mathematical perfection in the corner.",
    mistakeFeedback: "Deliver checkmate on g8 with your rook, protected by the knight."
  },
  {
    id: 63,
    tier: 3,
    tierName: "Tier 3: Tactical Motifs",
    category: "Masterpieces",
    title: "Paul Morphy's Opera Game Mate",
    // Morphy's Opera Game finish: White Rook on d1 delivers Rd8# with Bishop on g5 pinning
    fen: "3rkb1r/p2n1ppp/4p3/1B1p1b2/3P4/8/PPP2PPP/R1B1K2R w KQk - 0 1",
    // Let's set the exact final position after Queen sac:
    // Black King on e8, Black Knight on d7 pinned by Bishop on b5, White Rook on d1 slides to d8#:
    fen: "4kb1r/p2n1ppp/4p3/1B6/8/8/PPP2PPP/3R2K1 w k - 0 1",
    // Even cleaner Opera finale:
    fen: "3r4/4k3/8/1B6/8/8/PPP2PPP/3R2K1 w - - 0 1",
    // Let's use the iconic: White Rook penetrates to d8 delivering mate:
    fen: "1r2k3/3n1p2/8/1B6/8/8/8/3R2K1 w - - 0 1",
    // What if White plays Rxd7:
    fen: "4kb1r/3n1ppp/8/1B6/8/8/8/3R2K1 w k - 0 1",
    solution: ["Rxd7"],
    objective: "White to move: Channel Paul Morphy and capture the pinned knight on d7!",
    dialogue: "In Paul Morphy's 1858 Opera Game masterpiece, every single piece was deployed with tempo to crush Black's uncastled king.",
    hint: "Capture the paralyzed knight on d7 with your rook.",
    hintSquares: ["d1", "d7"],
    explanation: "Brilliant! The knight on d7 was pinned by the bishop and could not defend itself.",
    mistakeFeedback: "Capture on d7 with your rook."
  },
  {
    id: 64,
    tier: 3,
    tierName: "Tier 3: Tactical Motifs",
    category: "Tactical Concepts",
    title: "The Clearance Sacrifice",
    fen: "r1b2rk1/ppp2ppp/8/3q4/8/3B4/PPP2PPP/R2Q1RK1 w - - 0 1",
    // Clearance sacrifice: Bxh7+ clears the d1-d5 file for Qd1xd5!
    solution: ["Bxh7+"],
    objective: "White to move: Play the clearance sacrifice Bxh7+ to win Black's queen!",
    dialogue: "A CLEARANCE SACRIFICE vacates a square, rank, or diagonal so that a more powerful piece behind can strike with maximum impact.",
    hint: "Sacrifice your bishop on h7 with check.",
    hintSquares: ["d3", "h7"],
    explanation: "Unbelievable tactic! Sacrificing the bishop clears the d-file so your queen snaps up Black's queen on d5.",
    mistakeFeedback: "Play Bxh7+ to clear the d-file for your queen."
  },
  {
    id: 65,
    tier: 3,
    tierName: "Tier 3: Tactical Motifs",
    category: "Advanced Tactics",
    title: "The Shocking Zwischenzug",
    fen: "r1b1k2r/pppp1ppp/8/4q3/1bP5/2N1P3/PP3PPP/R1BQKB1R w KQkq - 0 1",
    // Zwischenzug: Black expects White to recapture on c3, but White plays an in-between check or move:
    fen: "r1bqk2r/ppp2ppp/2n5/3pP3/1b1P4/2N2N2/PPP1QPPP/R1B1KB1R w KQkq - 0 1",
    // Classic Zwischenzug: White plays Bd2 breaking pin, or in-between check:
    fen: "r1b1k2r/pppp1ppp/5n2/4q3/1bP5/2N1P3/PP1B1PPP/R2QKB1R b KQkq - 0 1",
    // Let's create an unmistakable Zwischenzug:
    // Black played ...Nxd4 expecting a recapture, but White plays in-between check:
    fen: "r1bqk2r/pppp1ppp/8/4n3/1b2P3/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 0 1",
    // If White plays Nxe5:
    fen: "r1bqk2r/pppp1ppp/8/8/1b1nP3/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 0 1",
    solution: ["Nxd4"], // or Qxd4
    // Let's create an exact intermediate move:
    // White is attacked, but plays check first:
    fen: "r1b1k2r/pppp1ppp/8/4q3/8/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 0 1",
    solution: ["Be2"],
    // Let's make an active Zwischenzug:
    fen: "r1bqk2r/ppp2ppp/2n5/3P4/1b2n3/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 0 1",
    solution: ["dxc6"],
    objective: "White to move: Unleash the in-between pawn capture 1. dxc6!",
    dialogue: "ZWISCHENZUG ('in-between move'): Instead of making the expected passive defensive move, play an unexpected attacking intermediate move that ruins the opponent's calculation!",
    hint: "Capture the black knight on c6 with your d-pawn.",
    hintSquares: ["d5", "c6"],
    explanation: "Masterful! Instead of passively defending against the pin, you counter-attack by capturing their knight on c6.",
    mistakeFeedback: "Capture on c6 with your d5 pawn."
  },

  // ==========================================
  // TIER 4: POSITIONAL & STRATEGIC MASTERY (Levels 66 - 85)
  // ==========================================
  {
    id: 66,
    tier: 4,
    tierName: "Tier 4: Positional Mastery",
    category: "Pawn Structure",
    title: "Creating a Passed Pawn",
    fen: "8/8/1p6/1P6/8/8/P7/4K2k w - - 0 1",
    // Creating a passed pawn on the queenside: White pawn on a2 pushes to a4:
    solution: ["a4"],
    objective: "White to move: Push a4 to create an unstoppable passed pawn.",
    dialogue: "A PASSED PAWN has no opposing pawns in front or on adjacent files to block its march to the 8th rank. As GM Nimzowitsch said: 'A passed pawn is a criminal which should be kept under lock and key!'",
    hint: "Advance your a2 pawn to a4.",
    hintSquares: ["a2", "a4"],
    explanation: "Textbook strategy! Your outside passed pawn will march down the board and force promotion.",
    mistakeFeedback: "Advance the a-pawn to a4 to create your runner."
  },
  {
    id: 67,
    tier: 4,
    tierName: "Tier 4: Positional Mastery",
    category: "Pawn Structure",
    title: "Rolling Connected Passed Pawns",
    fen: "8/8/8/8/8/2PP4/8/4K2k w - - 0 1",
    solution: ["d4"],
    objective: "White to move: Advance d4 to set the connected passed pawns in motion.",
    dialogue: "CONNECTED PASSED PAWNS protect each other as they advance. When rolled forward in tandem, they overpower even enemy rooks!",
    hint: "Advance your d3 pawn to d4.",
    hintSquares: ["d3", "d4"],
    explanation: "Superb technique! Connected passers support one another and restrict enemy pieces.",
    mistakeFeedback: "Push the d-pawn to d4 to start the rolling pawn steamroller."
  },
  {
    id: 68,
    tier: 4,
    tierName: "Tier 4: Positional Mastery",
    category: "Pawn Structure",
    title: "Targeting Doubled Pawns",
    fen: "r4rk1/pp1b1ppp/4p3/2ppP3/8/2P1P3/PP3PPP/R3KB1R w KQ - 0 1",
    // Position targeting doubled c-pawns or weak pawns:
    fen: "r4rk1/pp1b1ppp/4p3/2p1P3/2p5/2P1P3/PP3PPP/R3KB1R w KQ - 0 1",
    solution: ["Bxc4"],
    objective: "White to move: Capture Black's doubled, isolated c4 pawn with your bishop.",
    dialogue: "DOUBLED PAWNS cannot protect each other and are prone to being blockaded and captured. Snatch the weak front pawn!",
    hint: "Take the doubled c4 pawn with your bishop on f1.",
    hintSquares: ["f1", "c4"],
    explanation: "Crisp positional play! You eliminate Black's weak structural defect and pocket a clean pawn.",
    mistakeFeedback: "Capture the c4 pawn with your light-squared bishop."
  },
  {
    id: 69,
    tier: 4,
    tierName: "Tier 4: Positional Mastery",
    category: "Pawn Structure",
    title: "Piling on the Backward Pawn",
    fen: "r2r2k1/pp2bppp/3p1n2/4p3/4P3/2N1B3/PPP2PPP/R2R2K1 w - - 0 1",
    // Backward pawn on d6: White puts knight on d5:
    solution: ["Nd5"],
    objective: "White to move: Occupy the hole in front of Black's backward pawn with Nd5!",
    dialogue: "A BACKWARD PAWN cannot advance safely and leaves a juicy 'hole' directly in front of it. Plant your knight firmly on d5!",
    hint: "Jump your knight from c3 into the outpost on d5.",
    hintSquares: ["c3", "d5"],
    explanation: "Grandmaster positional masterclass! A knight stationed on an outpost in front of a backward pawn paralyzes the opponent's position.",
    mistakeFeedback: "Plant your knight into the d5 hole."
  },
  {
    id: 70,
    tier: 4,
    tierName: "Tier 4: Positional Mastery",
    category: "Pawn Structure",
    title: "The Isolated Queen's Pawn Break: d5!",
    fen: "r2q1rk1/pp2bppp/2n2n2/3p4/3P4/2N2N2/PP2BPPP/R1BQR1K1 w - - 0 1",
    // Black IQP or White IQP? White has d4 pawn:
    // Let's have White play d5 breakthrough!
    solution: ["d5"],
    objective: "White to move: Unleash the thematic IQP dynamic break with 1. d5!",
    dialogue: "An Isolated Queen's Pawn (IQP) is a dynamic weapon! The player with the IQP must strike with d5 before the opponent can blockade it.",
    hint: "Push your d4 pawn forward to d5.",
    hintSquares: ["d4", "d5"],
    explanation: "Classic Tarrasch/Botvinnik dynamism! The d5 break opens lines for all your attacking pieces.",
    mistakeFeedback: "Shatter Black's blockade with d5!"
  },
  {
    id: 71,
    tier: 4,
    tierName: "Tier 4: Positional Mastery",
    category: "Piece Placement",
    title: "Seizing the Open File",
    fen: "r2q1rk1/ppp1bppp/2np1n2/8/4P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 1",
    // Open d-file: White plays Rd1 or Re1:
    fen: "r2q1rk1/ppp1bppp/2np1n2/8/3PP3/2N2N2/PPP2PPP/R1BQ1RK1 w - - 0 1",
    // Clear open file:
    fen: "r4rk1/ppp1bppp/2n2n2/8/8/2N2N2/PPP2PPP/R1BR2K1 w - - 0 1",
    // Seize with Rd7 or double rooks:
    fen: "r4rk1/ppp1bppp/2n2n2/8/8/2N2N2/PPP2PPP/R2R2K1 w - - 0 1",
    solution: ["Bf4"], // or develop
    // Let's make it direct rook invasion to open d-file:
    fen: "3r1rk1/ppp1bppp/2n2n2/8/8/2N2N2/PPP2PPP/R1B2RK1 w - - 0 1",
    // White plays Be3 or Rd1 to contest:
    fen: "r4rk1/ppp1bppp/2n2n2/8/8/2N2N2/PPP2PPP/R1B2RK1 w - - 0 1",
    solution: ["Bg5"],
    // Clean open file seizure:
    fen: "r2r2k1/pp3ppp/8/8/8/8/PP3PPP/R4RK1 w - - 0 1",
    solution: ["Rfd1"],
    objective: "White to move: Contest the open d-file with Rfd1.",
    dialogue: "Rooks belong on open files. When a file has no pawns, rush your rooks there to control the gateway into enemy territory.",
    hint: "Slide your f1 rook to d1.",
    hintSquares: ["f1", "d1"],
    explanation: "Flawless! Controlling the open file is the prerequisite for invading the opponent's back ranks.",
    mistakeFeedback: "Occupy the open d-file with Rfd1."
  },
  {
    id: 72,
    tier: 4,
    tierName: "Tier 4: Positional Mastery",
    category: "Piece Placement",
    title: "Rook on the 7th Rank",
    fen: "3r2k1/pp3ppp/8/8/8/8/PP3PPP/3R2K1 w - - 0 1", // need Rd7
    fen: "5rk1/pp3ppp/8/8/8/8/PP3PPP/3R2K1 w - - 0 1",
    solution: ["Rd7"],
    objective: "White to move: Infiltrate Black's 7th rank with Rd7!",
    dialogue: "A Rook on the 7th rank is a devastating monster! It attacks enemy pawns from the side and traps the enemy king on the back rank.",
    hint: "Invade the 7th rank by moving your rook to d7.",
    hintSquares: ["d1", "d7"],
    explanation: "Dominant! The 7th-rank rook attacks the b7 pawn and paralyzes Black's entire defense.",
    mistakeFeedback: "Invade the 7th rank with Rd7."
  },
  {
    id: 73,
    tier: 4,
    tierName: "Tier 4: Positional Mastery",
    category: "Piece Placement",
    title: "Pigs on the Seventh: Doubled Rooks",
    fen: "5rk1/pp1R1ppp/8/8/8/8/PP3PPP/4R1K1 w - - 0 1",
    solution: ["Ree7"],
    objective: "White to move: Double your rooks on the 7th rank with Ree7!",
    dialogue: "Chess masters lovingly call doubled rooks on the 7th 'Blind Pigs' because they devour everything in sight! Double your rooks on the 7th rank.",
    hint: "Advance your e1 rook up to e7.",
    hintSquares: ["e1", "e7"],
    explanation: "Total devastation! Doubled 7th-rank rooks are almost always completely winning.",
    mistakeFeedback: "Bring your second rook to e7."
  },
  {
    id: 74,
    tier: 4,
    tierName: "Tier 4: Positional Mastery",
    category: "Outposts",
    title: "The Eternal Knight Outpost",
    fen: "r1b2rk1/pp3ppp/2n1pn2/3p4/3P4/2N2N2/PPP2PPP/R1BQKB1R w KQ - 0 1",
    // Knight to e5 outpost:
    solution: ["Ne5"],
    objective: "White to move: Anchor your knight on the dominant e5 outpost.",
    dialogue: "An OUTPOST is a square on the 4th, 5th, or 6th rank that cannot be attacked by enemy pawns. Plant your knight firmly on e5!",
    hint: "Hop your f3 knight into e5.",
    hintSquares: ["f3", "e5"],
    explanation: "Colossal outpost! Supported by the d4 pawn, the knight on e5 radiates pressure in all directions.",
    mistakeFeedback: "Occupy the e5 outpost with your knight."
  },
  {
    id: 75,
    tier: 4,
    tierName: "Tier 4: Positional Mastery",
    category: "Attacking King",
    title: "The King Hunt",
    fen: "r1bq1rk1/pppp1ppp/2n5/4p1N1/2B1P3/8/PPPP1PPP/RNBQK2R w KQ - 0 1",
    // White plays Qh5 threatening Qxf7# and Qxh7#:
    solution: ["Qh5"],
    objective: "White to move: Launch the King Hunt with Qh5!",
    dialogue: "When the enemy king's defensive shield is weakened, coordinate your Queen and minor pieces to deliver relentless threats.",
    hint: "Bring your queen to h5.",
    hintSquares: ["d1", "h5"],
    explanation: "Deadly coordination! White creates unstoppable dual mating threats on f7 and h7.",
    mistakeFeedback: "Deploy your queen to h5."
  },
  {
    id: 76,
    tier: 4,
    tierName: "Tier 4: Positional Mastery",
    category: "Prophylaxis",
    title: "Prophylaxis: The Art of Prevention",
    fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R b KQkq - 0 4",
    // White played d3. Black plays h6 or Bc5:
    // Let's have White play h3 to stop ...Bg4:
    fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 1 5",
    solution: ["h3"],
    objective: "White to move: Play the prophylactic pawn move h3 to stop ...Bg4.",
    dialogue: "PROPHYLAXIS (championed by Aron Nimzowitsch) is the art of anticipating and preventing your opponent's plans before they happen!",
    hint: "Push your h2 pawn to h3.",
    hintSquares: ["h2", "h3"],
    explanation: "Prophylactic brilliance! By playing h3, you permanently stop Black from pinning your f3 knight with ...Bg4.",
    mistakeFeedback: "Play h3 to prevent Black's annoying bishop pin."
  },
  {
    id: 77,
    tier: 4,
    tierName: "Tier 4: Positional Mastery",
    category: "Bishop Pair",
    title: "The Bishop Pair in an Open Board",
    fen: "r4rk1/pp3ppp/8/8/8/2B2B2/PPP2PPP/R4RK1 w - - 0 1",
    // White has bishop pair on open board:
    solution: ["Bxb7"],
    objective: "White to move: Snipe Black's queenside with Bxb7 using your bishop pair.",
    dialogue: "The BISHOP PAIR is worth more than the sum of its parts (~0.5 pawn bonus). Slicing across open diagonals, they control both color complexes.",
    hint: "Capture the b7 pawn with your f3 bishop.",
    hintSquares: ["f3", "b7"],
    explanation: "Ruthless execution! The bishop pair slices open Black's camp and captures key pawns.",
    mistakeFeedback: "Capture the b7 pawn with your bishop."
  },
  {
    id: 78,
    tier: 4,
    tierName: "Tier 4: Positional Mastery",
    category: "Minor Piece Domination",
    title: "Dominant Knight vs Bad Bishop",
    fen: "8/1p1b1k2/p1p1p1p1/P1PpPp1p/1P3P1P/4NKP1/8/8 w - - 0 1",
    // Knight maneuvers into d6 or c4:
    solution: ["Nc2"],
    objective: "White to move: Reroute your knight toward the d6 weakness via Nc2.",
    dialogue: "When an opponent's pawns are locked on the color of their own bishop, the bishop is 'bad' (blind). Maneuver your agile knight to conquer the board!",
    hint: "Step your knight from e3 to c2.",
    hintSquares: ["e3", "c2"],
    explanation: "Superb rerouting! The knight will travel to a3, b4, or d4 and completely dominate Black's passive bishop.",
    mistakeFeedback: "Reroute your knight toward c2."
  },
  {
    id: 79,
    tier: 4,
    tierName: "Tier 4: Positional Mastery",
    category: "Pawn Breaks",
    title: "The Kingside Pawn Break: f4!",
    fen: "r4rk1/pp1b1ppp/1qn1pn2/3p4/3P4/2PB1N2/PP1N1PPP/R2Q1RK1 w - - 0 1",
    // Better pawn break position:
    fen: "r1bq1rk1/pppn1ppp/4pn2/3p4/1bPP4/2NBPN2/PP3PPP/R1BQK2R w KQ - 0 1",
    // Classic f4 break: White has pawns on e4, d4, pushes f4:
    fen: "r1bq1rk1/pp1nbppp/2p1pn2/3p4/3PP3/2NB1N2/PPP2PPP/R1BQ1RK1 w - - 0 1",
    solution: ["e5"],
    objective: "White to move: Push e5 to seize kingside space and evict Black's knight.",
    dialogue: "A PAWN BREAK transforms the tension of the game. Push e5 to kick Black's f6 knight and open a devastating kingside attack!",
    hint: "Push your e4 pawn to e5.",
    hintSquares: ["e4", "e5"],
    explanation: "Crushing space advantage! Evicting the knight from f6 leaves Black's king defenseless against future sacrifices.",
    mistakeFeedback: "Push the e4 pawn to e5."
  },
  {
    id: 80,
    tier: 4,
    tierName: "Tier 4: Positional Mastery",
    category: "Pawn Levers",
    title: "Shattering the Chain: The c5 Lever",
    fen: "r2q1rk1/pp1n1ppp/2p1pn2/b7/3P4/2PB1N2/PP3PPP/R1BQR1K1 w - - 0 1",
    // The c4 or c5 pawn lever:
    fen: "r1bq1rk1/pp1n1ppp/2p1pn2/8/2PP4/2PB1N2/P4PPP/R1BQR1K1 w - - 0 1",
    solution: ["c5"],
    objective: "White to move: Lock Black's queenside and claim space with c5!",
    dialogue: "A PAWN LEVER challenges the opponent's pawn chain. Advance c5 to secure a queenside bind and clamp down on Black's counterplay.",
    hint: "Push your c4 pawn to c5.",
    hintSquares: ["c4", "c5"],
    explanation: "Masterful clamp! The c5 pawn restricts Black's minor pieces from accessing natural central squares.",
    mistakeFeedback: "Advance the c-pawn to c5."
  },
  {
    id: 81,
    tier: 4,
    tierName: "Tier 4: Positional Mastery",
    category: "Space Advantage",
    title: "The Space Advantage Squeeze",
    fen: "r2q1rk1/pp1nbppp/2p1pn2/3p4/3PP3/2N2N2/PPP2PPP/R1BQR1K1 w - - 0 1",
    solution: ["e5"],
    objective: "White to move: Seize massive space with e5, suffocating Black's pieces.",
    dialogue: "A SPACE ADVANTAGE gives your pieces freedom of movement while cramming the opponent into a cramped defensive bunker. Claim territory with e5!",
    hint: "Advance your pawn to e5.",
    hintSquares: ["e4", "e5"],
    explanation: "Textbook space squeeze! Black is forced into passivity.",
    mistakeFeedback: "Push to e5 to claim territory."
  },
  {
    id: 82,
    tier: 4,
    tierName: "Tier 4: Positional Mastery",
    category: "King Centralization",
    title: "Endgame King Centralization",
    fen: "8/pp3kpp/8/8/8/4P3/PP3PPP/4K3 w - - 0 1",
    solution: ["Ke2"],
    objective: "White to move: Centralize your king with Ke2.",
    dialogue: "In the middlegame, hide your King. In the ENDGAME, activate your King! With queens off the board, march your King directly toward the center.",
    hint: "Step your king forward to e2.",
    hintSquares: ["e1", "e2"],
    explanation: "Essential endgame technique! The king is an active fighting piece that must participate in controlling key squares.",
    mistakeFeedback: "Step your king to e2."
  },
  {
    id: 83,
    tier: 4,
    tierName: "Tier 4: Positional Mastery",
    category: "Simplification",
    title: "Liquidating into a Won Endgame",
    fen: "5rk1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1",
    // Simplification by trading queens when up material:
    fen: "r4rk1/pp3ppp/8/8/8/8/PP2QPPP/R4RK1 w - - 0 1",
    // Clear simplification: White up a piece trades rooks:
    fen: "3r2k1/pp3ppp/8/8/3B4/8/PP3PPP/3R2K1 w - - 0 1",
    solution: ["Kf1"],
    // Clean simplification trade:
    fen: "r4rk1/5ppp/8/8/8/8/5PPP/R4RK1 w - - 0 1",
    solution: ["Rxa8"],
    objective: "White to move: Liquidate pieces by capturing the rook on a8.",
    dialogue: "When ahead in material or entering a favorable pawn structure, SIMPLIFY! Trading off pieces reduces the opponent's counterplay.",
    hint: "Exchange rooks by capturing on a8.",
    hintSquares: ["a1", "a8"],
    explanation: "Crisp liquidation! As Capablanca taught: simplify the position when ahead to secure an effortless victory.",
    mistakeFeedback: "Capture the rook on a8."
  },
  {
    id: 84,
    tier: 4,
    tierName: "Tier 4: Positional Mastery",
    category: "Pawn Structure",
    title: "The Carlsbad Minority Attack",
    fen: "r1bq1rk1/pp1nbppp/2p1pn2/8/2PP4/2N2N2/PP2BPPP/R1BQ1RK1 w - - 0 1",
    // Minority attack on queenside: White pushes b4:
    solution: ["b4"],
    objective: "White to move: Launch the Minority Attack with 1. b4!",
    dialogue: "THE MINORITY ATTACK: White uses two pawns (a & b) to attack Black's three pawns (a, b, c), creating a permanent isolated or backward pawn weakness on c6!",
    hint: "Advance your b2 pawn two squares to b4.",
    hintSquares: ["b2", "b4"],
    explanation: "Brilliant strategic plan! 1. b4 followed by b5 will shatter Black's queenside pawn structure.",
    mistakeFeedback: "Push the b-pawn to b4 to initiate the attack."
  },
  {
    id: 85,
    tier: 4,
    tierName: "Tier 4: Positional Mastery",
    category: "The Blockade",
    title: "The Art of the Blockade",
    fen: "8/8/4k3/4p3/8/4KN2/8/8 w - - 0 1",
    // Blockade the e5 pawn with Nd4 or Ke4:
    solution: ["Ke4"],
    objective: "White to move: Establish an ironclad blockade on e4 with your King.",
    dialogue: "BLOCKADE: A passed or isolated pawn must be firmly stopped in its tracks. Station your king directly in front of the pawn on e4!",
    hint: "Step your king to e4 directly in front of the black pawn.",
    hintSquares: ["e3", "e4"],
    explanation: "Impenetrable blockade! The enemy pawn is frozen, and Black has zero winning chances.",
    mistakeFeedback: "Step your king to e4 to blockade the pawn."
  },

  // ==========================================
  // TIER 5: ENDGAME & MASTER TECHNIQUES (Levels 86 - 100)
  // ==========================================
  {
    id: 86,
    tier: 5,
    tierName: "Tier 5: Endgame Mastery",
    category: "King & Pawn Endgames",
    title: "The Direct Opposition",
    fen: "8/8/4k3/8/4K3/8/8/8 w - - 0 1",
    solution: ["Kd4"], // or Kf4? wait, kings on e4 and e6: White already has opposition if Black to move!
    // If White to move, White takes opposition:
    fen: "8/8/8/4k3/8/4K3/8/8 w - - 0 1",
    // Kings on e3 and e5: 1 square between them! If White moves, White gives up opposition unless taking diagonal or distant:
    // Better: White King on e1, Black King on e8:
    // Direct Opposition: White takes opposition against Black king:
    fen: "8/8/8/4k3/8/3K4/8/8 w - - 0 1",
    solution: ["Kd4"],
    objective: "White to move: Take the direct horizontal opposition with Kd4.",
    dialogue: "OPPOSITION: Placing your King directly opposite the enemy King with an odd number of squares between them. The side NOT having to move holds the opposition!",
    hint: "Move your king to d4 directly facing the black king.",
    hintSquares: ["d3", "d4"],
    explanation: "Masterful! Taking opposition forces the opponent's king to give ground.",
    mistakeFeedback: "Step to d4 to seize the opposition."
  },
  {
    id: 87,
    tier: 5,
    tierName: "Tier 5: Endgame Mastery",
    category: "King & Pawn Endgames",
    title: "Distant Opposition",
    fen: "8/4k3/8/8/8/8/4K3/8 w - - 0 1",
    solution: ["Ke3"],
    objective: "White to move: Seize the distant opposition with Ke3.",
    dialogue: "DISTANT OPPOSITION: Keeping an odd number of squares (3 or 5) between the kings. Step Ke3: you maintain the invisible magnetic connection!",
    hint: "Step your king forward to e3.",
    hintSquares: ["e2", "e3"],
    explanation: "Pure endgame science! By maintaining distant opposition, you guarantee winning the direct opposition when the kings meet.",
    mistakeFeedback: "Step to e3 to maintain the odd-number spacing."
  },
  {
    id: 88,
    tier: 5,
    tierName: "Tier 5: Endgame Mastery",
    category: "Endgame Calculation",
    title: "The Rule of the Square",
    fen: "8/8/8/8/8/1p6/8/4K2k w - - 0 1", // Black pawn on b3, White king on e1:
    // Can White king catch the pawn? The square of b3 is b3-b1-h1-h3 (5x5). King on e1 is inside!
    solution: ["Kd2"],
    objective: "White to move: Step into the square of the pawn with Kd2.",
    dialogue: "THE RULE OF THE SQUARE: Draw a diagonal from the pawn to the promotion rank to visualize a square. If your King can step inside the square, the pawn CANNOT escape!",
    hint: "Step your king to d2 inside the pawn's square.",
    hintSquares: ["e1", "d2"],
    explanation: "Flawless calculation! Your king is inside the square and will catch the pawn before it promotes.",
    mistakeFeedback: "Step to d2 to enter the square of the pawn."
  },
  {
    id: 89,
    tier: 5,
    tierName: "Tier 5: Endgame Mastery",
    category: "King Maneuvers",
    title: "King Triangulation: Zugzwang",
    fen: "8/8/8/4k3/8/3K4/4P3/8 w - - 0 1",
    solution: ["e4"],
    objective: "White to move: Push e4 to force Black into Zugzwang.",
    dialogue: "ZUGZWANG: The German word for 'compulsion to move.' Any move Black makes will worsen their position! Push e4 to force Black's king backward.",
    hint: "Push your e-pawn forward to e4.",
    hintSquares: ["e2", "e4"],
    explanation: "Decisive! Black's king must yield ground, allowing your king to penetrate and win.",
    mistakeFeedback: "Push the e-pawn to e4."
  },
  {
    id: 90,
    tier: 5,
    tierName: "Tier 5: Endgame Mastery",
    category: "King Maneuvers",
    title: "Shouldering the Enemy King",
    fen: "8/8/8/4k3/8/5K2/6P1/8 w - - 0 1",
    // White king shoulders Black king: Ke3 or Kg4
    solution: ["Kg4"],
    objective: "White to move: Shoulder the black king away with Kg4.",
    dialogue: "SHOULDERING: Using your king's physical body as a wall to block the enemy king from reaching the passed pawn.",
    hint: "Step your king to g4.",
    hintSquares: ["f3", "g4"],
    explanation: "Supreme technique! By shouldering Black's king to the left, your g-pawn has a clear, escorted path to promotion.",
    mistakeFeedback: "Step to g4 to box out Black's king."
  },
  {
    id: 91,
    tier: 5,
    tierName: "Tier 5: Endgame Mastery",
    category: "Rook Endgames",
    title: "The Lucena Position: Building the Bridge",
    // Classic Lucena: White pawn on d7, King on d8, Rook on a1 or similar. White plays Rf4! (or Re4)
    fen: "3K4/3P1k2/8/8/8/8/8/2R5 w - - 0 1", // let's give standard Lucena
    fen: "3K4/3P1k2/8/8/8/8/8/1r1R4 w - - 0 1",
    // Exact standard Lucena: White pawn on e7, King on e8, Black Rook on e1 checks...
    // Let's set the key bridge-building step:
    fen: "1K1k4/1P6/8/8/8/8/8/r2R4 w - - 0 1",
    // Even clearer: White Rook builds the bridge on the 4th rank:
    fen: "4K3/3P1k2/8/8/5R2/8/8/r7 w - - 0 1",
    // White plays Ke8 or Rd4:
    // Let's give: White plays Rd4 (the bridge builder)
    fen: "3K1k2/3P4/8/8/8/8/8/r2R4 w - - 0 1",
    solution: ["Rd4"],
    objective: "White to move: Play Rd4! to begin building the Lucena Bridge.",
    dialogue: "THE LUCENA POSITION is the Holy Grail of rook endgames. White builds 'The Bridge' on the 4th rank (Rd4) so the rook can shield the king from vertical checks!",
    hint: "Lift your rook to d4.",
    hintSquares: ["d1", "d4"],
    explanation: "Masterpiece! The rook on the 4th rank prepares to interpose on d4, ensuring the pawn safely promotes to a Queen.",
    mistakeFeedback: "Move your rook to d4 to build the bridge."
  },
  {
    id: 92,
    tier: 5,
    tierName: "Tier 5: Endgame Mastery",
    category: "Rook Endgames",
    title: "The Philidor Defense: Third Rank Cut",
    // Philidor defense: Black draws by keeping rook on 6th rank (or White on 3rd rank)
    fen: "4k3/4r3/8/8/8/8/4P3/4K1R1 w - - 0 1",
    // Let's have defender cut off the king:
    fen: "8/8/8/8/8/1r6/4P3/4K2k b - - 0 1",
    // Black plays Rb6 cutting off the 3rd rank:
    solution: ["Rb6"],
    objective: "Black to move: Cut off the White king along the 6th rank with Rb6!",
    dialogue: "THE PHILIDOR DEFENSE: In rook + pawn endgames, keep your rook on the 6th rank to prevent the enemy king from advancing. Once the pawn pushes, drop your rook to the back rank to check from behind!",
    hint: "Slide your rook to b6.",
    hintSquares: ["b3", "b6"],
    explanation: "Immortal defense! The 6th-rank barrier guarantees a draw against any player in the world.",
    mistakeFeedback: "Place your rook on b6 to hold the 6th rank."
  },
  {
    id: 93,
    tier: 5,
    tierName: "Tier 5: Endgame Mastery",
    category: "Conversion Checkmates",
    title: "Checkmate with King & Queen vs King",
    fen: "7k/8/6K1/8/8/8/8/7Q w - - 0 1",
    solution: ["Qh7#"],
    objective: "White to move: Deliver checkmate with Qh7#.",
    dialogue: "With King and Queen, box the enemy king to the edge of the board. Bring your king close for support, then deliver checkmate right in the king's face!",
    hint: "Move the queen to h7 right next to the king.",
    hintSquares: ["h1", "h7"],
    explanation: "Checkmate! The Queen delivers point-blank checkmate guarded by the King on g6.",
    mistakeFeedback: "Deliver mate on h7 with your queen."
  },
  {
    id: 94,
    tier: 5,
    tierName: "Tier 5: Endgame Mastery",
    category: "Conversion Checkmates",
    title: "Checkmate with King & Rook vs King",
    fen: "k7/8/1K6/8/8/8/8/R7 w - - 0 1",
    solution: ["Ra7"], // wait, Ra7 or Ra8+? If king on a8:
    fen: "8/k7/8/1K6/8/8/8/R7 w - - 0 1",
    // Classic box checkmate: King on a8, White King on a6 (or b6):
    fen: "k7/8/1K6/8/8/8/8/7R w - - 0 1",
    solution: ["Rh8#"],
    objective: "White to move: Deliver checkmate on the back rank with Rh8#!",
    dialogue: "With King and Rook, use the King to control the three escape squares on the adjacent rank, then swing your Rook down the back rank for checkmate!",
    hint: "Slide your rook up the h-file to h8.",
    hintSquares: ["h1", "h8"],
    explanation: "Checkmate! The White King controls a7, b7, and c7, leaving the Black King with nowhere to run.",
    mistakeFeedback: "Deliver checkmate on h8 with your rook."
  },
  {
    id: 95,
    tier: 5,
    tierName: "Tier 5: Endgame Mastery",
    category: "Conversion Checkmates",
    title: "The Two Bishops Checkmate",
    fen: "k7/8/1K6/8/8/8/2B5/B7 w - - 0 1",
    solution: ["Be4+"], // followed by Bb7#
    objective: "White to move: Check the cornered king with Be4+.",
    dialogue: "Two bishops operate as a lethal criss-cross scissor! Drive the enemy king into the corner, trap him with one bishop, and deliver the execution with the other.",
    hint: "Check the black king with Be4+.",
    hintSquares: ["c2", "e4"],
    explanation: "Sensational! The light-squared bishop delivers check, forcing Black's king into the fatal corner square a8.",
    mistakeFeedback: "Deliver check along the long diagonal with Be4+."
  },
  {
    id: 96,
    tier: 5,
    tierName: "Tier 5: Endgame Mastery",
    category: "Endgame Oddities",
    title: "The Wrong Bishop & Rook Pawn",
    fen: "k7/8/K7/8/8/8/7P/5B2 w - - 0 1",
    // Can White win if pawn promotes on h8 and bishop is dark-squared (f1 is light-squared)?
    // If pawn is on a-file and bishop doesn't control a8, it's a theoretical draw!
    // Let's demonstrate securing the win when bishop DOES control promotion square:
    fen: "k7/8/K7/8/8/8/1B5P/8 w - - 0 1",
    solution: ["h4"],
    objective: "White to move: Push your passed h-pawn to h4 toward promotion.",
    dialogue: "KNOW YOUR ENDGAME THEORY: A rook pawn + bishop is a DRAW if the bishop does not control the promotion square and the defender reaches the corner. Here, push h4 to win!",
    hint: "Advance your h-pawn to h4.",
    hintSquares: ["h2", "h4"],
    explanation: "Well played! Advancing your pawn secures the win.",
    mistakeFeedback: "Push the h-pawn to h4."
  },
  {
    id: 97,
    tier: 5,
    tierName: "Tier 5: Endgame Mastery",
    category: "Legendary Studies",
    title: "Richard Réti's Endgame Miracle (1921)",
    fen: "7K/8/8/8/2p5/8/1P6/k7 w - - 0 1", // Réti study: White king chases two pawns at once!
    // White King on h8, Black King on a1, Black pawn on c4, White pawn on h4?
    // Exact Réti: White King on h8, Black pawn on c6, White pawn on h5, Black King on a6
    fen: "7K/8/p1p5/7P/8/8/8/k7 w - - 0 1",
    // Let's use the exact classical Réti study:
    // White King on h8, pawn on h4; Black King on a6, pawn on c5:
    fen: "7K/8/8/2p4P/8/8/8/k7 w - - 0 1",
    // 1. Kg7! threatens both to catch c5 (via f6-e5) AND support h5!
    solution: ["Kg7"],
    objective: "White to move: Play the miraculous study move 1. Kg7!",
    dialogue: "Richard Réti's 1921 masterpiece is the most celebrated endgame study in history. White appears completely lost, but 1. Kg7 chases BOTH pawns simultaneously via diagonal geometry!",
    hint: "Step your king diagonally toward the center with Kg7.",
    hintSquares: ["h8", "g7"],
    explanation: "PURE GENIUS! From g7, the king simultaneously threatens to assist the h-pawn and intercept the c-pawn, miraculously holding the draw.",
    mistakeFeedback: "Play the legendary study move Kg7!"
  },
  {
    id: 98,
    tier: 5,
    tierName: "Tier 5: Endgame Mastery",
    category: "Queen vs Pawn",
    title: "Queen vs Pawn on the 7th Rank",
    fen: "8/8/8/8/8/4k3/4p3/4K1Q1 w - - 0 1",
    // Queen vs pawn on e2: Queen delivers check to step king in front:
    solution: ["Qe3+"], // wait, can White play Qe3+? King on e1, Black king on e3, pawn on e2.
    // If pawn on e2, King on e3:
    fen: "8/8/8/8/8/8/4p1K1/4Q2k w - - 0 1",
    // Simplest: Queen pins pawn or checks:
    fen: "8/8/8/8/8/3k4/4p3/4K1Q1 w - - 0 1",
    solution: ["Qg3+"],
    objective: "White to move: Check Black's king with Qg3+ to force it away from the pawn.",
    dialogue: "Against a center pawn on the 7th rank, the Queen repeatedly checks the king until forcing the king in front of its own pawn, giving your king time to march up and assist!",
    hint: "Deliver check on g3 with your queen.",
    hintSquares: ["g1", "g3"],
    explanation: "Masterful technique! The Queen's checks systematically strip Black of tempo.",
    mistakeFeedback: "Check on g3 with your queen."
  },
  {
    id: 99,
    tier: 5,
    tierName: "Tier 5: Endgame Mastery",
    category: "Master Combinations",
    title: "The Immortal Endgame Sacrifice",
    fen: "5rk1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1",
    // Brilliant multi-piece endgame sacrifice:
    fen: "6k1/5p1p/6p1/8/8/8/5PPP/4R1K1 w - - 0 1",
    // Let's create an iconic tactical sacrifice in endgame:
    // White Rook sacrifices on h7 or 8th rank:
    fen: "r5k1/5ppp/8/8/8/8/5PPP/1R4K1 w - - 0 1",
    // Better: White pawn breakthrough on 6th rank (a6-b6-c6):
    fen: "8/5ppp/8/8/8/8/5PPP/4K2k w - - 0 1",
    // Classic 3v3 pawn breakthrough: Pawns on a5, b5, c5 vs a7, b7, c7:
    fen: "8/ppp5/8/PPP5/8/8/8/4K2k w - - 0 1",
    // 1. b6!! sacrifices to create an unstoppable passed pawn!
    solution: ["b6"],
    objective: "White to move: Unleash the legendary pawn breakthrough 1. b6!!",
    dialogue: "THE IMMORTAL PAWN BREAKTHROUGH: 1. b6!! sacrifices a pawn to shatter Black's defense. Whether Black takes with axb6 or cxb6, White pushes the opposite pawn to crown a new Queen!",
    hint: "Thrust your middle pawn forward to b6!!",
    hintSquares: ["b5", "b6"],
    explanation: "MAGNIFICENT! 1. b6!! forces a passed pawn through sheer geometric brilliance. One of chess's greatest tactical breakthroughs.",
    mistakeFeedback: "Play the immortal pawn breakthrough b6!!"
  },
  {
    id: 100,
    tier: 5,
    tierName: "Tier 5: Endgame Mastery",
    category: "The Grandmaster Trial",
    title: "Level 100: The Grandmaster Coronation",
    // The ultimate Capablanca / Kasparov / Carlsen master combination:
    // White to move and deliver the decisive coronation blow:
    fen: "r1b2rk1/pp3ppp/2n1p3/3q4/3P4/3B1N2/PP1Q1PPP/R3K2R w KQ - 0 1", // or immortal combination:
    // Let's use an epic master combination:
    // Mikhail Tal's or Garry Kasparov's immortal tactical combination:
    // FEN with Queen sacrifice into checkmate or devastating double attack:
    fen: "r1b2rk1/2q1bppp/p2pp3/1p4P1/3BPP2/2NB1Q2/PPP4P/2KR3R w - - 0 1",
    // Or Fischer's Game of the Century or Morphy's Queen sacrifice:
    // Let's use a breathtaking Grandmaster combination:
    fen: "2r3k1/1p3ppp/p7/3N4/8/8/PPP2PPP/4R1K1 w - - 0 1",
    // Ne7+ forks Kh8 and Rc8:
    solution: ["Ne7+"],
    objective: "White to move: Deliver the final Grandmaster strike with Ne7+!",
    dialogue: "CONGRATULATIONS ON REACHING LEVEL 100! You stand at the pinnacle of GrandmasterPath. Deliver the royal knight fork to claim your Grandmaster Title!",
    hint: "Jump your knight into e7 with check.",
    hintSquares: ["d5", "e7"],
    explanation: "GRANDMASTER TITLE EARNED! You have completed all 100 levels of GrandmasterPath. You possess the tactical vision, strategic depth, and endgame precision of a true chess master!",
    mistakeFeedback: "Hop your knight into e7 with check to complete the trial!"
  }
];

console.log('Total levels defined:', rawLevels.length);

// Validate all levels with Chess
const validatedLevels = [];
for (let i = 0; i < rawLevels.length; i++) {
  const lvl = rawLevels[i];
  if (lvl.id !== i) {
    throw new Error(`Level index mismatch: expected ${i}, got ${lvl.id}`);
  }
  
  const chess = new Chess();
  const loaded = chess.load(lvl.fen);
  if (!loaded) {
    throw new Error(`Failed to load FEN for level ${i}: ${lvl.fen}`);
  }
  
  if (chess.turn() !== lvl.playerColor) {
    console.warn(`Warning level ${i}: chess.turn() is '${chess.turn()}' but playerColor is '${lvl.playerColor}'. Fixing.`);
    lvl.playerColor = chess.turn();
  }
  
  // Test solution moves
  const testChess = new Chess(lvl.fen);
  for (const mv of lvl.solution) {
    const res = testChess.move(mv, { sloppy: true });
    if (!res) {
      throw new Error(`Illegal move '${mv}' in level ${i} (${lvl.title}) from FEN: ${testChess.fen()}`);
    }
  }
  
  validatedLevels.push(lvl);
}

console.log(`Successfully validated all ${validatedLevels.length} levels!`);

const outputContent = `// GrandmasterPath Curriculum - Levels 0 to 100
// Fully validated with chess.js
window.CurriculumLevels = ${JSON.stringify(validatedLevels, null, 2)};
`;

fs.writeFileSync('js/curriculum.js', outputContent);
console.log('Saved js/curriculum.js successfully!');
