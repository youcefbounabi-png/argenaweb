import React, { useState, useEffect, useRef, useLayoutEffect, lazy, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Layers, Image, ChevronLeft, ChevronRight } from 'lucide-react';
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
    const [isImageExpanded, setIsImageExpanded] = useState(false);
    const touchStartX = useRef<number | null>(null);

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

    const galleryLength = product?.gallery?.length ?? 0;

    const prevImage = () => setCurrentImageIndex(i => (i - 1 + galleryLength) % galleryLength);
    const nextImage = () => setCurrentImageIndex(i => (i + 1) % galleryLength);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') { onClose(); return; }
            if (!isOpen || viewMode !== '2d') return;
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'ArrowRight') nextImage();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, viewMode, galleryLength]);

    // Reset view mode when modal opens
    useEffect(() => {
        if (isOpen) {
            setViewMode('2d');
            setCurrentImageIndex(0);
            setIsImageExpanded(false);

            // Stop lenis scrolling
            document.body.style.overflow = 'hidden';
            (window as any).lenis?.stop();
        } else {
            document.body.style.overflow = '';
            (window as any).lenis?.start();
        }

        return () => {
            document.body.style.overflow = '';
            (window as any).lenis?.start();
        };
    }, [isOpen]);

    if (!isOpen || !product) return null;

    // GLB model map — add new entries here when more models are ready
    const MODEL_MAP: Record<number, string> = {
        1: '/3djustbecause.glb',   // Lust Because cap
        2: '/3dboston.glb',        // Boston distressed cap
        3: '/3dboston.glb',        // B letter distressed cap
        4: '/3dairforce.glb',      // Vintage Airforce cap
    };

    const t = {
        addToCart: language === 'EN' ? 'ADD TO CART' : 'أضف إلى السلة',
        selectColor: language === 'EN' ? 'Select Color:' : 'اختر اللون:',
        description: language === 'EN' ? 'Description' : 'الوصف',
        price: language === 'EN' ? 'Price' : 'السعر',
        colorRequired: language === 'EN' ? 'Please select a color' : 'الرجاء اختيار لون',
        view2D: language === 'EN' ? 'DISPLAY' : 'صور',
        view3D: language === 'EN' ? '3D' : '3D',
        loadingModel: language === 'EN' ? 'LOADING 3D MODEL...' : 'جاري التحميل...',
        colors: (product.colors || []) as { name: string; quantity: number }[]
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

    if (!isOpen || !product) return null;

    const modalContent = (
        <>
            <AnimatePresence mode="wait">
                {isOpen && product && (
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 sm:p-12" data-lenis-prevent>
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
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                            className="relative w-full max-w-5xl max-h-[90vh] flex flex-col pt-12 md:p-6"
                            data-lenis-prevent
                        >
                            <div ref={modalCardRef} className="relative w-full h-full bg-bg border border-silver/20 rounded-t-2xl md:rounded-xl shadow-2xl overflow-hidden flex flex-col">

                                {/* Scrollable Content */}
                                <div className={`w-full h-full p-6 md:p-10 overflow-y-auto custom-scrollbar flex flex-col gap-8 md:gap-6 ${language === 'AR' ? 'md:flex-row-reverse' : 'md:flex-row'}`} dir={language === 'AR' ? 'rtl' : 'ltr'}>

                                    {/* Image / 3D Section — fixed 50% width */}
                                    <div className="md:w-1/2 w-full flex-shrink-0 flex flex-col gap-3">
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

                                        {/* Main image — aspect ratio keeps column stable */}
                                        <div
                                            className="relative aspect-[4/5] overflow-hidden bg-black group/img-container"
                                            onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
                                            onTouchEnd={(e) => {
                                                if (touchStartX.current === null) return;
                                                const delta = e.changedTouches[0].clientX - touchStartX.current;
                                                if (Math.abs(delta) > 40) { delta < 0 ? nextImage() : prevImage(); }
                                                touchStartX.current = null;
                                            }}
                                        >
                                            {viewMode === '2d' ? (
                                                <>
                                                    <img
                                                        src={product.gallery && product.gallery.length > 0 ? product.gallery[currentImageIndex] : product.image}
                                                        alt={product.title}
                                                        onClick={() => setIsImageExpanded(true)}
                                                        className={`w-full h-full object-cover cursor-zoom-in transition-transform duration-700 hover:scale-105 ${(product.gallery && product.gallery.length > 0 ? product.gallery[currentImageIndex] : product.image).includes('blettermodel') ? 'object-top' : ''}`}
                                                    />
                                                    {/* Expand hint */}
                                                    <div
                                                        onClick={() => setIsImageExpanded(true)}
                                                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img-container:opacity-100 transition-opacity duration-300 cursor-zoom-in pointer-events-none"
                                                    >
                                                        <div className="bg-black/40 backdrop-blur-md p-3 rounded-full border border-white/20">
                                                            <Image size={20} className="text-white" />
                                                        </div>
                                                    </div>
                                                    {/* Prev / Next arrows — only shown when there are multiple images */}
                                                    {galleryLength > 1 && (
                                                        <>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                                                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 border border-white/20 text-white opacity-0 group-hover/img-container:opacity-100 transition-opacity duration-300 hover:bg-black/80"
                                                                aria-label="Previous image"
                                                            >
                                                                <ChevronLeft size={18} />
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                                                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 border border-white/20 text-white opacity-0 group-hover/img-container:opacity-100 transition-opacity duration-300 hover:bg-black/80"
                                                                aria-label="Next image"
                                                            >
                                                                <ChevronRight size={18} />
                                                            </button>
                                                            {/* Dot indicators */}
                                                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                                                                {product.gallery.map((_: string, idx: number) => (
                                                                    <button
                                                                        key={idx}
                                                                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                                                                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/40'
                                                                            }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </>
                                                    )}
                                                </>
                                            ) : (
                                                <Suspense fallback={
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <p className="font-mono text-[9px] tracking-[0.3em] text-silver/40 animate-pulse">{t.loadingModel}</p>
                                                    </div>
                                                }>
                                                    <div style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}>
                                                        <Product3DViewer className="w-full h-full" modelPath={MODEL_MAP[product.id]} />
                                                    </div>
                                                </Suspense>
                                            )}
                                        </div>

                                        {/* Thumbnail strip — fixed height, horizontally scrollable, never grows */}
                                        {viewMode === '2d' && product.gallery && product.gallery.length > 1 && (
                                            <div
                                                className="flex gap-2 h-16 overflow-x-auto flex-nowrap"
                                                style={{ scrollbarWidth: 'none' }}
                                            >
                                                {product.gallery.map((img: string, idx: number) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setCurrentImageIndex(idx)}
                                                        className={`relative w-16 h-16 flex-shrink-0 border-2 transition-all duration-300 overflow-hidden ${currentImageIndex === idx
                                                            ? 'border-white opacity-100'
                                                            : 'border-transparent opacity-40 hover:opacity-80 hover:border-white/40'
                                                            }`}
                                                    >
                                                        <img src={img} alt={`${product.title} view ${idx + 1}`} className="w-full h-full object-cover" />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Details Section — fixed 50% width */}
                                    <div className={`md:w-1/2 w-full flex-shrink-0 flex flex-col justify-between ${language === 'AR' ? 'text-right' : ''}`}>
                                        <div>
                                            <p className="font-mono text-xs uppercase tracking-widest text-silver mb-4">({String(product.id).padStart(3, '0')}) {product.category}</p>
                                            <h2 className={`${language === 'EN' ? 'font-[UnifrakturMaguntia] italic' : 'font-sans font-bold'} text-4xl text-white mb-6`}>{product.title}</h2>
                                            <div className="flex items-baseline gap-4 mb-8 border-b border-silver/20 pb-8">
                                                <p className="font-mono text-2xl text-white font-bold">{product.price}</p>
                                                {product.originalPrice && (
                                                    <p className="font-mono text-lg text-silver/70 line-through decoration-silver/70 decoration-2">{product.originalPrice}</p>
                                                )}
                                            </div>

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
                                                        {t.colors.map((colorObj: { name: string; quantity: number }) => (
                                                            <button
                                                                key={colorObj.name}
                                                                onClick={() => setSelectedColor(colorObj.name)}
                                                                disabled={colorObj.quantity === 0}
                                                                className={`px-6 py-3 border font-mono text-xs uppercase tracking-widest transition-all ${selectedColor === colorObj.name ? 'border-white bg-white text-black' : 'border-silver/30 text-silver hover:border-white hover:text-white'} ${colorObj.quantity === 0 ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}
                                                            >
                                                                {colorObj.name} ({colorObj.quantity})
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

            {/* Expanded Image Modal */}
            <AnimatePresence>
                {isImageExpanded && (
                    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsImageExpanded(false)}
                            className="absolute inset-0 bg-black/95 backdrop-blur-2xl cursor-zoom-out"
                        />
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={() => setIsImageExpanded(false)}
                            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-[20001]"
                        >
                            <X size={32} />
                        </motion.button>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative max-w-7xl max-h-[90vh] z-10 select-none"
                        >
                            <img
                                src={product.gallery && product.gallery.length > 0 ? product.gallery[currentImageIndex] : product.image}
                                alt={product.title}
                                className="w-full h-full object-contain shadow-2xl"
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );

    return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};


export default ProductDetailsModal;
