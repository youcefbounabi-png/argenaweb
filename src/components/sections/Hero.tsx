import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EtherealShadowEffect } from '../ui/etheral-shadow';
import { useLanguage } from '../../contexts/LanguageContext';

export const Hero: React.FC = () => {
    const { language } = useLanguage();

    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section className="relative h-[100svh] w-full flex flex-col justify-between overflow-hidden pt-32 pb-12 px-6 md:px-12">
            <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
                <img
                    src="/pictures/Gemini_Generated_Image_dznecydznecydzne.webp"
                    alt="Hero Background"
                    className="w-full h-full object-cover art-image opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-bg/10 via-bg/60 to-bg" />
            </motion.div>

            <div className="relative z-10 w-full max-w-[1600px] mx-auto flex-1 flex flex-col justify-center items-center">
                <motion.div
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.2, delay: 2.2, ease: [0.76, 0, 0.24, 1] }}
                    className="flex flex-col items-center justify-center gap-8"
                >
                    {/* Logo wrapper — white background, shadow behind, transparent logo on top */}
                    <div
                        className="relative w-[80vw] md:w-[40vw] max-w-4xl overflow-hidden"
                        style={{ display: 'grid', backgroundColor: 'white' }}
                    >
                        {/* Shadow layer sits behind the transparent logo */}
                        <div style={{ gridArea: '1/1', zIndex: 0 }}>
                            <EtherealShadowEffect
                                color="rgba(30, 30, 38, 0.85)"
                                animation={{ scale: 60, speed: 90 }}
                            />
                        </div>
                        {/* logo0.png has transparent bg */}
                        <img
                            src="/pictures/logo0.webp"
                            alt="Argana Hero Logo"
                            className="w-full h-auto object-contain filter brightness-125 drop-shadow-[0_0_25px_rgba(255,255,255,0.6)]"
                            style={{ gridArea: '1/1', position: 'relative', zIndex: 10 }}
                        />
                    </div>
                </motion.div>
            </div>

            <div className={`relative z-10 w-full max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-8 text-white ${language === 'AR' ? 'text-right' : ''}`}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 2.6 }}
                    className="max-w-sm"
                >
                    <p className={`font-mono text-[10px] md:text-xs text-silver uppercase tracking-widest leading-relaxed ${language === 'AR' ? 'uppercase-none font-sans font-medium' : ''}`}>
                        {language === 'EN'
                            ? 'A curated collection of streetwear and accessories. Redefining urban aesthetics through a monochromatic lens.'
                            : 'مجموعة مميزة من ملابس الشارع والإكسسوارات. تصاميم عصرية بجودة عالية.'}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 2.8 }}
                >
                    <Link to={`/${language.toLowerCase()}/shop`} className={`group flex items-center gap-3 font-mono text-[10px] md:text-xs uppercase tracking-widest border border-silver/30 px-6 py-3 rounded-full hover:bg-white hover:text-black transition-all duration-500 ${language === 'AR' ? 'uppercase-none font-sans font-medium flex-row-reverse' : ''}`}>
                        {language === 'EN' ? 'Explore Collection' : 'اكتشف المجموعة'}
                        <ArrowRight size={14} className={`transition-transform duration-300 ${language === 'AR' ? 'rotate-180 group-hover:-translate-x-2' : 'group-hover:translate-x-2'}`} />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
