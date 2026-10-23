const fs = require('fs');

console.log('--- Motion Dojo Website Verification (Part A & B) ---');

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('styles.css', 'utf8');
const js = fs.readFileSync('script.js', 'utf8');

const criticalIds = [
  'header', 'hero', 'about', 'curriculum', 'projects', 'pricing', 'faq',
  'mobileMenuBtn', 'mobileDrawer', 'cardStack', 'carouselPrevBtn', 'carouselNextBtn',
  'videoModal', 'enrollModal', 'heroVideoTrigger', 'closeVideoModal', 'closeEnrollModal',
  'phase-outline-1', 'phase-outline-2', 'phase-outline-3', 'phase-outline-4'
];

let allPassed = true;

criticalIds.forEach(id => {
  if (!html.includes(`id="${id}"`)) {
    console.error(`❌ Missing ID in HTML: ${id}`);
    allPassed = false;
  } else {
    console.log(`✅ Verified ID: ${id}`);
  }
});

// Verify Brand Tokens defined in CSS :root
const requiredTokens = [
  '--dojo-white: #F7F5FF;',
  '--dojo-midnight: #140A2E;',
  '--motion-violet: #6D32E8;',
  '--electric-lavender: #A77BFF;',
  '--kinetic-lime: #C8FF3D;',
  '--surface: #FFFFFF;'
];

requiredTokens.forEach(token => {
  if (!css.includes(token)) {
    console.error(`❌ Missing CSS Token in :root: ${token}`);
    allPassed = false;
  } else {
    console.log(`✅ Verified Token: ${token}`);
  }
});

// Verify Zero Hex values outside :root in styles.css
const cssLines = css.split('\n');
let insideRoot = false;
let hexViolations = 0;
cssLines.forEach((line) => {
  if (line.includes(':root {')) insideRoot = true;
  if (insideRoot && line.includes('}')) insideRoot = false;
  if (!insideRoot && /#[0-9a-fA-F]{3,8}\b/.test(line)) {
    hexViolations++;
  }
});

if (hexViolations === 0) {
  console.log('✅ Verified Zero hard-coded hex values outside :root');
} else {
  console.error(`❌ Found ${hexViolations} hard-coded hex values outside :root`);
  allPassed = false;
}

// Verify British English Spellings in visible text
const britishTerms = [
  'Enrol now',
  'Pricing &amp; Enrolment',
  '2 instalments of ₦20,000',
  'Start instalment',
  'Can I pay in instalments?',
  'two instalments of ₦20,000',
  'Colour usage in motion design'
];

britishTerms.forEach(term => {
  if (!html.includes(term)) {
    console.error(`❌ Missing British English term in index.html: "${term}"`);
    allPassed = false;
  } else {
    console.log(`✅ Verified British English term: "${term}"`);
  }
});

// Verify Focus ring
if (css.includes('outline: 3px solid var(--motion-violet);')) {
  console.log('✅ Verified focus ring in var(--motion-violet)');
} else {
  console.error('❌ Missing focus ring in var(--motion-violet)');
  allPassed = false;
}

// Verify Dark mode overrides removed
if (!css.includes('@media (prefers-color-scheme: dark)')) {
  console.log('✅ Verified prefers-color-scheme dark override removed');
} else {
  console.error('❌ prefers-color-scheme: dark is still present in styles.css');
  allPassed = false;
}

if (allPassed) {
  console.log('\n🎉 ALL UPDATES VERIFIED & PASSING WITH FLYING COLOURS!');
} else {
  console.error('\n⚠️ VERIFICATION DETECTED ISSUES');
  process.exit(1);
}
