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
            : 'أصوات حقيقية من تجربوا ما تقدمه ارجينا.',
        testimonialsBlock: language === 'EN' ? 'TESTIMONIAL' : 'شهادة',
        testimonials: language === 'EN' ? [
            {
                name: 'AMINA B.',
                location: 'ALGIERS',
                review: 'The quality is fire, no cap! khedma nqiya bzaf w the fit is just perfect. Definitely worth every dinar. Keep it up guys!',
                date: '2024.12.01'
            },
            {
                name: 'TAREK M.',
                location: 'ORAN',
                review: 'Dystopian luxury at its finest. The silver hardware details are insane. Argana is the future.',
                date: '2024.11.15'
            },
            {
                name: 'YASMINE H.',
                location: 'CONSTANTINE',
                review: 'Finally a brand that understands the intersection of ancient aesthetics and modern street culture.',
                date: '2024.11.28'
            },
            {
                name: 'RIAD K.',
                location: 'ANNABA',
                review: 'The unboxing experience alone was enough for me. The "Ethereal" theme is carried through everything they do.',
                date: '2024.12.05'
            }
        ] : [
            {
                name: 'أمينة ب.',
                location: 'الجزائر العاصمة',
                review: 'جودة القبعة لا توصف — تحسّ وكأنك ترتدي قطعة فنية لا مجرد غطاء للرأس.',
                date: '2024.12.01'
            },
            {
                name: 'طارق م.',
                location: 'وهران',
                review: 'فخامة حقيقية بأسلوب عصري. الإكسسوارات الفضية تسرق الأنظار. ارجينا هي المستقبل.',
                date: '2024.11.15'
            },
            {
                name: 'ياسمين ح.',
                location: 'قسنطينة',
                review: 'أخيراً علامة تفهم كيف تمزج بين جماليات الماضي وروح الشارع اليوم.',
                date: '2024.11.28'
            },
            {
                name: 'رياض ك.',
                location: 'عنابة',
                review: '\u062a\u062c\u0631\u0628\u0629 \u0641\u062a\u062d \u0627\u0644\u0639\u0644\u0628\u0629 \u0648\u062d\u062f\u0647\u0627 \u0643\u0627\u0646\u062a \u062a\u0633\u062a\u062d\u0642. \u0627\u0644\u0627\u0647\u062a\u0645\u0627\u0645 \u0628\u0627\u0644\u062a\u0641\u0627\u0635\u064a\u0644 \u0648\u0627\u0636\u062d \u0641\u064a \u0643\u0644 \u0634\u064a\u0621.',
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
                    // Wrapper: 1px padding + rotating conic-gradient = the animated border
                    <div key={i} className="testimonial-wrapper">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.02, y: -10 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            className="p-12 bg-[#050505] flex flex-col justify-between aspect-[4/3] group transition-all duration-500 cursor-pointer"
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
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TestimonialsPage;
