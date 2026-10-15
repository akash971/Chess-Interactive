// GrandmasterPath Main Application Controller
// Orchestrates Curriculum, Coach Panel, Minimax AI Sandbox, and State Persistence

class GrandmasterApp {
  constructor() {
    this.levels = window.CurriculumLevels || [];
    this.audio = window.ChessAudio;
    this.engine = window.ChessEngine;

    // State loaded from localStorage
    this.currentLevelId = parseInt(localStorage.getItem('gm_current_level') || '0', 10);
    this.maxUnlockedLevel = parseInt(localStorage.getItem('gm_max_unlocked') || '0', 10);
    this.completedLevels = new Set(JSON.parse(localStorage.getItem('gm_completed_levels') || '[]'));
    this.userXP = parseInt(localStorage.getItem('gm_user_xp') || '0', 10);
    this.userRating = parseInt(localStorage.getItem('gm_user_rating') || '400', 10);

    // Active mode: 'curriculum' or 'sandbox'
    this.mode = 'curriculum';

    // Curriculum game instance & state
    this.chess = new Chess();
    this.currentStepIndex = 0;
    this.levelCompleted = false;

    // Demonstration animation state
    this.autoDemonstrate = localStorage.getItem('gm_auto_demo') === 'true';
    this.isDemonstrating = false;

    // Sandbox state
    this.sandboxChess = new Chess();
    this.sandboxPlayerColor = 'w';
    this.sandboxDifficulty = 2; // 1: Novice, 2: Intermediate, 3: Club
    this.sandboxMoveHistory = [];
    this.isAiThinking = false;

    // Board UI instance
    this.board = null;

    // DOM references
    this.dom = {};
  }

  init() {
    this.cacheDOM();
    this.initBoard();
    this.bindEvents();
    this.updateStatsUI();
    this.loadLevel(this.currentLevelId);
    this.renderLevelSelector();
  }

  cacheDOM() {
    this.dom = {
      // Header stats
      userXP: document.getElementById('user-xp-badge'),
      userRating: document.getElementById('user-rating-badge'),
      audioToggleBtn: document.getElementById('audio-toggle-btn'),
      audioIcon: document.getElementById('audio-icon'),
      modeCurriculumBtn: document.getElementById('mode-curriculum-btn'),
      modeSandboxBtn: document.getElementById('mode-sandbox-btn'),
      levelDrawerBtn: document.getElementById('level-drawer-btn'),
      levelDrawerModal: document.getElementById('level-drawer-modal'),
      closeDrawerBtn: document.getElementById('close-drawer-btn'),

      // Containers
      curriculumPanel: document.getElementById('curriculum-panel'),
      sandboxPanel: document.getElementById('sandbox-panel'),

      // Curriculum UI
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

      // Sandbox UI
      sandboxColorSelect: document.getElementById('sandbox-color-select'),
      sandboxDifficultySelect: document.getElementById('sandbox-difficulty-select'),
      sandboxTurnBadge: document.getElementById('sandbox-turn-badge'),
      sandboxEvaluationText: document.getElementById('sandbox-evaluation-text'),
      sandboxMoveList: document.getElementById('sandbox-move-list'),
      sandboxUndoBtn: document.getElementById('sandbox-undo-btn'),
      sandboxFlipBtn: document.getElementById('sandbox-flip-btn'),
      sandboxNewGameBtn: document.getElementById('sandbox-new-game-btn'),
      aiThinkingIndicator: document.getElementById('ai-thinking-indicator'),

      // Drawer modal elements
      drawerTierFilter: document.getElementById('drawer-tier-filter'),
      drawerLevelGrid: document.getElementById('drawer-level-grid'),
      drawerUnlockAllBtn: document.getElementById('drawer-unlock-all-btn'),
      drawerResetProgressBtn: document.getElementById('drawer-reset-progress-btn'),
    };
  }

  initBoard() {
    this.board = new ChessBoardUI('chessboard-container', {
      playerColor: 'w',
      flipped: false,
      interactive: true,
      onMove: (moveObj) => this.handleBoardMove(moveObj)
    });
  }

