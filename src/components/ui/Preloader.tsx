import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PreloaderProps {
    isLoading: boolean;
    progress: number;
}

// Boot sequence log lines
const BOOT_LINES = [
    'INITIALIZING SYSTEM...',
    'LOADING ARCHIVE DATABASE...',
    'DECRYPTING MATERIAL CATALOG...',
    'CALIBRATING STUDIO PROTOCOL...',
    'ESTABLISHING SECURE CONNECTION...',
];

// Random character set for glitch effect
const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

function useGlitchText(target: string, active: boolean) {
    const [displayed, setDisplayed] = useState(target);

    useEffect(() => {
        if (!active) { setDisplayed(target); return; }

        let frame = 0;
        const totalFrames = 18;
        const interval = setInterval(() => {
            frame++;
            const revealed = Math.floor((frame / totalFrames) * target.length);
            setDisplayed(
                target
                    .split('')
                    .map((char, i) => {
                        if (char === ' ') return ' ';
                        if (i < revealed) return char;
                        return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
                    })
                    .join('')
            );
            if (frame >= totalFrames) clearInterval(interval);
        }, 55);

        return () => clearInterval(interval);
    }, [active, target]);

    return displayed;
}

export const Preloader = ({ isLoading, progress }: PreloaderProps) => {
    const [glitchActive, setGlitchActive] = useState(false);
    const [visibleLines, setVisibleLines] = useState(0);

    const glitchedTitle = useGlitchText('G ARGENA', glitchActive);

    useEffect(() => {
        if (!isLoading) return;
        const t = setTimeout(() => setGlitchActive(true), 150);
        return () => clearTimeout(t);
    }, [isLoading]);

    // Stagger boot lines appearing based on progress
    useEffect(() => {
        const idx = Math.floor((progress / 100) * BOOT_LINES.length);
        setVisibleLines(Math.min(idx, BOOT_LINES.length));
    }, [progress]);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-bg text-white overflow-hidden"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 0.9, ease: 'easeInOut' }}
                >
                    {/* Scanline overlay inside preloader */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background:
                                'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.12) 4px)',
                        }}
                    />

                    <div className="text-center w-full max-w-sm px-6 relative z-10">
                        {/* Glitch Logo */}
                        <motion.h1
                            className="text-6xl md:text-8xl font-[UnifrakturMaguntia] italic mb-2 metallic-text select-none"
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            style={{ letterSpacing: '0.04em' }}
                        >
                            {glitchedTitle}
                        </motion.h1>

                        <p className="font-mono text-[9px] tracking-[0.5em] text-silver/40 uppercase mb-10">
                            STUDIO SYSTEM v2.5
                        </p>

                        {/* Progress bar */}
                        <div className="w-full h-[1px] bg-silver/15 overflow-hidden mb-4 relative">
                            <motion.div
                                className="h-full bg-white relative"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.08 }}
                            >
                                {/* Leading glow dot */}
                                <span
                                    className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full"
                                    style={{ boxShadow: '0 0 6px 2px rgba(255,255,255,0.8)' }}
                                />
                            </motion.div>
                        </div>

                        {/* Percentage + boot line */}
                        <div className="flex justify-between items-center mb-8">
                            <p className="font-mono text-[9px] text-silver/50 tracking-[0.3em]">
                                {Math.round(progress)}%
                            </p>
                            <p className="font-mono text-[9px] text-silver/50 tracking-[0.15em] text-right truncate max-w-[70%]">
                                {BOOT_LINES[Math.max(visibleLines - 1, 0)]}
                            </p>
                        </div>

                        {/* Terminal log lines */}
                        <div className="text-left border border-silver/10 p-3 space-y-1 bg-black/30">
                            {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
                                <motion.p
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="font-mono text-[9px] tracking-widest text-silver/40 uppercase"
                                >
                                    <span className="text-white/20 mr-2">›</span>
                                    {line}
                                    {i === visibleLines - 1 && (
                                        <motion.span
                                            animate={{ opacity: [1, 0] }}
                                            transition={{ repeat: Infinity, duration: 0.7 }}
                                            className="ml-1 inline-block"
                                        >
                                            _
                                        </motion.span>
                                    )}
                                </motion.p>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
