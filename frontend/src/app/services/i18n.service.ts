import { Injectable, signal } from '@angular/core';
import fr from '../../assets/i18n/fr.json';
import en from '../../assets/i18n/en.json';

type Language = 'fr' | 'en';
type Dictionary = Record<string, unknown>;

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly language = signal<Language>('fr');
  readonly availableLanguages: ReadonlyArray<{ code: Language; flag: string; label: string }> = [
    { code: 'fr', flag: '🇫🇷', label: 'Français' },
    { code: 'en', flag: '🇬🇧', label: 'English' }
  ];

  private readonly dictionaries: Record<Language, Dictionary> = { fr, en };

  setLanguage(language: Language): void {
    this.language.set(language);
    localStorage.setItem('flowio-language', language);
  }

  t(key: string): string {
    const value = key.split('.').reduce<unknown>((current, segment) => {
      return current && typeof current === 'object' ? (current as Dictionary)[segment] : undefined;
    }, this.dictionaries[this.language()]);

    return typeof value === 'string' ? value : key;
  }

  constructor() {
    const saved = localStorage.getItem('flowio-language');
    if (saved === 'fr' || saved === 'en') this.language.set(saved);
  }
}
