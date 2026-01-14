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
  keywords: "code editor, online compiler, python, javascript, typescript, html, css, json, programming, coding, web development, online IDE, code playground, python online, javascript online, typescript online, html editor, css editor, code runner, browser IDE, no installation, free coding, learn programming",
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
  // manifest는 조건부로 로드 (404 에러 방지)
  // manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://code-playground.pages.dev",
    title: "Code Playground - Multi-Language Online Editor",
    description: "Write, run, and share code in multiple languages in your browser. Supports Python, JavaScript, TypeScript, HTML, CSS, and JSON.",
    siteName: "Code Playground",
    images: [
      {
        url: '/og-image.svg',
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
    images: ['/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
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
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        
        {/* Monaco Editor CDN - Load before app initialization */}
        <script src="https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof require !== 'undefined') {
                require.config({ 
                  paths: { 
                    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' 
                  } 
                });
                console.log('Monaco Editor loader configured via require.config');
              }
            `,
          }}
        />
        
        <script 
          src="https://cdn.jsdelivr.net/pyodide/v0.29.0/full/pyodide.js"
          async
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600" 
          rel="stylesheet"
        />
        {/* manifest.json을 조건부로 로드하여 404 에러 방지 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var link = document.createElement('link');
                link.rel = 'manifest';
                link.href = '/manifest.json';
                link.onerror = function() {
                  console.warn('Manifest file not found, continuing without it');
                };
                document.head.appendChild(link);
              })();
            `,
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
