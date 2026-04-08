import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { LiquidBackground } from '../3d/LiquidBackground';
import { AIAssistant } from '../AIAssistant';
import { CustomCursor } from '../ui/CustomCursor';
import Header from './Header';

interface MainLayoutProps {
    children: React.ReactNode;
}

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
    return null;
};

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    useEffect(() => {
        const lenis = new Lenis({ autoRaf: true });
        (window as any).lenis = lenis;
        return () => {
            lenis.destroy();
            delete (window as any).lenis;
        };
    }, []);

    return (
        <div className="min-h-screen bg-bg text-fg selection:bg-fg selection:text-bg relative">
            <ScrollToTop />
            <LiquidBackground />
            <CustomCursor />
            <AIAssistant />

            <div className="crt-overlay" />
            <div className="noise-overlay" />

            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-black/5 rounded-full blur-[120px] pointer-events-none z-0" />

            <div>
                <Header />
                <main className="relative z-10">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
