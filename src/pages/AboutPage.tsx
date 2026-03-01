import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

export const AboutPage: React.FC = () => {
    const { language } = useLanguage();

    const t = {
        title1: language === 'EN' ? 'The' : 'الهوية',
        title2: language === 'EN' ? 'Identity' : '',
        p1: language === 'EN'
            ? 'Argana is more than a label. It is a visual system designed to bridge the gap between ancient elegance and dystopian utility.'
            : 'أرجانا هي أكثر من مجرد علامة تجارية. إنها نظام بصري مصمم لسد الفجوة بين الأناقة القديمة والمنفعة الديستوبية.',
        p2: language === 'EN'
            ? 'Our philosophy is rooted in monochromatic minimalism, technical craftsmanship, and the pursuit of ethereal beauty within urban chaos.'
            : 'تتجذر فلسفتنا في الحد الأدنى أحادي اللون، والحرفية التقنية، والسعي وراء الجمال الأثيري داخل فوضى المدينة.',
        p3: language === 'EN'
            ? 'Founded with intent. Materialized in the shadow.'
            : 'تأسست بقصد. تجسدت في الظل.'
    };

    return (
        <div className={`min-h-screen pt-48 pb-32 px-6 md:px-12 max-w-[1600px] mx-auto ${language === 'AR' ? 'text-right' : ''}`}>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-24 items-start ${language === 'AR' ? 'md:flex-row-reverse' : ''}`}>
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    className={language === 'AR' ? 'md:order-last' : ''}
                >
                    <h1 className={`${language === 'EN' ? 'font-[UnifrakturMaguntia]' : 'font-sans font-bold mt-12'} metallic-text text-7xl md:text-9xl mb-12 leading-none`}>
                        {t.title1}{t.title2 && <><br />{t.title2}</>}
                    </h1>
                    {/* Section metadata row — mono label */}
                    <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-silver/50 mb-10">
                        [ BRAND / IDENTITY / MANIFESTO ]
                    </p>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            visible: { transition: { staggerChildren: 0.25 } },
                            hidden: {}
                        }}
                        className={`space-y-8 max-w-lg ${language === 'AR' ? 'ml-auto text-right' : ''}`}
                    >
                        <motion.p
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.9 } } }}
                            className={`text-[15px] leading-[1.85] tracking-wide text-silver ${language === 'AR' ? 'font-sans font-medium' : 'font-sans font-light'}`}
                        >
                            {t.p1}
                        </motion.p>
                        <motion.p
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.9 } } }}
                            className={`text-[15px] leading-[1.85] tracking-wide text-silver/80 ${language === 'AR' ? 'font-sans font-medium' : 'font-sans font-light'}`}
                        >
                            {t.p2}
                        </motion.p>
                        <motion.p
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.9 } } }}
                            className={`font-mono text-xs uppercase tracking-[0.3em] text-white glow-text border-t border-silver/20 pt-6 ${language === 'AR' ? 'font-sans font-bold tracking-normal' : ''}`}
                        >
                            {t.p3}
                        </motion.p>
                    </motion.div>
                </motion.div>

                {/* Collage Image Layout for more 'Soul' */}
                <div className="relative h-[600px] md:h-[800px] w-full group">
                    {/* Background Image Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, delay: 0.2 }}
                        className="absolute top-0 right-0 w-[80%] h-[75%] overflow-hidden cursor-pointer hover:shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-all duration-700 border border-transparent hover:border-white/10 z-0"
                    >
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-700 z-10 mix-blend-overlay pointer-events-none" />
                        <img
                            src="/pictures/e89573dfa0c1da28e6fc73bc3df96c7f.webp"
                            alt="Argana Concept Primary"
                            className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-out"
                        />
                    </motion.div>

                    {/* Foreground Overlapping Image */}
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.5 }}
                        className="absolute bottom-0 left-0 w-[60%] h-[60%] overflow-hidden cursor-pointer hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] transition-all duration-700 border border-silver/10 hover:border-white/30 z-20"
                    >
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-700 z-10 mix-blend-overlay pointer-events-none" />
                        <img
                            src="/pictures/Gemini_Generated_Image_dznecydznecydzne.webp"
                            alt="Argana Concept Secondary"
                            className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-out"
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
