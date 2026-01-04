const fs = require('fs');
const path = require('path');

// HTML 파일들을 찾아서 DOCTYPE과 Content-Type 메타 태그 수정
function fixHtmlFiles(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fixHtmlFiles(filePath);
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // DOCTYPE을 더 명확하게 수정
      content = content.replace(
        /<!DOCTYPE html>/gi,
        '<!DOCTYPE html>'
      );
      
      // Content-Type 메타 태그가 없으면 추가 (가장 앞에)
      if (!content.includes('http-equiv="Content-Type"')) {
        content = content.replace(
          /<head>/i,
          '<head>\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8">'
        );
      }
      
      // HTML 엔티티 인코딩 문제 수정
      content = content.replace(/&amp;display=swap/g, '&display=swap');
      
      // XML 선언 제거 (있다면)
      content = content.replace(/<\?xml[^>]*\?>\s*/gi, '');
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed: ${filePath}`);
    }
  });
}

// out 디렉토리의 HTML 파일들 수정
const outDir = path.join(__dirname, 'out');
if (fs.existsSync(outDir)) {
  fixHtmlFiles(outDir);
  console.log('HTML files fixed successfully!');
} else {
  console.log('Out directory not found. Please run build first.');
}