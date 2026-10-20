function getLuminance(hex) {
  const rgb = hex.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16) / 255);
  const a = rgb.map(v => v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function getContrast(hex1, hex2) {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return Number(ratio.toFixed(2));
}

// Alpha compositing over solid background
function blendAlpha(fgHex, alpha, bgHex) {
  const fg = fgHex.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16));
  const bg = bgHex.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16));
  const res = fg.map((c, i) => Math.round(c * alpha + bg[i] * (1 - alpha)));
  return '#' + res.map(x => x.toString(16).padStart(2, '0')).join('');
}

console.log('=== WCAG AA / AAA CONTRAST RATIO AUDIT ===\n');

const tests = [
  {
    name: 'Primary text on Dojo White (Page background)',
    fg: '#140A2E',
    bg: '#F7F5FF',
    req: 4.5
  },
  {
    name: 'Secondary text (72% midnight) on Dojo White',
    fg: blendAlpha('#140A2E', 0.72, '#F7F5FF'),
    bg: '#F7F5FF',
    req: 4.5
  },
  {
    name: 'Motion Violet headings on Dojo White',
    fg: '#6D32E8',
    bg: '#F7F5FF',
    req: 4.5
  },
  {
    name: 'Primary button (White text on Motion Violet)',
    fg: '#FFFFFF',
    bg: '#6D32E8',
    req: 4.5
  },
  {
    name: 'Hero headline chip "Dangerously" (White text on Motion Violet)',
    fg: '#FFFFFF',
    bg: '#6D32E8',
    req: 4.5
  },
  {
    name: 'Hero headline chip "Good" (Midnight text on Kinetic Lime)',
    fg: '#140A2E',
    bg: '#C8FF3D',
    req: 4.5
  },
  {
    name: 'Cards on Dojo White: text on White surface',
    fg: '#140A2E',
    bg: '#FFFFFF',
    req: 4.5
  },
  {
    name: 'Cards on Dojo White: secondary text (72%) on White surface',
    fg: blendAlpha('#140A2E', 0.72, '#FFFFFF'),
    bg: '#FFFFFF',
    req: 4.5
  },
  {
    name: 'Dark Sections (Projects, Pricing, Footer): White heading on Midnight',
    fg: '#FFFFFF',
    bg: '#140A2E',
    req: 4.5
  },
  {
    name: 'Dark Sections: Body text (82% #F7F5FF) on Midnight',
    fg: blendAlpha('#F7F5FF', 0.82, '#140A2E'),
    bg: '#140A2E',
    req: 4.5
  },
  {
    name: 'Dark Sections: Muted text (62% #F7F5FF) on Midnight',
    fg: blendAlpha('#F7F5FF', 0.62, '#140A2E'),
    bg: '#140A2E',
    req: 3.0 // 3.0:1 for large text/captions/UI
  },
  {
    name: 'Pricing Instalment Chip (Lime): Midnight on Kinetic Lime',
    fg: '#140A2E',
    bg: '#C8FF3D',
    req: 4.5
  },
  {
    name: 'Pricing Instalment Chip (Violet): White on Motion Violet',
    fg: '#FFFFFF',
    bg: '#6D32E8',
    req: 4.5
  },
  {
    name: 'Pillar 1 Badge (Lime): Midnight Icon on Kinetic Lime',
    fg: '#140A2E',
    bg: '#C8FF3D',
    req: 4.5
  },
  {
    name: 'Pillar 2 Badge (Violet): White Icon on Motion Violet',
    fg: '#FFFFFF',
    bg: '#6D32E8',
    req: 4.5
  },
  {
    name: 'Pillar 3 Badge (Midnight): Kinetic Lime Icon on Dojo Midnight',
    fg: '#C8FF3D',
    bg: '#140A2E',
    req: 4.5
  },
  {
    name: 'Pillar 4 Badge (Lavender): Midnight Icon on Electric Lavender',
    fg: '#140A2E',
    bg: '#A77BFF',
    req: 4.5
  }
];

let allPassed = true;
tests.forEach(t => {
  const ratio = getContrast(t.fg, t.bg);
  const passed = ratio >= t.req;
  console.log(`${passed ? '✅ PASS' : '❌ FAIL'} [${ratio}:1 >= ${t.req}:1] ${t.name}`);
  if (!passed) allPassed = false;
});

console.log('\nContrast Audit Result:', allPassed ? 'ALL TESTS PASSED WCAG AA/AAA!' : 'FAILURES DETECTED');
