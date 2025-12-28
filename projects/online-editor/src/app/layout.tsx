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
  keywords: ["code editor", "online compiler", "python", "javascript", "typescript", "html", "css", "json", "programming", "coding"],
  authors: [{ name: "Code Playground" }],
  creator: "Code Playground",
  publisher: "Code Playground",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
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
  themeColor: "#1F2937",
  colorScheme: "dark",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://code-playground.dev",
    title: "Code Playground - Multi-Language Online Editor",
    description: "Write, run, and share code in multiple languages in your browser. Supports Python, JavaScript, TypeScript, HTML, CSS, and JSON.",
    siteName: "Code Playground",
  },
  twitter: {
    card: "summary_large_image",
    title: "Code Playground - Multi-Language Online Editor",
    description: "Write, run, and share code in multiple languages in your browser.",
    creator: "@codeplayground",
  },
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
          src="https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js"
          async
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
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
