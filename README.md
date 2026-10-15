# GrandmasterPath (Levels 0 to 100)
### Production-Ready Standalone Interactive Chess Learning & Training Web Application

**GrandmasterPath** is an interactive, zero-latency chess learning platform built to guide players from absolute beginners (Level 0) to titled Grandmaster tactical mastery (Level 100).

---

## 🌟 Highlights & Key Features

1. **Complete 101-Level Curriculum (Levels 0 to 100)**:
   - **Tier 1: Fundamentals (Levels 0 - 20)**: Pawn mechanics, double pushes, captures, Knights, Bishops, Rooks, Queens, Kings, escaping check, checkmate vs stalemate, castling (0-0 and 0-0-0), en passant, pawn promotion, and piece point valuation math.
   - **Tier 2: Opening Principles & Board Vision (Levels 21 - 40)**: Classical center control (1.e4, 2.d4), minor piece development, king safety, tempo management, defending Scholar's Mate, Fried Liver counter, Fool's mate refutation, Damiano punishment, and spotting hanging pieces.
   - **Tier 3: Tactical Motifs (Levels 41 - 65)**: Royal Knight forks, family forks, pawn forks, Queen double attacks, absolute vs relative pins, skewers, discovered attacks, discovered checks, double checks, deflections, decoys, removing the defender, overloaded pieces, back-rank mates, Philidor smothered mate, Greek gift sacrifice, Anastasia's mate, Boden's mate, Arabian mate, Morphy's Opera Game combination, clearance sacrifices, and Zwischenzugs.
   - **Tier 4: Positional & Strategic Mastery (Levels 66 - 85)**: Passed pawns, connected passers, doubled pawns, backward pawns, Isolated Queen's Pawn (IQP) breaks, open files, 7th rank rooks, "Blind Pigs" doubled rooks, eternal knight outposts, king hunts, Nimzowitsch prophylaxis, bishop pair dominance, good knight vs bad bishop, pawn breaks, levers, space squeezes, king centralization, and minority attacks.
   - **Tier 5: Endgame & Master Techniques (Levels 86 - 100)**: Direct opposition, distant opposition, the Rule of the Square, triangulation, shouldering, Lucena bridge building, Philidor 3rd-rank defense, K+Q mate, K+R box mate, two bishops mate, wrong rook pawn draws, Réti's 1921 study miracle, Queen vs 7th rank pawn technique, immortal pawn breakthroughs, and the Level 100 Grandmaster Coronation.

2. **Full Chess Engine & Interactive Board**:
   - Strict FEN parsing, move legality, check/checkmate detection, and board state transitions powered by `chess.js`.
   - Zero-lag interactive 8x8 chessboard supporting **both click-to-move and drag-and-drop**.
   - Valid destination dots, capture target rings, coordinates (a-h, 1-8), check glow indicators, last move highlights, and pawn promotion modal.
   - Board flip support (play as White or Black).

3. **Native Procedural Audio Engine (Web Audio API)**:
   - 100% native synthesizer with **zero external .mp3 dependencies**.
   - Generates procedural audio for:
     - Piece move (wooden knock)
     - Piece capture (crisp snap & impact crunch)
     - Check alert (two-tone alert chime)
     - Victory fanfare (ascending 4-note celebratory arpeggio)
     - Error buzzer (dual-sawtooth low buzz)
     - Level up sparkle

4. **Mentor Coach Panel**:
   - Live turn indicator and objective prompt for each level.
   - Dynamic evaluation feedback: plays celebration fanfare, explains the underlying chess principle, and reveals the "Next Challenge" button upon success.
   - Board shake CSS animation and targeted mentor feedback on errors.
   - Interactive "💡 Hint" button: highlights candidate squares and renders directional SVG arrows on the board.
   - Live Material Balance gauge bar (+1, +3, +5, etc.).

5. **Level Selector Drawer & Instant Override**:
   - Responsive drawer modal displaying all 101 levels with status indicators:
     - ⭐ Completed (Gold Star)
     - ▶ Unlocked (Playable)
     - 🔒 Locked
   - Tier filtering dropdown (All, Tier 1, Tier 2, Tier 3, Tier 4, Tier 5).
   - **"Unlock All Levels (Override)"** button allowing unrestricted access to any level at any time.
   - Quick Jump selector directly in the coach panel.

6. **Embedded Minimax AI Sandbox ("Practice vs AI")**:
   - Toggle seamlessly between Curriculum mode and Practice Sandbox.
   - Minimax engine with Alpha-Beta pruning, move ordering (MVV-LVA), quiescence search, and classical Piece-Square Tables (PST).
   - Selectable difficulty levels:
     - **Level 1 (Novice)**: Depth 1 with slight human-like randomness.
     - **Level 2 (Intermediate)**: Depth 2 with solid positional play.
     - **Level 3 (Club Player)**: Depth 3 with quiescence search.
   - Play as White or Black, Undo move, Flip board, Live evaluation score (`Eval: +0.4`), and live PGN/algebraic move history list.

7. **Persistent State (Local Storage)**:
   - Automatically tracks `currentLevel`, `maxUnlockedLevel`, `completedLevels` array, `userXP`, and `userRating`.

---

## 🚀 How to Run

### Option A: Local Dev Server (Recommended)
1. Start the included server:
   ```bash
   node server.js
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:3000/
   ```

### Option B: Standalone Single-File Bundle
Double-click `standalone.html` or `index.html` directly from your file manager into Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari. Everything is self-contained with zero server setup required!

---

## 📂 Project Architecture

```
Chess Interactive/
├── index.html                   # Main production web application
├── standalone.html              # Fully inlined, self-contained single-file build
├── server.js                    # Zero-dependency local Node static HTTP server
├── README.md                    # Comprehensive documentation
├── js/
│   ├── chess.min.js             # Strict chess logic & move validator
│   ├── audio.js                 # Web Audio API synthesizer module
│   ├── pieces.js                # Crisp SVG piece vectors (cburnett / Lichess)
│   ├── curriculum.js            # All 101 verified levels (Levels 0 - 100)
│   ├── engine.js                # Minimax AI with Alpha-Beta pruning & PST
│   ├── board.js                 # Interactive chessboard UI & SVG arrow overlay
│   └── app.js                   # Application controller & state manager
└── scripts/
    ├── build_curriculum.js      # Curriculum builder & validation harness
    ├── generate_clean_curriculum.js # Clean level generator
    └── build_standalone.js      # Single-file HTML bundler
```
