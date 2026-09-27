const fs = require('fs');
let home = fs.readFileSync('src/components/Home.jsx', 'utf8');

// Change x, y, width
home = home.replace('<image className="home__blob-img" x="25" y="40" width="420"', '<image className="home__blob-img" x="-10" y="70" width="500"');

fs.writeFileSync('src/components/Home.jsx', home);
