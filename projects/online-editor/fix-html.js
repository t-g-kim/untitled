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
      
      // 1. DOCTYPE 확인 및 추가 (주석 처리 포함)
      const doctypeRegex = /<!DOCTYPE\s+html\s*>/i;
      if (!doctypeRegex.test(content)) {
        // <html 태그를 찾아서 그 앞에 DOCTYPE 추가
        const htmlIndex = content.search(/<html[\s>]/i);
        if (htmlIndex !== -1) {
          // <html 태그 앞의 공백/줄바꿈 확인
          const beforeHtml = content.substring(0, htmlIndex).trim();
          if (beforeHtml.length === 0 || beforeHtml.startsWith('<!--')) {
            // 주석이 있거나 공백만 있는 경우, DOCTYPE을 맨 앞에 추가
            content = '<!DOCTYPE html>\n' + content.substring(htmlIndex);
          } else {
            // 다른 내용이 있는 경우, <html 앞에 DOCTYPE 추가
            content = content.substring(0, htmlIndex) + '<!DOCTYPE html>\n' + content.substring(htmlIndex);
          }
        } else {
          // <html 태그를 찾을 수 없는 경우, 파일 시작 부분에 DOCTYPE 추가
          console.log(`  WARNING: Could not find <html> tag in ${filePath}`);
          content = '<!DOCTYPE html>\n' + content;
        }
      }
      
      // 2. Content-Type 메타 태그 추가 (가장 중요)
      if (!content.includes('http-equiv="Content-Type"')) {
        content = content.replace(
          /<head>/i,
          '<head>\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8">'
        );
      }
      
      // 2-1. manifest.json 링크 완전 제거 (404 에러 방지)
      content = content.replace(
        /<link\s+rel="manifest"\s+href="\/manifest\.json"[^>]*>/gi,
        '<!-- manifest.json link removed to prevent 404 errors -->'
      );
      
      // 2-2. JavaScript 내부의 manifest 링크도 제거
      content = content.replace(
        /\["\\$","link","3",\{[^}]*"rel":"manifest"[^}]*\}[^\]]*\]/g,
        ''
      );
      
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
      
      // 9-10. HTML 포맷팅 제거 (HTML 구조를 파괴함)
      // 포맷팅을 시도하지 않고 원본 HTML 구조 유지
      
      // 11-12. 특수 문자 및 유니코드 엔티티 수정 제거
      // HTML 엔티티는 브라우저가 자동으로 처리하도록 유지
      
      // 13. 빈 인라인 스크립트 태그만 제거 (src 속성이 없는 것)
      // src 속성이 있는 외부 스크립트는 보존
      content = content.replace(/<script(?![^>]*\ssrc=)[^>]*><\/script>/g, '');
      
      // 13-1. 사용되지 않는 preload 링크 제거 (97e13b192c5667fa.js 등)
      // fetchPriority="low"이고 실제로 사용되지 않는 chunk preload 제거
      content = content.replace(
        /<link[^>]*rel="preload"[^>]*as="script"[^>]*fetchPriority="low"[^>]*href="\/_next\/static\/chunks\/[^"]*\.js"[^>]*>/g,
        ''
      );
      
      // 13-2. Turbopack 스크립트 제거 (개발 전용, 프로덕션에 불필요)
      // Turbopack은 개발 서버 전용이므로 프로덕션 빌드에서 제거
      content = content.replace(
        /<script[^>]*src="\/_next\/static\/chunks\/turbopack-[^"]*\.js"[^>]*><\/script>\s*/g,
        ''
      );
      
      // 14. 연속된 빈 줄 정리 제거 (HTML 한 줄 형식 유지)
      
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
      
      // 16. fontFamily 패턴 검사 제거
      // fontFamily는 404 페이지의 스타일링에 사용되며, 제거하면 HTML 구조가 파괴됨
      // 브라우저가 정상적으로 처리할 수 있으므로 그대로 유지
      const fontFamilyMatches = content.match(/fontFamily[^}]*\\"/g);
      if (fontFamilyMatches) {
        console.log(`  INFO: Found ${fontFamilyMatches.length} fontFamily patterns (keeping them)`);
      } else {
        console.log(`  ✓ No fontFamily patterns found`);
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
const functionsDir = path.join(__dirname, 'functions');
const outFunctionsDir = path.join(outDir, 'functions');

if (fs.existsSync(outDir)) {
  console.log('Starting aggressive fontFamily removal process...');
  fixHtmlFiles(outDir);
  console.log('HTML files processing completed!');
  
    // Cloudflare Pages Functions 복사
    if (fs.existsSync(functionsDir)) {
      console.log('Copying Cloudflare Pages Functions...');
      if (!fs.existsSync(outFunctionsDir)) {
        fs.mkdirSync(outFunctionsDir, { recursive: true });
      }
      
      const files = fs.readdirSync(functionsDir);
      files.forEach(file => {
        const srcPath = path.join(functionsDir, file);
        const destPath = path.join(outFunctionsDir, file);
        const stat = fs.statSync(srcPath);
        
        if (stat.isFile()) {
          // TypeScript 파일은 JavaScript로 변환하지 않고 그대로 복사
          // Cloudflare Pages가 자동으로 처리함
          fs.copyFileSync(srcPath, destPath);
          console.log(`  Copied: ${file}`);
        } else if (stat.isDirectory()) {
          // 하위 디렉토리도 복사
          const subDir = path.join(outFunctionsDir, file);
          if (!fs.existsSync(subDir)) {
            fs.mkdirSync(subDir, { recursive: true });
          }
          // 재귀적으로 복사
          const subFiles = fs.readdirSync(srcPath);
          subFiles.forEach(subFile => {
            const subSrcPath = path.join(srcPath, subFile);
            const subDestPath = path.join(subDir, subFile);
            fs.copyFileSync(subSrcPath, subDestPath);
            console.log(`  Copied: ${file}/${subFile}`);
          });
        }
      });
      console.log('Functions copied successfully!');
    }
} else {
  console.log('Out directory not found.');
}