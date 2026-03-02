import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ShoppingBag, Globe, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '../ui/Logo';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCart } from '../../contexts/CartContext';

export const Header: React.FC = () => {
    const [time, setTime] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { language, toggleLanguage } = useLanguage();
    const { count, openCart } = useCart();

    const t = {
        nav: language === 'EN' ? '(Navigation)' : '(التنقل)',
        shop: language === 'EN' ? 'Shop' : 'المتجر',
        about: language === 'EN' ? 'About' : 'عن ارجينا',
        customOrders: language === 'EN' ? 'Custom Orders' : 'طلبات خاصة',
        testimonials: language === 'EN' ? 'Testimonials' : 'آراء الزبائن',
        contact: language === 'EN' ? 'Contact' : 'تواصل معنا',
        socials: language === 'EN' ? '(Socials)' : '(التواصل الاجتماعي)',
        cart: language === 'EN' ? 'Cart' : 'السلة',
        studio: language === 'EN' ? 'Studio' : 'استوديو',
        instagram: language === 'EN' ? 'Instagram' : 'إنستغرام'
    };

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString('en-US', { hour12: false }) + ' CET');
        };
        updateTime();
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // Mobile overlay — portaled directly to document.body to fully escape
    // the parent header's mix-blend-difference stacking context
    const mobileMenuPortal = (
        <AnimatePresence>
            {isMobileMenuOpen && (
                <motion.div
                    key="mobile-menu"
                    initial={{ opacity: 0, y: '-100%' }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: '-100%' }}
                    transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 9999,
                        backgroundColor: '#050505',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mixBlendMode: 'normal',
                        isolation: 'isolate',
                        color: 'white',
                    }}
                >
                    {/* Close button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={{
                            position: 'absolute',
                            top: '1.5rem',
                            right: '1.5rem',
                            padding: '0.75rem',
                            color: 'white',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        <X size={32} />
                    </button>

                    {/* Navigation links */}
                    <nav
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '2rem',
                            fontFamily: language === 'AR' ? "'Segoe UI', sans-serif" : 'monospace',
                            textTransform: language === 'AR' ? 'none' : 'uppercase',
                            letterSpacing: language === 'AR' ? '0' : '0.12em',
                        }}
                    >
                        <Link to={`/${language.toLowerCase()}/`} style={{ fontSize: '1rem', color: '#aaa' }}>{t.studio}</Link>
                        <Link to={`/${language.toLowerCase()}/shop`} className="metallic-text" style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{t.shop}</Link>
                        <Link to={`/${language.toLowerCase()}/about`} className="metallic-text" style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{t.about}</Link>
                        <Link to={`/${language.toLowerCase()}/custom-orders`} className="metallic-text" style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{t.customOrders}</Link>
                        <Link to={`/${language.toLowerCase()}/testimonials`} className="metallic-text" style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{t.testimonials}</Link>
                        <Link to={`/${language.toLowerCase()}/contact`} className="metallic-text" style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{t.contact}</Link>
                    </nav>

                    {/* Bottom controls */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '3rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '1.25rem',
                        }}
                    >
                        <button
                            onClick={toggleLanguage}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: 'white',
                                border: '1px solid rgba(192,192,192,0.3)',
                                padding: '0.4rem 1.25rem',
                                borderRadius: '9999px',
                                fontFamily: 'monospace',
                                fontSize: '0.7rem',
                                textTransform: 'uppercase',
                                background: 'none',
                                cursor: 'pointer',
                                letterSpacing: '0.1em',
                            }}
                        >
                            <Globe size={13} />
                            <span>{language} / {language === 'EN' ? 'AR' : 'EN'}</span>
                        </button>
                        <div
                            style={{
                                display: 'flex',
                                gap: '2rem',
                                fontFamily: 'monospace',
                                fontSize: '0.7rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                color: '#888',
                            }}
                        >
                            <a href="https://www.instagram.com/argena.streetwear/" target="_blank" rel="noopener noreferrer" style={{ color: '#888' }}>{t.instagram}</a>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-50 p-6 mix-blend-difference text-white">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] md:text-xs font-mono uppercase tracking-widest items-start">

                    {/* Logo Section - Visible on all devices */}
                    <div className="flex flex-col">
                        <Link to={`/${language.toLowerCase()}/`} className="hover:text-white transition-colors flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-4 group">
                            <div className="filter drop-shadow-[0_0_30px_rgba(255,255,255,1)] group-hover:drop-shadow-[0_0_50px_rgba(255,255,255,1)] transition-all duration-500 opacity-100 mix-blend-normal isolate">
                                <Logo className="text-5xl h-12 md:text-7xl md:h-28 lg:h-32 w-auto text-white scale-125 origin-left" forceImageOnly={true} />
                            </div>
                            <span className={`font-sans ms-0 md:ms-4 text-white font-bold text-sm md:text-lg tracking-widest group-hover:text-silver transition-colors pt-1 md:pt-2 ${language === 'AR' ? 'font-bold md:text-2xl md:me-8' : ''}`}>{t.studio}</span>
                        </Link>
                        <p className="mt-2 text-silver hidden md:block">{time}</p>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <p className="text-white/50 mb-2">{t.nav}</p>
                        <Link to={`/${language.toLowerCase()}/shop`} className={`block hover:text-silver transition-colors ${location.pathname.includes('/shop') ? 'text-silver' : ''}`}>{t.shop}</Link>
                        <Link to={`/${language.toLowerCase()}/about`} className={`block hover:text-silver transition-colors ${location.pathname.includes('/about') ? 'text-silver' : ''}`}>{t.about}</Link>
                        <Link to={`/${language.toLowerCase()}/custom-orders`} className={`block hover:text-silver transition-colors ${location.pathname.includes('/custom-orders') ? 'text-silver' : ''}`}>{t.customOrders}</Link>
                        <Link to={`/${language.toLowerCase()}/testimonials`} className={`block hover:text-silver transition-colors ${location.pathname.includes('/testimonials') ? 'text-silver' : ''}`}>{t.testimonials}</Link>
                        <Link to={`/${language.toLowerCase()}/contact`} className={`block hover:text-silver transition-colors ${location.pathname.includes('/contact') ? 'text-silver' : ''}`}>{t.contact}</Link>
                    </div>

                    {/* Desktop Socials */}
                    <div className="hidden md:block text-end md:text-start">
                        <p className="text-white/50 mb-2">{t.socials}</p>
                        <a href="https://www.instagram.com/argena.streetwear/" target="_blank" rel="noopener noreferrer" className="block hover:text-silver transition-colors">{t.instagram}</a>
                    </div>

                    {/* Utilities */}
                    <div className="flex justify-end items-center md:items-start gap-4 md:gap-6 ml-auto">
                        <button
                            onClick={toggleLanguage}
                            className="hidden md:flex items-center gap-2 hover:text-silver transition-colors"
                        >
                            <Globe size={14} />
                            <span>{language} / {language === 'EN' ? 'AR' : 'EN'}</span>
                        </button>
                        <button onClick={openCart} className="relative flex items-center gap-2 hover:text-silver transition-colors">
                            <span className="hidden md:inline">{t.cart} ({count})</span>
                            <ShoppingBag size={18} className="md:w-[14px] md:h-[14px]" />
                            {count > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white text-black text-[9px] font-bold rounded-full flex items-center justify-center font-mono md:hidden">
                                    {count}
                                </span>
                            )}
                        </button>

                        {/* Mobile Hamburger — only visible on mobile */}
                        <button
                            className="md:hidden flex items-center justify-center hover:text-silver transition-colors ml-2"
                            onClick={() => setIsMobileMenuOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Portal to body — guaranteed to have no inherited blend modes */}
            {typeof document !== 'undefined' && createPortal(mobileMenuPortal, document.body)}
        </>
    );
};

export default Header;
