import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';
import { Loader2, Check } from 'lucide-react';

export const Footer: React.FC = () => {
    const { language } = useLanguage();
    const [email, setEmail] = React.useState('');
    const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const t = {
        joinCult: language === 'EN' ? 'Join the Cult' : 'انضم إلينا',
        subscribeText: language === 'EN'
            ? 'Subscribe to receive updates, access to exclusive deals, and more.'
            : 'اشترك ليصلك جديدنا وعروضنا الحصرية.',
        emailPlaceholder: language === 'EN' ? 'EMAIL ADDRESS' : 'البريد الإلكتروني',
        submit: language === 'EN' ? 'Submit' : 'إرسال',
        navHeading: language === 'EN' ? '(Navigation)' : '(التنقل)',
        legalHeading: language === 'EN' ? '(Legal)' : '(قانوني)',
        home: language === 'EN' ? 'Home' : 'الرئيسية',
        shopAll: language === 'EN' ? 'Shop All' : 'كل المنتجات',
        about: language === 'EN' ? 'About' : 'عن أرجانا',
        testim: language === 'EN' ? 'Testimonials' : 'آراء الزبائن',
        customOrder: language === 'EN' ? 'Custom Orders' : 'طلبات خاصة',
        terms: language === 'EN' ? 'Terms of Service' : 'شروط الخدمة',
        privacy: language === 'EN' ? 'Privacy Policy' : 'سياسة الخصوصية',
        shipping: language === 'EN' ? 'Shipping & Returns' : 'الشحن والإرجاع',
        rights: language === 'EN' ? `© ${new Date().getFullYear()} Argana. All rights reserved.` : `© ${new Date().getFullYear()} أرجانا. جميع الحقوق محفوظة.`,
        designed: language === 'EN' ? 'Designed by ' : 'صُمم بواسطة ',
        successMsg: language === 'EN' ? 'Thank you for subscribing!' : 'شكراً لاشتراكك!',
        errorMsg: language === 'EN' ? 'An error occurred. Try again.' : 'حدث خطأ. حاول مرة أخرى.'
    };

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        try {
            const { error } = await supabase.from('subscribers').insert([{ email }]);
            if (error) throw error;
            setStatus('success');
            setEmail('');
            setTimeout(() => setStatus('idle'), 3000);
        } catch (error) {
            console.error('Subscription error:', error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <footer className={`border-t border-silver/20 pt-20 pb-10 px-6 md:px-12 mt-20 relative z-10 ${language === 'AR' ? 'text-right' : ''}`}>
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                <div>
                    <h2 className={`${language === 'EN' ? 'font-[UnifrakturMaguntia]' : 'font-sans font-bold'} metallic-text text-5xl md:text-7xl mb-6`}>{t.joinCult}</h2>
                    <p className={`font-mono text-xs text-silver uppercase tracking-widest mb-8 max-w-md ${language === 'AR' ? 'uppercase-none font-sans font-medium' : ''}`}>
                        {t.subscribeText}
                    </p>
                    <form onSubmit={handleSubscribe} className="flex flex-col gap-2 max-w-md">
                        <div className="flex border-b border-silver/50 pb-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t.emailPlaceholder}
                                disabled={status === 'loading' || status === 'success'}
                                required
                                className={`bg-transparent border-none outline-none w-full font-mono text-xs uppercase placeholder:text-silver/50 disabled:opacity-50 ${language === 'AR' ? 'uppercase-none font-sans text-right' : ''}`}
                            />
                            <button
                                type="submit"
                                disabled={status === 'loading' || status === 'success'}
                                className={`font-mono text-xs uppercase hover:text-silver transition-colors flex items-center gap-2 disabled:opacity-50 ${language === 'AR' ? 'uppercase-none font-sans font-medium ms-4' : ''}`}
                            >
                                {status === 'loading' ? <Loader2 size={14} className="animate-spin" /> :
                                    status === 'success' ? <Check size={14} className="text-green-500" /> :
                                        t.submit}
                            </button>
                        </div>
                        {status === 'success' && <p className="text-green-500 font-mono text-[10px] mt-1">{t.successMsg}</p>}
                        {status === 'error' && <p className="text-red-500 font-mono text-[10px] mt-1">{t.errorMsg}</p>}
                    </form>
                </div>
                <div className={`grid grid-cols-2 gap-8 font-mono text-xs uppercase tracking-widest ${language === 'AR' ? 'uppercase-none font-sans font-medium' : ''}`}>
                    <div>
                        <p className="text-silver mb-4">{t.navHeading}</p>
                        <ul className="space-y-2">
                            <li><Link to="/" className="hover:text-silver transition-colors">{t.home}</Link></li>
                            <li><Link to="/shop" className="hover:text-silver transition-colors">{t.shopAll}</Link></li>
                            <li><Link to="/about" className="hover:text-silver transition-colors">{t.about}</Link></li>
                            <li><Link to="/testimonials" className="hover:text-silver transition-colors">{t.testim}</Link></li>
                            <li><Link to="/custom-orders" className="hover:text-silver transition-colors">{t.customOrder}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-silver mb-4">{t.legalHeading}</p>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-silver transition-colors">{t.terms}</a></li>
                            <li><a href="#" className="hover:text-silver transition-colors">{t.privacy}</a></li>
                            <li><a href="#" className="hover:text-silver transition-colors">{t.shipping}</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className={`max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center font-mono text-[10px] uppercase tracking-widest text-silver ${language === 'AR' ? 'uppercase-none font-sans font-medium' : ''}`}>
                <div className="flex items-center gap-6 mb-4 md:mb-0">
                    <Logo className="text-4xl md:text-6xl border-e border-silver/20 pe-6" forceImageOnly={true} />
                    <div className="flex flex-col gap-1">
                        <p>{t.rights}</p>
                        <a href="https://www.instagram.com/argena.streetwear/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">@argena.streetwear</a>
                    </div>
                </div>
                <p className="mt-4 md:mt-0">
                    {t.designed}
                    <a href="https://www.instagram.com/youcef.dev_/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-silver transition-colors underline underline-offset-4 decoration-silver/30">youcef.dev_</a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
