// GrandmasterPath Main Application Controller
// Dual-Mode Architecture: 
// 1. Learn Chess (Curriculum Levels 0-100)
// 2. Play Chess vs AI & Live Gemini AI Coach

class GrandmasterApp {
  constructor() {
    this.levels = window.CurriculumLevels || [];
    this.audio = window.ChessAudio;
    this.engine = window.ChessEngine;
    this.coach = window.GeminiCoach;

    // Persistent user stats
    this.currentLevelId = parseInt(localStorage.getItem('gm_current_level') || '0', 10);
    this.maxUnlockedLevel = parseInt(localStorage.getItem('gm_max_unlocked') || '0', 10);
    this.completedLevels = new Set(JSON.parse(localStorage.getItem('gm_completed_levels') || '[]'));
    this.userXP = parseInt(localStorage.getItem('gm_user_xp') || '0', 10);
    this.userRating = parseInt(localStorage.getItem('gm_user_rating') || '400', 10);

    // Active dual mode: 'curriculum' or 'play_ai'
    this.activeMode = localStorage.getItem('gm_active_mode') || 'curriculum';

    // Curriculum state
    this.curriculumChess = new Chess();
    this.curriculumBoard = null;
    this.currentStepIndex = 0;
    this.levelCompleted = false;
    this.autoDemonstrate = localStorage.getItem('gm_auto_demo') === 'true';
    this.isDemonstrating = false;

    // Play vs AI & AI Coach state
    this.playChess = new Chess();
    this.playBoard = null;
    this.playDifficulty = 'medium'; // 'easy' (1), 'medium' (2), 'hard' (3)
    this.playPlayerColor = 'w';     // 'w' (White) or 'b' (Black)
    this.playMoveHistory = [];
    this.playLastMove = null;
    this.isAiThinking = false;
    this.isCoachBusy = false;

    // DOM references cache
    this.dom = {};
  }

  // Initialize application
  init() {
    this.cacheDOM();
    this.initCurriculumBoard();
    this.initPlayAiBoard();
    this.bindEvents();
    this.updateStatsUI();

    // Check if user is first time visitor; show welcome choice modal
    const hasVisited = localStorage.getItem('gm_has_visited');
    if (!hasVisited) {
      this.openWelcomeModal();
    }

    // Switch to active mode (restores saved or default mode)
    this.switchMode(this.activeMode);

    // Initial load for curriculum
    this.loadLevel(this.currentLevelId);
    this.renderLevelSelector();

    // Initial match setup for Play vs AI
    this.startNewPlayMatch();
  }

  // Cache all DOM references
  cacheDOM() {
    this.dom = {
      // Header brand & navigation
      brandHomeBtn: document.getElementById('brand-home-btn'),
      headerModeBadge: document.getElementById('header-mode-badge'),
      headerSubtitle: document.getElementById('header-subtitle'),
      modeCurriculumBtn: document.getElementById('mode-curriculum-btn'),
      modePlayAiBtn: document.getElementById('mode-play-ai-btn'),
      openWelcomeModalBtn: document.getElementById('open-welcome-modal-btn'),
      audioToggleBtn: document.getElementById('audio-toggle-btn'),
      audioIcon: document.getElementById('audio-icon'),

      // Curriculum header controls
      curriculumHeaderControls: document.getElementById('curriculum-header-controls'),
      userXPBadge: document.getElementById('user-xp-badge'),
      userRatingBadge: document.getElementById('user-rating-badge'),
      levelDrawerBtn: document.getElementById('level-drawer-btn'),

      // Main views
      viewCurriculum: document.getElementById('view-curriculum'),
      viewPlayAi: document.getElementById('view-play-ai'),

      // Curriculum DOM
      curriculumTierBadge: document.getElementById('curriculum-tier-badge'),
      curriculumLevelTitle: document.getElementById('curriculum-level-title'),
      curriculumObjective: document.getElementById('curriculum-objective'),
      curriculumDialogue: document.getElementById('curriculum-dialogue'),
      curriculumFeedback: document.getElementById('curriculum-feedback'),
      curriculumTurnBadge: document.getElementById('curriculum-turn-badge'),
      materialGaugeFill: document.getElementById('material-gauge-fill'),
      materialScoreText: document.getElementById('material-score-text'),
      hintBtn: document.getElementById('hint-btn'),
      demoBtn: document.getElementById('demo-btn'),
      autoDemoCheckbox: document.getElementById('auto-demo-checkbox'),
      visualMoveBadge: document.getElementById('visual-move-badge'),
      resetLevelBtn: document.getElementById('reset-level-btn'),
      nextLevelBtn: document.getElementById('next-level-btn'),
      quickJumpSelect: document.getElementById('quick-jump-select'),

      // Play vs AI Match Top Bar
      diffEasyBtn: document.getElementById('diff-easy-btn'),
      diffMediumBtn: document.getElementById('diff-medium-btn'),
      diffHardBtn: document.getElementById('diff-hard-btn'),
      playStatusPill: document.getElementById('play-status-pill'),
      playStatusText: document.getElementById('play-status-text'),
      aiThinkingBadge: document.getElementById('ai-thinking-badge'),
      playSideToggleBtn: document.getElementById('play-side-toggle-btn'),
      playSideLabel: document.getElementById('play-side-label'),
      playUndoBtn: document.getElementById('play-undo-btn'),
      playFlipBtn: document.getElementById('play-flip-btn'),
      playNewGameBtn: document.getElementById('play-new-game-btn'),

      // Gemini AI Coach DOM
      coachChatStream: document.getElementById('coach-chat-stream'),
      coachTypingBubble: document.getElementById('coach-typing-bubble'),
      coachClearChatBtn: document.getElementById('coach-clear-chat-btn'),
      coachQuickChips: document.getElementById('coach-quick-chips'),
      coachInputForm: document.getElementById('coach-input-form'),
      coachPromptInput: document.getElementById('coach-prompt-input'),
      coachSendBtn: document.getElementById('coach-send-btn'),

      // Play Match Arena DOM
      playBotDiffBadge: document.getElementById('play-bot-diff-badge'),
      botCapturedPieces: document.getElementById('bot-captured-pieces'),
      botAdvantageBadge: document.getElementById('bot-advantage-badge'),
      playPlayerRoleBadge: document.getElementById('play-player-role-badge'),
      playerCapturedPieces: document.getElementById('player-captured-pieces'),
      playerAdvantageBadge: document.getElementById('player-advantage-badge'),
      playMoveCountBadge: document.getElementById('play-move-count-badge'),
      playEvalScoreText: document.getElementById('play-eval-score-text'),
      playAiMoveList: document.getElementById('play-ai-move-list'),
      copyPgnBtn: document.getElementById('copy-pgn-btn'),

      // Welcome Modal DOM
      welcomeModal: document.getElementById('welcome-modal'),
      closeWelcomeModalBtn: document.getElementById('close-welcome-modal-btn'),
      chooseCurriculumCard: document.getElementById('choose-curriculum-card'),
      choosePlayAiCard: document.getElementById('choose-play-ai-card'),

      // Drawer Modal DOM
      levelDrawerModal: document.getElementById('level-drawer-modal'),
      closeDrawerBtn: document.getElementById('close-drawer-btn'),
      drawerTierFilter: document.getElementById('drawer-tier-filter'),
      drawerLevelGrid: document.getElementById('drawer-level-grid'),
      drawerUnlockAllBtn: document.getElementById('drawer-unlock-all-btn'),
      drawerResetProgressBtn: document.getElementById('drawer-reset-progress-btn'),
    };
  }

