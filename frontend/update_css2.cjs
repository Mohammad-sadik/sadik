const fs = require('fs');
let cssContent = fs.readFileSync('src/styles/styles.css', 'utf8');

const premiumCss = 
/* PREMIUM UTILITIES */
.premium-card {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.premium-card:hover {
  box-shadow: 0 20px 40px -15px rgba(124, 58, 237, 0.25) !important;
  border-color: rgba(124, 58, 237, 0.3) !important;
}

/* Glassmorphism Navigation */
.l-header {
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.dark-theme .l-header {
  background: rgba(15, 23, 42, 0.8) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

/* Gradient Text Selection */
::selection {
  background: rgba(124, 58, 237, 0.3);
  color: inherit;
}
;

if (!cssContent.includes('.premium-card')) {
  fs.writeFileSync('src/styles/styles.css', cssContent + premiumCss);
  console.log('Premium styles added to styles.css');
}
