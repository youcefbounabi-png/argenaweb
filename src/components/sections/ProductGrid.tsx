import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCart } from '../../contexts/CartContext';
import ProductDetailsModal from '../ui/ProductDetailsModal';

export const productsEN = [
    {
        id: 1,
        title: 'lust because cap',
        price: 'DA 2,200',
        originalPrice: 'DA 3,200',
        image: '/pictures/lust0 (1).png',
        gallery: [
            '/pictures/gemini01.png',
            '/pictures/lustbecausecaps (1).png',
            '/pictures/lust0 (1).jpeg',
            '/pictures/lust0 (2).jpeg',
            '/pictures/lust0 (3).jpeg',
            '/pictures/lust0 (4).jpeg',
            '/pictures/lustlastpic.jpeg'
        ],
        category: 'Headwear',
        available: true,
        colors: [
            { name: 'Dark Blue', quantity: 11 },
            { name: 'Beige', quantity: 2 },
            { name: 'White', quantity: 3 },
            { name: 'Brown', quantity: 3 },
            { name: 'Grey', quantity: 1 }
        ],
        description: 'Fashion And Hot Sale Cotton Fabric Washed Baseball Cap And Hat Manufacturer with Custom Embroidery on Visor \nOne size can fit most people.\nWith 100% cotton to ensure the baseball cap is lightweight.\nNew Technology of Embroidery.'
    },
    {
        id: 2,
        title: 'boston disstressed cap',
        price: 'DA 2,000',
        originalPrice: 'DA 3,200',
        image: '/pictures/bostoncaps.png',
        gallery: [
            '/pictures/boston0.png',
            '/pictures/bostoncaps.png',
            '/pictures/bost1.jpeg',
            '/pictures/bost2.jpeg',
            '/pictures/bost3.jpeg',
            '/pictures/bost4.jpeg',
            '/pictures/bost5.jpeg',
            '/pictures/bost6.jpeg'
        ],
        category: 'Headwear',
        available: true,
        colors: [
            { name: 'Black', quantity: 0 },
            { name: 'Grey', quantity: 1 },
            { name: 'Burgundy', quantity: 0 },
            { name: 'Beige', quantity: 2 },
            { name: 'Brown', quantity: 3 },
            { name: 'Light Pink', quantity: 1 },
            { name: 'Light Blue', quantity: 1 },
            { name: 'Red', quantity: 1 }
        ],
        description: 'Baseball Cap Men Women Fashion Mesh Hat Sun Protection Spring Summer Stylish Casual\n\nPeculiarities:\nEnjoy stylish sun protection during your outdoor activities\nEnjoy versatile fashion with unisex designs\nAccentuate your look with fashionable letter embroidery\nEffortless wind and sun protection\nIdeal for everyday wear and street style'
    },
    {
        id: 3,
        title: 'B letter distressed cap',
        price: 'DA 2,000',
        originalPrice: 'DA 3,200',
        image: '/pictures/blettercaps.png',
        gallery: [
            '/pictures/blettermodel.png',
            '/pictures/blettercaps.png',
            '/pictures/bletter (1).jpeg',
            '/pictures/bletter (2).jpeg',
            '/pictures/bletter (3).jpeg',
            '/pictures/bletter (4).jpeg',
            '/pictures/blettergrey.jpeg'
        ],
        category: 'Headwear',
        available: true,
        colors: [
            { name: 'Black', quantity: 1 },
            { name: 'Burgundy', quantity: 2 },
            { name: 'Beige', quantity: 1 },
            { name: 'Brown', quantity: 2 },
            { name: 'Grey', quantity: 1 }
        ],
        description: 'Unisex Vintage B-Letter Distressed Baseball Cap. \n\nFeatures:\nPremium washed cotton for a comfortable, worn-in feel.\nAdjustable strap back fitting most head sizes seamlessly.\nClassic distressed detailing for an authentic streetwear edge.\nPerfect for daily casual wear, sun protection, and effortless style.'
    },
    {
        id: 4,
        title: 'vintage airforce cap',
        price: 'DA 1,800',
        originalPrice: 'DA 2,900',
        image: '/pictures/airforcelast.png',
        gallery: [
            '/pictures/airforce.png',
            '/pictures/airfor0 (1).jpeg',
            '/pictures/airfor0 (2).jpeg',
            '/pictures/airfor0 (3).jpeg',
            '/pictures/airfor0 (4).jpeg',
            '/pictures/airfor0 (5).jpeg',
            '/pictures/airfor0 (6).jpeg'
        ],
        category: 'Headwear',
        available: true,
        colors: [
            { name: 'Burgundy', quantity: 2 },
            { name: 'Beige', quantity: 2 },
            { name: 'Yellow', quantity: 2 },
            { name: 'Grey', quantity: 2 },
            { name: 'Dark Blue', quantity: 2 },
            { name: 'Light Blue', quantity: 2 }
        ],
        description: 'Unisex Vintage Airforce Inspiration Cap. \n\nFeatures:\nClassic military-inspired aesthetic perfect for any casual look.\nLightweight and durable fabric for all-day comfort.\nSubtle embroidery and vintage wash finish.\nVersatile accessory for sun protection and everyday streetwear.'
    }
];

