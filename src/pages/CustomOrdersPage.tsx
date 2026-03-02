import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export const CustomOrdersPage: React.FC = () => {
    const { language } = useLanguage();
    const navigate = useNavigate();

    const t = {
        title1: language === 'EN' ? 'Custom' : 'طلبات',
        title2: language === 'EN' ? 'Orders' : 'خاصة',
        desc: language === 'EN'
            ? 'Bespoke craftsmanship for those who seek the unique. Materializing your vision into reality.'
            : 'حرفية خالصة لمن يبحث عن التميّز. نحوّل رؤيتك إلى شيء حقيقي تلمسه.',
        studioProt: language === 'EN' ? 'Studio Protocol' : 'بروتوكول الاستوديو',
        step1Title: language === 'EN' ? '01. Consultation' : '01. استشارة',
        step1Desc: language === 'EN'
            ? 'Dialogue between creator and client to define the visual intent and material requirements.'
            : 'حوار بينك وبيننا لتحديد توجهك البصري ومتطلباتك من البداية.',
        step2Title: language === 'EN' ? '02. Materialization' : '02. تجسيد',
        step2Desc: language === 'EN'
            ? 'Handcrafted selection of technical fabrics or premium silver hardware to match the bespoke blueprint.'
            : 'اختيار يدوي للأقمشة والإكسسوارات لتتوافق مع مخططك الخاص.',
        startProto: language === 'EN' ? 'START THE PROTOCOL' : 'ابدأ البروتوكول'
    };

    return (
        <div className={`min-h-screen pt-48 pb-32 px-6 md:px-12 max-w-[1600px] mx-auto ${language === 'AR' ? 'text-right' : ''}`}>
            <div className={`flex flex-col md:flex-row justify-between items-start md:items-end mb-32 border-b border-silver/20 pb-8 gap-8 ${language === 'AR' ? 'md:flex-row-reverse' : ''}`}>
                <h1 className={`${language === 'EN' ? 'font-[UnifrakturMaguntia]' : 'font-sans font-bold'} metallic-text text-6xl md:text-9xl leading-none`}>
                    {t.title1}<br />{t.title2}
                </h1>
                <p className={`font-mono text-xs uppercase tracking-widest text-silver max-w-xs text-start md:text-end ${language === 'AR' ? 'uppercase-none font-sans font-medium' : ''}`}>
                    {t.desc}
                </p>
            </div>

            <div className={`max-w-4xl ${language === 'AR' ? 'ml-auto' : ''}`}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative aspect-video mb-24 overflow-hidden border border-silver/20 shadow-2xl"
                >
                    <img
                        src="/pictures/37fd76ec735f1578cec4da78fa103e6f.webp"
                        alt="Craftsmanship"
                        className="w-full h-full object-cover grayscale opacity-40 art-image"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <h2 className={`${language === 'EN' ? 'font-[UnifrakturMaguntia] italic' : 'font-sans font-bold'} metallic-text text-5xl md:text-7xl`}>{t.studioProt}</h2>
                    </div>
                </motion.div>

                <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 font-mono text-sm tracking-widest uppercase ${language === 'AR' ? 'uppercase-none font-sans font-medium' : ''}`}>
                    <div className="space-y-6">
                        <h3 className="text-white border-b border-silver/20 pb-2 font-bold">{t.step1Title}</h3>
                        <p className="text-silver text-xs leading-relaxed">{t.step1Desc}</p>
                    </div>
                    <div className="space-y-6">
                        <h3 className="text-white border-b border-silver/20 pb-2 font-bold">{t.step2Title}</h3>
                        <p className="text-silver text-xs leading-relaxed">{t.step2Desc}</p>
                    </div>
                </div>

                <button
                    onClick={() => navigate('/contact')}
                    className={`mt-24 w-full group flex items-center justify-between font-mono text-xs tracking-[0.4em] border border-white px-12 py-6 rounded-full bg-white text-black hover:bg-silver transition-all duration-500 ${language === 'AR' ? 'uppercase-none font-sans font-bold tracking-widest flex-row-reverse' : ''}`}
                >
                    {t.startProto}
                    {language === 'EN' ? <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" /> : <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />}
                </button>
            </div>
        </div>
    );
};

export default CustomOrdersPage;
