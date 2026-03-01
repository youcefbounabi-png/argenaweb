import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';

export const FeaturedCollections: React.FC = () => {
    const targetRef = useRef<HTMLDivElement>(null);
    const { language } = useLanguage();

    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const xVal = language === 'AR' ? "66.66%" : "-66.66%";
    const x = useTransform(scrollYProgress, [0, 1], ["0%", xVal]);

    const collections = language === 'EN' ? [
        {
            title: "Core Collection",
            desc: "Essential pieces for the modern wardrobe.",
            image: "/pictures/gemini.png"
        },
        {
            title: "Archival Packaging",
            desc: "Classified hardware. Sealed for authenticity.",
            image: "/pictures/packaging.png"
        },
        {
            title: "Headwear",
            desc: "Structured and distressed caps.",
            image: "/pictures/e89573dfa0c1da28e6fc73bc3df96c7f.webp"
        }
    ] : [
        {
            title: "المجموعة الأساسية",
            desc: "قطع أساسية لخزانة الملابس الحديثة.",
            image: "/pictures/gemini.png"
        },
        {
            title: "تغليف الأرشيف",
            desc: "معدات مصنفة محكمة الغلق لضمان الأصالة.",
            image: "/pictures/packaging.png"
        },
        {
            title: "أغطية الرأس",
            desc: "قبعات مهيكلة وممزقة.",
            image: "/pictures/e89573dfa0c1da28e6fc73bc3df96c7f.webp"
        }
    ];

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-bg">
            <div className="sticky top-0 h-screen flex items-center overflow-hidden">
                <motion.div style={{ x }} className="flex gap-12 px-12 w-[300vw]">
                    {collections.map((collection, index) => (
                        <div key={index} className="w-[100vw] flex-shrink-0 flex items-center justify-center">
                            <div className="relative w-full max-w-5xl aspect-[16/9] overflow-hidden group">
                                <img
                                    src={collection.image}
                                    alt={collection.title}
                                    className="w-full h-full object-cover art-image group-hover:scale-105 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-12">
                                    <h3 className={`${language === 'EN' ? 'font-[UnifrakturMaguntia]' : 'font-sans font-bold'} metallic-text text-6xl md:text-8xl mb-4`}>{collection.title}</h3>
                                    <p className={`font-mono text-xs uppercase tracking-widest text-silver max-w-sm ${language === 'AR' ? 'uppercase-none font-sans font-medium' : ''}`}>
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
