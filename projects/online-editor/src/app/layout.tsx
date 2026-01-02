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
  title: "Code Playground - Multi-Language Online Editor",
  description: "Write, run, and share code in multiple languages in your browser. Supports Python, JavaScript, TypeScript, HTML, CSS, and JSON. No installation required.",
  keywords: [
    "code editor", "online compiler", "python", "javascript", "typescript", "html", "css", "json", 
    "programming", "coding", "web development", "online IDE", "code playground",
    "python online", "javascript online", "typescript online", "html editor", "css editor",
    "code runner", "browser IDE", "no installation", "free coding", "learn programming"
  ].join(", "),
  authors: [{ name: "Code Playground" }],
  creator: "Code Playground",
  publisher: "Code Playground",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://code-playground.pages.dev'),
  alternates: {
    canonical: '/',
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://code-playground.pages.dev",
    title: "Code Playground - Multi-Language Online Editor",
    description: "Write, run, and share code in multiple languages in your browser. Supports Python, JavaScript, TypeScript, HTML, CSS, and JSON.",
    siteName: "Code Playground",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Code Playground - Multi-Language Online Editor',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Code Playground - Multi-Language Online Editor",
    description: "Write, run, and share code in multiple languages in your browser.",
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

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1F2937",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning={true}>
      <head>
        <script 
          src="https://cdn.jsdelivr.net/pyodide/v0.29.0/full/pyodide.js"
          async
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&amp;display=swap" 
          rel="stylesheet"
          as="style"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // 전역 에러 핸들러 - 외부 스크립트 에러 방지
              window.addEventListener('error', function(e) {
                // autofill 관련 에러 차단
                if (e.filename) {
                  if (e.filename.includes('autofill') || e.filename.includes('extension')) {
                    e.preventDefault();
                    console.warn('External script error suppressed:', e.message);
                    return false;
                  }
                }
                
                // 특정 에러 메시지 차단
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
              
              // 추가적인 전역 에러 처리
              window.onerror = function(message, source, lineno, colno, error) {
                if (source && (source.includes('autofill') || source.includes('extension'))) {
                  console.warn('Global error suppressed:', message);
                  return true; // 에러 처리됨을 표시
                }
                if (message && (message.includes('Cannot use \\'in\\' operator') || 
                               message.includes('animation'))) {
                  console.warn('Animation error suppressed:', message);
                  return true;
                }
                return false; // 다른 에러는 정상 처리
              };
            `
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
