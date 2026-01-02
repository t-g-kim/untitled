import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ConvertPro - 무료 PDF Word 변환기',
  description: 'PDF를 Word로, Word를 PDF로 무료 변환하세요. 회원가입 없이 빠르고 안전한 파일 변환 서비스.',
  keywords: [
    'PDF 변환', 'Word 변환', '무료 변환기', '온라인 변환', 'PDF to Word', 'Word to PDF',
    'PDF 워드 변환', '문서 변환', '파일 변환', '무료 도구', '회원가입 없음',
    'PDF 편집', 'Word 편집', '문서 처리', '온라인 PDF', '온라인 Word',
    'PDF 다운로드', 'Word 다운로드', '안전한 변환', '개인정보 보호'
  ].join(', '),
  authors: [{ name: 'ConvertPro' }],
  creator: 'ConvertPro',
  publisher: 'ConvertPro',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://file-conversion.pages.dev'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ConvertPro - 무료 PDF Word 변환기',
    description: 'PDF를 Word로, Word를 PDF로 무료 변환하세요. 회원가입 없이 빠르고 안전한 파일 변환 서비스.',
    url: 'https://file-conversion.pages.dev',
    siteName: 'ConvertPro',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ConvertPro - 무료 PDF Word 변환기',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ConvertPro - 무료 PDF Word 변환기',
    description: 'PDF를 Word로, Word를 PDF로 무료 변환하세요.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml", sizes: "32x32" },
      { url: "/icon-192.svg", type: "image/svg+xml", sizes: "192x192" },
      { url: "/icon-512.svg", type: "image/svg+xml", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.svg", type: "image/svg+xml", sizes: "180x180" },
    ],
  },
  manifest: "/manifest.json",
  verification: {
    google: 'your-google-verification-code',
    other: {
      'naver-site-verification': 'your-naver-verification-code',
    },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* 전역 에러 핸들러 - 외부 스크립트 에러 방지 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                if (e.filename) {
                  if (e.filename.includes('autofill') || e.filename.includes('extension')) {
                    e.preventDefault();
                    console.warn('External script error suppressed:', e.message);
                    return false;
                  }
                }
                
                if (e.message) {
                  if (e.message.includes('Cannot use \\'in\\' operator') || 
                      e.message.includes('animation') ||
                      e.message.includes('autofill')) {
                    e.preventDefault();
                    console.warn('Animation/autofill error suppressed:', e.message);
                    return false;
                  }
                }
              });
              
              window.addEventListener('unhandledrejection', function(e) {
                if (e.reason) {
                  var reasonStr = e.reason.toString();
                  if (reasonStr.includes('autofill') || 
                      reasonStr.includes('animation') ||
                      reasonStr.includes('Cannot use \\'in\\' operator')) {
                    e.preventDefault();
                    console.warn('Promise rejection suppressed:', reasonStr);
                    return false;
                  }
                }
              });
              
              window.onerror = function(message, source, lineno, colno, error) {
                if (source && (source.includes('autofill') || source.includes('extension'))) {
                  console.warn('Global error suppressed:', message);
                  return true;
                }
                if (message && (message.includes('Cannot use \\'in\\' operator') || 
                               message.includes('animation'))) {
                  console.warn('Animation error suppressed:', message);
                  return true;
                }
                return false;
              };
            `
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <div className="min-h-screen bg-gray-50 font-sans antialiased">
          {children}
        </div>
      </body>
    </html>
  );
}