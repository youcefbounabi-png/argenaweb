import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'EN' | 'AR';

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(() => {
        // 1. Check URL path first (e.g. /ar/shop or /en/about)
        const pathParts = window.location.pathname.split('/');
        const pathLang = pathParts[1]?.toUpperCase();
        if (pathLang === 'AR' || pathLang === 'EN') return pathLang as Language;

        // 2. Check URL parameters next (e.g. ?lang=ar or ?lang=en)
        const params = new URLSearchParams(window.location.search);
        const urlLang = params.get('lang')?.toUpperCase();
        if (urlLang === 'AR' || urlLang === 'EN') return urlLang as Language;

        // 3. Check localStorage
        const storedLang = localStorage.getItem('argena_language');
        if (storedLang === 'AR' || storedLang === 'EN') return storedLang as Language;

        // 4. Fallback to default
        return 'EN';
    });

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'EN' ? 'AR' : 'EN');
    };

    useEffect(() => {
        // Persist language to localStorage
        localStorage.setItem('argena_language', language);

        // Update URL path to reflect current language without reloading the page
        const newUrl = new URL(window.location.href);
        const pathParts = newUrl.pathname.split('/');

        // If the first part of the path is already a language, replace it. Otherwise, prepend it.
        if (pathParts[1] && (pathParts[1].toUpperCase() === 'AR' || pathParts[1].toUpperCase() === 'EN')) {
            pathParts[1] = language.toLowerCase();
        } else {
            pathParts.splice(1, 0, language.toLowerCase());
        }

        newUrl.pathname = pathParts.join('/').replace(/\/+$/, '') || '/';

        // Clean up legacy ?lang= params
        newUrl.searchParams.delete('lang');

        window.history.replaceState({}, '', newUrl);

        // Update document attributes for direction and language
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