export const productsAR = [
    {
        id: 1,
        title: 'قبعة «لست بيكوز»',
        price: '2,200 د.ج',
        originalPrice: '3,200 د.ج',
        image: '/pictures/lust0 (1).png',
        gallery: [
            '/pictures/gemini01.png',
            '/pictures/lustbecausecaps (1).png',
            '/pictures/lust0 (1).jpeg',
            '/pictures/lust0 (2).jpeg',
            '/pictures/lust0 (3).jpeg',
            '/pictures/lust0 (4).jpeg',
            '/pictures/lustlastpic.jpeg'
        ],
        category: 'أغطية الرأس',
        available: true,
        colors: [
            { name: 'أزرق غامق', quantity: 11 },
            { name: 'بيج', quantity: 2 },
            { name: 'أبيض', quantity: 3 },
            { name: 'بني', quantity: 3 },
            { name: 'رمادي', quantity: 1 }
        ],
        description: 'قبعة بيسبول قطنية مريحة بجودة عالية مع تطريز مميز.\nمقاس قابل للتعديل يناسب الجميع.\nخفيفة الوزن ومناسبة للاستعمال اليومي.'
    },
    {
        id: 2,
        title: 'قبعة بوسطن الممزقة',
        price: '2,000 د.ج',
        originalPrice: '3,200 د.ج',
        image: '/pictures/bostoncaps.png',
        gallery: [
            '/pictures/boston0.png',
            '/pictures/bostoncaps.png',
            '/pictures/bost1.jpeg',
            '/pictures/bost2.jpeg',
            '/pictures/bost3.jpeg',
            '/pictures/bost4.jpeg',
            '/pictures/bost5.jpeg',
            '/pictures/bost6.jpeg'
        ],
        category: 'أغطية الرأس',
        available: true,
        colors: [
            { name: 'أسود', quantity: 0 },
            { name: 'رمادي', quantity: 1 },
            { name: 'عنابي', quantity: 0 },
            { name: 'بيج', quantity: 2 },
            { name: 'بني', quantity: 3 },
            { name: 'وردي فاتح', quantity: 1 },
            { name: 'أزرق فاتح', quantity: 1 },
            { name: 'أحمر', quantity: 1 }
        ],
        description: 'قبعة ممزقة عصرية للرجال والنساء.\nتوفر حماية من الشمس ومناسبة لفصلي الربيع والصيف.\nتصميم مميز يلائم إطلالتك اليومية.'
    },
    {
        id: 3,
        title: 'قبعة حرف B الممزقة',
        price: '2,000 د.ج',
        originalPrice: '3,200 د.ج',
        image: '/pictures/blettercaps.png',
        gallery: [
            '/pictures/blettermodel.png',
            '/pictures/blettercaps.png',
            '/pictures/bletter (1).jpeg',
            '/pictures/bletter (2).jpeg',
            '/pictures/bletter (3).jpeg',
            '/pictures/bletter (4).jpeg',
            '/pictures/blettergrey.jpeg'
        ],
        category: 'أغطية الرأس',
        available: true,
        colors: [
            { name: 'أسود', quantity: 1 },
            { name: 'خمري', quantity: 2 },
            { name: 'بيج', quantity: 1 },
            { name: 'بني', quantity: 2 },
            { name: 'رمادي داكن', quantity: 1 }
        ],
        description: 'قبعة ممزقة بحرف B للرجال والنساء.\nقطن عالي الجودة وحزام قابل للتعديل.\nتصميم كلاسيكي ممزق يمنحك ستايلات الشارع العصرية.'
    },
    {
        id: 4,
        title: 'قبعة إير فورس كلاسيكية',
        price: '1,800 د.ج',
        originalPrice: '2,900 د.ج',
        image: '/pictures/airforcelast.png',
        gallery: [
            '/pictures/airforce.png',
            '/pictures/airfor0 (1).jpeg',
            '/pictures/airfor0 (2).jpeg',
            '/pictures/airfor0 (3).jpeg',
            '/pictures/airfor0 (4).jpeg',
            '/pictures/airfor0 (5).jpeg',
            '/pictures/airfor0 (6).jpeg'
        ],
        category: 'أغطية الرأس',
        available: true,
        colors: [
            { name: 'خمري', quantity: 2 },
            { name: 'بيج', quantity: 2 },
            { name: 'أصفر', quantity: 2 },
            { name: 'رمادي', quantity: 2 },
            { name: 'أزرق غامق', quantity: 2 },
            { name: 'أزرق فاتح', quantity: 2 }
        ],
        description: 'قبعة إير فورس بستايل عسكري كلاسيكي.\nقماش خفيف ومريح للاستعمال اليومي.\nتصميم بسيط وعملي يناسب الجميع.'
    }
];

