import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ConvertPro - 무료 PDF Word 변환기',
  description: 'PDF를 Word로, Word를 PDF로 무료 변환하세요. 회원가입 없이 빠르고 안전한 파일 변환 서비스.',
  keywords: 'PDF 변환, Word 변환, 무료 변환기, 온라인 변환, PDF to Word, Word to PDF',
  authors: [{ name: 'ConvertPro' }],
  robots: 'index, follow',
  openGraph: {
    title: 'ConvertPro - 무료 PDF Word 변환기',
    description: 'PDF를 Word로, Word를 PDF로 무료 변환하세요.',
    type: 'website',
    locale: 'ko_KR',
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
      <body suppressHydrationWarning>
        <div className="min-h-screen bg-gray-50 font-sans antialiased">
          {children}
        </div>
      </body>
    </html>
  );
}