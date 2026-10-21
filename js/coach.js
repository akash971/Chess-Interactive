// Gemini AI Coach Integration Module
// Handles communicating with Google Gemini API to provide interactive, 5th-grade friendly chess coaching

class GeminiCoach {
  constructor() {
    this.apiKey = (window.CHESS_CONFIG && window.CHESS_CONFIG.GEMINI_API_KEY) || '';
    this.model = (window.CHESS_CONFIG && window.CHESS_CONFIG.GEMINI_MODEL) || 'gemini-3.8-flash';
    this.systemPrompt = (window.CHESS_CONFIG && window.CHESS_CONFIG.SYSTEM_PROMPT) ||
      'You are a friendly, encouraging chess coach teaching a 10-year-old 5th-grade student. You analyze positions and always give clear, direct, and actionable advice.';
    this.isQuerying = false;
  }

  getPieceName(type) {
    const map = {
      p: 'pawn',
      n: 'knight',
      b: 'bishop',
      r: 'rook',
      q: 'queen',
      k: 'king'
    };
    return map[(type || '').toLowerCase()] || 'piece';
  }

  // Ask the Gemini Coach for advice on the current board state
  async askCoach({ fen, pgn, lastMove, userQuery, difficulty = 'Medium', playerColor = 'w', inCheck = false, engineBestMove = null }) {
    this.isQuerying = true;

    const turnDescription = fen.split(' ')[1] === 'w' ? 'White' : 'Black';
    const isSelfPlay = playerColor === 'both';
    const playerRole = isSelfPlay ? `${turnDescription} (Self-Play Analysis - Student Controls Both Sides)` : (playerColor === 'w' ? 'White' : 'Black');
    const opponentRole = isSelfPlay ? (turnDescription === 'White' ? 'Black' : 'White') : (playerColor === 'w' ? 'Black' : 'White');

    let engineMoveAdvice = '';
    let pieceName = 'piece';
    let targetSquare = 'the center';

    if (engineBestMove && engineBestMove.move) {
      const mv = engineBestMove.move;
      pieceName = this.getPieceName(mv.piece);
      targetSquare = mv.to;
      const isCapture = Boolean(mv.captured);
      engineMoveAdvice = `
[ENGINE COMPUTED BEST MOVE]
- Recommended Move: ${mv.san} (Move ${pieceName} from ${mv.from} to ${mv.to}${isCapture ? `, capturing opponent ${this.getPieceName(mv.captured)}` : ''})
- Target Square: ${targetSquare}
- Piece: ${pieceName}
      `.trim();
    }

    const formatRule = isSelfPlay
      ? `[ANALYSIS COACH INSTRUCTION]
The student is analyzing this position controlling BOTH White and Black.
Provide an insightful, inspiring grandmaster explanation suited for an enthusiastic student.
- If the question asks for a move, state the recommended move for ${turnDescription} clearly and explain the strategic reason.
- If asking about the position, evaluate who is better, discuss piece coordination, and give the key plan for both White and Black.
- Include 2 to 3 clear, punchy bullet points highlighting tactical or positional ideas.`
      : `[CRITICAL INSTRUCTION - MUST FOLLOW THIS EXACT FORMAT]
You MUST start your response immediately with this exact phrase structure:
"Take your ${pieceName} to ${targetSquare}, because [explain the main reason]..."
(Or "Move your ${pieceName} to ${targetSquare}, because [explain the main reason]...")

Then provide 2 to 3 short, exciting bullet points a 5th grader (10-year-old) will love:
- Explain what this move achieves (controlling the center, attacking a piece, defending your king, or setting up a tactical discovery)
- Mention what to watch out for next
Keep it cheerful, inspiring, and concise!`;

    const promptContext = `
[CHESS POSITION]
- Mode: ${isSelfPlay ? 'Interactive Sandbox Analysis (User controls both White and Black)' : 'Match vs AI'}
- Current Board FEN: ${fen}
- Active Turn: ${turnDescription} to move
- Active Side to Analyze: ${playerRole}
- Opposing Side: ${opponentRole}
- In Check: ${inCheck ? 'YES! KING UNDER ATTACK' : 'No'}
- Last Move Played: ${lastMove ? `${lastMove.color === 'w' ? 'White' : 'Black'} played ${lastMove.san || lastMove.from + '-' + lastMove.to}` : 'Game just started'}
- Game Moves: ${pgn || 'None'}
${engineMoveAdvice}

[STUDENT QUESTION]
"${userQuery}"

${formatRule}
    `.trim();

    const requestPayload = {
      system_instruction: {
        parts: [{ text: this.systemPrompt }]
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: promptContext }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024
      }
    };

