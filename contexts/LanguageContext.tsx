import React, { createContext, useContext, useState, ReactNode } from 'react';
import { locales, Language } from '../locales';

interface LanguageContextProps {
  language: Language;
  toggleLanguage: () => void;
  t: (keyPath: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('CN');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'CN' ? 'EN' : 'CN'));
  };

  const t = (keyPath: string): string => {
    const keys = keyPath.split('.');
    let current: any = locales[language];
    
    for (const key of keys) {
      if (current === undefined || current[key] === undefined) {
        console.warn(`Translation key not found: ${keyPath}`);
        return keyPath;
      }
      current = current[key];
    }
    
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