  bindEvents() {
    // Mode toggles
    this.dom.modeCurriculumBtn.addEventListener('click', () => this.switchMode('curriculum'));
    this.dom.modeSandboxBtn.addEventListener('click', () => this.switchMode('sandbox'));

    // Audio mute toggle
    this.dom.audioToggleBtn.addEventListener('click', () => {
      const isMuted = this.audio.toggleMute();
      this.updateAudioIcon(isMuted);
    });
    this.updateAudioIcon(this.audio.muted);

    // Level navigation in Curriculum
    this.dom.hintBtn.addEventListener('click', () => this.showHint());
    this.dom.resetLevelBtn.addEventListener('click', () => this.resetLevel());
    this.dom.nextLevelBtn.addEventListener('click', () => this.goToNextLevel());

    // Animated Lesson Demonstration
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

    // Quick Jump dropdown
    this.dom.quickJumpSelect.addEventListener('change', (e) => {
      const targetId = parseInt(e.target.value, 10);
      if (!isNaN(targetId)) {
        this.loadLevel(targetId);
      }
    });

    // Drawer modal controls
    this.dom.levelDrawerBtn.addEventListener('click', () => this.openLevelDrawer());
    this.dom.closeDrawerBtn.addEventListener('click', () => this.closeLevelDrawer());
    this.dom.levelDrawerModal.addEventListener('click', (e) => {
      if (e.target === this.dom.levelDrawerModal) this.closeLevelDrawer();
    });
    this.dom.drawerTierFilter.addEventListener('change', () => this.renderLevelSelector());

    // Cheat / Override buttons in drawer
    this.dom.drawerUnlockAllBtn.addEventListener('click', () => {
      this.maxUnlockedLevel = 100;
      localStorage.setItem('gm_max_unlocked', '100');
      this.renderLevelSelector();
      this.showFeedback('All 100 Levels Unlocked! You can jump anywhere.', 'info');
    });

    this.dom.drawerResetProgressBtn.addEventListener('click', () => {
      if (confirm('Reset all progress back to Level 0?')) {
        this.completedLevels.clear();
        this.maxUnlockedLevel = 0;
        this.currentLevelId = 0;
        this.userXP = 0;
        this.userRating = 400;
        this.saveState();
        this.updateStatsUI();
        this.renderLevelSelector();
        this.loadLevel(0);
        this.closeLevelDrawer();
      }
    });

    // Sandbox controls
    this.dom.sandboxColorSelect.addEventListener('change', (e) => {
      this.sandboxPlayerColor = e.target.value;
      this.board.setFlipped(this.sandboxPlayerColor === 'b');
      this.startNewSandboxGame();
    });

    this.dom.sandboxDifficultySelect.addEventListener('change', (e) => {
      this.sandboxDifficulty = parseInt(e.target.value, 10);
    });

    this.dom.sandboxFlipBtn.addEventListener('click', () => {
      this.board.setFlipped(!this.board.options.flipped);
    });

    this.dom.sandboxUndoBtn.addEventListener('click', () => this.undoSandboxMove());
    this.dom.sandboxNewGameBtn.addEventListener('click', () => this.startNewSandboxGame());
  }

  updateAudioIcon(isMuted) {
    if (isMuted) {
      this.dom.audioIcon.innerHTML = `
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
      `;
    } else {
      this.dom.audioIcon.innerHTML = `
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      `;
    }
  }

  saveState() {
    localStorage.setItem('gm_current_level', this.currentLevelId.toString());
    localStorage.setItem('gm_max_unlocked', this.maxUnlockedLevel.toString());
    localStorage.setItem('gm_completed_levels', JSON.stringify(Array.from(this.completedLevels)));
    localStorage.setItem('gm_user_xp', this.userXP.toString());
    localStorage.setItem('gm_user_rating', this.userRating.toString());
  }

  updateStatsUI() {
    this.dom.userXP.textContent = `${this.userXP} XP`;
    this.dom.userRating.textContent = `${this.userRating}`;
  }

