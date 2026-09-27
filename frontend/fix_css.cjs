const fs = require('fs');
let css = fs.readFileSync('src/styles/styles.css', 'utf8');
if (!css.includes('.home__stats-grid')) {
  css += '\n' +
'/* Stats Grid */\n' +
'.home__stats-grid {\n' +
'  grid-column: 1 / -1;\n' +
'  display: grid;\n' +
'  grid-template-columns: repeat(4, 1fr);\n' +
'  gap: 1.5rem;\n' +
'  margin-top: 2rem;\n' +
'  width: 100%;\n' +
'}\n' +
'\n' +
'.stat-card {\n' +
'  background: #fff;\n' +
'  padding: 1.5rem 1rem;\n' +
'  border-radius: 12px;\n' +
'  box-shadow: 0 4px 12px rgba(0,0,0,0.05);\n' +
'  text-align: center;\n' +
'  transition: transform 0.3s ease;\n' +
'  border: 1px solid rgba(0,0,0,0.05);\n' +
'}\n' +
'\n' +
'.stat-card:hover {\n' +
'  transform: translateY(-5px);\n' +
'  box-shadow: 0 8px 24px rgba(0,0,0,0.1);\n' +
'}\n' +
'\n' +
'.stat-icon {\n' +
'  font-size: 2rem;\n' +
'  color: #333;\n' +
'  margin-bottom: 0.5rem;\n' +
'}\n' +
'\n' +
'.stat-card h3 {\n' +
'  font-size: 1.1rem;\n' +
'  font-weight: 700;\n' +
'  color: #1a1a1a;\n' +
'  margin-bottom: 0.25rem;\n' +
'}\n' +
'\n' +
'.stat-card p {\n' +
'  font-size: 0.85rem;\n' +
'  color: #555;\n' +
'}\n' +
'\n' +
'.home__footer-text {\n' +
'  grid-column: 1 / -1;\n' +
'  font-size: 0.85rem;\n' +
'  font-style: italic;\n' +
'  color: #666;\n' +
'  margin-top: 1rem;\n' +
'}\n' +
'\n' +
'@media screen and (max-width: 992px) {\n' +
'  .home__stats-grid {\n' +
'    grid-template-columns: repeat(2, 1fr);\n' +
'  }\n' +
'}\n' +
'\n' +
'@media screen and (max-width: 576px) {\n' +
'  .home__stats-grid {\n' +
'    grid-template-columns: 1fr;\n' +
'  }\n' +
'}\n';
  fs.writeFileSync('src/styles/styles.css', css, 'utf8');
}