interface ProductGridProps {
    onAddToCart?: (product: any) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ onAddToCart }) => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const { addItem } = useCart();
    const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const products = language === 'EN' ? productsEN : productsAR;

    const t = {
        title1: language === 'EN' ? 'The' : 'الأرشيف',
        title2: language === 'EN' ? 'Archive' : '',
        desc: language === 'EN'
            ? 'This space holds projects, tests, and visual systems. A record of decisions.'
            : 'اكتشف جميع تشكيلاتنا، تصاميم حصرية بجودة عالية.',
        itemsCount: language === 'EN' ? '(004) Items' : '(004) منتجات',
        addToCart: language === 'EN' ? 'Add to Cart' : 'أضف إلى السلة',
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
                        {t.itemsCount}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-6 md:gap-4 lg:gap-6">
                {products.map((product, index) => {
                    const colSpans = ['md:col-span-7', 'md:col-span-5', 'md:col-span-5', 'md:col-span-7'];
                    const margins = ['mt-0', 'md:mt-12', 'mt-0', 'md:-mt-24'];

                    return (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className={`group cursor-pointer ${colSpans[index]} ${margins[index]}`}
                            onClick={() => handleProductClick(product)}
                        >
                            {/* Image Container */}
                            <div className="relative aspect-square md:aspect-[4/5] overflow-hidden bg-black/5 rounded-sm">
                                <motion.img
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                                    src={product.image}
                                    alt={product.title}
                                    className={`w-full h-full object-cover transition-transform duration-[2s] ${product.image.includes('blettermodel') ? 'object-top' : ''}`}
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
                                        {product.available ? t.addToCart : t.comingSoon}
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
                                {product.available ? t.addToCart : t.comingSoon}
                            </button>
                        </motion.div>
                    );
                })}
            </div>

            <ProductDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={selectedProduct}
                onAddToCart={(p) => {
                    addItem(p);
                }}
            />
        </section>
    );
};

export default ProductGrid;
