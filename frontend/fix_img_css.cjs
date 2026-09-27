const fs = require('fs');
let css = fs.readFileSync('src/styles/styles.css', 'utf8');

css = css.replace(/\.home__blob-img\s*\{\s*width:\s*360px;\s*\}/g, '.home__blob-img { width: 450px; transform: translateY(20px); }');

fs.writeFileSync('src/styles/styles.css', css);
