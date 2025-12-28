'use client';

import { useState, useRef, useEffect } from 'react';
import { SupportedLanguage, LANGUAGE_CONFIGS } from '@/types/languages';

interface LanguageSelectorProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
}

export default function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentConfig = LANGUAGE_CONFIGS[currentLanguage];

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      
      // If there's not enough space below (less than 320px for dropdown), open upward
      if (spaceBelow < 320 && spaceAbove > spaceBelow) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageSelect = (language: SupportedLanguage) => {
    onLanguageChange(language);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="flex items-center space-x-2 px-3 py-1.5 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors text-sm"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span>{currentConfig.icon}</span>
        <span>{currentConfig.name}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div 
            ref={dropdownRef}
            className={`absolute left-0 mt-1 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto dropdown-scroll ${
              dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full'
            }`}
            role="listbox"
          >
            <div className="py-1">
              {Object.values(LANGUAGE_CONFIGS).map((config) => (
                <button
                  key={config.id}
                  onClick={() => handleLanguageSelect(config.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-700 transition-colors ${
                    currentLanguage === config.id 
                      ? 'bg-gray-700 text-blue-400' 
                      : 'text-gray-300'
                  }`}
                  role="option"
                  aria-selected={currentLanguage === config.id}
                >
                  <span className="text-lg">{config.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{config.name}</div>
                    <div className="text-xs text-gray-500">.{config.fileExtension}</div>
                  </div>
                  {config.supportsExecution && (
                    <div className="w-2 h-2 bg-green-400 rounded-full" title="Supports execution" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}