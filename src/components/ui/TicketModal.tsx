import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';

interface TicketModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose }) => {
    const { language } = useLanguage();
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

    const t = {
        title: language === 'EN' ? 'Open a Ticket' : 'فتح تذكرة',
        subtitle: language === 'EN' ? 'Direct support via WhatsApp' : 'دعم مباشر عبر واتساب',
        name: language === 'EN' ? 'Full Name' : 'الاسم الكامل',
        email: language === 'EN' ? 'Email Address' : 'البريد الإلكتروني',
        subject: language === 'EN' ? 'Subject' : 'الموضوع',
        message: language === 'EN' ? 'Your Message' : 'رسالتك',
        send: language === 'EN' ? 'OPEN WHATSAPP' : 'فتح واتساب',
        successTitle: language === 'EN' ? 'Portal Opened' : 'تم فتح البوابة',
        successDesc: language === 'EN' ? 'Redirecting to our secure WhatsApp line for assistance.' : 'يتم توجيهك إلى خط واتساب الخاص بنا للمساعدة.',
        close: language === 'EN' ? 'CLOSE' : 'إغلاق',
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const WHATSAPP_NUMBER = "213556967562";
        const message = encodeURIComponent(
            `*NEW TICKET - G ARGENA*\n\n` +
            `*Name:* ${form.name}\n` +
            `*Email:* ${form.email}\n` +
            `*Subject:* ${form.subject}\n\n` +
            `*Message:* ${form.message}`
        );

        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');

        try {
            // Backup save to Supabase
            await supabase.from('tickets').insert([{
                name: form.name,
                email: form.email,
                subject: form.subject,
                message: form.message
            }]);
        } catch (error) {
            console.error('Supabase Ticket Save Error:', error);
        }

        setSent(true);
        setLoading(false);
    };

    const handleClose = () => {
        setSent(false);
        setForm({ name: '', email: '', subject: '', message: '' });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className={`relative w-full max-w-lg bg-bg border border-silver/20 p-8 md:p-10 overflow-hidden ${language === 'AR' ? 'text-right' : ''}`}
                >
                    <button
                        onClick={handleClose}
                        className="absolute top-5 right-5 text-silver hover:text-white transition-colors"
                    >
                        <X size={22} />
                    </button>

                    {!sent ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <h2 className={`${language === 'EN' ? 'font-[UnifrakturMaguntia] italic' : 'font-sans font-bold'} metallic-text text-4xl mb-2`}>
                                    {t.title}
                                </h2>
                                <p className="font-mono text-[10px] text-silver tracking-widest uppercase">
                                    {t.subtitle}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-mono text-[10px] text-silver mb-2 tracking-widest uppercase">{t.name}</label>
                                    <input
                                        required
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className="w-full bg-transparent border-b border-silver/30 py-2 font-mono text-sm outline-none focus:border-white transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block font-mono text-[10px] text-silver mb-2 tracking-widest uppercase">{t.email}</label>
                                    <input
                                        required
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        className="w-full bg-transparent border-b border-silver/30 py-2 font-mono text-sm outline-none focus:border-white transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-mono text-[10px] text-silver mb-2 tracking-widest uppercase">{t.subject}</label>
                                <input
                                    required
                                    name="subject"
                                    value={form.subject}
                                    onChange={handleChange}
                                    className="w-full bg-transparent border-b border-silver/30 py-2 font-mono text-sm outline-none focus:border-white transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block font-mono text-[10px] text-silver mb-2 tracking-widest uppercase">{t.message}</label>
                                <textarea
                                    required
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full bg-transparent border border-silver/30 p-4 font-mono text-xs outline-none focus:border-white transition-colors resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full group flex items-center justify-between font-mono text-xs tracking-[0.3em] border border-white px-8 py-4 rounded-full bg-white text-black hover:bg-silver transition-all duration-500 disabled:opacity-50"
                            >
                                {loading ? 'SENDING...' : t.send}
                                <Send size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-10"
                        >
                            <CheckCircle2 size={56} className="mx-auto text-silver mb-6" strokeWidth={1} />
                            <h2 className={`${language === 'EN' ? 'font-[UnifrakturMaguntia] italic' : 'font-sans font-bold'} metallic-text text-4xl mb-4`}>
                                {t.successTitle}
                            </h2>
                            <p className="font-mono text-xs text-silver tracking-widest uppercase mb-10">
                                {t.successDesc}
                            </p>
                            <button
                                onClick={handleClose}
                                className="font-mono text-xs border border-silver/30 px-10 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-500 tracking-widest"
                            >
                                {t.close}
                            </button>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default TicketModal;
