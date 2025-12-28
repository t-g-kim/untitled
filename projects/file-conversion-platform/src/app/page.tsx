import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'ConvertPro - 무료 PDF Word 변환기',
  description: 'PDF를 Word로, Word를 PDF로 무료 변환하세요. 회원가입 없이 빠르고 안전한 파일 변환 서비스.',
};

export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />
      <Features />
      <Footer />
    </main>
  );
}