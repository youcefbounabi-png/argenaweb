import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import ProductDetailsModal from '../ui/ProductDetailsModal';
import { supabase } from '../../lib/supabase';

interface ProductGridProps {}

export const ProductGrid: React.FC<ProductGridProps> = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Remote Products State
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            // Transform fetched DB data into the structure the UI expects based on language
            const transformed = data.map(p => ({
                ...p,
                title: language === 'EN' ? p.title_en : p.title_ar,
                category: language === 'EN' ? p.category_en : p.category_ar,
                description: language === 'EN' ? p.description_en : p.description_ar,
                originalPrice: p.original_price
            }));
            setProducts(transformed);
        }
        setLoading(false);
    };

    // Re-transform when language changes
    useEffect(() => {
        setProducts(prev => prev.map(p => ({
            ...p,
            title: language === 'EN' ? p.title_en : p.title_ar,
            category: language === 'EN' ? p.category_en : p.category_ar,
            description: language === 'EN' ? p.description_en : p.description_ar,
        })));
    }, [language]);

    const t = {
        title1: language === 'EN' ? 'The' : 'الأرشيف',
        title2: language === 'EN' ? 'Archive' : '',
        desc: language === 'EN'
            ? 'This space holds projects, tests, and visual systems. A record of decisions.'
            : 'اكتشف جميع تشكيلاتنا، تصاميم حصرية بجودة عالية.',
        itemsCount: language === 'EN' ? '(002) Items' : '(002) منتجات',
        viewDetails: language === 'EN' ? 'Order Now' : 'اطلب الآن',
        comingSoon: language === 'EN' ? 'Coming Soon' : 'قريباً',
        soonBadge: language === 'EN' ? 'SOON' : 'قريباً'
    };


    const handleProductClick = (product: any) => {
        if (!product.available) {
            navigate('/available-soon');
            return;
        }
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    return (
        <section className={`py-32 px-6 md:px-12 max-w-[1600px] mx-auto relative z-10 ${language === 'AR' ? 'text-right' : ''}`}>
            <div className={`flex flex-col md:flex-row justify-between items-start md:items-end mb-24 border-b border-silver/20 pb-8 gap-8 ${language === 'AR' ? 'md:flex-row-reverse' : ''}`}>
                <h2 className={`${language === 'EN' ? 'font-[UnifrakturMaguntia]' : 'font-sans font-bold'} metallic-text text-6xl md:text-9xl leading-none`}>
                    {t.title1}{t.title2 && <><br />{t.title2}</>}
                </h2>
                <div className={`flex flex-col items-start md:items-end gap-4 ${language === 'AR' ? 'md:items-start' : ''}`}>
                    <p className={`font-mono text-xs uppercase tracking-widest text-silver max-w-xs text-start md:text-end ${language === 'AR' ? 'uppercase-none font-sans font-medium' : ''}`}>
                        {t.desc}
                    </p>
                    <p className={`font-mono text-xs uppercase tracking-widest border border-silver/30 px-4 py-2 rounded-full ${language === 'AR' ? 'uppercase-none font-sans font-medium' : ''}`}>
                        {language === 'EN' ? `(${String(products.length).padStart(3, '0')}) Items` : `(${String(products.length).padStart(3, '0')}) منتجات`}
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-32">
                    <p className="font-mono text-xs tracking-widest text-silver uppercase animate-pulse">Scanning Archive...</p>
                </div>
            ) : products.length === 0 ? (
                <div className="flex justify-center items-center py-32 border border-dashed border-silver/20 rounded-sm bg-fg/5">
                    <p className="font-mono text-xs tracking-widest text-silver uppercase">Archive is currently empty.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-6 md:gap-4 lg:gap-6">
                    {products.map((product, index) => {
                        const colSpans = ['md:col-span-7', 'md:col-span-5', 'md:col-span-5', 'md:col-span-7'];
                        const margins = ['mt-0', 'md:mt-12', 'mt-0', 'md:-mt-24'];
                        const currentIdx = index % 4;

                        return (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, delay: (index % 2) * 0.1 }}
                                className={`group cursor-pointer ${colSpans[currentIdx]} ${margins[currentIdx]}`}
                                onClick={() => handleProductClick(product)}
                            >
                                {/* Image Container */}
                                <div className="relative aspect-square md:aspect-[4/5] overflow-hidden bg-black/5 rounded-sm">
                                    <motion.img
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                                        src={product.image || 'https://via.placeholder.com/600'}
                                        alt={product.title}
                                        className={`w-full h-full object-cover transition-transform duration-[2s] ${product.image?.includes('blettermodel') ? 'object-top' : ''}`}
                                    />
                                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Quick Add Button (Desktop) */}
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hidden md:block w-[80%]">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleProductClick(product);
                                            }}
                                            className={`w-full font-mono text-xs uppercase tracking-widest border border-fg/30 bg-fg/80 backdrop-blur-md px-6 py-3 rounded-full text-bg hover:bg-bg hover:text-fg transition-colors ${language === 'AR' ? 'uppercase-none font-sans font-bold' : ''}`}
                                        >
                                            {product.available ? t.viewDetails : t.comingSoon}
                                        </button>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className={`flex justify-between items-center font-mono text-xs uppercase tracking-widest border-t border-silver/20 pt-1 sm:pt-3 flex-col sm:flex-row gap-0.5 sm:gap-1.5 ${language === 'AR' ? 'uppercase-none font-sans font-medium' : ''}`}>
                                    <div className="flex-1 pr-2 w-full text-center sm:text-left mt-1">
                                        <p className="text-silver mb-0 sm:mb-1 text-[8px] sm:text-xs tracking-tight sm:tracking-widest">({String(index + 1).padStart(3, '0')}) {product.category}</p>
                                        <h3 className="text-[10px] sm:text-[13px] font-bold group-hover:text-silver transition-colors break-words leading-tight mt-0.5">{product.title}</h3>
                                    </div>
                                    <div className="flex flex-row items-center justify-center sm:justify-end gap-1 sm:gap-2 flex-shrink-0 w-full sm:w-auto mt-0.5">
                                        <div className="flex items-center gap-1 sm:gap-2 bg-fg text-bg px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[11px] whitespace-nowrap">
                                            {product.available && product.originalPrice && (
                                                <span className="text-xs text-black/70 line-through decoration-black/70 decoration-[1.5px] font-medium inline">{product.originalPrice}</span>
                                            )}
                                            <span className="font-bold">{product.available ? product.price : t.soonBadge}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Add Button (Mobile) */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleProductClick(product);
                                    }}
                                    className={`w-full mt-2 md:hidden font-mono text-[8px] sm:text-[10px] uppercase tracking-[0.1em] sm:tracking-widest border border-silver/30 px-2 sm:px-6 py-2 sm:py-3 rounded-full text-fg hover:bg-fg hover:text-bg transition-all duration-300 shadow-sm ${language === 'AR' ? 'uppercase-none font-sans font-bold text-xs sm:text-sm' : ''}`}
                                >
                                    {product.available ? t.viewDetails : t.comingSoon}
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            <ProductDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={selectedProduct}
            />
        </section>
    );
};

export default ProductGrid;
