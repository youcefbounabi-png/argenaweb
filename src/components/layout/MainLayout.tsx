import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { LiquidBackground } from '../3d/LiquidBackground';
import { AIAssistant } from '../AIAssistant';
import { CustomCursor } from '../ui/CustomCursor';
import { Preloader } from '../ui/Preloader';
import { CartDrawer } from '../ui/CartDrawer';
import { CheckoutModal } from '../ui/CheckoutModal';
import { useCart } from '../../contexts/CartContext';
import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
    children: React.ReactNode;
}

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const { isCheckoutOpen, closeCheckout, selectedProduct } = useCart();
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    // Initial load progress effect
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setIsLoading(false), 600); // Wait 0.6s at 100% before fading out
                    return 100;
                }
                // Slower progression (between 1.5 and 4 per tick = ~25 to 60 ticks = ~2.5 to 6 seconds)
                return p + (Math.random() * 2.5 + 1.5);
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const lenis = new Lenis({
            autoRaf: true,
        });

        return () => {
            lenis.destroy();
        };
    }, []);

    return (
        <div className="min-h-screen bg-bg text-fg selection:bg-fg selection:text-bg relative">
            <ScrollToTop />
            <LiquidBackground />
            <CustomCursor />
            <AIAssistant />

            <Preloader isLoading={isLoading} progress={progress} />

            <div className="crt-overlay" />
            <div className="noise-overlay" />

            {/* Ethereal Glow */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-white/5 rounded-full blur-[120px] pointer-events-none z-0" />

            <div className={isLoading ? 'invisible' : 'visible'}>
                <Header />
                <main className="relative z-10 transition-opacity duration-500">
                    {children}
                </main>
                <Footer />
            </div>

            {/* Top-level UI overlays */}
            <CartDrawer />
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={closeCheckout}
                product={selectedProduct}
            />
        </div>
    );
};

export default MainLayout;
