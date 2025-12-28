'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';

const EmojiSearch = dynamic(() => import('@/components/EmojiSearch'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-pulse">🔍</div>
        <p className="text-gray-600">이모지 검색기 로딩 중...</p>
        <div className="mt-4 text-sm text-gray-500">
          1300개 이상의 이모지를 준비하고 있습니다
        </div>
      </div>
    </div>
  )
});

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <>
        <Head>
          <title>이모지 검색기 - 1300개 이상 이모지 무료 검색 및 복사</title>
          <meta name="description" content="🔍 1300개 이상의 이모지를 쉽게 찾고 클릭 한 번으로 복사하세요! 감정표현, 음식, 동물, 여행, 국기 등 9개 카테고리" />
        </Head>
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-pulse">🔍</div>
            <p className="text-gray-600">이모지 검색기 로딩 중...</p>
            <div className="mt-4 text-sm text-gray-500">
              1300개 이상의 이모지를 준비하고 있습니다
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>이모지 검색기 - 1300개 이상 이모지 무료 검색 및 복사</title>
        <meta name="description" content="🔍 1300개 이상의 이모지를 쉽게 찾고 클릭 한 번으로 복사하세요! 감정표현, 음식, 동물, 여행, 국기 등 9개 카테고리" />
        <link rel="canonical" href="https://emoji-search.pages.dev" />
      </Head>
      <main className="min-h-screen bg-gray-50">
        {/* 숨겨진 SEO 텍스트 */}
        <div className="sr-only">
          <h1>이모지 검색기 - 무료 이모지 검색 및 복사 도구</h1>
          <p>
            1300개 이상의 다양한 이모지를 카테고리별로 검색하고 클릭 한 번으로 복사할 수 있는 무료 웹 도구입니다. 
            감정 표현, 사람, 동물과 자연, 음식과 음료, 활동, 여행과 장소, 물건, 기호, 국기 등 9개 카테고리로 분류되어 있으며, 
            한국어와 영어 키워드 검색을 지원합니다. 모바일과 데스크톱에서 모두 최적화되어 있습니다.
          </p>
          <h2>주요 기능</h2>
          <ul>
            <li>1300개 이상의 이모지 검색</li>
            <li>9개 카테고리별 분류</li>
            <li>한국어/영어 키워드 검색</li>
            <li>클릭 한 번으로 복사</li>
            <li>국기 이미지 지원</li>
            <li>모바일 최적화</li>
            <li>완전 무료 사용</li>
          </ul>
        </div>
        <EmojiSearch />
      </main>
    </>
  );
}