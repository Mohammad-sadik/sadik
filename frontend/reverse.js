
const fs = require('fs');
const path = 'src/components/Work.jsx';
let content = fs.readFileSync(path, 'utf8');

const regex = /<div className="timeline-row">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g;
let matches = content.match(regex);
if (matches && matches.length === 5) {
    const reversed = matches.reverse().join('\n\n          ');
    content = content.replace(/<div className="timeline-row">[\s\S]*?<\/i>\s*<\/div>\s*<\/div>/g, 'REPLACE_TOKEN');
    // Actually replace is dangerous with global. Let's do it manually.
}
console.log(matches ? matches.length : 0);

