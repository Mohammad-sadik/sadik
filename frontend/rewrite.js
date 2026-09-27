const fs = require('fs');
let code = fs.readFileSync('src/components/Home.jsx', 'utf8');

// Find the end of home__data
let dataEnd = code.indexOf('<div className="home__img">');

if (dataEnd > -1 && code.includes('className="home__stats-grid"')) {
    // Extract stats-grid and footer
    let statsGridMatch = code.match(/<div className="home__stats-grid">[\s\S]*?<\/div>\s*<\/div>/);
    // wait, regex is fragile here. Let's just rewrite the whole file.
}
