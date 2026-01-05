import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ServiceWorkerProvider from '@/components/ServiceWorkerProvider';

export const metadata: Metadata = {
  title: 'QR 코드 생성기 - 무료 QR 코드 생성 및 다운로드',
  description: '텍스트, URL, 연락처, WiFi 정보를 QR 코드로 변환하는 무료 온라인 도구입니다. 빠르고 안전하며 개인정보를 보호합니다. 회원가입 없이 즉시 사용 가능.',
  keywords: [
    'QR 코드', 'QR 생성기', 'QR 코드 생성', '무료 QR 코드', 'QR code generator',
    'URL QR 코드', '텍스트 QR 코드', '연락처 QR 코드', 'WiFi QR 코드',
    '온라인 QR 생성', '무료 도구', '개인정보 보호', '회원가입 없음',
    'QR 다운로드', 'PNG QR 코드', 'SVG QR 코드'
  ].join(', '),
  authors: [{ name: 'QR Generator' }],
  creator: 'QR Generator',
  publisher: 'QR Generator',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://qr-generator.pages.dev'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'QR 코드 생성기 - 무료 QR 코드 생성 및 다운로드',
    description: '텍스트, URL, 연락처, WiFi 정보를 QR 코드로 변환하는 무료 온라인 도구입니다.',
    url: 'https://qr-generator.pages.dev',
    siteName: 'QR 코드 생성기',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'QR 코드 생성기 - 무료 QR 코드 생성',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR 코드 생성기 - 무료 QR 코드 생성',
    description: '텍스트, URL을 QR 코드로 변환하는 무료 도구입니다.',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* HTML 엔티티 수정 스크립트 - 가장 먼저 로드 */}
        <script src="/fix-entities.js"></script>
        
        {/* 전역 에러 핸들러 - 외부 스크립트 에러 방지 */}
        <script src="/error-handler.js" async></script>
      </head>
      <body className="min-h-screen flex flex-col">
        <ServiceWorkerProvider />
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}