'use client';

import LanguageSwitcher, { useLocale } from '@/components/LanguageSwitcher';
import { getTranslation } from '@/lib/i18n';

export default function Header() {
  const { locale, changeLocale } = useLocale();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">
              {getTranslation(locale, 'header.title')}
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-gray-600 hover:text-gray-900">
              {getTranslation(locale, 'footer.howTo')}
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              {getTranslation(locale, 'footer.faq')}
            </a>
            <a href="/privacy" className="text-gray-600 hover:text-gray-900">
              {getTranslation(locale, 'footer.privacy')}
            </a>
            <LanguageSwitcher currentLocale={locale} onLocaleChange={changeLocale} />
          </nav>
          
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSwitcher currentLocale={locale} onLocaleChange={changeLocale} />
          </div>
        </div>
      </div>
    </header>
  );
}