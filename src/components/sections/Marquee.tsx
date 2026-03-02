import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from '../ui/Logo';
import { useLanguage } from '../../contexts/LanguageContext';

export const Marquee: React.FC = () => {
    const { language } = useLanguage();

    return (
        <div className={`w-full overflow-hidden bg-white text-black py-4 border-y border-silver/20 flex items-center relative z-10 ${language === 'AR' ? 'dir-ltr' : ''}`} style={{ direction: 'ltr' }}>
            <motion.div
                animate={{ x: [0, -1035] }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className="flex whitespace-nowrap font-mono text-sm uppercase tracking-widest"
            >
                {[...Array(10)].map((_, i) => (
                    <span key={i} className={`mx-8 flex items-center gap-8 ${language === 'AR' ? 'font-sans font-bold text-lg' : ''}`}>
                        <Logo className="text-xl" forceImageOnly={true} />
                        <span className="w-2 h-2 rounded-full bg-black" />
                        <span>{language === 'EN' ? 'Ethereal Beauty' : 'أناقة الشارع'}</span>
                        <span className="w-2 h-2 rounded-full bg-black" />
                    </span>
                ))}
            </motion.div>
        </div>
    );
};

export default Marquee;
