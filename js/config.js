// Application Configuration
// Defines default parameters and loads API configuration from /api/config or environment
window.CHESS_CONFIG = {
  GEMINI_API_KEY: (window.CHESS_CONFIG && window.CHESS_CONFIG.GEMINI_API_KEY) || '',
  GEMINI_MODEL: 'gemini-3.8-flash',
  PROJECT_ID: '537850591670',
  SYSTEM_PROMPT: 'You are a friendly, encouraging chess coach teaching a 10-year-old 5th-grade student. You analyze positions and always give clear, direct, and actionable advice.'
};

// Automatically fetch API configuration from local server endpoint if available
if (typeof fetch !== 'undefined') {
  fetch('/api/config')
    .then(res => res.ok ? res.json() : null)
    .then(cfg => {
      if (cfg && cfg.GEMINI_API_KEY) {
        window.CHESS_CONFIG.GEMINI_API_KEY = cfg.GEMINI_API_KEY;
      }
    })
    .catch(() => {});
}
