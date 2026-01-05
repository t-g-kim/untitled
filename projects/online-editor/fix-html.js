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
      
      // 1. DOCTYPE 확인 및 추가
      if (!content.startsWith('<!DOCTYPE html>')) {
        content = '<!DOCTYPE html>' + content.substring(content.indexOf('<html'));
      }
      
      // 2. Content-Type 메타 태그 추가 (가장 중요)
      if (!content.includes('http-equiv="Content-Type"')) {
        content = content.replace(
          /<head>/i,
          '<head>\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8">'
        );
      }
      
      // 3. 모든 fontFamily 관련 JSON 스크립트 완전 제거 (더 강력한 패턴)
      content = content.replace(
        /<script[^>]*>self\.__next_f\.push\(\[1,"[^"]*fontFamily[^"]*"\]\)<\/script>/gs,
        ''
      );
      
      // 4. 404 에러 페이지의 style 객체가 포함된 스크립트 제거
      content = content.replace(
        /<script[^>]*>self\.__next_f\.push\(\[1,"[^"]*notFound[^"]*fontFamily[^"]*"\]\)<\/script>/gs,
        ''
      );
      
      // 5. 모든 JSON 스크립트에서 fontFamily 패턴을 안전한 값으로 교체
      content = content.replace(
        /"fontFamily":"system-ui,\\+"Segoe UI\\+",Roboto[^"]*"/g,
        '"fontFamily":"system-ui,sans-serif"'
      );
      
      // 6. 더 광범위한 fontFamily 패턴 제거
      content = content.replace(
        /"fontFamily":"[^"]*\\+"[^"]*"/g,
        '"fontFamily":"system-ui,sans-serif"'
      );
      
      // 7. 이중 이스케이프 따옴표 문제 해결
      content = content.replace(
        /\\+"Segoe UI\\+"/g,
        'Segoe UI'
      );
      content = content.replace(
        /\\+"Apple Color Emoji\\+"/g,
        'Apple Color Emoji'
      );
      content = content.replace(
        /\\+"Segoe UI Emoji\\+"/g,
        'Segoe UI Emoji'
      );
      
      // 8. 모든 백슬래시 이스케이프 문제 해결
      content = content.replace(
        /\\\\"/g,
        '"'
      );
      
      // 9. HTML을 더 읽기 쉽게 포맷팅
      content = content.replace(/<head>/, '<head>\n');
      content = content.replace(/<\/head>/, '\n</head>');
      content = content.replace(/<body([^>]*)>/, '<body$1>\n');
      content = content.replace(/<\/body>/, '\n</body>');
      
      // 10. 메타 태그들을 개별 라인으로 분리
      content = content.replace(/><meta/g, '>\n<meta');
      content = content.replace(/><link/g, '>\n<link');
      content = content.replace(/><script/g, '>\n<script');
      content = content.replace(/><title/g, '>\n<title');
      
      // 11. 특수 문자 엔티티 수정
      content = content.replace(/&amp;/g, '&');
      content = content.replace(/&lt;/g, '<');
      content = content.replace(/&gt;/g, '>');
      content = content.replace(/&quot;/g, '"');
      content = content.replace(/&#x27;/g, "'");
      
      // 12. 유니코드 엔티티 수정
      content = content.replace(/\\u0026\\u0026/g, '&&');
      content = content.replace(/\\u0026/g, '&');
      content = content.replace(/\u0026\u0026/g, '&&');
      content = content.replace(/\u0026/g, '&');
      
      // 13. 빈 스크립트 태그 제거
      content = content.replace(/<script[^>]*><\/script>/g, '');
      
      // 14. 연속된 빈 줄 정리
      content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
      
      // 15. HTML 구조 검증
      const headOpenCount = (content.match(/<head>/g) || []).length;
      const headCloseCount = (content.match(/<\/head>/g) || []).length;
      const bodyOpenCount = (content.match(/<body[^>]*>/g) || []).length;
      const bodyCloseCount = (content.match(/<\/body>/g) || []).length;
      
      console.log(`  Head tags: ${headOpenCount} open, ${headCloseCount} close`);
      console.log(`  Body tags: ${bodyOpenCount} open, ${bodyCloseCount} close`);
      
      if (headOpenCount !== headCloseCount || bodyOpenCount !== bodyCloseCount) {
        console.log(`  WARNING: Tag mismatch detected in ${filePath}`);
      }
      
      // 16. fontFamily 패턴 검사 (최종 확인)
      const fontFamilyMatches = content.match(/fontFamily[^}]*\\"/g);
      if (fontFamilyMatches) {
        console.log(`  WARNING: Still found ${fontFamilyMatches.length} problematic fontFamily patterns`);
        // 남은 패턴들을 강제로 제거
        fontFamilyMatches.forEach((match, i) => {
          console.log(`    ${i + 1}: ${match.substring(0, 80)}...`);
        });
        
        // 해당 스크립트 전체를 제거
        content = content.replace(
          /<script[^>]*>[^<]*fontFamily[^<]*<\/script>/g,
          ''
        );
      } else {
        console.log(`  ✓ No problematic fontFamily patterns found`);
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
  console.log('Starting aggressive fontFamily removal process...');
  fixHtmlFiles(outDir);
  console.log('HTML files processing completed!');
} else {
  console.log('Out directory not found.');
}