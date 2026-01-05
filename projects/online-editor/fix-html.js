const fs = require('fs');
const path = require('path');

function fixHtmlFiles(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fixHtmlFiles(filePath);
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // 1. Content-Type 메타 태그 추가
      if (!content.includes('http-equiv="Content-Type"')) {
        content = content.replace(
          /<head>/i,
          '<head>\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8">'
        );
      }
      
      // 2. 모든 유니코드 엔티티 문제 수정
      content = content.replace(/\\u0026\\u0026/g, '&&');
      content = content.replace(/\\u0026/g, '&');
      content = content.replace(/\u0026\u0026/g, '&&');
      content = content.replace(/\u0026/g, '&');
      
      // 3. 스크립트 내부의 문제가 되는 부분들 수정
      content = content.replace(/src \u0026\u0026 src\.includes/g, 'src && src.includes');
      content = content.replace(/msg \u0026\u0026 msg\.includes/g, 'msg && msg.includes');
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed: ${filePath}`);
    }
  });
}

const outDir = path.join(__dirname, 'out');
if (fs.existsSync(outDir)) {
  fixHtmlFiles(outDir);
  console.log('HTML files fixed successfully!');
} else {
  console.log('Out directory not found.');
}