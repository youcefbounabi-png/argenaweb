import React, { useState, useEffect, useRef, useLayoutEffect, lazy, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Layers, Image, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { WILAYAS } from '../../data/wilayas';
import { COMMUNES } from '../../data/communes';
import { supabase } from '../../lib/supabase';

const Product3DViewer = lazy(() => import('../3d/Product3DViewer'));

interface ProductDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: any;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ isOpen, onClose, product }) => {
    const { language } = useLanguage();
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isImageExpanded, setIsImageExpanded] = useState(false);
    const [orderStep, setOrderStep] = useState<1 | 2 | 3>(1);
    const [orderName, setOrderName] = useState('');
    const [orderPhone, setOrderPhone] = useState('');
    const [orderState, setOrderState] = useState('');
    const [orderCommune, setOrderCommune] = useState('');
    const [orderQuantity, setOrderQuantity] = useState(1);
    const [orderAddress, setOrderAddress] = useState('');
    const [orderNotes, setOrderNotes] = useState('');
    const [orderSubmitted, setOrderSubmitted] = useState(false);
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
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

    // Reset view mode and order form when modal opens or product changes
    useEffect(() => {
        if (!product) return;

        if (isOpen) {
            setViewMode('2d');
            setCurrentImageIndex(0);
            setIsImageExpanded(false);
            setSelectedColor(product?.colors?.[0]?.name || '');
            setOrderStep(1);
            setOrderName('');
            setOrderPhone('');
            setOrderState('');
            setOrderCommune('');
            setOrderQuantity(1);
            setOrderAddress('');
            setOrderNotes('');
            setOrderSubmitted(false);
            setFormError('');

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
    }, [isOpen, product]);

    const selectedColorOption = product?.colors?.find((color: any) => color.name === selectedColor);
    const currentGallery = selectedColorOption?.gallery || product?.gallery || [product?.image];
    const galleryLength = currentGallery.length;

    useEffect(() => {
        if (!currentGallery.length) return;
        if (!selectedColorOption) return;
        const selectedIndex = currentGallery.findIndex((img: string) => img === selectedColorOption.image);
        if (selectedIndex >= 0) {
            setCurrentImageIndex(selectedIndex);
        } else {
            setCurrentImageIndex(0);
        }
    }, [selectedColorOption, currentGallery]);

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

    if (!isOpen || !product) return null;

    if (!isOpen || !product) return null;

    // GLB model map — add new entries here when more models are ready
    const MODEL_MAP: Record<number, string> = {
        1: '/3dboston.glb',   // B letter distressed cap
        2: '/3dboston.glb',   // A distressed cap
    };

    const t = {
        selectColor: language === 'EN' ? 'Select Color:' : 'اختر اللون:',
        description: language === 'EN' ? 'Description' : 'الوصف',
        price: language === 'EN' ? 'Price' : 'السعر',
        colorRequired: language === 'EN' ? 'Please select a color' : 'الرجاء اختيار لون',
        view2D: language === 'EN' ? 'DISPLAY' : 'صور',
        view3D: language === 'EN' ? '3D' : '3D',
        loadingModel: language === 'EN' ? 'LOADING 3D MODEL...' : 'جاري التحميل...',
        payOnDelivery: language === 'EN' ? 'PAY ON DELIVERY' : 'الدفع عند الاستلام',
        deliveryTime: language === 'EN' ? 'DELIVERY: 2-3 DAYS' : 'التوصيل: 2-3 أيام',
        orderNow: language === 'EN' ? 'ORDER NOW' : 'اطلب الآن',
        contactWhatsApp: language === 'EN' ? 'Message on WhatsApp' : 'أرسل رسالة واتساب',
        fillInfo: language === 'EN' ? 'Enter your contact details below' : 'أدخل بيانات الاتصال أدناه',
        namePlaceholder: language === 'EN' ? 'Full name' : 'الاسم الكامل',
        phonePlaceholder: language === 'EN' ? 'Phone number' : 'رقم الهاتف',
        addressPlaceholder: language === 'EN' ? 'Delivery address (optional)' : 'عنوان التوصيل (اختياري)',
        notesPlaceholder: language === 'EN' ? 'Notes (optional)' : 'ملاحظات (اختياري)',
        sendRequest: language === 'EN' ? 'Send Request' : 'أرسل الطلب',
        cancel: language === 'EN' ? 'Cancel' : 'إلغاء',
        invalidFields: language === 'EN' ? 'Please fill in all required fields.' : 'الرجاء ملء جميع الحقول المطلوبة.',
        orderReceived: language === 'EN' ? 'Order request recorded. We will contact you soon.' : 'تم تسجيل طلبك. سنتواصل معك قريباً.',
        orderViaWhatsApp: language === 'EN' ? 'Prefer to order via message? Click here' : 'هل تفضل الطلب عبر رسالة؟ اضغط هنا',
        quantityLabel: language === 'EN' ? 'Quantity' : 'الكمية',
        stateLabel: language === 'EN' ? 'State / Province' : 'الولاية / الولاية',
        communeLabel: language === 'EN' ? 'Commune' : 'البلدية',
        selectState: language === 'EN' ? 'Select state / province' : 'اختر الولاية / الولاية',
        selectCommune: language === 'EN' ? 'Select commune' : 'اختر البلدية',
        quantityPlaceholder: language === 'EN' ? 'Select quantity' : 'اختر الكمية',
        colors: (product?.colors || []) as { name: string; quantity: number }[]
    };

    const selectedWilaya = WILAYAS.find(w => w.name === orderState || w.nameAr === orderState);
    const communeOptions = orderState ? COMMUNES[selectedWilaya?.id || ''] || [] : [];

    const handleOrderSubmit = async () => {
        if (!orderName.trim() || !orderPhone.trim() || !orderQuantity || !orderState || !orderCommune) {
            setFormError(t.invalidFields);
            return;
        }

        if (t.colors.length > 0 && !selectedColor) {
            setFormError(t.colorRequired);
            return;
        }

        setFormError('');
        setIsSubmitting(true);

        try {
            // Prepare order data
            const orderData = {
                name: orderName.trim(),
                phone: orderPhone.trim(),
                quantity: Number(orderQuantity),
                state: orderState,
                commune: orderCommune,
                address: orderAddress.trim() || null,
                notes: orderNotes.trim() || null,
                product_name: product.title,
                product_price: product.price,
                product_color: selectedColor || null,
                product_image: selectedColorOption?.image || product.image || null,
            };

            // Insert into Supabase (remove .select() because there is no SELECT RLS policy)
            const { error } = await supabase
                .from('orders')
                .insert([orderData]);

            if (error) {
                console.error('Supabase error:', error.code, error.message, error.details);
                setFormError(language === 'EN' ? `Order failed: ${error.message}` : `فشل الطلب: ${error.message}`);
                return;
            }

            // Send email notifications via Supabase Edge Function
            try {
                // Formatting the message to match what the Edge Function expects
                const message = `*NEW QUICK ORDER - G ARGENA*\n\n` +
                    `*Customer:* ${orderData.name}\n` +
                    `*Phone:* ${orderData.phone}\n` +
                    `*Destination:* ${orderData.state} - ${orderData.commune}\n` +
                    (orderData.address ? `*Address:* ${orderData.address}\n` : '') +
                    `*Product:* ${orderData.product_name} (x${orderData.quantity})\n` +
                    (orderData.product_color ? `*Color:* ${orderData.product_color}\n` : '') +
                    `*Subtotal:* ${orderData.product_price}\n\n` +
                    `*Notes:* ${orderData.notes || 'N/A'}`;

                const { data: emailData, error: emailError } = await supabase.functions.invoke('send-order-email', {
                    body: { 
                        name: "Customer Quick Order",
                        email: "order@argena.com",
                        subject: `[QUICK ORDER] - New Order from ${orderData.name} (${orderData.phone})`,
                        message: message
                    }
                });

                if (emailError) {
                    console.warn('Email sending failed:', emailError);
                    // Don't fail the order submission if email fails
                }
            } catch (emailErr) {
                console.warn('Email function call failed:', emailErr);
                // Don't fail the order submission if email fails
            }

            setOrderSubmitted(true);
            setOrderStep(3);
        } catch (error) {
            console.error('Order submission error:', error);
            setFormError(language === 'EN' ? 'Failed to submit order. Please try again.' : 'فشل في إرسال الطلب. يرجى المحاولة مرة أخرى.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !product) return null;

    const productHeader = (
        <div className={language === 'AR' ? 'text-right' : ''}>
            <p className="font-mono text-xs uppercase tracking-widest text-silver mb-4">({String(product.id).padStart(3, '0')}) {product.category}</p>
            <h2 className={`${language === 'EN' ? 'font-[UnifrakturMaguntia] italic' : 'font-sans font-bold'} text-4xl text-fg mb-6`}>{product.title}</h2>
            <div className="flex items-baseline gap-4 mb-4">
                <p className="font-mono text-2xl text-fg font-bold">{product.price}</p>
                {product.originalPrice && (
                    <p className="font-mono text-lg text-silver/70 line-through decoration-silver/70 decoration-2">{product.originalPrice}</p>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-silver/20 pb-8">
                <span className={`inline-flex items-center px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 font-mono text-[10px] tracking-widest uppercase ${language === 'AR' ? 'font-sans font-bold uppercase-none text-xs' : ''}`}>
                    <CheckCircle2 size={12} className={language === 'AR' ? 'ml-1.5' : 'mr-1.5'} />
                    {t.payOnDelivery}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full border border-silver/30 bg-silver/5 text-silver font-mono text-[10px] tracking-widest uppercase ${language === 'AR' ? 'font-sans font-bold uppercase-none text-xs' : ''}`}>
                    {t.deliveryTime}
                </span>
            </div>
        </div>
    );

    const detailsSection = (
        <div className={`w-full md:w-[45%] min-w-0 flex flex-col justify-between gap-8 ${language === 'AR' ? 'text-right' : ''}`}>
            <div className="hidden md:block">
                {productHeader}
            </div>

                <div className="border border-silver/20 rounded-xl p-7 mb-12 bg-bg/80">
                    {orderStep === 3 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="text-center py-8 px-4"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.4, type: 'spring', stiffness: 200 }}
                                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border-2 border-green-500/30 mb-4"
                            >
                                <CheckCircle2 size={32} className="text-green-400" />
                            </motion.div>
                            <h3 className="font-mono text-lg font-bold text-fg mb-2 uppercase tracking-wider">
                                {language === 'EN' ? 'Order Confirmed!' : 'تم تأكيد الطلب!'}
                            </h3>
                            <p className="text-sm text-silver leading-relaxed mb-6">
                                {t.orderReceived}
                            </p>
                            <button
                                type="button"
                                onClick={onClose}
                                className="mt-2 inline-flex items-center justify-center rounded-full border border-fg px-8 py-3 text-xs uppercase tracking-[0.2em] font-mono text-bg bg-fg hover:bg-silver transition-all duration-300"
                            >
                                {language === 'EN' ? 'Close' : 'إغلاق'}
                            </button>
                        </motion.div>
                    ) : orderStep === 2 ? (
                        <>
                            <p className="font-mono text-xs uppercase tracking-[0.3em] text-silver mb-4">{t.fillInfo}</p>
                            <div className="grid gap-4">
                                <input
                                    type="text"
                                    value={orderName}
                                    onChange={(e) => setOrderName(e.target.value)}
                                    placeholder={t.namePlaceholder}
                                    className="w-full border border-silver/20 bg-transparent px-4 py-3 rounded-lg text-sm text-fg outline-none focus:border-fg"
                                />
                                <input
                                    type="tel"
                                    value={orderPhone}
                                    onChange={(e) => setOrderPhone(e.target.value)}
                                    placeholder={t.phonePlaceholder}
                                    className="w-full border border-silver/20 bg-transparent px-4 py-3 rounded-lg text-sm text-fg outline-none focus:border-fg"
                                />
                                <div className="grid gap-4">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <label className="block">
                                            <span className="font-mono text-[10px] uppercase tracking-widest text-silver mb-2 block">{t.stateLabel}</span>
                                            <select
                                                value={orderState}
                                                onChange={(e) => {
                                                    setOrderState(e.target.value);
                                                    setOrderCommune('');
                                                }}
                                                className="w-full border border-silver/20 bg-[#0b0d12] px-4 py-3 rounded-lg text-sm text-silver outline-none focus:border-fg focus:ring-2 focus:ring-fg/20 appearance-none"
                                            >
                                                <option className="bg-[#0b0d12] text-silver" value="">{t.selectState}</option>
                                                {WILAYAS.map((w) => (
                                                    <option className="bg-[#0b0d12] text-silver" key={w.id} value={language === 'EN' ? w.name : w.nameAr}>
                                                        {language === 'EN' ? w.name : w.nameAr}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                        <label className="block">
                                            <span className="font-mono text-[10px] uppercase tracking-widest text-silver mb-2 block">{t.communeLabel}</span>
                                            <select
                                                value={orderCommune}
                                                onChange={(e) => setOrderCommune(e.target.value)}
                                                disabled={!orderState}
                                                className="w-full border border-silver/20 bg-[#0b0d12] px-4 py-3 rounded-lg text-sm text-silver outline-none focus:border-fg focus:ring-2 focus:ring-fg/20 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                <option className="bg-[#0b0d12] text-silver" value="">{t.selectCommune}</option>
                                                {communeOptions.map((c) => (
                                                    <option className="bg-[#0b0d12] text-silver" key={c.name} value={language === 'EN' ? c.name : c.nameAr}>
                                                        {language === 'EN' ? c.name : c.nameAr}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    value={orderAddress}
                                    onChange={(e) => setOrderAddress(e.target.value)}
                                    placeholder={t.addressPlaceholder}
                                    className="w-full border border-silver/20 bg-transparent px-4 py-3 rounded-lg text-sm text-fg outline-none focus:border-fg"
                                />
                                <textarea
                                    rows={3}
                                    value={orderNotes}
                                    onChange={(e) => setOrderNotes(e.target.value)}
                                    placeholder={t.notesPlaceholder}
                                    className="w-full border border-silver/20 bg-transparent px-4 py-3 rounded-lg text-sm text-fg outline-none focus:border-fg resize-none"
                                />
                                {formError && (
                                    <p className="text-sm text-red-400">{formError}</p>
                                )}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setOrderStep(1)}
                                        className="w-full sm:w-auto flex-1 font-mono text-xs uppercase tracking-[0.2em] border border-silver/30 px-8 py-3 rounded-full text-silver hover:text-fg hover:border-fg transition-all duration-300"
                                    >
                                        {language === 'EN' ? 'Back' : 'رجوع'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleOrderSubmit}
                                        disabled={isSubmitting}
                                        className="w-full sm:w-auto flex-1 font-mono text-xs uppercase tracking-[0.2em] border border-fg px-8 py-3 rounded-full bg-fg text-bg hover:bg-silver transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (language === 'EN' ? 'Submitting...' : 'جاري الإرسال...') : t.sendRequest}
                                    </button>
                                </div>
                            </div>
                            </>
                        ) : (
                            <>
                                <p className="font-mono text-xs uppercase tracking-[0.3em] text-silver mb-4">{language === 'EN' ? 'Choose your color and quantity' : 'اختر اللون والكمية'}</p>
                                <div className="grid gap-6">
                                    {t.colors.length > 0 && (
                                        <div className="rounded-3xl border border-silver/20 bg-[#11171f] p-6 shadow-[0_20px_80px_-40px_rgba(0,0,0,0.65)]">
                                            <h3 className={`font-mono text-xs text-fg tracking-widest uppercase mb-4 ${language === 'AR' ? 'uppercase-none font-sans font-medium' : ''}`}>{t.selectColor}</h3>
                                            <div className="flex flex-wrap gap-3">
                                                {t.colors.map((colorObj: { name: string; quantity: number }) => (
                                                    <button
                                                        key={colorObj.name}
                                                        onClick={() => setSelectedColor(colorObj.name)}
                                                        disabled={colorObj.quantity === 0}
                                                        className={`px-4 py-3 border font-mono text-[11px] uppercase tracking-widest transition-all ${selectedColor === colorObj.name ? 'border-fg bg-fg text-bg' : 'border-silver/30 text-silver hover:border-fg hover:text-fg'} ${colorObj.quantity === 0 ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}
                                                    >
                                                        {colorObj.name} {colorObj.quantity > 0 ? `(${colorObj.quantity})` : '(Sold out)'}
                                                    </button>
                                                ))}
                                            </div>
                                            <AnimatePresence>
                                                {selectedColor && t.colors.find(c => c.name === selectedColor)?.quantity! > 0 && t.colors.find(c => c.name === selectedColor)?.quantity! <= 3 && (
                                                    <motion.p
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className={`font-mono text-[10px] text-silver/70 tracking-widest uppercase flex items-center gap-2 mt-3 ${language === 'AR' ? 'uppercase-none font-sans font-medium' : ''}`}
                                                    >
                                                        <span className="w-1.5 h-1.5 rounded-full bg-silver/60 animate-pulse"></span>
                                                        {language === 'EN'
                                                            ? `Only ${t.colors.find(c => c.name === selectedColor)?.quantity} pieces remaining`
                                                            : `بقي ${t.colors.find(c => c.name === selectedColor)?.quantity} قطع فقط`}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    )}
                                    <label className="block">
                                        <span className="font-mono text-[10px] uppercase tracking-widest text-silver mb-2 block">{t.quantityLabel}</span>
                                        <select
                                            value={String(orderQuantity)}
                                            onChange={(e) => setOrderQuantity(Number(e.target.value))}
                                            className="w-full border border-silver/20 bg-[#0b0d12] px-4 py-3 rounded-lg text-sm text-silver outline-none focus:border-fg focus:ring-2 focus:ring-fg/20 appearance-none"
                                        >
                                            {[1,2,3,4,5,6,7,8,9,10].map((qty) => (
                                                <option className="bg-[#0b0d12] text-silver" key={qty} value={qty}>
                                                    {qty}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    {formError && (
                                        <p className="text-sm text-red-400">{formError}</p>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (t.colors.length > 0 && !selectedColor) {
                                                setFormError(t.colorRequired);
                                                return;
                                            }
                                            setFormError('');
                                            setOrderStep(2);
                                        }}
                                        className="w-full font-mono text-xs uppercase tracking-[0.2em] border border-fg px-8 py-4 rounded-full bg-fg text-bg hover:bg-silver transition-all duration-500"
                                    >
                                        {language === 'EN' ? 'Next' : 'التالي'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
        );

        const modalContent = (
            <>
                <AnimatePresence mode="wait">
                    {isOpen && product && (
                        <div className="fixed inset-0 z-[10000] flex items-start justify-center p-4 sm:p-12 pt-8 sm:pt-12" data-lenis-prevent>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={onClose}
                                className="absolute inset-0 bg-fg/10 backdrop-blur-xl"
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
                                className="relative w-[min(100vw-1.5rem,1100px)] max-w-[1100px] max-h-[calc(100vh-1.5rem)] flex flex-col pt-10 md:p-6"
                                data-lenis-prevent
                            >
                                <div ref={modalCardRef} className="relative w-full max-h-[calc(100vh-2rem)] bg-bg border border-silver/20 rounded-t-2xl md:rounded-xl shadow-2xl overflow-hidden flex flex-col">

                                    {/* Scrollable Content */}
                                    <div className="w-full min-h-0 overflow-y-auto touch-pan-y custom-scrollbar flex flex-col" dir={language === 'AR' ? 'rtl' : 'ltr'}>

                                    {/* Side-by-side row: image + details */}
                                    <div className={`w-full p-6 sm:p-10 flex flex-col gap-12 md:gap-14 ${language === 'AR' ? 'md:flex-row-reverse' : 'md:flex-row'}`}>

                                    {/* Product Header — visible only on mobile */}
                                    <div className="md:hidden w-full">
                                        {productHeader}
                                    </div>

                                    {/* Image / 3D Section — larger image column */}
                                    <div className="md:w-[55%] w-full min-w-0 flex min-h-0 flex-col gap-8">
                                        <div className="flex items-center gap-3 font-mono text-[10px] tracking-widest">
                                            <button
                                                onClick={() => setViewMode('2d')}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 border transition-all ${viewMode === '2d' ? 'border-fg text-fg' : 'border-silver/20 text-silver hover:border-silver'}`}
                                            >
                                                <Image size={10} /> {t.view2D}
                                            </button>
                                            <button
                                                onClick={() => setViewMode('3d')}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 border transition-all ${viewMode === '3d' ? 'border-fg text-fg' : 'border-silver/20 text-silver hover:border-silver'}`}
                                            >
                                                <Layers size={10} /> {t.view3D}
                                            </button>
                                        </div>

                                        {/* Main image — aspect ratio keeps column stable */}
                                        <div
                                            className="relative w-full min-h-[220px] md:min-h-[340px] aspect-video md:aspect-[4/3] overflow-hidden bg-black group/img-container"
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
                                                        src={currentGallery[currentImageIndex] || product.image}
                                                        alt={product.title}
                                                        onClick={() => setIsImageExpanded(true)}
                                                        className={`w-full h-full object-cover cursor-zoom-in transition-transform duration-700 hover:scale-105 ${currentGallery[currentImageIndex]?.includes('blettermodel') ? 'object-top' : 'object-center'}`}
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
                                                                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-fg/80 border border-bg/20 text-bg opacity-0 group-hover/img-container:opacity-100 transition-opacity duration-300 hover:bg-fg"
                                                                aria-label="Previous image"
                                                            >
                                                                <ChevronLeft size={18} />
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                                                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-fg/80 border border-bg/20 text-bg opacity-0 group-hover/img-container:opacity-100 transition-opacity duration-300 hover:bg-fg"
                                                                aria-label="Next image"
                                                            >
                                                                <ChevronRight size={18} />
                                                            </button>
                                                            {/* Dot indicators */}
                                                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                                                                {currentGallery.map((_: string, idx: number) => (
                                                                    <button
                                                                        key={idx}
                                                                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                                                                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'bg-fg w-4' : 'bg-fg/40'
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
                                        {viewMode === '2d' && currentGallery && currentGallery.length > 1 && (
                                            <div
                                                className="flex gap-2 h-16 overflow-x-auto flex-nowrap"
                                                style={{ scrollbarWidth: 'none' }}
                                            >
                                                {currentGallery.map((img: string, idx: number) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setCurrentImageIndex(idx)}
                                                        className={`relative w-16 h-16 flex-shrink-0 border-2 transition-all duration-300 overflow-hidden ${currentImageIndex === idx
                                                            ? 'border-fg opacity-100'
                                                            : 'border-transparent opacity-40 hover:opacity-80 hover:border-fg/40'
                                                            }`}
                                                    >
                                                        <img src={img} alt={`${product.title} view ${idx + 1}`} className="w-full h-full object-cover" />
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                    </div>

                                    {detailsSection}
                                    </div>{/* end side-by-side row */}

                                    {/* Description Section — full width below, inside scroll */}
                                    <div className="hidden md:block w-full px-6 sm:px-10 pb-10">
                                        <div className="rounded-3xl border border-silver/20 bg-[#12171f] p-6 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.75)]">
                                            <h3 className={`font-mono text-xs text-fg tracking-widest uppercase mb-4 ${language === 'AR' ? 'uppercase-none font-sans font-medium' : ''}`}>{t.description}</h3>
                                            <p className={`text-sm text-silver/90 leading-7 font-mono whitespace-pre-wrap ${language === 'AR' ? 'font-sans' : ''} mb-2`}>
                                                {product.description || (language === 'EN' ? 'No description available.' : 'لا يوجد وصف.')}
                                            </p>
                                        </div>
                                    </div>

                                </div>{/* end scrollable */}
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
                            className="absolute inset-0 bg-bg/95 backdrop-blur-2xl cursor-zoom-out"
                        />
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={() => setIsImageExpanded(false)}
                            className="absolute top-8 right-8 text-fg/50 hover:text-fg transition-colors z-[20001]"
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
