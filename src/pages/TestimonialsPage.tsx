import React from 'react';
import { motion } from 'framer-motion';

import { useLanguage } from '../contexts/LanguageContext';

export const TestimonialsPage: React.FC = () => {
    const { language } = useLanguage();

    const t = {
        title1: language === 'EN' ? 'The' : 'الشهود',
        title2: language === 'EN' ? 'Witnesses' : '',
        subtitle: language === 'EN'
            ? 'A collection of voices from the archive. Those who have experienced the ethereal.'
            : 'مجموعة من الأصوات من الأرشيف. أولئك الذين جربوا الأثيري.',
        testimonialsBlock: language === 'EN' ? 'TESTIMONIAL' : 'شهادة',
        testimonials: language === 'EN' ? [
            {
                name: 'ELARA VANCE',
                location: 'BERLIN',
                review: 'The quality of the herringbone dad hat is unmatched. It feels like a piece of art rather than just headwear.',
                date: '2024.12.01'
            },
            {
                name: 'KAIRO S.',
                location: 'TOKYO',
                review: 'Dystopian luxury at its finest. The silver hardware details are insane. Argana is the future.',
                date: '2024.11.15'
            },
            {
                name: 'MAYA R.',
                location: 'NYC',
                review: 'Finally a brand that understands the intersection of ancient aesthetics and modern street culture.',
                date: '2024.11.28'
            },
            {
                name: 'JULIAN D.',
                location: 'PARIS',
                review: 'The unboxing experience alone was enough for me. The "Ethereal" theme is carried through everything they do.',
                date: '2024.12.05'
            }
        ] : [
            {
                name: 'أمينة ب.',
                location: 'الجزائر العاصمة',
                review: 'جودة القبعة لا مثيل لها. تبدو كقطعة فنية أكثر من مجرد غطاء للرأس.',
                date: '2024.12.01'
            },
            {
                name: 'طارق م.',
                location: 'وهران',
                review: 'الفخامة الديستوبية في أبهى صورها. تفاصيل الإكسسوارات الفضية خيالية. أرجانا هي المستقبل.',
                date: '2024.11.15'
            },
            {
                name: 'ياسمين ح.',
                location: 'قسنطينة',
                review: 'أخيراً علامة تجارية تفهم التقاطع بين الجماليات القديمة وثقافة الشارع الحديثة.',
                date: '2024.11.28'
            },
            {
                name: 'رياض ك.',
                location: 'عنابة',
                review: 'تجربة فتح العلبة وحدها كانت كافية بالنسبة لي. طابع "الأثيري" حاضر في كل ما يفعلونه.',
                date: '2024.12.05'
            }
        ]
    };

    return (
        <div className={`min-h-screen pt-48 pb-32 px-6 md:px-12 max-w-[1600px] mx-auto ${language === 'AR' ? 'text-right' : ''}`}>
            <div className={`flex flex-col ${language === 'AR' ? 'md:flex-row-reverse' : 'md:flex-row'} justify-between items-start md:items-end mb-32 border-b border-silver/20 pb-8 gap-8`}>
                <h1 className={`${language === 'EN' ? 'font-[UnifrakturMaguntia]' : 'font-sans font-bold'} metallic-text text-6xl md:text-9xl leading-none`}>
                    {t.title1}{t.title2 && <><br />{t.title2}</>}
                </h1>
                <p className={`font-mono text-xs uppercase tracking-widest text-silver max-w-xs ${language === 'AR' ? 'text-right md:text-left' : 'text-left md:text-right'} leading-loose`}>
                    {t.subtitle}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {t.testimonials.map((testim, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02, y: -10 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="p-12 border border-silver/10 bg-silver-dark/5 flex flex-col justify-between aspect-[4/3] group transition-all duration-500 hover:border-white/40 hover:bg-silver-dark/20 hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] cursor-pointer"
                    >
                        <div>
                            <p className={`font-mono text-[10px] text-silver tracking-widest mb-6 ${language === 'AR' ? 'text-right' : 'text-left'}`}>
                                ({String(i + 1).padStart(3, '0')}) {t.testimonialsBlock}
                            </p>
                            <h2 className={`${language === 'EN' ? 'font-[UnifrakturMaguntia]' : 'font-sans font-bold leading-loose'} text-2xl md:text-3xl text-white group-hover:metallic-text mb-8 italic`}>
                                "{testim.review}"
                            </h2>
                        </div>
                        <div className={`flex ${language === 'AR' ? 'flex-row-reverse' : 'flex-row'} justify-between items-end border-t border-silver/20 pt-8 mt-8 font-mono text-xs uppercase tracking-widest`}>
                            <div className={language === 'AR' ? 'text-right' : 'text-left'}>
                                <p className="font-bold mb-1 text-white">{testim.name}</p>
                                <p className="text-silver">{testim.location}</p>
                            </div>
                            <p className="text-silver/50">{testim.date}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default TestimonialsPage;
