import { ReactNode, useContext, useState, createContext } from "react";

export type Language = "en" | "hi" | "sa";

export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
//   t: (key: string) => string;
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
  const [language, setLanguage] = useState<Language>("en");

//   function t(key: string): string {
//     const translations: Record<Language, Record<string, string>> = {
//       english: { hello: "Hello" },
//       hindi: { hello: "नमस्ते" },
//       sanskrit: { hello: "नमः" },
//     };
//     return translations[language][key] || key;
//   }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
