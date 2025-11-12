import { ReactNode, useContext, useState, createContext, useEffect } from "react";
import { translations, Translations } from "@/utils/translations";

export type Language = "en" | "hi" | "sa";

export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof Translations | string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  // Load language from localStorage or default to "en"
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("gitagyan-language");
    return (saved as Language) || "en";
  });

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("gitagyan-language", language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: keyof Translations | string): string => {
    if (key.includes('.')) {
      // Handle nested keys like "highlights.yearsOld"
      const [parent, child] = key.split('.');
      const parentValue = translations[language]?.[parent as keyof Translations] ?? translations.en[parent as keyof Translations];
      if (parentValue && typeof parentValue === 'object' && child in parentValue) {
        return (parentValue as any)[child] || key;
      }
      return key;
    }
    const value = translations[language]?.[key as keyof Translations] ?? translations.en[key as keyof Translations];
    return typeof value === "string" ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
