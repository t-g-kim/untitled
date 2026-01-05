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
      
      // 2. HTML을 더 읽기 쉽게 포맷팅 (한 줄로 된 것을 여러 줄로)
      content = content.replace(/<head>/, '<head>\n');
      content = content.replace(/<\/head>/, '\n</head>');
      content = content.replace(/<body([^>]*)>/, '<body$1>\n');
      content = content.replace(/<\/body>/, '\n</body>');
      
      // 3. 메타 태그들을 개별 라인으로 분리
      content = content.replace(/><meta/g, '>\n<meta');
      content = content.replace(/><link/g, '>\n<link');
      content = content.replace(/><script/g, '>\n<script');
      content = content.replace(/><title/g, '>\n<title');
      
      // 4. JSON 스크립트 내부의 fontFamily 문제 수정
      content = content.replace(
        /"fontFamily":"system-ui,\\"Segoe UI\\",Roboto,Helvetica,Arial,sans-serif,\\"Apple Color Emoji\\",\\"Segoe UI Emoji\\""/g,
        '"fontFamily":"system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji"'
      );
      
      // 5. 모든 JSON 내부의 이중 이스케이프 따옴표 수정
      content = content.replace(/\\\\"/g, '\\"');
      content = content.replace(/\\\\\\\\/g, '\\\\');
      
      // 6. 특수 문자 엔티티 수정
      content = content.replace(/&amp;/g, '&');
      content = content.replace(/&lt;/g, '<');
      content = content.replace(/&gt;/g, '>');
      content = content.replace(/&quot;/g, '"');
      content = content.replace(/&#x27;/g, "'");
      
      // 7. 유니코드 엔티티 수정
      content = content.replace(/\\u0026\\u0026/g, '&&');
      content = content.replace(/\\u0026/g, '&');
      content = content.replace(/\u0026\u0026/g, '&&');
      content = content.replace(/\u0026/g, '&');
      
      // 8. JSON 스크립트 전체를 안전하게 정리
      content = content.replace(/<script[^>]*>self\.__next_f\.push\(\[1,"([^"]*(?:\\.[^"]*)*)"\]\)<\/script>/g, function(match, jsonContent) {
        try {
          // JSON 내용을 안전하게 정리
          let cleanJson = jsonContent
            .replace(/\\\\\\\\/g, '\\\\')  // 4개 백슬래시를 2개로
            .replace(/\\\\\"/g, '\\"')     // 이중 이스케이프 따옴표 정리
            .replace(/\\\\n/g, '\\n')      // 이중 이스케이프 개행 정리
            .replace(/\\\\t/g, '\\t')      // 이중 이스케이프 탭 정리
            .replace(/system-ui,\\"Segoe UI\\"/g, 'system-ui,Segoe UI')  // 폰트 이름 정리
            .replace(/\\"Apple Color Emoji\\"/g, 'Apple Color Emoji')
            .replace(/\\"Segoe UI Emoji\\"/g, 'Segoe UI Emoji');
          
          return `<script>self.__next_f.push([1,"${cleanJson}"])</script>`;
        } catch (e) {
          console.log('JSON parsing error, keeping original:', e.message);
          return match;
        }
      });
      
      // 9. 마지막으로 HTML 구조 검증
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
  console.log('Starting HTML fix process...');
  fixHtmlFiles(outDir);
  console.log('HTML files processing completed!');
} else {
  console.log('Out directory not found.');
}