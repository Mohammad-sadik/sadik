const fs = require('fs');

// Fix Work.jsx
let work = fs.readFileSync('src/components/Work.jsx', 'utf8');
work = work.replace(/top:\s*2rem;/g, 'bottom: -10px; top: auto;');
fs.writeFileSync('src/components/Work.jsx', work);

// Fix Timeline.jsx
let timeline = fs.readFileSync('src/components/Timeline.jsx', 'utf8');
timeline = timeline.replace(/top:\s*2rem;/g, 'bottom: -10px; top: auto;');
fs.writeFileSync('src/components/Timeline.jsx', timeline);

// Fix styles.css
let css = fs.readFileSync('src/styles/styles.css', 'utf8');
css = css.replace(/top:\s*2rem;/g, 'bottom: -10px; top: auto;');
css = css.replace(/top:\s*3rem;/g, 'bottom: -15px; top: auto;');
fs.writeFileSync('src/styles/styles.css', css);

console.log('Fixed underline position across files.');
