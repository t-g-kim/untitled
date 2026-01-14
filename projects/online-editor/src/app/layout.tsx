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
  title: "Python Online Editor - Run Python in Your Browser",
  description: "Write and run Python code directly in your browser. No installation required. Features include syntax highlighting, instant execution with Pyodide, and a clean interface.",
  keywords: "python editor, online python, python playground, python compiler, run python online, python ide, browser python, pyodide, python online compiler, learn python",
  authors: [{ name: "Python Online Editor" }],
  creator: "Python Online Editor",
  publisher: "Python Online Editor",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://editor.readme.website'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://editor.readme.website",
    title: "Python Online Editor - Run Python in Your Browser",
    description: "Write and run Python code directly in your browser. No installation required.",
    siteName: "Python Online Editor",
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Python Online Editor',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Python Online Editor - Run Python in Your Browser",
    description: "Write and run Python code directly in your browser.",
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
