import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../contexts/LanguageContext';

interface SEOProps {
    title?: string;
    description?: string;
    canonical?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, canonical }) => {
    const { language } = useLanguage();

    const siteTitle = "Argena Streetwear";
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;

    const defaultDescription = language === 'EN'
        ? "Argena Streetwear - High-quality, elite streetwear and headwear. Discover our Core Collection."
        : "Argena Streetwear - ملابس شارع وأغطية رأس عالية الجودة ونخبوية. اكتشف تشكيلتنا الأساسية.";

    const contentDescription = description || defaultDescription;

    return (
        <Helmet htmlAttributes={{ lang: language.toLowerCase() }}>
            <title>{fullTitle}</title>
            <meta name="description" content={contentDescription} />

            {canonical && <link rel="canonical" href={canonical} />}

            {/* Dynamic Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={contentDescription} />
            <meta property="og:locale" content={language === 'EN' ? 'en_US' : 'ar_AR'} />

            {/* Dynamic Twitter */}
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={contentDescription} />
        </Helmet>
    );
};

export default SEO;
