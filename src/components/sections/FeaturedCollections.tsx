import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';

export const FeaturedCollections: React.FC = () => {
    const targetRef = useRef<HTMLDivElement>(null);
    const { language } = useLanguage();

    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const xVal = language === 'AR' ? "200vw" : "-200vw";
    const x = useTransform(scrollYProgress, [0, 0.95], ["0vw", xVal]);

    const collections = language === 'EN' ? [
        {
            title: "Core Collection",
            desc: "Essential pieces for the modern wardrobe.",
            image: "/pictures/gemini.png"
        },
        {
            title: "Archival Packaging",
            desc: "Classified hardware. Sealed for authenticity.",
            image: "/pictures/unnamed.jpg"
        },
        {
            title: "Headwear",
            desc: "Structured and distressed caps.",
            image: "/pictures/e89573dfa0c1da28e6fc73bc3df96c7f.webp"
        }
    ] : [
        {
            title: "التشكيلة الأساسية",
            desc: "قطع لن تغيب عن خزانتك أبداً.",
            image: "/pictures/gemini.png"
        },
        {
            title: "تغليف الأرشيف",
            desc: "كل تفاصيل التغليف أجزء من تجربة نقلها بعناية.",
            image: "/pictures/unnamed.jpg"
        },
        {
            title: "أغطية الرأس",
            desc: "قبعات متينة وأخرى ممزقة بعمد وفن.",
            image: "/pictures/e89573dfa0c1da28e6fc73bc3df96c7f.webp"
        }
    ];

    return (
        <section ref={targetRef} className="relative h-[350vh] bg-bg">
            <div className="sticky top-0 h-[100dvh] flex items-center overflow-hidden">
                <motion.div style={{ x }} className="flex w-max px-0">
                    {collections.map((collection, index) => (
                        <div key={index} className="w-screen flex-shrink-0 flex items-center justify-center p-6 md:p-12">
                            <div className="relative w-full max-w-5xl aspect-[16/9] overflow-hidden group">
                                <img
                                    src={collection.image}
                                    alt={collection.title}
                                    className="w-full h-full object-cover art-image group-hover:scale-105 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-8 md:p-12">
                                    <h3 className={`${language === 'EN' ? 'font-[UnifrakturMaguntia]' : 'font-sans font-bold'} metallic-text text-5xl md:text-8xl mb-4`}>{collection.title}</h3>
                                    <p className={`font-mono text-[10px] md:text-xs uppercase tracking-widest text-silver max-w-xs md:max-w-sm ${language === 'AR' ? 'uppercase-none font-sans font-medium' : ''}`}>
                                        {collection.desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturedCollections;