  switchMode(newMode) {
    this.mode = newMode;
    if (newMode === 'curriculum') {
      this.dom.modeCurriculumBtn.className = 'px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 text-white shadow-lg shadow-emerald-900/30 transition-all';
      this.dom.modeSandboxBtn.className = 'px-4 py-2 rounded-xl text-sm font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all';
      this.dom.curriculumPanel.classList.remove('hidden');
      this.dom.sandboxPanel.classList.add('hidden');
      this.loadLevel(this.currentLevelId);
    } else {
      this.dom.modeSandboxBtn.className = 'px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 text-white shadow-lg shadow-emerald-900/30 transition-all';
      this.dom.modeCurriculumBtn.className = 'px-4 py-2 rounded-xl text-sm font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all';
      this.dom.sandboxPanel.classList.remove('hidden');
      this.dom.curriculumPanel.classList.add('hidden');
      this.startNewSandboxGame();
    }
  }

  // ==========================================
  // CURRICULUM CONTROLLER
  // ==========================================
  loadLevel(levelId) {
    if (levelId < 0 || levelId >= this.levels.length) return;
    this.currentLevelId = levelId;
    this.saveState();

    const lvl = this.levels[levelId];
    this.currentStepIndex = 0;
    this.levelCompleted = false;

    // Load FEN into chess instance
    this.chess.load(lvl.fen);

    // Update board UI
    this.board.setPlayerColor(lvl.playerColor);
    this.board.setFlipped(lvl.playerColor === 'b');
    this.board.setInteractive(true);
    this.board.setChess(this.chess);

    // Update text UI
    this.dom.curriculumTierBadge.textContent = lvl.tierName;
    this.dom.curriculumLevelTitle.textContent = `Level ${lvl.id}: ${lvl.title}`;
    this.dom.curriculumObjective.textContent = lvl.objective;
    this.dom.curriculumDialogue.textContent = lvl.dialogue;
    this.dom.nextLevelBtn.classList.add('hidden');

    // Update Visual Move Badge (no text required)
    if (this.dom.visualMoveBadge && lvl.solution && lvl.solution.length > 0) {
      try {
        const tempChess = new Chess(lvl.fen);
        const firstMv = tempChess.move(lvl.solution[0], { sloppy: true });
        if (firstMv) {
          const pieceSymbols = { p: '♟', n: '♞', b: '♝', r: '♜', q: '♛', k: '♚' };
          const symbol = pieceSymbols[firstMv.piece] || '♟';
          this.dom.visualMoveBadge.innerHTML = `
            <span class="text-base">${symbol}</span>
            <span class="text-slate-300 font-bold">${firstMv.from.toUpperCase()}</span>
            <span class="text-emerald-400 font-extrabold">➔</span>
            <span class="text-white font-black">${firstMv.to.toUpperCase()}${firstMv.captured ? ' ⚔' : ''}</span>
          `;
        }
      } catch (e) {}
    }

    if (this.dom.demoBtn) {
      this.dom.demoBtn.innerHTML = '<span class="text-base">🎬</span><span>Show Move (Animation)</span>';
      this.dom.demoBtn.classList.remove('opacity-75');
    }

    // Update Quick Jump select value
    this.populateQuickJumpSelect();

    // Material gauge
    this.updateMaterialGauge();
    this.updateTurnBadge(this.chess.turn());

    // Clear feedback
    this.showFeedback('', 'neutral');

    // Auto-demonstrate animation if enabled
    if (this.autoDemonstrate) {
      setTimeout(() => {
        if (this.currentLevelId === levelId && !this.levelCompleted && !this.isDemonstrating) {
          this.demonstrateCurrentLesson();
        }
      }, 450);
    }
  }

