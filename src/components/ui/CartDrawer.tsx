import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useLanguage } from '../../contexts/LanguageContext';

export const CartDrawer: React.FC = () => {
    const { items, isOpen, closeCart, removeItem, updateQty, count, openCheckout } = useCart();
    const { language } = useLanguage();

    const isAR = language === 'AR';

    React.useEffect(() => {
        if (isOpen) {
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

    const t = {
        title: isAR ? 'سلتك' : 'Your Cart',
        empty: isAR ? 'سلتك فارغة.' : 'Your cart is empty.',
        total: isAR ? 'المجموع' : 'Total',
        checkout: isAR ? 'المتابعة للطلب' : 'PROCEED TO ORDER',
        color: isAR ? 'اللون' : 'Color',
        orderViaWhatsApp: isAR ? 'هل تفضل الطلب عبر رسالة؟ اضغط هنا' : 'Prefer to order via message? Click here',
        // Arabic: use دعنا نقل عنصرين/عناصر for plural — simplified to عنصر/عناصر
        items: isAR
            ? count === 1 ? '١ عنصر' : `${count} عناصر`
            : `${count} item${count !== 1 ? 's' : ''}`,
    };

    // Calculate total — prices are like "DA 1,950" or "1,950 د.ج"
    const total = items.reduce((sum, item) => {
        const raw = item.price.replace(/[^\d,]/g, '').replace(',', '');
        return sum + (parseInt(raw) || 0) * item.quantity;
    }, 0);

    const formattedTotal = language === 'EN'
        ? `DA ${total.toLocaleString()}`
        : `${total.toLocaleString()} د.ج`;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[150]"
                        data-lenis-prevent
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: isAR ? '-100%' : '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: isAR ? '-100%' : '100%' }}
                        transition={{ type: 'tween', ease: [0.76, 0, 0.24, 1], duration: 0.5 }}
                        className={`fixed top-0 h-full w-full max-w-sm bg-[#050505] z-[160] flex flex-col ${isAR ? 'right-auto left-0 border-r border-silver/20 text-right' : 'left-auto right-0 border-l border-silver/20'}`}
                        dir={isAR ? 'rtl' : 'ltr'}
                        data-lenis-prevent
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-silver/20">
                            <div>
                                <h2 className={`${language === 'EN' ? 'font-[UnifrakturMaguntia] italic' : 'font-sans font-bold'} metallic-text text-3xl`}>
                                    {t.title}
                                </h2>
                                <p className="font-mono text-[10px] text-silver tracking-widest uppercase mt-1">{t.items}</p>
                            </div>
                            <button onClick={closeCart} className="text-silver hover:text-white transition-colors p-4 -mr-4">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6" data-lenis-prevent>
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center gap-4 opacity-40">
                                    <ShoppingBag size={48} strokeWidth={1} className="text-silver" />
                                    <p className="font-mono text-xs text-silver tracking-widest uppercase">{t.empty}</p>
                                </div>
                            ) : (
                                items.map(item => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="flex gap-4"
                                    >
                                        <div className="w-20 h-24 flex-shrink-0 overflow-hidden bg-silver/10">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-full object-cover grayscale"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <p className={`font-mono text-xs tracking-widest text-silver ${isAR ? 'font-sans' : 'uppercase'}`}>
                                                    {item.category}{item.selectedColor ? ` · ${isAR ? t.color + ': ' : ''}${item.selectedColor}` : ''}
                                                </p>
                                                <button
                                                    onClick={() => removeItem(item.id, item.selectedColor)}
                                                    className="text-silver/50 hover:text-white transition-colors ml-2"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                            <p className="font-mono text-sm text-white truncate mb-3">{item.title}</p>
                                            <div className="flex items-center justify-between">
                                                {/* Qty control */}
                                                <div className="flex items-center gap-4 border border-silver/20 rounded-full px-4 py-2">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); updateQty(item.id, item.quantity - 1, item.selectedColor); }}
                                                        disabled={item.quantity <= 1}
                                                        className="text-silver hover:text-white disabled:opacity-30 transition-colors p-1"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="font-mono text-xs w-6 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); updateQty(item.id, item.quantity + 1, item.selectedColor); }}
                                                        className="text-silver hover:text-white transition-colors p-1"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <p className="font-mono text-xs text-white">{item.price}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-silver/20 space-y-4">
                                <div className="flex justify-between font-mono text-sm">
                                    <span className="text-silver uppercase tracking-widest text-xs">{t.total}</span>
                                    <span className="text-white font-bold">{formattedTotal}</span>
                                </div>
                                <button
                                    onClick={() => {
                                        closeCart();
                                        openCheckout();
                                    }}
                                    className={`w-full group flex items-center justify-between border border-white px-8 py-4 rounded-full bg-white text-black hover:bg-silver transition-all duration-500 ${isAR ? 'font-sans font-bold text-sm flex-row-reverse' : 'font-mono text-xs tracking-[0.3em]'}`}
                                >
                                    {t.checkout}
                                    {isAR
                                        ? <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                        : <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    }
                                </button>

                                <a
                                    href={`https://wa.me/213556967562?text=${encodeURIComponent(
                                        `Hello, I want to order the following items:\n\n` +
                                        items.map(item => `- ${item.title} (x${item.quantity})${item.selectedColor ? ` [Color: ${item.selectedColor}]` : ''}`).join('\n') +
                                        `\n\nTotal: DA ${total.toLocaleString()}`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-full flex items-center justify-center gap-2 font-mono text-xs border border-silver/30 px-8 py-3 rounded-full text-silver hover:text-white hover:border-white/50 transition-all duration-300 tracking-[0.1em] ${isAR ? 'uppercase-none font-sans flex-row-reverse' : ''}`}
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 1.905 6.456L.045 24l5.688-1.503A11.94 11.94 0 0 0 11.944 24C18.553 24 24 18.623 24 12S18.553 0 11.944 0zM12 21.844c-1.742 0-3.414-.46-4.88-1.328l-.35-.208-3.623.956.974-3.52-.229-.364A9.816 9.816 0 0 1 2.16 12c0-5.433 4.417-9.843 9.84-9.843S21.84 6.567 21.84 12c0 5.433-4.417 9.844-9.84 9.844zm5.395-7.36c-.296-.149-1.751-.864-2.023-.963-.271-.097-.47-.148-.667.148-.198.297-.768.963-.941 1.16-.173.197-.346.223-.642.074a8.216 8.216 0 0 1-4.008-2.484c-.309-.399-.17-.611-.02-.756.134-.13.296-.347.444-.52.149-.174.198-.298.297-.496.099-.198.05-.371-.025-.52-.074-.148-.667-1.609-.914-2.203-.242-.58-.487-.502-.667-.512-.173-.008-.37-.01-.568-.01a1.08 1.08 0 0 0-.791.371C6.012 8.63 5 9.596 5 11.602c0 2.006 1.359 3.945 1.545 4.193.185.248 2.859 4.364 6.923 6.12 2.657 1.147 3.5.992 4.143.834.787-.193 2.022-.826 2.318-1.626.297-.8.297-1.488.209-1.626-.088-.138-.344-.223-.64-.372z" /></svg>
                                    {t.orderViaWhatsApp}
                                </a>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
