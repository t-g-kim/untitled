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
        {/* HTML 엔티티 수정 스크립트 - 가장 먼저 로드 */}
        <script src="/fix-entities.js"></script>
        
        {/* 전역 에러 핸들러 - 외부 스크립트 에러 방지 */}
        <script src="/error-handler.js" async></script>
      </head>
      <body suppressHydrationWarning>
        <div className="min-h-screen bg-gray-50 font-sans antialiased">
          {children}
        </div>
      </body>
    </html>
  );
}