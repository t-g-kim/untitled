import { SupportedLanguage } from '@/types/languages';

export class StorageManager {
  private static readonly MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB limit
  private static readonly LANGUAGES: SupportedLanguage[] = ['python', 'javascript', 'typescript', 'html', 'css', 'json', 'java', 'cpp', 'c', 'csharp', 'php', 'ruby', 'go', 'rust', 'kotlin', 'swift'];

  static getStorageUsage(): number {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  }

  static isStorageFull(): boolean {
    return this.getStorageUsage() > this.MAX_STORAGE_SIZE * 0.9; // 90% threshold
  }

  static clearOldLanguageCodes(currentLanguage: SupportedLanguage): void {
    this.LANGUAGES.forEach(lang => {
      if (lang !== currentLanguage) {
        localStorage.removeItem('code-' + lang);
      }
    });
  }

  static saveCode(language: SupportedLanguage, code: string): boolean {
    try {
      localStorage.setItem('code-' + language, code);
      return true;
    } catch (error) {
      console.warn('Storage quota exceeded, attempting to clear old data...');
      
      try {
        // Clear old language codes
        this.clearOldLanguageCodes(language);
        
        // Try saving again
        localStorage.setItem('code-' + language, code);
        return true;
      } catch (clearError) {
        console.error('Failed to save code even after clearing storage:', clearError);
        return false;
      }
    }
  }

  static loadCode(language: SupportedLanguage): string | null {
    try {
      return localStorage.getItem('code-' + language);
    } catch (error) {
      console.error('Error loading code from localStorage:', error);
      return null;
    }
  }

  static clearAllCodes(): void {
    this.LANGUAGES.forEach(lang => {
      localStorage.removeItem('code-' + lang);
    });
  }

  static resetToDefaults(): void {
    // Import here to avoid circular dependency
    const { LANGUAGE_CONFIGS } = require('@/types/languages');
    this.LANGUAGES.forEach(lang => {
      localStorage.setItem('code-' + lang, LANGUAGE_CONFIGS[lang].defaultCode);
    });
  }
}