  // Demonstrate current lesson with smooth piece animation
  async demonstrateCurrentLesson() {
    const lvl = this.levels[this.currentLevelId];
    if (!lvl || this.isDemonstrating) return;

    this.isDemonstrating = true;

    // Reset board to initial FEN
    this.chess.load(lvl.fen);
    this.board.setChess(this.chess);

    // Compute move sequence details
    const tempChess = new Chess(lvl.fen);
    const moveSequence = [];
    for (const san of lvl.solution) {
      const m = tempChess.move(san, { sloppy: true });
      if (m) {
        moveSequence.push({
          from: m.from,
          to: m.to,
          captured: m.captured,
          san: m.san,
          promotion: m.promotion,
          piece: m.piece,
          color: m.color
        });
      }
    }

    if (moveSequence.length === 0) {
      this.isDemonstrating = false;
      return;
    }

    this.showFeedback('🎬 <strong>Demonstration in progress:</strong> Watch the piece move on the board...', 'hint');
    if (this.dom.demoBtn) {
      this.dom.demoBtn.innerHTML = '<span class="animate-spin text-base">⏳</span><span>Demonstrating...</span>';
      this.dom.demoBtn.classList.add('opacity-75');
    }

    await this.board.demonstrateSequence(moveSequence, () => {
      // Demonstration complete: reset board so user can play it!
      this.chess.load(lvl.fen);
      this.board.setChess(this.chess);
      this.board.setInteractive(true);

      // Highlight starting piece with glowing hint and trajectory arrow
      if (moveSequence[0]) {
        this.board.highlight([moveSequence[0].from]);
        this.board.addArrow(moveSequence[0].from, moveSequence[0].to, '#10b981');
      }

      this.showFeedback('🎯 <strong>Now your turn!</strong> Move the piece as demonstrated in the animation above.', 'success');
      if (this.dom.demoBtn) {
        this.dom.demoBtn.innerHTML = '<span class="text-base">↺</span><span>Replay Animation</span>';
        this.dom.demoBtn.classList.remove('opacity-75');
      }
      this.isDemonstrating = false;
    });
  }

  populateQuickJumpSelect() {
    this.dom.quickJumpSelect.innerHTML = '';
    this.levels.forEach(l => {
      const opt = document.createElement('option');
      opt.value = l.id;
      const isDone = this.completedLevels.has(l.id) ? '⭐ ' : '';
      opt.textContent = `${isDone}L${l.id}: ${l.title}`;
      if (l.id === this.currentLevelId) opt.selected = true;
      this.dom.quickJumpSelect.appendChild(opt);
    });
  }

  resetLevel() {
    this.loadLevel(this.currentLevelId);
  }

  goToNextLevel() {
    if (this.currentLevelId < this.levels.length - 1) {
      this.loadLevel(this.currentLevelId + 1);
    } else {
      this.showFeedback('🎉 You have completed all 100 levels of GrandmasterPath!', 'success');
    }
  }

  showHint() {
    const lvl = this.levels[this.currentLevelId];
    if (!lvl) return;

    if (lvl.hintSquares && lvl.hintSquares.length >= 2) {
      this.board.highlight(lvl.hintSquares);
      this.board.addArrow(lvl.hintSquares[0], lvl.hintSquares[1], '#f59e0b');
    }

    this.showFeedback(`💡 Hint: ${lvl.hint}`, 'hint');
  }

  handleBoardMove(moveObj) {
    if (this.mode === 'curriculum') {
      this.handleCurriculumMove(moveObj);
    } else {
      this.handleSandboxMove(moveObj);
    }
  }

