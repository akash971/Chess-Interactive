const fs = require('fs');

console.log('Building standalone single-file HTML...');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const chessMinJs = fs.readFileSync('js/chess.min.js', 'utf8');
const audioJs = fs.readFileSync('js/audio.js', 'utf8');
const piecesJs = fs.readFileSync('js/pieces.js', 'utf8');
const curriculumJs = fs.readFileSync('js/curriculum.js', 'utf8');
const engineJs = fs.readFileSync('js/engine.js', 'utf8');
const boardJs = fs.readFileSync('js/board.js', 'utf8');
const appJs = fs.readFileSync('js/app.js', 'utf8');

let bundle = indexHtml;

// Replace external script tags with inlined scripts
const scriptsBlock = `
  <script>
    // --- Inlined chess.min.js ---
    ${chessMinJs}
  </script>
  <script>
    // --- Inlined audio.js ---
    ${audioJs}
  </script>
  <script>
    // --- Inlined pieces.js ---
    ${piecesJs}
  </script>
  <script>
    // --- Inlined curriculum.js ---
    ${curriculumJs}
  </script>
  <script>
    // --- Inlined engine.js ---
    ${engineJs}
  </script>
  <script>
    // --- Inlined board.js ---
    ${boardJs}
  </script>
  <script>
    // --- Inlined app.js ---
    ${appJs}
  </script>
`;

bundle = bundle.replace(/<!-- Scripts -->[\s\S]*?<\/body>/, `${scriptsBlock}\n</body>`);

fs.writeFileSync('standalone.html', bundle);
console.log('Successfully created standalone.html!');