  // Initialize Curriculum Board UI
  initCurriculumBoard() {
    this.curriculumBoard = new ChessBoardUI('chessboard-container', {
      playerColor: 'w',
      flipped: false,
      interactive: true,
      onMove: (moveObj) => this.handleCurriculumMove(moveObj)
    });
  }

  // Initialize Play vs AI Board UI
  initPlayAiBoard() {
    this.playBoard = new ChessBoardUI('play-ai-board-container', {
      playerColor: this.playPlayerColor,
      flipped: this.playPlayerColor === 'b',
      interactive: true,
      onMove: (moveObj) => this.handlePlayAiMove(moveObj)
    });
  }

  // Bind global application events
  bindEvents() {
    // Mode switcher buttons in header
    this.dom.modeCurriculumBtn.addEventListener('click', () => this.switchMode('curriculum'));
    this.dom.modePlayAiBtn.addEventListener('click', () => this.switchMode('play_ai'));

    // Welcome modal triggers
    this.dom.brandHomeBtn.addEventListener('click', () => this.openWelcomeModal());
    this.dom.openWelcomeModalBtn.addEventListener('click', () => this.openWelcomeModal());
    this.dom.closeWelcomeModalBtn.addEventListener('click', () => this.closeWelcomeModal());
    this.dom.chooseCurriculumCard.addEventListener('click', () => {
      this.switchMode('curriculum');
      this.closeWelcomeModal();
    });
    this.dom.choosePlayAiCard.addEventListener('click', () => {
      this.switchMode('play_ai');
      this.closeWelcomeModal();
    });

    // Audio mute toggle
    this.dom.audioToggleBtn.addEventListener('click', () => {
      const isMuted = this.audio.toggleMute();
      this.updateAudioIcon(isMuted);
    });
    this.updateAudioIcon(this.audio.muted);

    // Curriculum Controls
    this.dom.hintBtn.addEventListener('click', () => this.showHint());
    this.dom.resetLevelBtn.addEventListener('click', () => this.resetLevel());
    this.dom.nextLevelBtn.addEventListener('click', () => this.goToNextLevel());
    if (this.dom.demoBtn) {
      this.dom.demoBtn.addEventListener('click', () => this.demonstrateCurrentLesson());
    }
    if (this.dom.autoDemoCheckbox) {
      this.dom.autoDemoCheckbox.checked = this.autoDemonstrate;
      this.dom.autoDemoCheckbox.addEventListener('change', (e) => {
        this.autoDemonstrate = e.target.checked;
        localStorage.setItem('gm_auto_demo', this.autoDemonstrate.toString());
      });
    }
    this.dom.quickJumpSelect.addEventListener('change', (e) => {
      const targetId = parseInt(e.target.value, 10);
      if (!isNaN(targetId)) {
        this.loadLevel(targetId);
      }
    });

    // Curriculum Level Drawer
    this.dom.levelDrawerBtn.addEventListener('click', () => this.openLevelDrawer());
    this.dom.closeDrawerBtn.addEventListener('click', () => this.closeLevelDrawer());
    this.dom.drawerTierFilter.addEventListener('change', () => this.renderLevelSelector());
    this.dom.drawerUnlockAllBtn.addEventListener('click', () => this.unlockAllLevels());
    this.dom.drawerResetProgressBtn.addEventListener('click', () => this.resetAllProgress());

    // Play vs AI Match Difficulty Buttons
    this.dom.diffEasyBtn.addEventListener('click', () => this.setPlayDifficulty('easy'));
    this.dom.diffMediumBtn.addEventListener('click', () => this.setPlayDifficulty('medium'));
    this.dom.diffHardBtn.addEventListener('click', () => this.setPlayDifficulty('hard'));

    // Play vs AI Match Actions
    this.dom.playSideToggleBtn.addEventListener('click', () => this.togglePlaySide());
    this.dom.playUndoBtn.addEventListener('click', () => this.undoPlayMove());
    this.dom.playFlipBtn.addEventListener('click', () => this.flipPlayBoard());
    this.dom.playNewGameBtn.addEventListener('click', () => this.startNewPlayMatch());
    this.dom.copyPgnBtn.addEventListener('click', () => this.copyPlayPgn());

    // Gemini Coach Chat Events
    this.dom.coachInputForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = this.dom.coachPromptInput.value.trim();
      if (query) {
        this.askCoach(query);
        this.dom.coachPromptInput.value = '';
      }
    });

    // Quick suggestion chips
    this.dom.coachQuickChips.querySelectorAll('.coach-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const prompt = chip.getAttribute('data-prompt');
        if (prompt) {
          this.askCoach(prompt);
        }
      });
    });

    // Clear coach chat
    this.dom.coachClearChatBtn.addEventListener('click', () => this.clearCoachChat());
  }

  // ========================================================
  // DUAL-MODE ARCHITECTURE CONTROLLER
  // ========================================================

  switchMode(targetMode) {
    this.activeMode = targetMode;
    localStorage.setItem('gm_active_mode', targetMode);
    localStorage.setItem('gm_has_visited', 'true');

    if (targetMode === 'curriculum') {
      // Show Curriculum, Hide Play vs AI
      this.dom.viewCurriculum.classList.remove('hidden');
      this.dom.viewPlayAi.classList.add('hidden');
      this.dom.curriculumHeaderControls.classList.remove('hidden');

      // Update Nav Tabs Styling
      this.dom.modeCurriculumBtn.className = 'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-emerald-600 text-white shadow-md shadow-emerald-950 transition-all';
      this.dom.modePlayAiBtn.className = 'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-all';

      // Update header badges
      this.dom.headerModeBadge.textContent = 'Curriculum';
      this.dom.headerModeBadge.className = 'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      this.dom.headerSubtitle.textContent = 'Elite Interactive Chess Curriculum (Levels 0–100)';

      // Refresh curriculum board
      if (this.curriculumBoard) {
        this.curriculumBoard.setChess(this.curriculumChess);
      }
    } else {
      // Show Play vs AI, Hide Curriculum
      this.dom.viewCurriculum.classList.add('hidden');
      this.dom.viewPlayAi.classList.remove('hidden');
      this.dom.curriculumHeaderControls.classList.add('hidden');

      // Update Nav Tabs Styling
      this.dom.modeCurriculumBtn.className = 'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-all';
      this.dom.modePlayAiBtn.className = 'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-emerald-600 text-white shadow-md shadow-emerald-950 transition-all';

      // Update header badges
      this.dom.headerModeBadge.textContent = 'Play vs AI & Coach';
      this.dom.headerModeBadge.className = 'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20';
      this.dom.headerSubtitle.textContent = 'Live Interactive Match with Google Gemini AI Coach';

      // Refresh play board
      if (this.playBoard) {
        this.playBoard.setChess(this.playChess);
        this.updatePlayArenaUI();
      }
    }
  }

  openWelcomeModal() {
    this.dom.welcomeModal.classList.remove('hidden');
  }

  closeWelcomeModal() {
    this.dom.welcomeModal.classList.add('hidden');
  }

  updateAudioIcon(isMuted) {
    if (isMuted) {
      this.dom.audioIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />`;
      this.dom.audioToggleBtn.classList.add('text-rose-400');
    } else {
      this.dom.audioIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />`;
      this.dom.audioToggleBtn.classList.remove('text-rose-400');
    }
  }

  // ========================================================
  // PLAY CHESS VS AI & GEMINI COACH CONTROLLER
  // ========================================================

  setPlayDifficulty(diff) {
    this.playDifficulty = diff;
    const buttons = [
      { id: this.dom.diffEasyBtn, val: 'easy', badge: 'Easy', activeCls: 'bg-emerald-600 text-white shadow' },
      { id: this.dom.diffMediumBtn, val: 'medium', badge: 'Medium', activeCls: 'bg-emerald-600 text-white shadow' },
      { id: this.dom.diffHardBtn, val: 'hard', badge: 'Hard', activeCls: 'bg-emerald-600 text-white shadow' }
    ];

    buttons.forEach(b => {
      if (b.val === diff) {
        b.id.className = `px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${b.activeCls}`;
        this.dom.playBotDiffBadge.textContent = b.badge;
      } else {
        b.id.className = 'px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-slate-400 hover:text-white';
      }
    });

    this.audio.playMove();
  }

  togglePlaySide() {
    this.playPlayerColor = this.playPlayerColor === 'w' ? 'b' : 'w';
    const isWhite = this.playPlayerColor === 'w';

    this.dom.playSideLabel.textContent = isWhite ? '⚪ White' : '⚫ Black';
    this.dom.playPlayerRoleBadge.textContent = isWhite ? 'White' : 'Black';

    this.startNewPlayMatch();
  }

  flipPlayBoard() {
    const isFlipped = !this.playBoard.options.flipped;
    this.playBoard.setFlipped(isFlipped);
  }

  startNewPlayMatch() {
    this.playChess = new Chess();
    this.playMoveHistory = [];
    this.playLastMove = null;
    this.isAiThinking = false;

    this.dom.aiThinkingBadge.classList.add('hidden');

    const isWhite = this.playPlayerColor === 'w';
    this.playBoard.setPlayerColor(this.playPlayerColor);
    this.playBoard.setFlipped(!isWhite);
    this.playBoard.setInteractive(true);
    this.playBoard.setChess(this.playChess);

    this.updatePlayArenaUI();

    // If human plays as Black, AI makes first move
    if (!isWhite) {
      this.makePlayAiMove();
    }
  }

  handlePlayAiMove(moveObj) {
    if (this.isAiThinking) return;

    // Verify it is user's turn
    if (this.playChess.turn() !== this.playPlayerColor) return;

    const moveRes = this.playChess.move({
      from: moveObj.from,
      to: moveObj.to,
      promotion: moveObj.promotion || 'q'
    });

    if (!moveRes) {
      this.playBoard.shake();
      this.audio.playError();
      return;
    }

    // Audio effects
    if (moveRes.captured) this.audio.playCapture();
    else this.audio.playMove();
    if (this.playChess.in_check()) this.audio.playCheck();

    this.playLastMove = moveRes;
    this.playMoveHistory.push(moveRes);
    this.playBoard.setChess(this.playChess);
    this.updatePlayArenaUI();

    // Check game over
    if (this.checkPlayGameOver()) return;

    // Trigger AI move if active turn belongs to computer
    if (this.playChess.turn() !== this.playPlayerColor) {
      this.makePlayAiMove();
    }
  }

  async makePlayAiMove() {
    this.isAiThinking = true;
    this.playBoard.setInteractive(false);
    this.dom.aiThinkingBadge.classList.remove('hidden');
    this.updatePlayStatusBadge('Computer is thinking...', 'thinking');

    // Engine difficulty mapping
    let engineDepth = 2;
    if (this.playDifficulty === 'easy') engineDepth = 1;
    else if (this.playDifficulty === 'hard') engineDepth = 3;

    const delay = this.playDifficulty === 'easy' ? 300 : 500;
    const result = await this.engine.findBestMoveAsync(this.playChess, engineDepth, delay);

    this.isAiThinking = false;
    this.dom.aiThinkingBadge.classList.add('hidden');
    this.playBoard.setInteractive(true);

    if (result && result.move) {
      const moveRes = this.playChess.move(result.move);
      if (moveRes) {
        if (moveRes.captured) this.audio.playCapture();
        else this.audio.playMove();
        if (this.playChess.in_check()) this.audio.playCheck();

        this.playLastMove = moveRes;
        this.playMoveHistory.push(moveRes);
        this.playBoard.setChess(this.playChess);
        this.updatePlayArenaUI();
        this.checkPlayGameOver();
      }
    }
  }

  undoPlayMove() {
    if (this.isAiThinking || this.playMoveHistory.length === 0) return;

    // Undo bot move and player move to return to player's turn
    this.playChess.undo();
    this.playMoveHistory.pop();

    if (this.playChess.turn() !== this.playPlayerColor && this.playMoveHistory.length > 0) {
      this.playChess.undo();
      this.playMoveHistory.pop();
    }

    this.playLastMove = this.playMoveHistory[this.playMoveHistory.length - 1] || null;
    this.playBoard.setChess(this.playChess);
    this.updatePlayArenaUI();
    this.audio.playMove();
  }

  checkPlayGameOver() {
    if (this.playChess.in_checkmate()) {
      const winner = this.playChess.turn() === 'w' ? 'Black' : 'White';
      const userWon = (winner === 'White' && this.playPlayerColor === 'w') || (winner === 'Black' && this.playPlayerColor === 'b');
      
      this.updatePlayStatusBadge(`Checkmate! ${winner} wins!`, 'mate');
      if (userWon) {
        this.audio.playVictory();
        this.addChatMessage({
          role: 'coach',
          text: `🎉 **VICTORY!** Incredible job! You found checkmate against the computer! Keep up the brilliant play!`
        });
      } else {
        this.audio.playError();
        this.addChatMessage({
          role: 'coach',
          text: `Good try! The computer caught your king in checkmate. Don't worry at all—every grandmaster loses games! Click **Undo** to try another defense or **New Match** for a fresh start.`
        });
      }
      return true;
    }

    if (this.playChess.in_draw()) {
      let reason = 'Draw';
      if (this.playChess.in_stalemate()) reason = 'Stalemate';
      else if (this.playChess.in_threefold_repetition()) reason = 'Threefold Repetition';
      else if (this.playChess.insufficient_material()) reason = 'Insufficient Material';

      this.updatePlayStatusBadge(`Game Drawn (${reason})`, 'draw');
      this.addChatMessage({
        role: 'coach',
        text: `🤝 The game ended in a draw by **${reason}**! That was a super competitive match!`
      });
      return true;
    }

    return false;
  }

  updatePlayStatusBadge(customText, statusType = 'normal') {
    if (customText) {
      this.dom.playStatusText.textContent = customText;
      return;
    }

    const turn = this.playChess.turn();
    const isPlayerTurn = turn === this.playPlayerColor;
    const inCheck = this.playChess.in_check();

    if (inCheck) {
      this.dom.playStatusText.textContent = isPlayerTurn ? '⚠️ Check! Your King is under attack!' : '🔥 Check! Computer King under attack!';
      this.dom.playStatusPill.className = 'flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-xs font-bold text-rose-300 shadow-sm animate-pulse';
    } else if (isPlayerTurn) {
      this.dom.playStatusText.textContent = `Your turn (${this.playPlayerColor === 'w' ? 'White' : 'Black'})`;
      this.dom.playStatusPill.className = 'flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-xs font-bold text-emerald-300 shadow-sm';
    } else {
      this.dom.playStatusText.textContent = 'Computer is thinking...';
      this.dom.playStatusPill.className = 'flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 shadow-sm';
    }
  }

  // Update captured pieces trays, advantage gauge, and PGN move log
  updatePlayArenaUI() {
    this.updatePlayStatusBadge();

    // 1. Captured Pieces & Material Differential
    const captured = this.getCapturedPieces(this.playChess);
    this.renderCapturedTray(this.dom.playerCapturedPieces, captured.b, 'b');
    this.renderCapturedTray(this.dom.botCapturedPieces, captured.w, 'w');

    // Material Balance
    const mat = this.engine.getMaterialBalance(this.playChess);
    const diff = mat.diff; // + = White advantage, - = Black advantage
    const userIsWhite = this.playPlayerColor === 'w';
    const userAdvantage = userIsWhite ? diff : -diff;

    if (userAdvantage > 0) {
      this.dom.playerAdvantageBadge.textContent = `+${userAdvantage}`;
      this.dom.playerAdvantageBadge.classList.remove('hidden');
      this.dom.botAdvantageBadge.classList.add('hidden');
    } else if (userAdvantage < 0) {
      this.dom.botAdvantageBadge.textContent = `+${Math.abs(userAdvantage)}`;
      this.dom.botAdvantageBadge.classList.remove('hidden');
      this.dom.playerAdvantageBadge.classList.add('hidden');
    } else {
      this.dom.playerAdvantageBadge.classList.add('hidden');
      this.dom.botAdvantageBadge.classList.add('hidden');
    }

    // 2. Evaluation Score
    const evalScore = (this.engine.evaluate(this.playChess) / 100).toFixed(1);
    const scorePrefix = evalScore > 0 ? `+${evalScore}` : evalScore;
    this.dom.playEvalScoreText.textContent = `Eval: ${scorePrefix}`;

    // 3. Move Count & PGN Log
    const history = this.playChess.history({ verbose: true });
    this.dom.playMoveCountBadge.textContent = `${history.length} moves`;

    if (history.length === 0) {
      this.dom.playAiMoveList.innerHTML = `<div class="text-xs text-slate-500 italic text-center py-4">No moves yet. Play a piece to start the game!</div>`;
    } else {
      this.dom.playAiMoveList.innerHTML = '';
      for (let i = 0; i < history.length; i += 2) {
        const moveNum = Math.floor(i / 2) + 1;
        const whiteMove = history[i] ? history[i].san : '';
        const blackMove = history[i + 1] ? history[i + 1].san : '';
        const isLatestWhite = i === history.length - 1;
        const isLatestBlack = i + 1 === history.length - 1;

        const row = document.createElement('div');
        row.className = 'grid grid-cols-3 py-1 px-2 text-xs rounded hover:bg-slate-800/60 font-mono transition-colors';
        row.innerHTML = `
          <span class="text-slate-500 font-bold">${moveNum}.</span>
          <span class="${isLatestWhite ? 'text-emerald-400 font-bold bg-emerald-950/60 px-1 rounded' : 'text-slate-200'}">${whiteMove}</span>
          <span class="${isLatestBlack ? 'text-emerald-400 font-bold bg-emerald-950/60 px-1 rounded' : 'text-slate-300'}">${blackMove}</span>
        `;
        this.dom.playAiMoveList.appendChild(row);
      }
      this.dom.playAiMoveList.scrollTop = this.dom.playAiMoveList.scrollHeight;
    }
  }

  // Calculate captured pieces from active board
  getCapturedPieces(chess) {
    const initial = {
      w: { p: 8, n: 2, b: 2, r: 2, q: 1 },
      b: { p: 8, n: 2, b: 2, r: 2, q: 1 }
    };
    const current = {
      w: { p: 0, n: 0, b: 0, r: 0, q: 0 },
      b: { p: 0, n: 0, b: 0, r: 0, q: 0 }
    };

    const board = chess.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.type !== 'k') {
          current[piece.color][piece.type] = (current[piece.color][piece.type] || 0) + 1;
        }
      }
    }

    const captured = { w: [], b: [] };
    const order = ['q', 'r', 'b', 'n', 'p'];

    order.forEach(type => {
      const diffW = Math.max(0, initial.w[type] - (current.w[type] || 0));
      for (let i = 0; i < diffW; i++) captured.w.push(type);

      const diffB = Math.max(0, initial.b[type] - (current.b[type] || 0));
      for (let i = 0; i < diffB; i++) captured.b.push(type);
    });

    return captured;
  }

  renderCapturedTray(container, pieces, color) {
    if (!pieces || pieces.length === 0) {
      container.innerHTML = '<span class="text-[11px] text-slate-500">No captures yet</span>';
      return;
    }

    const symbols = {
      p: '♟',
      n: '♞',
      b: '♝',
      r: '♜',
      q: '♛'
    };

    container.innerHTML = pieces.map(p => `
      <span class="inline-flex items-center justify-center w-5 h-5 text-sm ${color === 'w' ? 'text-slate-100 drop-shadow' : 'text-slate-400'}" title="${color === 'w' ? 'White' : 'Black'} ${p.toUpperCase()}">
        ${symbols[p] || p}
      </span>
    `).join('');
  }

  copyPlayPgn() {
    const pgn = this.playChess.pgn() || 'No moves yet';
    navigator.clipboard.writeText(pgn).then(() => {
      const origText = this.dom.copyPgnBtn.textContent;
      this.dom.copyPgnBtn.textContent = 'Copied!';
      setTimeout(() => {
        this.dom.copyPgnBtn.textContent = origText;
      }, 1500);
    });
  }

  // ========================================================
  // GEMINI AI COACH INTERACTIVE CHATBOX
  // ========================================================

  async askCoach(userQuery) {
    if (this.isCoachBusy || !userQuery) return;

    this.isCoachBusy = true;
    this.dom.coachPromptInput.disabled = true;
    this.dom.coachSendBtn.disabled = true;

    // Append user query to chat feed
    this.addChatMessage({
      role: 'user',
      text: userQuery
    });

    // Show coach typing indicator
    this.dom.coachTypingBubble.classList.remove('hidden');
    this.dom.coachChatStream.scrollTop = this.dom.coachChatStream.scrollHeight;

    try {
      const fen = this.playChess.fen();
      const pgn = this.playChess.pgn();
      const inCheck = this.playChess.in_check();

      // Compute engine best move so Gemini knows the exact tactical move to explain
      let engineBestMove = null;
      try {
        engineBestMove = this.engine.findBestMove(this.playChess, 2);
      } catch (e) {
        console.warn('Could not compute engine best move:', e);
      }

      // If engine best move found, draw a helpful suggestion arrow on the match board
      if (engineBestMove && engineBestMove.move && this.playBoard) {
        this.playBoard.clearArrows();
        this.playBoard.addArrow(engineBestMove.move.from, engineBestMove.move.to, '#10b981');
      }

      const advice = await this.coach.askCoach({
        fen: fen,
        pgn: pgn,
        lastMove: this.playLastMove,
        userQuery: userQuery,
        difficulty: this.playDifficulty,
        playerColor: this.playPlayerColor,
        inCheck: inCheck,
        engineBestMove: engineBestMove
      });

      this.dom.coachTypingBubble.classList.add('hidden');

      this.addChatMessage({
        role: 'coach',
        text: advice
      });
      this.audio.playCelebration();
    } catch (err) {
      console.error('Coach query failed:', err);
      this.dom.coachTypingBubble.classList.add('hidden');

      // Intelligent engine-backed fallback matching exact requested format
      let fallbackText = '';
      if (engineBestMove && engineBestMove.move) {
        const pName = this.coach.getPieceName(engineBestMove.move.piece);
        const sq = engineBestMove.move.to;
        const isCap = Boolean(engineBestMove.move.captured);
        fallbackText = `Take your ${pName} to ${sq}, because ${isCap ? 'it captures the enemy piece and gains valuable material!' : 'it grabs control of key central squares and sets up an active game!'}\n\n* **Center Power:** Placing your ${pName} on **${sq}** keeps your attack strong.\n* **Army Teamwork:** Your pieces support each other on the board.\n* **Next Step:** Stay focused and keep your king safe!`;
      } else {
        fallbackText = `Take your queen to e4, because dominating the center puts maximum pressure on the opponent!`;
      }

      this.addChatMessage({
        role: 'coach',
        text: fallbackText
      });
    } finally {
      this.isCoachBusy = false;
      this.dom.coachPromptInput.disabled = false;
      this.dom.coachSendBtn.disabled = false;
      this.dom.coachPromptInput.focus();
    }
  }

  addChatMessage({ role, text }) {
    const isCoach = role === 'coach';
    const messageEl = document.createElement('div');
    messageEl.className = `flex items-start gap-3 chat-bubble-enter ${isCoach ? '' : 'flex-row-reverse'}`;

    const formattedContent = isCoach ? this.coach.formatCoachResponse(text) : `<p class="leading-relaxed text-sm text-white">${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`;

    messageEl.innerHTML = `
      <div class="w-8 h-8 rounded-xl ${isCoach ? 'bg-emerald-600/20 border border-emerald-500/30' : 'bg-blue-600/30 border border-blue-500/40'} flex items-center justify-center text-sm shrink-0 shadow-sm">
        ${isCoach ? '🧙‍♂️' : '👤'}
      </div>
      <div class="max-w-[85%] p-3.5 rounded-2xl ${isCoach ? 'bg-slate-900 border border-slate-800 text-slate-200 shadow-md' : 'bg-gradient-to-tr from-emerald-700 to-teal-600 text-white shadow-md'} text-sm">
        ${formattedContent}
      </div>
    `;

    // Insert before typing indicator
    this.dom.coachChatStream.insertBefore(messageEl, this.dom.coachTypingBubble);
    this.dom.coachChatStream.scrollTop = this.dom.coachChatStream.scrollHeight;
  }

  clearCoachChat() {
    this.dom.coachChatStream.innerHTML = `
      <div class="flex items-start gap-3 chat-bubble-enter">
        <div class="w-8 h-8 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-sm shrink-0">
          🧙‍♂️
        </div>
        <div class="flex-1 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-sm text-slate-200 shadow-md">
          <p class="font-semibold text-emerald-400 mb-1">Board analysis reset!</p>
          <p class="leading-relaxed text-slate-300">
            Ask me anything about your current position, or click any of the question chips below to get master tips!
          </p>
        </div>
      </div>
    `;
    this.dom.coachChatStream.appendChild(this.dom.coachTypingBubble);
  }

  // ========================================================
  // CURRICULUM DRILLS & LEVEL PROGRESSION (101 LEVELS)
  // ========================================================

  loadLevel(levelId) {
    const level = this.levels.find(l => l.id === levelId) || this.levels[0];
    this.currentLevelId = level.id;
    this.currentStepIndex = 0;
    this.levelCompleted = false;

    localStorage.setItem('gm_current_level', this.currentLevelId.toString());

    // Update UI elements
    this.dom.curriculumTierBadge.textContent = `Tier ${level.tier}: ${level.category}`;
    this.dom.curriculumLevelTitle.textContent = `Level ${level.id}: ${level.title}`;
    this.dom.curriculumObjective.textContent = level.objective;
    this.dom.curriculumDialogue.textContent = level.mentorDialogue;

    // Update Visual Target Badge
    if (this.dom.visualMoveBadge && level.solution && level.solution.length > 0) {
      const sol = level.solution[0];
      const from = sol.slice(0, 2);
      const to = sol.slice(2, 4);
      this.dom.visualMoveBadge.innerHTML = `<span>♟</span><span>${from}</span><span class="text-emerald-400 font-extrabold">➔</span><span class="text-white">${to}</span>`;
      this.dom.visualMoveBadge.classList.remove('hidden');
    }

    this.dom.nextLevelBtn.classList.add('hidden');
    this.showCurriculumFeedback('', 'neutral');

    // Initialize chess board state
    this.curriculumChess.load(level.fen);
    this.curriculumBoard.setPlayerColor(level.playerColor || 'w');
    this.curriculumBoard.setFlipped(level.playerColor === 'b');
    this.curriculumBoard.setInteractive(true);
    this.curriculumBoard.setChess(this.curriculumChess);

    this.updateCurriculumTurnBadge(this.curriculumChess.turn());
    this.updateMaterialGauge();

    // Auto-Demonstration if enabled
    if (this.autoDemonstrate) {
      setTimeout(() => this.demonstrateCurrentLesson(), 400);
    }
  }

  handleCurriculumMove(moveObj) {
    if (this.levelCompleted || this.isDemonstrating) return;

    const level = this.levels.find(l => l.id === this.currentLevelId);
    if (!level) return;

    const moveUci = `${moveObj.from}${moveObj.to}`;
    const expectedMove = level.solution[this.currentStepIndex];

    const moveRes = this.curriculumChess.move({
      from: moveObj.from,
      to: moveObj.to,
      promotion: moveObj.promotion || 'q'
    });

    if (!moveRes) {
      this.curriculumBoard.shake();
      this.audio.playError();
      return;
    }

    if (moveRes.captured) this.audio.playCapture();
    else this.audio.playMove();

    this.curriculumBoard.setChess(this.curriculumChess);
    this.updateMaterialGauge();

    // Check against lesson solution
    if (moveUci === expectedMove || moveRes.san === expectedMove) {
      this.currentStepIndex++;

      // Check if multi-step drill has opponent reply
      if (this.currentStepIndex < level.solution.length) {
        const opponentMoveUci = level.solution[this.currentStepIndex];
        this.currentStepIndex++;

        setTimeout(() => {
          const from = opponentMoveUci.slice(0, 2);
          const to = opponentMoveUci.slice(2, 4);
          const oppRes = this.curriculumChess.move({ from, to, promotion: 'q' });

          if (oppRes) {
            if (oppRes.captured) this.audio.playCapture();
            else this.audio.playMove();
            this.curriculumBoard.setChess(this.curriculumChess);
            this.updateMaterialGauge();
          }

          if (this.currentStepIndex >= level.solution.length) {
            this.completeCurrentLevel(level);
          }
        }, 500);
      } else {
        this.completeCurrentLevel(level);
      }
    } else {
      // Wrong move for the drill objective
      this.curriculumBoard.shake();
      this.audio.playError();
      this.showCurriculumFeedback(`Not quite! Remember: ${level.objective}`, 'error');

      setTimeout(() => {
        this.curriculumChess.undo();
        this.curriculumBoard.setChess(this.curriculumChess);
        this.updateMaterialGauge();
      }, 700);
    }
  }

  completeCurrentLevel(level) {
    this.levelCompleted = true;
    this.curriculumBoard.setInteractive(false);
    this.audio.playFanfare();

    // Reward XP & Rating
    if (!this.completedLevels.has(level.id)) {
      this.completedLevels.add(level.id);
      this.userXP += level.xp || 50;
      this.userRating += 10;
      if (level.id >= this.maxUnlockedLevel) {
        this.maxUnlockedLevel = level.id + 1;
      }
      this.saveProgress();
      this.updateStatsUI();
      this.renderLevelSelector();
    }

    this.showCurriculumFeedback(`🎉 **Brilliant!** ${level.explanation || 'Objective completed!'}`, 'success');
    this.dom.nextLevelBtn.classList.remove('hidden');
  }

  showHint() {
    const level = this.levels.find(l => l.id === this.currentLevelId);
    if (!level || !level.solution) return;

    const nextMove = level.solution[this.currentStepIndex];
    if (nextMove) {
      const from = nextMove.slice(0, 2);
      const to = nextMove.slice(2, 4);
      this.curriculumBoard.addArrow(from, to, '#f59e0b');
      this.showCurriculumFeedback(`💡 Hint: Move piece from <strong>${from}</strong> to <strong>${to}</strong>`, 'hint');
    }
  }

  demonstrateCurrentLesson() {
    const level = this.levels.find(l => l.id === this.currentLevelId);
    if (!level || !level.solution || level.solution.length === 0) return;

    this.isDemonstrating = true;
    this.curriculumChess.load(level.fen);
    this.curriculumBoard.setChess(this.curriculumChess);

    const firstMove = level.solution[0];
    const from = firstMove.slice(0, 2);
    const to = firstMove.slice(2, 4);

    this.curriculumBoard.addArrow(from, to, '#10b981');
    this.showCurriculumFeedback(`🎬 Watch: Push from <strong>${from}</strong> to <strong>${to}</strong>`, 'hint');

    setTimeout(() => {
      this.curriculumChess.move({ from, to, promotion: 'q' });
      this.curriculumBoard.setChess(this.curriculumChess);
      this.audio.playMove();

      setTimeout(() => {
        this.resetLevel();
        this.isDemonstrating = false;
      }, 1400);
    }, 700);
  }

  resetLevel() {
    this.loadLevel(this.currentLevelId);
  }

  goToNextLevel() {
    if (this.currentLevelId + 1 < this.levels.length) {
      this.loadLevel(this.currentLevelId + 1);
    }
  }

  showCurriculumFeedback(html, type = 'neutral') {
    if (!html) {
      this.dom.curriculumFeedback.className = 'hidden';
      return;
    }

    this.dom.curriculumFeedback.className = 'p-3.5 rounded-xl text-sm font-medium transition-all duration-200 border ';
    if (type === 'success') {
      this.dom.curriculumFeedback.classList.add('bg-emerald-950/60', 'border-emerald-500/50', 'text-emerald-300');
    } else if (type === 'error') {
      this.dom.curriculumFeedback.classList.add('bg-rose-950/60', 'border-rose-500/50', 'text-rose-300');
    } else if (type === 'hint') {
      this.dom.curriculumFeedback.classList.add('bg-amber-950/60', 'border-amber-500/50', 'text-amber-300');
    } else {
      this.dom.curriculumFeedback.classList.add('bg-slate-800/80', 'border-slate-600', 'text-slate-300');
    }

    this.dom.curriculumFeedback.innerHTML = html;
    this.dom.curriculumFeedback.classList.remove('hidden');
  }

  updateMaterialGauge() {
    const mat = this.engine.getMaterialBalance(this.curriculumChess);
    const diff = mat.diff;
    let text = 'Material: Equal';
    let pct = 50;

    if (diff > 0) {
      text = `White +${diff}`;
      pct = Math.min(95, 50 + diff * 4);
    } else if (diff < 0) {
      text = `Black +${Math.abs(diff)}`;
      pct = Math.max(5, 50 + diff * 4);
    }

    this.dom.materialScoreText.textContent = text;
    this.dom.materialGaugeFill.style.width = `${pct}%`;
  }

  updateCurriculumTurnBadge(turn) {
    if (turn === 'w') {
      this.dom.curriculumTurnBadge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-white text-slate-900 border border-slate-300 shadow-sm';
      this.dom.curriculumTurnBadge.textContent = 'White to move';
    } else {
      this.dom.curriculumTurnBadge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-white border border-slate-700 shadow-sm';
      this.dom.curriculumTurnBadge.textContent = 'Black to move';
    }
  }

  // ========================================================
  // LEVEL DRAWER & PROGRESSION OVERRIDE
  // ========================================================

  openLevelDrawer() {
    this.renderLevelSelector();
    this.dom.levelDrawerModal.classList.remove('hidden');
  }

  closeLevelDrawer() {
    this.dom.levelDrawerModal.classList.add('hidden');
  }

  renderLevelSelector() {
    const filterTier = this.dom.drawerTierFilter.value;
    this.dom.drawerLevelGrid.innerHTML = '';

    // Quick jump options
    this.dom.quickJumpSelect.innerHTML = '';

    const filtered = this.levels.filter(l => {
      if (filterTier === 'all') return true;
      return l.tier.toString() === filterTier;
    });

    this.levels.forEach(lvl => {
      const opt = document.createElement('option');
      opt.value = lvl.id;
      opt.textContent = `Lv ${lvl.id}: ${lvl.title}`;
      if (lvl.id === this.currentLevelId) opt.selected = true;
      this.dom.quickJumpSelect.appendChild(opt);
    });

    filtered.forEach(lvl => {
      const isCompleted = this.completedLevels.has(lvl.id);
      const isUnlocked = lvl.id <= this.maxUnlockedLevel;
      const isCurrent = lvl.id === this.currentLevelId;

      const card = document.createElement('div');
      card.className = `p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all duration-150 transform hover:-translate-y-0.5 ${
        isCurrent
          ? 'bg-emerald-950/70 border-emerald-500 ring-2 ring-emerald-500/50'
          : isCompleted
          ? 'bg-slate-800/80 border-amber-500/40 hover:border-amber-400'
          : isUnlocked
          ? 'bg-slate-800/80 border-slate-600 hover:border-emerald-500'
          : 'bg-slate-900/40 border-slate-800 opacity-60 hover:opacity-90'
      }`;

      let icon = '🔒';
      if (isCompleted) icon = '⭐';
      else if (isUnlocked) icon = '▶';

      card.innerHTML = `
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-xs font-bold text-slate-400">#${lvl.id}</span>
          <span class="text-sm">${icon}</span>
        </div>
        <div class="font-semibold text-sm text-white truncate mb-1" title="${lvl.title}">${lvl.title}</div>
        <div class="text-[11px] text-slate-400 truncate">${lvl.category}</div>
      `;

      card.onclick = () => {
        this.loadLevel(lvl.id);
        this.closeLevelDrawer();
      };

      this.dom.drawerLevelGrid.appendChild(card);
    });
  }

  unlockAllLevels() {
    this.maxUnlockedLevel = 100;
    this.saveProgress();
    this.renderLevelSelector();
    this.audio.playCelebration();
  }

  resetAllProgress() {
    if (confirm('Are you sure you want to reset all curriculum level progress?')) {
      this.completedLevels.clear();
      this.maxUnlockedLevel = 0;
      this.userXP = 0;
      this.userRating = 400;
      this.saveProgress();
      this.updateStatsUI();
      this.loadLevel(0);
      this.renderLevelSelector();
    }
  }

  updateStatsUI() {
    this.dom.userXPBadge.textContent = `${this.userXP} XP`;
    this.dom.userRatingBadge.textContent = this.userRating.toString();
  }

  saveProgress() {
    localStorage.setItem('gm_max_unlocked', this.maxUnlockedLevel.toString());
    localStorage.setItem('gm_completed_levels', JSON.stringify(Array.from(this.completedLevels)));
    localStorage.setItem('gm_user_xp', this.userXP.toString());
    localStorage.setItem('gm_user_rating', this.userRating.toString());
  }
}

// Global initialization on DOM Ready
window.addEventListener('DOMContentLoaded', () => {
  window.App = new GrandmasterApp();
  window.App.init();
});