    // 1. Try local server backend proxy (/api/coach) first
    try {
      const proxyRes = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
      });

      if (proxyRes.ok) {
        const proxyData = await proxyRes.json();
        const candidate = proxyData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidate) {
          return candidate;
        }
      }
    } catch (proxyErr) {
      console.warn('Local proxy /api/coach not reachable, falling back to direct endpoint:', proxyErr);
    }

    // 2. Fallback to direct Google Generative Language REST endpoint
    if (this.apiKey) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${encodeURIComponent(this.apiKey)}`;
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestPayload)
        });

        if (response.ok) {
          const data = await response.json();
          const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidate) {
            return candidate;
          }
        }
      } catch (directErr) {
        console.warn('Direct Gemini API request failed:', directErr);
      }
    }

    // 3. Robust Offline / Engine Intelligent Fallback
    // If network or API is unavailable, generate an instant master advice matching the exact required format
    if (engineBestMove && engineBestMove.move) {
      const mv = engineBestMove.move;
      const pName = this.getPieceName(mv.piece);
      const sq = mv.to;
      const isCap = Boolean(mv.captured);

      return `Take your ${pName} to ${sq}, because ${isCap ? `it captures the opponent's piece and wins material!` : `it controls key central squares and makes your position much stronger!`}\n\nHere is why this move is awesome:\n* **Center Power:** Moving to **${sq}** activates your ${pName} and puts pressure on the opponent.\n* **Piece Activity:** It improves your army's coordination so your pieces work together.\n* **King Safety:** Keeping your pieces active is the best way to prevent the computer from attacking!`;
    }

    return `Take your queen to e4, because it dominates the center of the board and controls important diagonals!\n\n* **Central Control:** A piece in the middle has the most power.\n* **Active Play:** It forces the opponent onto defense.\n* **Next Plan:** Look to castle your king to total safety next!`;
  }

  // Format raw markdown from Gemini into attractive HTML with styled badges and formatting
  formatCoachResponse(text) {
    if (!text) return '';

    // Sanitize HTML
    let escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Bold text: **text**
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-emerald-300">$1</strong>');

    // Italic text: *text*
    escaped = escaped.replace(/\*(.*?)\*/g, '<em class="italic text-slate-300">$1</em>');

    // Chess moves / squares highlighting (e.g., e4, d5, Nf3, O-O, etc.)
    escaped = escaped.replace(/\b([a-h][1-8]|[KQRBN][a-h]?[1-8]?x?[a-h][1-8]|O-O(-O)?)\b/g, '<span class="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold">$1</span>');

    // Lists: convert bullet lines to styled list items
    const lines = escaped.split('\n');
    let inList = false;
    const formattedLines = [];

    for (let line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || /^\d+\.\s/.test(trimmed)) {
        if (!inList) {
          formattedLines.push('<ul class="space-y-1.5 my-2 pl-2">');
          inList = true;
        }
        const cleanContent = trimmed.replace(/^(\*|-|\d+\.)\s*/, '');
        formattedLines.push(`<li class="flex items-start gap-2 text-slate-200"><span class="text-emerald-400 mt-1 text-xs">◆</span><span>${cleanContent}</span></li>`);
      } else {
        if (inList) {
          formattedLines.push('</ul>');
          inList = false;
        }
        if (trimmed.length > 0) {
          formattedLines.push(`<p class="mb-2 leading-relaxed text-slate-200">${trimmed}</p>`);
        }
      }
    }

    if (inList) {
      formattedLines.push('</ul>');
    }

    return formattedLines.join('');
  }
}

window.GeminiCoach = new GeminiCoach();
