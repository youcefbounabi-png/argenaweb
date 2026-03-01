import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'EN' | 'AR';

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('EN');

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'EN' ? 'AR' : 'EN');
    };

    useEffect(() => {
        if (language === 'AR') {
            document.documentElement.setAttribute('dir', 'rtl'); // Enable native RTL mirroring
            document.documentElement.setAttribute('lang', 'ar');
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
            document.documentElement.setAttribute('lang', 'en');
        }
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