  handleCurriculumMove(moveObj) {
    const lvl = this.levels[this.currentLevelId];
    if (!lvl || this.levelCompleted) return;

    // Check legality according to chess rules
    const moveRes = this.chess.move({
      from: moveObj.from,
      to: moveObj.to,
      promotion: moveObj.promotion || 'q'
    });

    if (!moveRes) {
      // Illegal move
      this.board.shake();
      this.audio.playError();
      this.showFeedback(lvl.mistakeFeedback || 'Illegal move! Check piece movement rules.', 'error');
      return;
    }

    // Play move audio
    if (moveRes.captured) {
      this.audio.playCapture();
    } else {
      this.audio.playMove();
    }
    if (this.chess.in_check()) {
      this.audio.playCheck();
    }

    // Check if move matches solution SAN
    const expectedSAN = lvl.solution[this.currentStepIndex];
    const isCorrect = (moveRes.san === expectedSAN) || (moveRes.from + moveRes.to === expectedSAN);

    if (isCorrect) {
      this.currentStepIndex++;
      this.board.setChess(this.chess);
      this.updateMaterialGauge();

      if (this.currentStepIndex >= lvl.solution.length) {
        // Level Successfully Solved!
        this.levelCompleted = true;
        this.audio.playVictory();
        this.showFeedback(`🏆 Brilliant! ${lvl.explanation}`, 'success');

        // Award XP and Rating
        if (!this.completedLevels.has(lvl.id)) {
          this.completedLevels.add(lvl.id);
          this.userXP += 25;
          this.userRating += Math.max(10, 25 - Math.floor(lvl.id / 6));
          if (this.currentLevelId >= this.maxUnlockedLevel && this.currentLevelId < 100) {
            this.maxUnlockedLevel = this.currentLevelId + 1;
          }
          this.saveState();
          this.updateStatsUI();
          this.renderLevelSelector();
        }

        this.dom.nextLevelBtn.classList.remove('hidden');
      } else {
        // Multi-step drill: Opponent engine responds
        this.board.setInteractive(false);
        setTimeout(() => {
          const opponentSAN = lvl.solution[this.currentStepIndex];
          const oppMove = this.chess.move(opponentSAN, { sloppy: true });
          if (oppMove) {
            if (oppMove.captured) this.audio.playCapture();
            else this.audio.playMove();
            this.board.setChess(this.chess);
            this.board.setInteractive(true);
            this.currentStepIndex++;
            this.showFeedback('Opponent replied. Find the next winning move!', 'info');
          }
        }, 500);
      }
    } else {
      // Incorrect move played
      this.board.shake();
      this.audio.playError();
      this.showFeedback(`❌ Not quite right. ${lvl.mistakeFeedback}`, 'error');

      // Undo the wrong move after brief pause
      setTimeout(() => {
        this.chess.undo();
        this.board.setChess(this.chess);
        this.updateMaterialGauge();
      }, 650);
    }
  }

