const fs = require('fs');
const path = require('path');

function validateHtml(filePath) {
  console.log(`Validating: ${filePath}`);
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  // 기본 HTML 구조 검사
  const doctypeMatch = content.match(/<!DOCTYPE html>/i);
  const htmlOpenMatch = content.match(/<html[^>]*>/i);
  const htmlCloseMatch = content.match(/<\/html>/i);
  const headOpenMatch = content.match(/<head[^>]*>/i);
  const headCloseMatch = content.match(/<\/head>/i);
  const bodyOpenMatch = content.match(/<body[^>]*>/i);
  const bodyCloseMatch = content.match(/<\/body>/i);
  
  let isValid = true;
  const issues = [];
  
  if (!doctypeMatch) {
    issues.push('Missing DOCTYPE declaration');
    isValid = false;
  }
  
  if (!htmlOpenMatch || !htmlCloseMatch) {
    issues.push('Missing or malformed html tags');
    isValid = false;
  }
  
  if (!headOpenMatch || !headCloseMatch) {
    issues.push('Missing or malformed head tags');
    isValid = false;
  }
  
  if (!bodyOpenMatch || !bodyCloseMatch) {
    issues.push('Missing or malformed body tags');
    isValid = false;
  }
  
  // 메타 태그 검사
  const metaTags = content.match(/<meta[^>]*>/gi) || [];
  const linkTags = content.match(/<link[^>]*>/gi) || [];
  const scriptTags = content.match(/<script[^>]*>/gi) || [];
  
  console.log(`  - DOCTYPE: ${doctypeMatch ? '✓' : '✗'}`);
  console.log(`  - HTML tags: ${htmlOpenMatch && htmlCloseMatch ? '✓' : '✗'}`);
  console.log(`  - HEAD tags: ${headOpenMatch && headCloseMatch ? '✓' : '✗'}`);
  console.log(`  - BODY tags: ${bodyOpenMatch && bodyCloseMatch ? '✓' : '✗'}`);
  console.log(`  - Meta tags: ${metaTags.length}`);
  console.log(`  - Link tags: ${linkTags.length}`);
  console.log(`  - Script tags: ${scriptTags.length}`);
  
  // JSON 스크립트 내부의 문제가 되는 패턴 검사
  const problematicPatterns = [
    /system-ui,\\"Segoe UI\\"/g,
    /\\"Apple Color Emoji\\"/g,
    /\\"Segoe UI Emoji\\"/g
  ];
  
  let hasProblematicPatterns = false;
  problematicPatterns.forEach((pattern, index) => {
    const matches = content.match(pattern);
    if (matches) {
      console.log(`  - Problematic pattern ${index + 1}: ${matches.length} matches found`);
      hasProblematicPatterns = true;
    }
  });
  
  if (!hasProblematicPatterns) {
    console.log(`  - Font family patterns: ✓ Clean`);
  }
  
  // 전체 파일 크기와 라인 수
  const lines = content.split('\n').length;
  const size = content.length;
  console.log(`  - File size: ${size} bytes, ${lines} lines`);
  
  if (issues.length > 0) {
    console.log(`  - Issues found:`);
    issues.forEach(issue => console.log(`    * ${issue}`));
  }
  
  console.log(`  - Overall status: ${isValid ? '✓ VALID' : '✗ INVALID'}`);
  console.log('');
  
  return isValid;
}

// 모든 HTML 파일 검증
const outDir = path.join(__dirname, 'out');
const htmlFiles = [
  'index.html',
  '404.html',
  '404/index.html',
  '_not-found/index.html'
];

let allValid = true;

console.log('HTML Validation Report');
console.log('=====================\n');

htmlFiles.forEach(file => {
  const filePath = path.join(outDir, file);
  if (fs.existsSync(filePath)) {
    const isValid = validateHtml(filePath);
    if (!isValid) allValid = false;
  } else {
    console.log(`File not found: ${file}\n`);
  }
});

console.log(`Final Result: ${allValid ? '✓ ALL FILES VALID' : '✗ SOME FILES HAVE ISSUES'}`);
process.exit(allValid ? 0 : 1);