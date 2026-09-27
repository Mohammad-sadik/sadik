const fs = require('fs');

// Fix Home.jsx SVG image tag to make it cover the blob properly
let home = fs.readFileSync('src/components/Home.jsx', 'utf8');
home = home.replace(/<image className="home__blob-img".*?\/>/, '<image className="home__blob-img" x="20" y="60" width="460" href="/assets/img/perfil.png"/>');
fs.writeFileSync('src/components/Home.jsx', home);

// Fix CSS
let css = fs.readFileSync('src/styles/styles.css', 'utf8');
css = css.replace(/\.home__blob-img\s*\{[\s\S]*?\}/g, '.home__blob-img { width: auto; }');
fs.writeFileSync('src/styles/styles.css', css);