  showFeedback(text, type = 'neutral') {
    if (!text) {
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
    this.dom.curriculumFeedback.innerHTML = text;
    this.dom.curriculumFeedback.classList.remove('hidden');
  }

  updateMaterialGauge() {
    const mat = this.engine.getMaterialBalance(this.chess);
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

  updateTurnBadge(turn) {
    if (turn === 'w') {
      this.dom.curriculumTurnBadge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-white text-slate-900 border border-slate-300 shadow-sm';
      this.dom.curriculumTurnBadge.textContent = 'White to move';
    } else {
      this.dom.curriculumTurnBadge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-white border border-slate-700 shadow-sm';
      this.dom.curriculumTurnBadge.textContent = 'Black to move';
    }
  }

  // ==========================================
  // LEVEL SELECTOR DRAWER
  // ==========================================
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

    const filtered = this.levels.filter(l => {
      if (filterTier === 'all') return true;
      return l.tier.toString() === filterTier;
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

  // ==========================================
  // PRACTICE VS AI SANDBOX CONTROLLER
  // ==========================================
  startNewSandboxGame() {
    this.sandboxChess = new Chess();
    this.sandboxMoveHistory = [];
    this.isAiThinking = false;
    this.dom.aiThinkingIndicator.classList.add('hidden');

    this.board.setPlayerColor(this.sandboxPlayerColor);
    this.board.setFlipped(this.sandboxPlayerColor === 'b');
    this.board.setInteractive(true);
    this.board.setChess(this.sandboxChess);

    this.updateSandboxUI();

    // If player is Black, AI moves first
    if (this.sandboxPlayerColor === 'b') {
      this.makeAiMove();
    }
  }

  handleSandboxMove(moveObj) {
    if (this.isAiThinking) return;

    const moveRes = this.sandboxChess.move({
      from: moveObj.from,
      to: moveObj.to,
      promotion: moveObj.promotion || 'q'
    });

    if (!moveRes) {
      this.board.shake();
      this.audio.playError();
      return;
    }

    if (moveRes.captured) this.audio.playCapture();
    else this.audio.playMove();
    if (this.sandboxChess.in_check()) this.audio.playCheck();

    this.sandboxMoveHistory.push(moveRes);
    this.board.setChess(this.sandboxChess);
    this.updateSandboxUI();

    // Check game over
    if (this.checkSandboxGameOver()) return;

    // AI response turn
    if (this.sandboxChess.turn() !== this.sandboxPlayerColor) {
      this.makeAiMove();
    }
  }

  async makeAiMove() {
    this.isAiThinking = true;
    this.board.setInteractive(false);
    this.dom.aiThinkingIndicator.classList.remove('hidden');

    const result = await this.engine.findBestMoveAsync(this.sandboxChess, this.sandboxDifficulty, 400);

    this.isAiThinking = false;
    this.dom.aiThinkingIndicator.classList.add('hidden');
    this.board.setInteractive(true);

    if (result && result.move) {
      const moveRes = this.sandboxChess.move(result.move);
      if (moveRes) {
        if (moveRes.captured) this.audio.playCapture();
        else this.audio.playMove();
        if (this.sandboxChess.in_check()) this.audio.playCheck();

        this.sandboxMoveHistory.push(moveRes);
        this.board.setChess(this.sandboxChess);
        this.updateSandboxUI();
        this.checkSandboxGameOver();
      }
    }
  }

  undoSandboxMove() {
    if (this.isAiThinking) return;
    // Undo both AI move and player move
    if (this.sandboxChess.history().length > 0) {
      this.sandboxChess.undo();
      this.sandboxMoveHistory.pop();
      if (this.sandboxChess.turn() !== this.sandboxPlayerColor && this.sandboxChess.history().length > 0) {
        this.sandboxChess.undo();
        this.sandboxMoveHistory.pop();
      }
      this.board.setChess(this.sandboxChess);
      this.updateSandboxUI();
    }
  }

  checkSandboxGameOver() {
    if (this.sandboxChess.in_checkmate()) {
      const winner = this.sandboxChess.turn() === 'w' ? 'Black' : 'White';
      alert(`Checkmate! ${winner} wins.`);
      return true;
    }
    if (this.sandboxChess.in_draw()) {
      let reason = 'Draw';
      if (this.sandboxChess.in_stalemate()) reason = 'Stalemate';
      else if (this.sandboxChess.in_threefold_repetition()) reason = 'Threefold Repetition';
      alert(`Game Drawn: ${reason}`);
      return true;
    }
    return false;
  }

  updateSandboxUI() {
    const turn = this.sandboxChess.turn();
    if (turn === 'w') {
      this.dom.sandboxTurnBadge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-white text-slate-900 border border-slate-300 shadow-sm';
      this.dom.sandboxTurnBadge.textContent = 'White to move';
    } else {
      this.dom.sandboxTurnBadge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-white border border-slate-700 shadow-sm';
      this.dom.sandboxTurnBadge.textContent = 'Black to move';
    }

    // Material & Position Evaluation score
    const evalScore = (this.engine.evaluate(this.sandboxChess) / 100).toFixed(1);
    const scorePrefix = evalScore > 0 ? `+${evalScore}` : evalScore;
    this.dom.sandboxEvaluationText.textContent = `Eval: ${scorePrefix}`;

    // Move history PGN list
    this.dom.sandboxMoveList.innerHTML = '';
    const history = this.sandboxChess.history({ verbose: true });
    for (let i = 0; i < history.length; i += 2) {
      const moveNum = Math.floor(i / 2) + 1;
      const whiteMove = history[i] ? history[i].san : '';
      const blackMove = history[i + 1] ? history[i + 1].san : '';

      const row = document.createElement('div');
      row.className = 'grid grid-cols-3 py-1 px-2 text-xs rounded hover:bg-slate-700/50 font-mono';
      row.innerHTML = `
        <span class="text-slate-400 font-semibold">${moveNum}.</span>
        <span class="text-white">${whiteMove}</span>
        <span class="text-slate-300">${blackMove}</span>
      `;
      this.dom.sandboxMoveList.appendChild(row);
    }
    this.dom.sandboxMoveList.scrollTop = this.dom.sandboxMoveList.scrollHeight;
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.App = new GrandmasterApp();
  window.App.init();
});
