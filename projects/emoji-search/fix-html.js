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
      
      // 1. Content-Type 메타 태그 추가 (가장 중요)
      if (!content.includes('http-equiv="Content-Type"')) {
        content = content.replace(
          /<head>/i,
          '<head>\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8">'
        );
      }
      
      // 2. 가장 문제가 되는 fontFamily JSON 문자열 완전 수정
      // system-ui,\"Segoe UI\",Roboto 패턴 수정
      content = content.replace(
        /system-ui,\\\\\"Segoe UI\\\\\",Roboto,Helvetica,Arial,sans-serif,\\\\\"Apple Color Emoji\\\\\",\\\\\"Segoe UI Emoji\\\\\"/g,
        'system-ui,\\"Segoe UI\\",Roboto,Helvetica,Arial,sans-serif,\\"Apple Color Emoji\\",\\"Segoe UI Emoji\\"'
      );
      
      // 3. Apple Color Emoji 관련 문제 수정
      content = content.replace(/\\\"Apple Color Emoji\\\",\\\"Segoe UI Emoji\\\"/g, '\\"Apple Color Emoji\\",\\"Segoe UI Emoji\\"');
      
      // 4. 모든 JSON 스크립트 내부의 fontFamily 속성 정리
      content = content.replace(/"fontFamily":"([^"]*(?:\\\\[^"]*)*)"/, function(_, fontValue) {
        // 이중 백슬래시를 단일 백슬래시로 변경
        const cleanFont = fontValue.replace(/\\\\/g, '\\');
        return `"fontFamily":"${cleanFont}"`;
      });
      
      // 5. 모든 유니코드 엔티티 문제 수정
      content = content.replace(/\\u0026\\u0026/g, '&&');
      content = content.replace(/\\u0026/g, '&');
      content = content.replace(/\u0026\u0026/g, '&&');
      content = content.replace(/\u0026/g, '&');
      
      // 6. JSON 내부의 잘못된 이스케이프 수정 (더 정확한 패턴)
      content = content.replace(/\\\\\"/g, '\\"');
      
      // 7. 특수 문자 엔티티 수정
      content = content.replace(/&amp;/g, '&');
      content = content.replace(/&lt;/g, '<');
      content = content.replace(/&gt;/g, '>');
      content = content.replace(/&quot;/g, '"');
      content = content.replace(/&#x27;/g, "'");
      
      // 8. JSON 스크립트 내부의 모든 문제가 되는 패턴 정리
      content = content.replace(/<script[^>]*>self\.__next_f\.push\(\[1,"([^"]*(?:\\.[^"]*)*)"\]\)<\/script>/g, function(match, jsonContent) {
        // JSON 내용을 안전하게 정리
        let cleanJson = jsonContent
          .replace(/\\\\\\\\/g, '\\\\')  // 4개 백슬래시를 2개로
          .replace(/\\\\\"/g, '\\"')     // 이중 이스케이프 따옴표 정리
          .replace(/\\\\n/g, '\\n')      // 이중 이스케이프 개행 정리
          .replace(/\\\\t/g, '\\t');     // 이중 이스케이프 탭 정리
        
        return `<script>self.__next_f.push([1,"${cleanJson}"])</script>`;
      });
      
      // 변경사항이 있을 때만 파일 저장
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed: ${filePath}`);
      }
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