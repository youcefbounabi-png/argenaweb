import React, { useState, useEffect, useRef, useLayoutEffect, lazy, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Layers, Image } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const Product3DViewer = lazy(() => import('../3d/Product3DViewer'));

interface ProductDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: any;
    onAddToCart: (product: any) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ isOpen, onClose, product, onAddToCart }) => {
    const { language } = useLanguage();
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Ref for the modal card so we can compute the portal button's position
    const modalCardRef = useRef<HTMLDivElement>(null);
    const [btnPos, setBtnPos] = useState({ top: 24, right: 24 });

    // Recompute the X button position whenever the modal opens or window resizes
    useLayoutEffect(() => {
        if (!isOpen) return;
        const update = () => {
            const card = modalCardRef.current;
            if (!card) return;
            const rect = card.getBoundingClientRect();
            setBtnPos({
                top: rect.top + 16,
                right: window.innerWidth - rect.right + 16,
            });
        };
        // Run once and on resize
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    // Reset view mode when modal opens
    useEffect(() => {
        if (isOpen) {
            setViewMode('3d');
            setCurrentImageIndex(0);
        }
    }, [isOpen]);

    if (!isOpen || !product) return null;

    // GLB model map — add new entries here when more models are ready
    const MODEL_MAP: Record<number, string> = {
        1: '/3dboston.glb',        // B letter distressed cap
        2: '/3dboston.glb',        // Boston distressed cap
        3: '/3djustbecause.glb',   // Just Because cap
        4: '/3dairforce.glb',      // Vintage Airforce cap
    };

    const t = {
        addToCart: language === 'EN' ? 'ADD TO CART' : 'أضف إلى السلة',
        selectColor: language === 'EN' ? 'Select Color:' : 'اختر اللون:',
        description: language === 'EN' ? 'Description' : 'الوصف',
        price: language === 'EN' ? 'Price' : 'السعر',
        colorRequired: language === 'EN' ? 'Please select a color' : 'الرجاء اختيار لون',
        view2D: language === 'EN' ? '2D' : 'صورة',
        view3D: language === 'EN' ? '3D' : 'ثلاثي الأبعاد',
        loadingModel: language === 'EN' ? 'LOADING 3D MODEL...' : 'جارٍ تحميل النموذج...',
        colors: product.colors || []
    };

    const handleAddToCart = () => {
        if (t.colors.length > 0 && !selectedColor) {
            return;
        }

        onAddToCart({
            ...product,
            selectedColor: selectedColor || undefined
        });

        setSelectedColor('');
        onClose();
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && product && (
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 sm:p-12">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                        />

                        {/* X button — rendered via portal into document.body so it is completely
                            immune to any stacking context created by the Canvas or the modal.
                            Position is dynamically computed from the modal card's bounding rect. */}
                        {createPortal(
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onClose(); }}
                                onTouchEnd={(e) => { e.stopPropagation(); e.preventDefault(); onClose(); }}
                                style={{
                                    position: 'fixed',
                                    top: `${btnPos.top}px`,
                                    right: `${btnPos.right}px`,
                                    zIndex: 99999,
                                    width: '44px',
                                    height: '44px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '50%',
                                    color: '#aaa',
                                    cursor: 'pointer',
                                    userSelect: 'none',
                                    transition: 'background 0.2s, color 0.2s',
                                    background: 'rgba(255,255,255,0)',
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)';
                                    (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0)';
                                    (e.currentTarget as HTMLButtonElement).style.color = '#aaa';
                                }}
                                aria-label="Close modal"
                            >
                                <X size={22} />
                            </button>,
                            document.body
                        )}

                        {/* Modal */}
                        <motion.div
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-4xl max-h-[90vh] flex flex-col pt-12 md:p-6"
                            data-lenis-prevent
                        >
                            <div ref={modalCardRef} className="relative w-full h-full bg-bg border border-silver/20 rounded-t-2xl md:rounded-xl shadow-2xl overflow-hidden flex flex-col">

                                {/* Scrollable Content */}
                                <div className={`w-full h-full p-8 md:p-12 overflow-y-auto custom-scrollbar flex flex-col md:gap-12 ${language === 'AR' ? 'md:flex-row-reverse' : 'md:flex-row'}`} dir={language === 'AR' ? 'rtl' : 'ltr'}>

                                    {/* Image / 3D Section */}
                                    <div className="flex-1 flex flex-col gap-3">
                                        <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest">
                                            <button
                                                onClick={() => setViewMode('2d')}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 border transition-all ${viewMode === '2d' ? 'border-white text-white' : 'border-silver/20 text-silver hover:border-silver'}`}
                                            >
                                                <Image size={10} /> {t.view2D}
                                            </button>
                                            <button
                                                onClick={() => setViewMode('3d')}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 border transition-all ${viewMode === '3d' ? 'border-white text-white' : 'border-silver/20 text-silver hover:border-silver'}`}
                                            >
                                                <Layers size={10} /> {t.view3D}
                                            </button>
                                        </div>

                                        <div className="relative aspect-[4/5] overflow-hidden bg-silver-dark/20 flex flex-col">
                                            {viewMode === '2d' ? (
                                                <>
                                                    <div className="flex-1 w-full relative h-0">
                                                        <img
                                                            src={product.gallery && product.gallery.length > 0 ? product.gallery[currentImageIndex] : product.image}
                                                            alt={product.title}
                                                            className={`w-full h-full object-cover ${(product.gallery && product.gallery.length > 0 ? product.gallery[currentImageIndex] : product.image).includes('blettermodel') ? 'object-top' : ''}`}
                                                        />
                                                    </div>
                                                    {product.gallery && product.gallery.length > 1 && (
                                                        <div className="flex gap-2 p-2 bg-black/40 overflow-x-auto shrink-0" style={{ scrollbarWidth: 'none' }}>
                                                            {product.gallery.map((img: string, idx: number) => (
                                                                <button
                                                                    key={idx}
                                                                    onClick={() => setCurrentImageIndex(idx)}
                                                                    className={`relative w-16 h-16 flex-shrink-0 border transition-all duration-300 ${currentImageIndex === idx ? 'border-white opacity-100' : 'border-transparent opacity-50 hover:opacity-100 hover:border-white/50'}`}
                                                                >
                                                                    <img src={img} alt={`${product.title} view ${idx + 1}`} className="w-full h-full object-cover" />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <Suspense fallback={
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <p className="font-mono text-[9px] tracking-[0.3em] text-silver/40 animate-pulse">{t.loadingModel}</p>
                                                    </div>
                                                }>
                                                    {/* pointer-events wrapper: the 3D canvas must NOT capture events from outside its own div */}
                                                    <div style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}>
                                                        <Product3DViewer className="w-full h-full" modelPath={MODEL_MAP[product.id]} />
                                                    </div>
                                                </Suspense>
                                            )}
                                        </div>
                                    </div>

                                    {/* Details Section */}
                                    <div className={`flex-1 flex flex-col justify-between ${language === 'AR' ? 'text-right' : ''}`}>
                                        <div>
                                            <p className="font-mono text-xs uppercase tracking-widest text-silver mb-4">({String(product.id).padStart(3, '0')}) {product.category}</p>
                                            <h2 className={`${language === 'EN' ? 'font-[UnifrakturMaguntia] italic' : 'font-sans font-bold'} text-4xl text-white mb-6`}>{product.title}</h2>
                                            <p className="font-mono text-xl text-white mb-8 border-b border-silver/20 pb-8">{product.price}</p>

                                            <div className="mb-8">
                                                <h3 className={`font-mono text-xs text-silver tracking-widest uppercase mb-4 ${language === 'AR' ? 'uppercase-none font-sans font-medium' : ''}`}>{t.description}</h3>
                                                <p className={`text-sm text-silver font-mono whitespace-pre-wrap ${language === 'AR' ? 'font-sans' : ''}`}>
                                                    {product.description || (language === 'EN' ? 'No description available.' : 'لا يوجد وصف.')}
                                                </p>
                                            </div>

                                            {t.colors.length > 0 && (
                                                <div className="mb-12">
                                                    <h3 className={`font-mono text-xs text-silver tracking-widest uppercase mb-4 ${language === 'AR' ? 'uppercase-none font-sans font-medium' : ''}`}>{t.selectColor}</h3>
                                                    <div className="flex flex-wrap gap-3">
                                                        {t.colors.map((color: string) => (
                                                            <button
                                                                key={color}
                                                                onClick={() => setSelectedColor(color)}
                                                                className={`px-6 py-3 border font-mono text-xs uppercase tracking-widest transition-all ${selectedColor === color ? 'border-white bg-white text-black' : 'border-silver/30 text-silver hover:border-white hover:text-white'}`}
                                                            >
                                                                {color}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            onClick={handleAddToCart}
                                            disabled={t.colors.length > 0 && !selectedColor}
                                            className={`w-full group flex items-center justify-between font-mono text-xs border border-white px-8 py-4 rounded-full bg-white text-black hover:bg-silver transition-all duration-500 tracking-[0.2em] disabled:opacity-50 disabled:cursor-not-allowed ${language === 'AR' ? 'uppercase-none font-sans font-bold flex-row-reverse' : ''}`}
                                        >
                                            {t.colors.length > 0 && !selectedColor ? t.colorRequired : t.addToCart}
                                            {t.colors.length > 0 && !selectedColor ? null :
                                                (language === 'EN'
                                                    ? <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                                                    : <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />)
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ProductDetailsModal;
