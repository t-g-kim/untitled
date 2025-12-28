'use client';

import QRGenerator from '@/components/QRGenerator';
import { AdSensePlaceholder } from '@/components/AdSense';
import { useLocale } from '@/components/LanguageSwitcher';
import { getTranslation } from '@/lib/i18n';

export default function Home() {
  const { locale } = useLocale();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          {getTranslation(locale, 'main.title')}
        </h1>
        <p className="text-lg text-gray-600">
          {getTranslation(locale, 'main.subtitle')}
        </p>
      </div>
      
      {/* Top Ad */}
      <AdSensePlaceholder 
        height="90px" 
        className="mb-8 rounded-lg"
        label="상단 광고 (728×90)"
      />
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <QRGenerator locale={locale} />
      </div>
      
      {/* Bottom Ad */}
      <AdSensePlaceholder 
        height="250px" 
        className="mt-8 rounded-lg"
        label="하단 광고 (300×250)"
      />
      
      {/* Mobile Ad */}
      <div className="md:hidden mt-4">
        <AdSensePlaceholder 
          height="100px" 
          className="rounded-lg"
          label="모바일 광고 (320×100)"
        />
      </div>
    </div>
  );
}