import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const AvailableSoonPage: React.FC = () => {
    const { language } = useLanguage();
    return (
        <div className="min-h-screen pt-32 px-6 md:px-12 max-w-[1600px] mx-auto flex flex-col items-center justify-center text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                <p className={`font-mono text-xs uppercase tracking-[0.4em] text-silver mb-8 ${language === 'AR' ? 'uppercase-none font-sans font-bold' : ''}`}>
                    {language === 'EN' ? 'Collection // In Progress' : 'المجموعة // قيد التنفيذ'}
                </p>
                <h1 className={`${language === 'EN' ? 'font-[UnifrakturMaguntia]' : 'font-sans font-bold'} metallic-text text-6xl md:text-9xl mb-12 leading-tight`}>
                    {language === 'EN' ? <><span className="hidden">Ethereal Expansion</span>Ethereal<br />Expansion</> : 'توسع أثيري'}
                </h1>
                <p className={`font-mono text-sm text-silver uppercase tracking-widest leading-relaxed max-w-xl mb-12 ${language === 'AR' ? 'uppercase-none font-sans font-medium' : ''}`}>
                    {language === 'EN'
                        ? 'Technical apparel and silver hardware are currently in production. The next drop is materializing soon.'
                        : 'الملابس التقنية والإكسسوارات الفضية قيد الإنتاج حالياً. الإصدار القادم سيتحقق قريباً.'}
                </p>
                <Link
                    to={`/${language.toLowerCase()}/shop`}
                    className={`group flex items-center justify-center gap-3 font-mono text-[10px] md:text-xs uppercase tracking-widest border border-silver/30 px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-500 ${language === 'AR' ? 'uppercase-none font-sans font-bold flex-row-reverse' : ''}`}
                >
                    {language === 'EN' ? <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform duration-300" /> : <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-300" />}
                    {language === 'EN' ? 'Back to Shop' : 'العودة إلى المتجر'}
                </Link>
            </motion.div>
        </div>
    );
};

export default AvailableSoonPage;
