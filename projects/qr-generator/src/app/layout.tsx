import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ServiceWorkerProvider from '@/components/ServiceWorkerProvider';

export const metadata: Metadata = {
  title: 'QR 코드 생성기 - 무료 QR 코드 생성',
  description: '텍스트나 URL을 QR 코드로 변환하는 무료 온라인 도구입니다. 빠르고 안전하며 개인정보를 보호합니다.',
  keywords: 'QR 코드, QR 생성기, QR 코드 생성, 무료 QR 코드',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
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