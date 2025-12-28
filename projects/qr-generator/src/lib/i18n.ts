// Simple internationalization system

export type Locale = 'ko' | 'en';

export const translations = {
  ko: {
    // Header
    'header.title': 'QR 코드 생성기',
    'header.language': '언어',
    
    // Main page
    'main.title': 'QR 코드 생성기',
    'main.subtitle': '텍스트나 URL을 입력하여 QR 코드를 생성하세요',
    
    // QR Generator
    'qr.title': 'QR 코드 생성',
    'qr.subtitle': '텍스트나 URL을 입력하여 QR 코드를 생성하세요',
    'qr.inputLabel': '텍스트 또는 URL',
    'qr.inputPlaceholder': '여기에 텍스트나 URL을 입력하세요...',
    'qr.characters': '자',
    'qr.validUrl': '✓ 유효한 URL',
    'qr.generating': '생성 중...',
    'qr.generate': 'QR 코드 생성',
    'qr.preview': 'QR 코드 미리보기',
    'qr.download': 'PNG로 다운로드',
    'qr.options': '옵션',
    'qr.size': '크기',
    'qr.errorCorrection': '오류 정정 레벨',
    'qr.resetSettings': '기본 설정으로 초기화',
    
    // Error messages
    'error.emptyText': '텍스트를 입력해주세요',
    'error.tooLong': '텍스트는 2048자를 초과할 수 없습니다',
    'error.qrGeneration': 'QR 코드 생성 중 오류가 발생했습니다',
    'error.download': '다운로드 중 오류가 발생했습니다',
    
    // Footer
    'footer.description': '빠르고 안전한 QR 코드 생성 서비스입니다. 모든 처리는 브라우저에서 이루어져 개인정보가 보호됩니다.',
    'footer.links': '링크',
    'footer.howTo': '사용법',
    'footer.faq': 'FAQ',
    'footer.privacy': '개인정보처리방침',
    'footer.ads': '광고',
    'footer.copyright': '© 2024 QR 생성기. 모든 권리 보유.',
    
    // Privacy page
    'privacy.title': '개인정보 처리방침',
    
    // Offline message
    'offline.message': '인터넷 연결이 끊어졌습니다. QR 코드 생성은 오프라인에서도 계속 작동합니다.'
  },
  en: {
    // Header
    'header.title': 'QR Code Generator',
    'header.language': 'Language',
    
    // Main page
    'main.title': 'QR Code Generator',
    'main.subtitle': 'Enter text or URL to generate QR code',
    
    // QR Generator
    'qr.title': 'Generate QR Code',
    'qr.subtitle': 'Enter text or URL to generate QR code',
    'qr.inputLabel': 'Text or URL',
    'qr.inputPlaceholder': 'Enter text or URL here...',
    'qr.characters': 'characters',
    'qr.validUrl': '✓ Valid URL',
    'qr.generating': 'Generating...',
    'qr.generate': 'Generate QR Code',
    'qr.preview': 'QR Code Preview',
    'qr.download': 'Download as PNG',
    'qr.options': 'Options',
    'qr.size': 'Size',
    'qr.errorCorrection': 'Error Correction Level',
    'qr.resetSettings': 'Reset to Default Settings',
    
    // Error messages
    'error.emptyText': 'Please enter text',
    'error.tooLong': 'Text cannot exceed 2048 characters',
    'error.qrGeneration': 'Error occurred while generating QR code',
    'error.download': 'Error occurred during download',
    
    // Footer
    'footer.description': 'Fast and secure QR code generation service. All processing is done in your browser to protect your privacy.',
    'footer.links': 'Links',
    'footer.howTo': 'How to Use',
    'footer.faq': 'FAQ',
    'footer.privacy': 'Privacy Policy',
    'footer.ads': 'Ads',
    'footer.copyright': '© 2024 QR Generator. All rights reserved.',
    
    // Privacy page
    'privacy.title': 'Privacy Policy',
    
    // Offline message
    'offline.message': 'Internet connection lost. QR code generation continues to work offline.'
  }
};

export const getTranslation = (locale: Locale, key: string): string => {
  return translations[locale][key as keyof typeof translations[typeof locale]] || key;
};

export const detectBrowserLanguage = (): Locale => {
  if (typeof window === 'undefined') return 'ko';
  
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('ko')) return 'ko';
  return 'en';
};

export const setLanguagePreference = (locale: Locale): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('preferred-language', locale);
  }
};

export const getLanguagePreference = (): Locale | null => {
  if (typeof window === 'undefined') return null;
  
  const saved = localStorage.getItem('preferred-language');
  return (saved === 'ko' || saved === 'en') ? saved : null;
};