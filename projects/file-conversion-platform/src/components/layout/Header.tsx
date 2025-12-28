'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CP</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">ConvertPro</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/pdf-to-word" className="text-gray-600 hover:text-primary-600 transition-colors">
              PDF → Word
            </Link>
            <Link href="/word-to-pdf" className="text-gray-600 hover:text-primary-600 transition-colors">
              Word → PDF
            </Link>
            <Link href="/tools" className="text-gray-600 hover:text-primary-600 transition-colors">
              도구
            </Link>
            <Link href="/help" className="text-gray-600 hover:text-primary-600 transition-colors">
              도움말
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <Link href="/pdf-to-word" className="block px-3 py-2 text-gray-600 hover:text-primary-600">
                PDF → Word
              </Link>
              <Link href="/word-to-pdf" className="block px-3 py-2 text-gray-600 hover:text-primary-600">
                Word → PDF
              </Link>
              <Link href="/tools" className="block px-3 py-2 text-gray-600 hover:text-primary-600">
                도구
              </Link>
              <Link href="/help" className="block px-3 py-2 text-gray-600 hover:text-primary-600">
                도움말
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}