// Interactive Chessboard UI Module
// Supports Click-to-Move, Drag-and-Drop, Destination Dots, Capture Rings, Arrows, Coordinates, Flip

class ChessBoardUI {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Container #${containerId} not found`);
      return;
    }

    this.options = Object.assign({
      flipped: false,
      interactive: true,
      playerColor: 'w',
      onMove: null
    }, options);

    this.chess = null;
    this.selectedSquare = null;
    this.legalMovesForSelected = [];
    this.highlightedSquares = [];
    this.arrows = [];
    this.lastMove = null;
    this.draggedPiece = null;
    this.dragElement = null;

    this.initDOM();
  }

  initDOM() {
    this.container.innerHTML = `
      <div class="relative select-none aspect-square w-full max-w-[560px] mx-auto rounded-xl overflow-hidden shadow-2xl border-4 border-slate-700/80 bg-slate-900 transition-transform duration-300">
        <!-- 8x8 Board Grid -->
        <div id="board-grid" class="grid grid-cols-8 grid-rows-8 w-full h-full relative"></div>

        <!-- SVG Annotation Layer for Arrows & Vectors -->
        <svg id="board-svg-layer" class="absolute inset-0 w-full h-full pointer-events-none z-20">
          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto">
              <path d="M 0 0 L 8 4 L 0 8 z" fill="#10b981" />
            </marker>
            <marker id="arrowhead-gold" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto">
              <path d="M 0 0 L 8 4 L 0 8 z" fill="#f59e0b" />
            </marker>
            <marker id="arrowhead-blue" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto">
              <path d="M 0 0 L 8 4 L 0 8 z" fill="#3b82f6" />
            </marker>
          </defs>
          <g id="svg-arrows-group"></g>
        </svg>

        <!-- Promotion Modal Overlay -->
        <div id="promotion-modal" class="hidden absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-30 flex items-center justify-center p-4">
          <div class="bg-slate-800 border border-slate-600 rounded-2xl p-5 shadow-2xl text-center max-w-xs w-full animate-scaleIn">
            <h4 class="text-white font-bold text-lg mb-4">Promote Your Pawn</h4>
            <div id="promotion-choices" class="grid grid-cols-4 gap-2"></div>
          </div>
        </div>
      </div>
    `;

    this.boardGrid = this.container.querySelector('#board-grid');
    this.svgGroup = this.container.querySelector('#svg-arrows-group');
    this.promotionModal = this.container.querySelector('#promotion-modal');
    this.promotionChoices = this.container.querySelector('#promotion-choices');

    this.bindGlobalEvents();
  }

  setChess(chessInstance) {
    this.chess = chessInstance;
    this.selectedSquare = null;
    this.legalMovesForSelected = [];
    this.clearArrows();
    this.render();
  }

  setFlipped(flipped) {
    this.options.flipped = flipped;
    this.render();
    this.renderArrows();
  }

  setInteractive(val) {
    this.options.interactive = val;
  }

  setPlayerColor(color) {
    this.options.playerColor = color;
  }

  // Convert (row, col) to square notation ('e4') respecting board flip
  indicesToSquare(row, col) {
    const fileIndex = this.options.flipped ? 7 - col : col;
    const rankIndex = this.options.flipped ? row + 1 : 8 - row;
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    return `${files[fileIndex]}${rankIndex}`;
  }

  // Convert square notation ('e4') to current DOM (row, col)
  squareToIndices(sq) {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const file = sq[0];
    const rank = parseInt(sq[1], 10);
    const fileIdx = files.indexOf(file);

    const col = this.options.flipped ? 7 - fileIdx : fileIdx;
    const row = this.options.flipped ? rank - 1 : 8 - rank;
    return { row, col };
  }

  // Render the 8x8 chessboard
  render() {
    if (!this.boardGrid || !this.chess) return;

    this.boardGrid.innerHTML = '';
    const boardState = this.chess.board();
    const inCheck = this.chess.in_check();
    const turn = this.chess.turn();

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const actualRow = this.options.flipped ? 7 - r : r;
        const actualCol = this.options.flipped ? 7 - c : c;
        const sqName = this.indicesToSquare(r, c);
        const piece = boardState[actualRow][actualCol];

        const isLight = (r + c) % 2 === 0;
        const squareEl = document.createElement('div');
        squareEl.dataset.square = sqName;
        squareEl.className = `relative flex items-center justify-center transition-colors duration-150 ${
          isLight ? 'bg-[#eeeed2] text-[#769656]' : 'bg-[#769656] text-[#eeeed2]'
        }`;

        // Last move highlight
        if (this.lastMove && (this.lastMove.from === sqName || this.lastMove.to === sqName)) {
          squareEl.classList.add('bg-amber-300/60');
        }

        // Selected square highlight
        if (this.selectedSquare === sqName) {
          squareEl.classList.add('bg-emerald-400/70', 'ring-2', 'ring-emerald-400', 'ring-inset');
        }

        // Check highlight on king
        if (inCheck && piece && piece.type === 'k' && piece.color === turn) {
          squareEl.classList.add('bg-rose-500/80', 'animate-pulse');
        }

        // Custom highlighted squares (hints, objectives)
        if (this.highlightedSquares.includes(sqName)) {
          squareEl.classList.add('ring-4', 'ring-amber-400', 'ring-inset', 'bg-amber-400/30');
        }

        // Coordinates notation along edges
        const isBottomRank = r === 7;
        const isLeftFile = c === 0;

        if (isBottomRank) {
          const fileLetter = document.createElement('span');
          fileLetter.className = 'absolute right-1 bottom-0.5 text-[10px] font-bold leading-none pointer-events-none opacity-80';
          fileLetter.textContent = sqName[0];
          squareEl.appendChild(fileLetter);
        }
        if (isLeftFile) {
          const rankNumber = document.createElement('span');
          rankNumber.className = 'absolute left-1 top-0.5 text-[10px] font-bold leading-none pointer-events-none opacity-80';
          rankNumber.textContent = sqName[1];
          squareEl.appendChild(rankNumber);
        }

        // Legal move indicators (dots & rings)
        const isLegalDest = this.legalMovesForSelected.some(m => m.to === sqName);
        if (isLegalDest) {
          if (piece) {
            // Capture target ring
            const ring = document.createElement('div');
            ring.className = 'absolute inset-0 rounded-full border-4 border-slate-900/30 pointer-events-none z-10';
            squareEl.appendChild(ring);
          } else {
            // Move destination dot
            const dot = document.createElement('div');
            dot.className = 'w-3.5 h-3.5 rounded-full bg-slate-900/25 pointer-events-none z-10';
            squareEl.appendChild(dot);
          }
        }

        // Render SVG Piece
        if (piece) {
          const pieceContainer = document.createElement('div');
          pieceContainer.className = 'w-full h-full p-1 cursor-grab active:cursor-grabbing flex items-center justify-center';
          pieceContainer.innerHTML = window.ChessPieces.getSvg(piece.type, piece.color);
          pieceContainer.dataset.piece = `${piece.color}${piece.type}`;
          pieceContainer.dataset.square = sqName;
          squareEl.appendChild(pieceContainer);
        }

        // Square click handler
        squareEl.addEventListener('click', (e) => this.handleSquareClick(sqName, e));
        this.attachDragListeners(squareEl, sqName);

        this.boardGrid.appendChild(squareEl);
      }
    }
  }

  // Drag and drop support
  attachDragListeners(squareEl, sqName) {
    squareEl.addEventListener('mousedown', (e) => this.onDragStart(e, sqName));
    squareEl.addEventListener('touchstart', (e) => this.onDragStart(e, sqName), { passive: false });
  }

  onDragStart(e, sqName) {
    if (!this.options.interactive) return;
    const piece = this.chess.get(sqName);
    if (!piece) return;
    if (this.options.playerColor && piece.color !== this.options.playerColor && this.options.playerColor !== 'both') return;
    if (piece.color !== this.chess.turn()) return;

    this.draggedSquare = sqName;
    this.selectSquare(sqName);

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const pieceSvg = window.ChessPieces.getSvg(piece.type, piece.color);
    this.dragGhost = document.createElement('div');
    this.dragGhost.className = 'fixed pointer-events-none z-50 w-16 h-16 transform -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl';
    this.dragGhost.innerHTML = pieceSvg;
    this.dragGhost.style.left = `${clientX}px`;
    this.dragGhost.style.top = `${clientY}px`;
    document.body.appendChild(this.dragGhost);

    this.onDragMoveBind = (evt) => this.onDragMove(evt);
    this.onDragEndBind = (evt) => this.onDragEnd(evt);

    document.addEventListener('mousemove', this.onDragMoveBind);
    document.addEventListener('mouseup', this.onDragEndBind);
    document.addEventListener('touchmove', this.onDragMoveBind, { passive: false });
    document.addEventListener('touchend', this.onDragEndBind);
  }

  onDragMove(e) {
    if (!this.dragGhost) return;
    if (e.preventDefault && e.cancelable) e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    this.dragGhost.style.left = `${clientX}px`;
    this.dragGhost.style.top = `${clientY}px`;
  }

  onDragEnd(e) {
    if (this.dragGhost) {
      document.body.removeChild(this.dragGhost);
      this.dragGhost = null;
    }
    document.removeEventListener('mousemove', this.onDragMoveBind);
    document.removeEventListener('mouseup', this.onDragEndBind);
    document.removeEventListener('touchmove', this.onDragMoveBind);
    document.removeEventListener('touchend', this.onDragEndBind);

    const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;

    const targetEl = document.elementFromPoint(clientX, clientY);
    if (!targetEl) return;
    const squareContainer = targetEl.closest('[data-square]');
    if (squareContainer && squareContainer.dataset.square) {
      const targetSquare = squareContainer.dataset.square;
      if (targetSquare !== this.draggedSquare) {
        this.attemptMove(this.draggedSquare, targetSquare);
      }
    }
  }

  bindGlobalEvents() {
    // Unselect when clicking outside board
    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target) && !e.target.closest('#promotion-modal')) {
        if (this.selectedSquare) {
          this.selectedSquare = null;
          this.legalMovesForSelected = [];
          this.render();
        }
      }
    });
  }

  handleSquareClick(sqName) {
    if (!this.options.interactive) return;

    if (!this.selectedSquare) {
      // First click: select piece if friendly
      const piece = this.chess.get(sqName);
      if (piece && piece.color === this.chess.turn()) {
        if (this.options.playerColor && this.options.playerColor !== 'both' && piece.color !== this.options.playerColor) {
          return;
        }
        this.selectSquare(sqName);
      }
    } else {
      // Second click: either attempt move or reselect
      if (sqName === this.selectedSquare) {
        this.selectedSquare = null;
        this.legalMovesForSelected = [];
        this.render();
      } else {
        const piece = this.chess.get(sqName);
        if (piece && piece.color === this.chess.turn()) {
          // Reselect friendly piece
          this.selectSquare(sqName);
        } else {
          // Attempt move to target square
          this.attemptMove(this.selectedSquare, sqName);
        }
      }
    }
  }

  selectSquare(sqName) {
    this.selectedSquare = sqName;
    this.legalMovesForSelected = this.chess.moves({ square: sqName, verbose: true });
    this.render();
  }

  attemptMove(from, to) {
    const isLegal = this.legalMovesForSelected.some(m => m.from === from && m.to === to);
    
    // Check for pawn promotion
    const piece = this.chess.get(from);
    const isPromotion = piece && piece.type === 'p' && (to[1] === '8' || to[1] === '1');

    if (isPromotion && isLegal) {
      this.promptPromotion(piece.color, (promoType) => {
        this.executeMove({ from, to, promotion: promoType });
      });
      return;
    }

    if (isLegal) {
      this.executeMove({ from, to, promotion: 'q' });
    } else {
      // Illegal / unviable move attempted
      if (this.options.onMove) {
        this.options.onMove({ from, to, legal: false });
      }
      this.selectedSquare = null;
      this.legalMovesForSelected = [];
      this.render();
    }
  }

  executeMove(moveObj) {
    this.lastMove = { from: moveObj.from, to: moveObj.to };
    this.selectedSquare = null;
    this.legalMovesForSelected = [];
    this.clearArrows();

    if (this.options.onMove) {
      this.options.onMove(Object.assign({ legal: true }, moveObj));
    }
    this.render();
  }

  promptPromotion(color, callback) {
    this.promotionChoices.innerHTML = '';
    const choices = ['q', 'r', 'b', 'n'];
    choices.forEach(type => {
      const btn = document.createElement('button');
      btn.className = 'w-14 h-14 p-2 bg-slate-700/80 hover:bg-emerald-600 rounded-xl flex items-center justify-center transition-all duration-150 transform hover:scale-105 shadow';
      btn.innerHTML = window.ChessPieces.getSvg(type, color);
      btn.onclick = () => {
        this.promotionModal.classList.add('hidden');
        callback(type);
      };
      this.promotionChoices.appendChild(btn);
    });
    this.promotionModal.classList.remove('hidden');
  }

  // Shake the board for wrong/illegal move feedback
  shake() {
    const boardWrapper = this.container.firstElementChild;
    if (boardWrapper) {
      boardWrapper.classList.add('animate-shake');
      setTimeout(() => {
        boardWrapper.classList.remove('animate-shake');
      }, 500);
    }
  }

  // Highlight specific hint squares
  highlight(squares = []) {
    this.highlightedSquares = squares;
    this.render();
  }

  clearHighlights() {
    this.highlightedSquares = [];
    this.render();
  }

  // Draw GM arrows on SVG layer
  addArrow(from, to, color = '#10b981') {
    this.arrows.push({ from, to, color });
    this.renderArrows();
  }

  clearArrows() {
    this.arrows = [];
    if (this.svgGroup) {
      this.svgGroup.innerHTML = '';
    }
  }

  renderArrows() {
    if (!this.svgGroup) return;
    this.svgGroup.innerHTML = '';

    const boardRect = this.boardGrid.getBoundingClientRect();
    const squareSize = boardRect.width / 8;

    this.arrows.forEach(arrow => {
      const fromPos = this.squareToIndices(arrow.from);
      const toPos = this.squareToIndices(arrow.to);

      // Percentage centers (0% to 100%)
      const x1 = ((fromPos.col + 0.5) / 8) * 100;
      const y1 = ((fromPos.row + 0.5) / 8) * 100;
      const x2 = ((toPos.col + 0.5) / 8) * 100;
      const y2 = ((toPos.row + 0.5) / 8) * 100;

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', `${x1}%`);
      line.setAttribute('y1', `${y1}%`);
      line.setAttribute('x2', `${x2}%`);
      line.setAttribute('y2', `${y2}%`);
      line.setAttribute('stroke', arrow.color);
      line.setAttribute('stroke-width', '5');
      line.setAttribute('stroke-linecap', 'round');
      line.setAttribute('opacity', '0.85');

      let markerId = 'arrowhead';
      if (arrow.color.includes('f59e0b') || arrow.color.includes('gold')) markerId = 'arrowhead-gold';
      if (arrow.color.includes('3b82f6') || arrow.color.includes('blue')) markerId = 'arrowhead-blue';
      line.setAttribute('marker-end', `url(#${markerId})`);

      this.svgGroup.appendChild(line);
    });
  }

  // Animate a single piece move smoothly across the board
  animateMove(from, to, options = {}) {
    return new Promise((resolve) => {
      const fromEl = this.boardGrid.querySelector(`[data-square="${from}"]`);
      const toEl = this.boardGrid.querySelector(`[data-square="${to}"]`);

      if (!fromEl || !toEl) {
        resolve();
        return;
      }

      const pieceEl = fromEl.querySelector('[data-piece]');
      if (!pieceEl) {
        resolve();
        return;
      }

      // Visual cues: clear previous arrows, highlight squares, draw vector arrow
      this.clearArrows();
      const arrowColor = options.color || '#10b981';
      this.highlight([from, to]);
      this.addArrow(from, to, arrowColor);

      const fromRect = fromEl.getBoundingClientRect();
      const toRect = toEl.getBoundingClientRect();
      const deltaX = toRect.left - fromRect.left;
      const deltaY = toRect.top - fromRect.top;

      // Create floating animated ghost
      const ghost = pieceEl.cloneNode(true);
      ghost.style.position = 'fixed';
      ghost.style.left = `${fromRect.left}px`;
      ghost.style.top = `${fromRect.top}px`;
      ghost.style.width = `${fromRect.width}px`;
      ghost.style.height = `${fromRect.height}px`;
      ghost.style.zIndex = '9999';
      ghost.style.pointerEvents = 'none';
      ghost.style.filter = 'drop-shadow(0 14px 24px rgba(0,0,0,0.7)) drop-shadow(0 0 10px rgba(16,185,129,0.6))';
      ghost.style.transition = 'transform 0.7s cubic-bezier(0.2, 0.9, 0.3, 1.1)';
      document.body.appendChild(ghost);

      // Dim original piece while ghost glides
      pieceEl.style.opacity = '0.2';

      requestAnimationFrame(() => {
        ghost.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.15)`;
      });

      setTimeout(() => {
        // Landing audio
        if (options.captured) {
          if (window.ChessAudio) window.ChessAudio.playCapture();
        } else {
          if (window.ChessAudio) window.ChessAudio.playMove();
        }

        // Landing ping ripple ring
        const ripple = document.createElement('div');
        ripple.className = 'absolute inset-0 rounded-full border-4 border-emerald-400 animate-ping pointer-events-none z-30';
        toEl.appendChild(ripple);
        setTimeout(() => {
          if (ripple.parentElement) ripple.parentElement.removeChild(ripple);
        }, 650);

        // Remove ghost
        if (ghost.parentElement) ghost.parentElement.removeChild(ghost);
        pieceEl.style.opacity = '1';

        resolve();
      }, 720);
    });
  }

  // Demonstrate an entire tactical move sequence with smooth step-by-step animation
  async demonstrateSequence(moveList, onComplete) {
    this.setInteractive(false);
    this.clearArrows();
    this.clearHighlights();

    for (let i = 0; i < moveList.length; i++) {
      const mv = moveList[i];
      const arrowColor = i % 2 === 0 ? '#10b981' : '#3b82f6'; // Green for player, blue for opponent
      
      await this.animateMove(mv.from, mv.to, {
        captured: !!mv.captured,
        color: arrowColor
      });

      // Update board position internally so next move reflects reality
      if (this.chess) {
        this.chess.move({
          from: mv.from,
          to: mv.to,
          promotion: mv.promotion || 'q'
        });
        this.lastMove = { from: mv.from, to: mv.to };
        this.render();
      }

      // Brief pause between moves
      if (i < moveList.length - 1) {
        await new Promise(r => setTimeout(r, 550));
      }
    }

    // Hold final position for viewing
    await new Promise(r => setTimeout(r, 1000));

    if (onComplete) {
      onComplete();
    }
  }
}

window.ChessBoardUI = ChessBoardUI;
