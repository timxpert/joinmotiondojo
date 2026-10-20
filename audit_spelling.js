const fs = require('fs');

console.log('=== AUDITING BRITISH ENGLISH & US TERMS ===\n');

const files = ['index.html', 'script.js', 'styles.css'];
let matches = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    // Look for US terms
    const regex = /\b(enroll|enrolls|enrolled|enrolling|enrollment|enrollments|installment|installments|program|programs|color|colors|organize|organizes|center|centers|practise|practice)\b/gi;
    let match;
    while ((match = regex.exec(line)) !== null) {
      matches.push({
        file,
        lineNum: index + 1,
        term: match[0],
        fullLine: line.trim()
      });
    }
  });
});

console.log(`Total occurrences found: ${matches.length}`);
matches.forEach(m => {
  console.log(`${m.file}:${m.lineNum} [${m.term}] -> ${m.fullLine}`);
});
