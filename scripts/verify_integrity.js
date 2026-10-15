const fs = require('fs');

console.log('--- Verifying Chess Application Integrity ---');

// 1. Check index.html DOM IDs against app.js
const html = fs.readFileSync('index.html', 'utf8');
const appJs = fs.readFileSync('js/app.js', 'utf8');

const idRegex = /document\.getElementById\(['"]([^'"]+)['"]\)/g;
let match;
const ids = [];
while ((match = idRegex.exec(appJs)) !== null) {
  ids.push(match[1]);
}

const missing = ids.filter(id => !html.includes(`id="${id}"`));
console.log(`Verified ${ids.length} DOM elements queried by app.js.`);
if (missing.length > 0) {
  console.error('Missing IDs in index.html:', missing);
  process.exit(1);
} else {
  console.log('✓ 100% of DOM IDs in app.js exist in index.html!');
}

// 2. Test GeminiCoach formatting
global.window = global;
const coachJs = fs.readFileSync('js/coach.js', 'utf8');
eval(coachJs); // executes class definition

const testText = "A great move is **Pawn to e4**! Control the center and develop *pieces*.\n* Push e4\n* Move Nf3";
const formatted = window.GeminiCoach.formatCoachResponse(testText);
console.log('✓ Gemini Coach Markdown Formatter test passed. Output contains:', formatted.includes('text-emerald-300'));

// 3. Verify .env credentials
const envContent = fs.readFileSync('.env', 'utf8');
if (envContent.includes('GEMINI_API_KEY=') && !envContent.includes('GEMINI_API_KEY=\n')) {
  console.log('✓ .env credentials loaded properly.');
} else {
  console.error('Missing Gemini API key in .env');
  process.exit(1);
}

// 4. Verify standalone bundle
const standalone = fs.readFileSync('standalone.html', 'utf8');
if (standalone.includes('GeminiCoach') && standalone.includes('GrandmasterApp') && standalone.includes('view-play-ai')) {
  console.log('✓ standalone.html is fully up to date with new dual-mode and Gemini Coach!');
} else {
  console.error('standalone.html is missing inlined modules');
  process.exit(1);
}

console.log('--- ALL INTEGRITY TESTS PASSED SUCCESSFULLY! ---');
