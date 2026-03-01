import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCart } from '../../contexts/CartContext';
import { supabase } from '../../lib/supabase';
import { WILAYAS } from '../../data/wilayas';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    product?: any;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, product }) => {
    const { language } = useLanguage();
    const { items, clearCart } = useCart();
    const WHATSAPP_NUMBER = "213556967562";

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        state: '',
        deliveryType: 'home' as 'home' | 'desk',
        review: ''
    });

    const selectedWilaya = WILAYAS.find(w => w.name.toLowerCase() === formData.state.toLowerCase());
    const deliveryFee = selectedWilaya ? (formData.deliveryType === 'home' ? selectedWilaya.home : selectedWilaya.desk) : 0;


    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Generate WhatsApp message
        const orderItems = items.length > 0 ? items : (product ? [{ ...product, quantity: 1 }] : []);
        const itemsList = orderItems.map(i => `- ${i.title} (x${i.quantity})${i.selectedColor ? ` [Color: ${i.selectedColor}]` : ''}`).join('\n');
        const totalPrice = items.reduce((sum, item) => {
            const raw = item.price.replace(/[^\d,]/g, '').replace(',', '');
            return sum + (parseInt(raw) || 0) * item.quantity;
        }, 0);

        const totalWithDelivery = totalPrice + deliveryFee;

        const message = `*NEW ORDER - G ARGENA*\n\n` +
            `*Contact:* ${formData.email}\n` +
            `*Phone:* ${formData.phone}\n` +
            `*Destination:* ${selectedWilaya?.name || formData.state} (${formData.deliveryType.toUpperCase()})\n` +
            `*Delivery Fee:* DA ${deliveryFee.toLocaleString()}\n\n` +
            `*Items:* \n${itemsList}\n\n` +
            `*Subtotal:* DA ${totalPrice.toLocaleString()}\n` +
            `*TOTAL:* DA ${totalWithDelivery.toLocaleString()}\n\n` +
            `*Feedback:* ${formData.review || 'N/A'}`;

        // Send via the new Supabase Edge Function
        const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
        const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

        fetch(`${SUPABASE_URL}/functions/v1/send-order-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ANON_KEY}`
            },
            body: JSON.stringify({
                name: "Customer Order",
                email: formData.email,
                subject: `[ORDER] - New Order from ${formData.phone}`,
                message: message
            }),
        }).catch(err => console.error('Email Send Error:', err));

        // Async save to Supabase
        supabase.from('orders').insert([{
            email: formData.email,
            phone: formData.phone,
            state: formData.state,
            delivery_type: formData.deliveryType,
            delivery_fee: deliveryFee,
            items: orderItems,
            total: totalWithDelivery,
            feedback: formData.review
        }]).then(({ error }) => {
            if (error) console.error('Supabase Order Save Error:', error);
        });

        clearCart();
        nextStep(); // Move to success screen
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const t = {
        step1: language === 'EN' ? 'STEP 01/03 — CONTACT' : 'الخطوة 01/03 — جهة الاتصال',
        who: language === 'EN' ? 'Who is ordering?' : 'من يطلب؟',
        email: language === 'EN' ? 'Email Address' : 'البريد الإلكتروني',
        enterEmail: language === 'EN' ? 'ENTER EMAIL' : 'أدخل البريد الإلكتروني',
        phone: language === 'EN' ? 'Phone Number' : 'رقم الهاتف',
        enterPhone: language === 'EN' ? 'ENTER PHONE' : 'أدخل رقم الهاتف',
        continue1: language === 'EN' ? 'CONTINUE TO SHIPPING' : 'متابعة إلى الشحن',

        step2: language === 'EN' ? 'STEP 02/03 — DESTINATION' : 'الخطوة 02/03 — الوجهة',
        where: language === 'EN' ? 'Where is it going?' : 'إلى أين تتجه؟',
        stateLabel: language === 'EN' ? 'State / region (Algeria)' : 'الولاية / المنطقة (الجزائر)',
        selectState: language === 'EN' ? 'Select State' : 'اختر الولاية',
        algiers: language === 'EN' ? 'Algiers' : 'الجزائر العاصمة',
        oran: language === 'EN' ? 'Oran' : 'وهران',
        constantine: language === 'EN' ? 'Constantine' : 'قسنطينة',
        back: language === 'EN' ? 'BACK' : 'رجوع',
        deliveryMethod: language === 'EN' ? 'Delivery Method' : 'طريقة التوصيل',
        homeDelivery: language === 'EN' ? 'Home Delivery' : 'توصيل للمنزل',
        deskDelivery: language === 'EN' ? 'Desk / Office' : 'توصيل للمكتب',
        deliveryFeeLabel: language === 'EN' ? 'Delivery Fee' : 'رسوم التوصيل',
        free: language === 'EN' ? 'FREE' : 'مجاني',
        finalStep: language === 'EN' ? 'FINAL STEP' : 'الخطوة النهائية',

        step3: language === 'EN' ? 'STEP 03/03 — FEEDBACK' : 'الخطوة 03/03 — ملاحظات',
        leaveReview: language === 'EN' ? 'Leave a Review' : 'اترك تقييماً',
        howFind: language === 'EN' ? 'How did you find us? (Optional)' : 'كيف وجدتنا؟ (اختياري)',
        tellUs: language === 'EN' ? 'TELL US ABOUT YOUR EXPERIENCE...' : 'أخبرنا عن تجربتك...',
        placeOrder: language === 'EN' ? 'PLACE ORDER' : 'إرسال الطلب',

        step4Title: language === 'EN' ? 'Order Received' : 'تم استلام الطلب',
        step4Desc: language === 'EN' ? 'Will be in contact with you shortly. Thank you for ordering from us.' : 'سنتواصل معك قريباً. شكراً لطلبك منا.',
        close: language === 'EN' ? 'RETURN TO ARCHIVE' : 'العودة للأرشيف'
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                />

                <motion.div
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-2xl bg-bg border border-silver/20 p-8 md:p-12 max-h-[90vh] overflow-y-auto custom-scrollbar"
                    data-lenis-prevent
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-silver/10">
                        <motion.div
                            className="h-full bg-white"
                            initial={{ width: '0%' }}
                            animate={{ width: `${(step / 4) * 100}%` }}
                        />
                    </div>

                    <button onClick={onClose} className="absolute top-6 right-6 text-silver hover:text-white transition-colors">
                        <X size={24} />
                    </button>

                    <form onSubmit={handleSubmit} className={`relative z-10 ${language === 'AR' ? 'text-right' : ''}`}>
                        {step === 1 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <p className={`font-mono text-[10px] text-silver tracking-widest mb-4 ${language === 'AR' ? 'uppercase-none font-sans font-bold' : ''}`}>{t.step1}</p>
                                <h2 className={`${language === 'EN' ? 'font-[UnifrakturMaguntia] italic' : 'font-sans font-bold'} text-4xl md:text-5xl text-white mb-8`}>{t.who}</h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className={`block font-mono text-[10px] text-silver mb-2 tracking-widest uppercase ${language === 'AR' ? 'uppercase-none font-sans font-medium' : ''}`}>{t.email}</label>
                                        <input
                                            required
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder={t.enterEmail}
                                            className={`w-full bg-transparent border-b border-silver/30 py-3 font-mono text-sm outline-none focus:border-white transition-colors uppercase ${language === 'AR' ? 'uppercase-none font-sans text-right' : ''}`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block font-mono text-[10px] text-silver mb-2 tracking-widest uppercase ${language === 'AR' ? 'uppercase-none font-sans font-medium' : ''}`}>{t.phone}</label>
                                        <input
                                            required
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder={t.enterPhone}
                                            className={`w-full bg-transparent border-b border-silver/30 py-3 font-mono text-sm outline-none focus:border-white transition-colors uppercase ${language === 'AR' ? 'uppercase-none font-sans text-right' : ''}`}
                                        />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={!formData.email || !formData.phone}
                                    className={`mt-12 w-full group flex items-center justify-between font-mono text-xs tracking-[0.3em] border border-silver/30 px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-500 disabled:opacity-30 ${language === 'AR' ? 'uppercase-none font-sans font-bold flex-row-reverse' : ''}`}
                                >
                                    {t.continue1}
                                    {language === 'EN' ? <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" /> : <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />}
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <p className={`font-mono text-[10px] text-silver tracking-widest mb-4 ${language === 'AR' ? 'uppercase-none font-sans font-bold' : ''}`}>{t.step2}</p>
                                <h2 className={`${language === 'EN' ? 'font-[UnifrakturMaguntia] italic' : 'font-sans font-bold'} text-4xl md:text-5xl text-white mb-8`}>{t.where}</h2>
                                <div>
                                    <label className={`block font-mono text-[10px] text-silver mb-2 tracking-widest uppercase ${language === 'AR' ? 'uppercase-none font-sans font-medium' : ''}`}>{t.stateLabel}</label>
                                    <select
                                        required
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        className={`w-full bg-bg border-b border-silver/30 py-3 font-mono text-sm outline-none focus:border-white transition-colors uppercase appearance-none ${language === 'AR' ? 'uppercase-none font-sans text-right' : ''}`}
                                    >
                                        <option value="">{t.selectState}</option>
                                        {WILAYAS.map(w => (
                                            <option key={w.id} value={w.name.toLowerCase()}>
                                                {language === 'EN' ? `${w.id.toString().padStart(2, '0')} - ${w.name}` : `${w.id.toString().padStart(2, '0')} - ${w.nameAr}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {formData.state && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-4">
                                        <label className={`block font-mono text-[10px] text-silver mb-2 tracking-widest uppercase ${language === 'AR' ? 'uppercase-none font-sans font-medium' : ''}`}>{t.deliveryMethod}</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setFormData(p => ({ ...p, deliveryType: 'home' }))}
                                                className={`p-4 border font-mono text-[10px] tracking-widest transition-all ${formData.deliveryType === 'home' ? 'border-white bg-white text-black' : 'border-silver/20 text-silver hover:border-silver'}`}
                                            >
                                                {t.homeDelivery.toUpperCase()}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData(p => ({ ...p, deliveryType: 'desk' }))}
                                                className={`p-4 border font-mono text-[10px] tracking-widest transition-all ${formData.deliveryType === 'desk' ? 'border-white bg-white text-black' : 'border-silver/20 text-silver hover:border-silver'}`}
                                            >
                                                {t.deskDelivery.toUpperCase()}
                                            </button>
                                        </div>
                                        <div className="flex justify-between items-center py-4 border-t border-silver/10 mt-4">
                                            <span className="font-mono text-[10px] text-silver tracking-widest uppercase">{t.deliveryFeeLabel}</span>
                                            <span className="font-mono text-sm text-white">DA {deliveryFee.toLocaleString()}</span>
                                        </div>
                                    </motion.div>
                                )}

                                <div className={`flex gap-4 mt-12 ${language === 'AR' ? 'flex-row-reverse' : ''}`}>
                                    <button type="button" onClick={prevStep} className={`flex-1 font-mono text-[10px] border border-silver/30 px-4 py-4 rounded-full hover:bg-white/10 transition-colors tracking-widest ${language === 'AR' ? 'uppercase-none font-sans font-bold' : ''}`}>
                                        {t.back}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        disabled={!formData.state}
                                        className={`flex-[2] group flex items-center justify-between font-mono text-xs border border-silver/30 px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-500 disabled:opacity-30 tracking-[0.2em] ${language === 'AR' ? 'uppercase-none font-sans font-bold flex-row-reverse' : ''}`}
                                    >
                                        {t.finalStep}
                                        {language === 'EN' ? <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" /> : <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <p className={`font-mono text-[10px] text-silver tracking-widest mb-4 ${language === 'AR' ? 'uppercase-none font-sans font-bold' : ''}`}>{t.step3}</p>
                                <h2 className={`${language === 'EN' ? 'font-[UnifrakturMaguntia] italic' : 'font-sans font-bold'} text-4xl md:text-5xl text-white mb-8`}>{t.leaveReview}</h2>
                                <div>
                                    <label className={`block font-mono text-[10px] text-silver mb-2 tracking-widest uppercase ${language === 'AR' ? 'uppercase-none font-sans font-medium' : ''}`}>{t.howFind}</label>
                                    <textarea
                                        name="review"
                                        value={formData.review}
                                        onChange={handleInputChange}
                                        placeholder={t.tellUs}
                                        className={`w-full bg-transparent border border-silver/30 p-6 font-mono text-xs outline-none focus:border-white transition-colors uppercase min-h-[120px] resize-none ${language === 'AR' ? 'uppercase-none font-sans text-right' : ''}`}
                                    />
                                </div>

                                <div className="mt-8 p-6 bg-silver/5 border border-silver/10 rounded-xl space-y-3">
                                    <div className="flex justify-between items-center text-silver font-mono text-[10px] tracking-widest uppercase">
                                        <span>Subtotal</span>
                                        <span>DA {items.reduce((sum, item) => {
                                            const raw = item.price.replace(/[^\d,]/g, '').replace(',', '');
                                            return sum + (parseInt(raw) || 0) * item.quantity;
                                        }, 0).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-silver font-mono text-[10px] tracking-widest uppercase">
                                        <span>{t.deliveryFeeLabel}</span>
                                        <span>DA {deliveryFee.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-white font-mono text-sm border-t border-silver/10 pt-3 mt-3">
                                        <span>TOTAL</span>
                                        <span className="metallic-text font-bold">DA {(items.reduce((sum, item) => {
                                            const raw = item.price.replace(/[^\d,]/g, '').replace(',', '');
                                            return sum + (parseInt(raw) || 0) * item.quantity;
                                        }, 0) + deliveryFee).toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className={`flex gap-4 mt-12 ${language === 'AR' ? 'flex-row-reverse' : ''}`}>
                                    <button type="button" onClick={prevStep} className={`flex-1 font-mono text-[10px] border border-silver/30 px-4 py-4 rounded-full hover:bg-white/10 transition-colors tracking-widest uppercase ${language === 'AR' ? 'uppercase-none font-sans font-bold' : ''}`}>
                                        {t.back}
                                    </button>
                                    <button
                                        type="submit"
                                        className={`flex-[2] group flex items-center justify-between font-mono text-xs border border-white px-8 py-4 rounded-full bg-white text-black hover:bg-silver transition-all duration-500 tracking-[0.2em] ${language === 'AR' ? 'uppercase-none font-sans font-bold flex-row-reverse' : ''}`}
                                    >
                                        {t.placeOrder}
                                        {language === 'EN' ? <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" /> : <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                                <CheckCircle2 size={64} className="mx-auto text-silver mb-8 mb-6" strokeWidth={1} />
                                <h2 className={`${language === 'EN' ? 'font-[UnifrakturMaguntia] italic' : 'font-sans font-bold'} text-5xl text-white mb-6`}>{t.step4Title}</h2>
                                <p className={`font-mono text-xs text-silver tracking-widest uppercase mb-12 ${language === 'AR' ? 'uppercase-none font-sans font-medium' : ''}`}>
                                    {t.step4Desc}
                                </p>
                                <button
                                    onClick={onClose}
                                    className={`font-mono text-xs border border-silver/30 px-12 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-500 tracking-widest ${language === 'AR' ? 'uppercase-none font-sans font-bold' : ''}`}
                                >
                                    {t.close}
                                </button>
                            </motion.div>
                        )}
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CheckoutModal;
