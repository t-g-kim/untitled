'use client';

import { useState, useMemo } from 'react';
import { emojis, categories, Emoji } from '@/data/emojis';

export default function EmojiSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedEmoji, setCopiedEmoji] = useState<string | null>(null);

  // 검색 및 필터링 로직
  const filteredEmojis = useMemo(() => {
    let filtered = emojis;

    // 카테고리 필터
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(emoji => emoji.category === selectedCategory);
    }

    // 검색어 필터
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(emoji => 
        emoji.name.toLowerCase().includes(term) ||
        emoji.nameKo.includes(term) ||
        emoji.keywords.some(keyword => keyword.toLowerCase().includes(term)) ||
        emoji.keywordsKo.some(keyword => keyword.includes(term))
      );
    }

    return filtered;
  }, [searchTerm, selectedCategory]);

  // 이모지 복사 기능
  const copyEmoji = async (emoji: string) => {
    try {
      await navigator.clipboard.writeText(emoji);
      setCopiedEmoji(emoji);
      setTimeout(() => setCopiedEmoji(null), 1000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  // 국기 이모지 렌더링 함수
  const renderFlagEmoji = (emoji: Emoji) => {
    if (emoji.category === 'flags') {
      // 국가 코드 매핑 (확장된 버전)
      const flagToCountryCode: { [key: string]: string } = {
        // 아시아
        '🇰🇷': 'kr', '🇰🇵': 'kp', '🇯🇵': 'jp', '🇨🇳': 'cn', 
        '🇹🇼': 'tw', '🇭🇰': 'hk', '🇲🇴': 'mo', '🇲🇳': 'mn',
        '🇹🇭': 'th', '🇻🇳': 'vn', '🇱🇦': 'la', '🇰🇭': 'kh', 
        '🇲🇲': 'mm', '🇲🇾': 'my', '🇸🇬': 'sg', '🇮🇩': 'id', 
        '🇵🇭': 'ph', '🇧🇳': 'bn', '🇹🇱': 'tl', '🇮🇳': 'in',
        '🇵🇰': 'pk', '🇧🇩': 'bd', '🇱🇰': 'lk', '🇳🇵': 'np',
        '🇧🇹': 'bt', '🇲🇻': 'mv', '🇦🇫': 'af',
        // 북미
        '🇺🇸': 'us', '🇨🇦': 'ca', '🇲🇽': 'mx',
        // 남미
        '🇧🇷': 'br', '🇦🇷': 'ar', '🇨🇱': 'cl', '🇵🇪': 'pe', 
        '🇨🇴': 'co', '🇻🇪': 've', '🇪🇨': 'ec', '🇧🇴': 'bo', 
        '🇵🇾': 'py', '🇺🇾': 'uy', '🇸🇷': 'sr', '🇬🇾': 'gy',
        // 유럽
        '🇬🇧': 'gb', '🇫🇷': 'fr', '🇩🇪': 'de', '🇮🇹': 'it',
        '🇪🇸': 'es', '🇳🇱': 'nl', '🇮🇪': 'ie', '🇵🇹': 'pt', 
        '🇧🇪': 'be', '🇱🇺': 'lu', '🇨🇭': 'ch', '🇦🇹': 'at', 
        '🇱🇮': 'li', '🇲🇨': 'mc', '🇸🇲': 'sm', '🇻🇦': 'va', 
        '🇦🇩': 'ad', '🇲🇹': 'mt', '🇨🇾': 'cy', '🇬🇷': 'gr', 
        '🇲🇰': 'mk', '🇦🇱': 'al', '🇲🇪': 'me', '🇷🇸': 'rs', 
        '🇧🇦': 'ba', '🇭🇷': 'hr', '🇸🇮': 'si', '🇭🇺': 'hu', 
        '🇷🇴': 'ro', '🇧🇬': 'bg', '🇲🇩': 'md', '🇺🇦': 'ua', 
        '🇧🇾': 'by', '🇱🇹': 'lt', '🇱🇻': 'lv', '🇪🇪': 'ee', 
        '🇫🇮': 'fi', '🇸🇪': 'se', '🇳🇴': 'no', '🇩🇰': 'dk', 
        '🇮🇸': 'is', '🇵🇱': 'pl', '🇨🇿': 'cz', '🇸🇰': 'sk', 
        '🇷🇺': 'ru',
        // 오세아니아
        '🇦🇺': 'au', '🇳🇿': 'nz'
      };

      const countryCode = flagToCountryCode[emoji.emoji];
      
      return (
        <div className="flag-emoji">
          <div className="relative w-8 h-8 mx-auto">
            {countryCode ? (
              <img 
                src={`https://flagcdn.com/w40/${countryCode}.png`}
                alt={emoji.nameKo}
                className="w-8 h-6 object-cover rounded-sm border border-gray-200"
                onError={(e) => {
                  // 이미지 로드 실패 시 원본 이모지로 폴백
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = document.createElement('span');
                    fallback.textContent = emoji.emoji;
                    fallback.style.fontSize = '2rem';
                    fallback.style.fontFamily = '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
                    parent.appendChild(fallback);
                  }
                }}
              />
            ) : (
              <span 
                style={{ 
                  fontSize: '2rem', 
                  fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif'
                }}
              >
                {emoji.emoji}
              </span>
            )}
          </div>
          
          <div className="text-xs text-gray-500 mt-1 truncate max-w-16 leading-tight">
            {emoji.nameKo.replace(' 국기', '').replace('특별행정구', 'SAR')}
          </div>
        </div>
      );
    }
    return <span className="emoji">{emoji.emoji}</span>;
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* 헤더 */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">🔍 이모지 검색기</h1>
        <p className="text-gray-600 mb-2">원하는 이모지를 찾아서 클릭하면 복사됩니다!</p>
        <p className="text-sm text-gray-500">
          1300개 이상의 이모지 • 9개 카테고리 • 한국어/영어 검색 지원
        </p>
      </header>

      {/* 검색 바 */}
      <section className="mb-6" role="search" aria-label="이모지 검색">
        <label htmlFor="emoji-search" className="sr-only">
          이모지 검색 입력창
        </label>
        <input
          id="emoji-search"
          type="text"
          placeholder="이모지 검색... (예: 웃음, happy, 하트)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-describedby="search-help"
        />
        <div id="search-help" className="sr-only">
          한국어나 영어로 이모지를 검색할 수 있습니다. 예: 웃음, happy, 하트, food
        </div>
      </section>

      {/* 카테고리 탭 */}
      <nav className="mb-6 overflow-x-auto" role="navigation" aria-label="이모지 카테고리">
        <div className="flex space-x-2 min-w-max">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            aria-pressed={selectedCategory === 'all'}
          >
            전체
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              aria-pressed={selectedCategory === category.id}
            >
              {category.nameKo}
            </button>
          ))}
        </div>
      </nav>

      {/* 검색 결과 개수 */}
      <div className="mb-4 text-gray-600" role="status" aria-live="polite">
        {filteredEmojis.length}개의 이모지를 찾았습니다
        {selectedCategory === 'flags' && (
          <div className="mt-2">
            <div className="text-sm mb-2">
              국기 테스트 (실제 국기 이미지):
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { emoji: '🇰🇷', code: 'kr', name: '한국' },
                { emoji: '🇰🇵', code: 'kp', name: '북한' },
                { emoji: '🇺🇸', code: 'us', name: '미국' },
                { emoji: '🇯🇵', code: 'jp', name: '일본' },
                { emoji: '🇨🇳', code: 'cn', name: '중국' },
                { emoji: '🇹🇼', code: 'tw', name: '대만' },
                { emoji: '🇭🇰', code: 'hk', name: '홍콩' },
                { emoji: '🇲🇴', code: 'mo', name: '마카오' },
                { emoji: '🇲🇳', code: 'mn', name: '몽골' },
                { emoji: '🇬🇧', code: 'gb', name: '영국' },
                { emoji: '🇫🇷', code: 'fr', name: '프랑스' },
                { emoji: '🇩🇪', code: 'de', name: '독일' },
                { emoji: '🇮🇹', code: 'it', name: '이탈리아' }
              ].map((flag, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <img 
                    src={`https://flagcdn.com/w40/${flag.code}.png`}
                    alt={`${flag.name} 국기`}
                    className="w-6 h-4 object-cover rounded-sm border border-gray-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const span = document.createElement('span');
                      span.textContent = flag.emoji;
                      span.style.fontSize = '1.5rem';
                      target.parentElement?.appendChild(span);
                    }}
                  />
                  <span className="text-xs text-gray-400 mt-1">{flag.name}</span>
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              총 {emojis.filter(e => e.category === 'flags').length}개의 국기 이모지가 있습니다
            </div>
          </div>
        )}
      </div>

      {/* 이모지 그리드 */}
      <main 
        className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-16 gap-2"
        role="main"
        aria-label="이모지 목록"
      >
        {filteredEmojis.map((emoji, index) => (
          <button
            key={index}
            onClick={() => copyEmoji(emoji.emoji)}
            className={`relative group cursor-pointer p-3 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              emoji.category === 'flags' ? 'flag-container' : ''
            }`}
            title={`${emoji.nameKo} (${emoji.name}) - 클릭하여 복사`}
            aria-label={`${emoji.nameKo} 이모지 복사`}
          >
            <div className="text-2xl text-center">
              {renderFlagEmoji(emoji)}
            </div>
            
            {/* 복사 완료 표시 */}
            {copiedEmoji === emoji.emoji && (
              <div 
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded"
                role="status"
                aria-live="assertive"
              >
                복사됨!
              </div>
            )}
            
            {/* 호버 시 이름 표시 */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {emoji.nameKo}
            </div>
          </button>
        ))}
      </main>

      {/* 검색 결과가 없을 때 */}
      {filteredEmojis.length === 0 && (
        <div className="text-center py-12" role="status">
          <div className="text-6xl mb-4">😅</div>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">검색 결과가 없습니다</h2>
          <p className="text-gray-500 text-sm">다른 키워드로 검색해보세요!</p>
          <div className="mt-4 text-sm text-gray-400">
            추천 검색어: 웃음, 음식, 동물, 하트, happy, food, love
          </div>
        </div>
      )}

      {/* 푸터 정보 */}
      <footer className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
        <p className="mb-2">
          <strong>이모지 검색기</strong> - 1300개 이상의 이모지를 무료로 검색하고 복사하세요
        </p>
        <p className="mb-2">
          9개 카테고리: 감정표현, 사람, 동물과자연, 음식과음료, 활동, 여행과장소, 물건, 기호, 국기
        </p>
        <p>
          한국어/영어 검색 지원 • 모바일 최적화 • 완전 무료
        </p>
      </footer>
    </div>
  );
}