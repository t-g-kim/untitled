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
      let originalContent = content;
      
      console.log(`Processing: ${filePath}`);
      
      // 1. Content-Type 메타 태그 추가 (가장 중요)
      if (!content.includes('http-equiv="Content-Type"')) {
        content = content.replace(
          /<head>/i,
          '<head>\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8">'
        );
      }
      
      // 2. 문제가 되는 JSON 스크립트만 선택적으로 제거
      // fontFamily가 포함된 스크립트만 제거
      content = content.replace(
        /<script[^>]*>self\.__next_f\.push\(\[1,"[^"]*fontFamily[^"]*"\]\)<\/script>/g,
        ''
      );
      
      // 3. 복잡한 style 객체가 포함된 JSON 스크립트 제거
      content = content.replace(
        /<script[^>]*>self\.__next_f\.push\(\[1,"[^"]*style[^"]*fontFamily[^"]*"\]\)<\/script>/g,
        ''
      );
      
      // 4. HTML을 더 읽기 쉽게 포맷팅
      content = content.replace(/<head>/, '<head>\n');
      content = content.replace(/<\/head>/, '\n</head>');
      content = content.replace(/<body([^>]*)>/, '<body$1>\n');
      content = content.replace(/<\/body>/, '\n</body>');
      
      // 5. 메타 태그들을 개별 라인으로 분리
      content = content.replace(/><meta/g, '>\n<meta');
      content = content.replace(/><link/g, '>\n<link');
      content = content.replace(/><script/g, '>\n<script');
      content = content.replace(/><title/g, '>\n<title');
      
      // 6. JSON 스크립트 내부의 안전한 패턴 수정
      content = content.replace(
        /"fontFamily":"system-ui,\\"Segoe UI\\",Roboto,Helvetica,Arial,sans-serif,\\"Apple Color Emoji\\",\\"Segoe UI Emoji\\""/g,
        '"fontFamily":"system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji"'
      );
      
      // 7. 특수 문자 엔티티 수정
      content = content.replace(/&amp;/g, '&');
      content = content.replace(/&lt;/g, '<');
      content = content.replace(/&gt;/g, '>');
      content = content.replace(/&quot;/g, '"');
      content = content.replace(/&#x27;/g, "'");
      
      // 8. 유니코드 엔티티 수정
      content = content.replace(/\\u0026\\u0026/g, '&&');
      content = content.replace(/\\u0026/g, '&');
      content = content.replace(/\u0026\u0026/g, '&&');
      content = content.replace(/\u0026/g, '&');
      
      // 9. 빈 스크립트 태그 제거
      content = content.replace(/<script[^>]*><\/script>/g, '');
      
      // 10. 연속된 빈 줄 정리
      content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
      
      // 11. HTML 구조 검증
      const headOpenCount = (content.match(/<head>/g) || []).length;
      const headCloseCount = (content.match(/<\/head>/g) || []).length;
      const bodyOpenCount = (content.match(/<body[^>]*>/g) || []).length;
      const bodyCloseCount = (content.match(/<\/body>/g) || []).length;
      
      console.log(`  Head tags: ${headOpenCount} open, ${headCloseCount} close`);
      console.log(`  Body tags: ${bodyOpenCount} open, ${bodyCloseCount} close`);
      
      if (headOpenCount !== headCloseCount || bodyOpenCount !== bodyCloseCount) {
        console.log(`  WARNING: Tag mismatch detected in ${filePath}`);
      }
      
      // 변경사항이 있을 때만 파일 저장
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  Fixed: ${filePath}`);
      } else {
        console.log(`  No changes needed: ${filePath}`);
      }
    }
  });
}

const outDir = path.join(__dirname, 'out');
if (fs.existsSync(outDir)) {
  console.log('Starting selective HTML fix process...');
  fixHtmlFiles(outDir);
  console.log('HTML files processing completed!');
} else {
  console.log('Out directory not found.');
}