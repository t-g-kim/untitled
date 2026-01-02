import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "이모지 검색기 - 1300개 이상 이모지 무료 검색 및 복사",
  description: "🔍 1300개 이상의 이모지를 쉽게 찾고 클릭 한 번으로 복사하세요! 감정표현, 음식, 동물, 여행, 국기 등 9개 카테고리. 한국어/영어 검색 지원, 모바일 최적화, 완전 무료",
  keywords: [
    "이모지", "이모티콘", "검색", "복사", "emoji", "emoticon", "search", "copy",
    "감정표현", "웃는얼굴", "하트", "음식", "동물", "여행", "국기", "기호",
    "smileys", "food", "animals", "travel", "flags", "symbols", "activities",
    "한국어", "무료", "모바일", "클릭복사", "카테고리", "필터"
  ].join(", "),
  authors: [{ name: "Emoji Search" }],
  creator: "Emoji Search",
  publisher: "Emoji Search",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://emoji-search.pages.dev'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "이모지 검색기 - 1300개 이상 이모지 무료 검색 및 복사",
    description: "🔍 1300개 이상의 이모지를 쉽게 찾고 클릭 한 번으로 복사하세요! 감정표현, 음식, 동물, 여행, 국기 등 9개 카테고리",
    url: 'https://emoji-search.pages.dev',
    siteName: '이모지 검색기',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '이모지 검색기 - 1300개 이상 이모지 검색',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "이모지 검색기 - 1300개 이상 이모지 무료 검색",
    description: "🔍 원하는 이모지를 쉽게 찾고 클릭 한 번으로 복사하세요!",
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
  verification: {
    google: 'your-google-verification-code',
    other: {
      'naver-site-verification': 'your-naver-verification-code',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* 구조화된 데이터 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "이모지 검색기",
              "description": "1300개 이상의 이모지를 쉽게 찾고 복사할 수 있는 무료 웹 애플리케이션",
              "url": "https://emoji-search.pages.dev",
              "applicationCategory": "UtilityApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "KRW"
              },
              "featureList": [
                "1300개 이상 이모지 검색",
                "9개 카테고리 분류",
                "한국어/영어 검색 지원",
                "클릭 한 번으로 복사",
                "모바일 최적화",
                "국기 이미지 지원"
              ]
            })
          }}
        />
        
        {/* 전역 에러 핸들러 - 외부 스크립트 에러 방지 */}
        <script src="/error-handler.js" async></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
