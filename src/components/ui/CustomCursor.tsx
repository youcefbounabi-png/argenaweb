import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { createPortal } from 'react-dom';
import { useCustomCursor } from '../../hooks/useCustomCursor';

// ─── Dust Particle Canvas ────────────────────────────────────────────────────

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    alpha: number;
    life: number;      // 0 → 1 (born → dead)
    decay: number;
}

const DustCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particles = useRef<Particle[]>([]);
    const rafRef = useRef<number>(0);
    const lastPos = useRef({ x: -999, y: -999 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const onMouseMove = (e: MouseEvent) => {
            const { clientX: x, clientY: y } = e;
            const dx = x - lastPos.current.x;
            const dy = y - lastPos.current.y;
            const speed = Math.sqrt(dx * dx + dy * dy);

            const count = Math.min(Math.floor(speed / 3) + 1, 6);
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const spread = Math.random() * 8;
                particles.current.push({
                    x: x + (Math.random() - 0.5) * 6,
                    y: y + (Math.random() - 0.5) * 6,
                    vx: Math.cos(angle) * spread * 0.3 - dx * 0.08,
                    vy: Math.sin(angle) * spread * 0.3 - dy * 0.08,
                    size: Math.random() * 2.5 + 0.5,
                    alpha: Math.random() * 0.6 + 0.3,
                    life: 0,
                    decay: Math.random() * 0.018 + 0.012,
                });
            }

            lastPos.current = { x, y };
        };

        window.addEventListener('mousemove', onMouseMove);

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.current = particles.current.filter(p => p.life < 1);

            for (const p of particles.current) {
                p.life += p.decay;
                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 0.97;
                p.vy *= 0.97;
                p.vy -= 0.04;

                const alpha = p.alpha * (1 - p.life);
                const radius = p.size * (1 - p.life * 0.5);

                ctx.save();
                ctx.globalAlpha = alpha;

                const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 2);
                grd.addColorStop(0, `rgba(255,255,255,${alpha})`);
                grd.addColorStop(1, 'rgba(255,255,255,0)');

                ctx.beginPath();
                ctx.arc(p.x, p.y, radius * 2, 0, Math.PI * 2);
                ctx.fillStyle = grd;
                ctx.fill();

                ctx.restore();
            }

            rafRef.current = requestAnimationFrame(draw);
        };

        rafRef.current = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 2000000,
            }}
        />
    );
};

// ─── Magnetic snap logic ──────────────────────────────────────────────────────

const MAGNETIC_SELECTORS = 'button, a, [data-magnetic]';
const MAGNETIC_RADIUS = 80;     // px — how close to snap
const MAGNETIC_STRENGTH = 0.32; // 0 = no pull, 1 = fully locks onto center

function getMagneticOffset(mouseX: number, mouseY: number) {
    const elements = document.querySelectorAll<HTMLElement>(MAGNETIC_SELECTORS);
    let closestDist = Infinity;
    let snapX = 0;
    let snapY = 0;
    let snapped = false;

    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(mouseX - cx, mouseY - cy);

        if (dist < MAGNETIC_RADIUS && dist < closestDist) {
            closestDist = dist;
            // Pull cursor proportionally toward the center of the element
            const pull = (1 - dist / MAGNETIC_RADIUS) * MAGNETIC_STRENGTH;
            snapX = (cx - mouseX) * pull;
            snapY = (cy - mouseY) * pull;
            snapped = true;
        }
    });

    return { snapX, snapY, snapped };
}

// ─── Combined Cursor ──────────────────────────────────────────────────────────

export const CustomCursor = () => {
    const { position, isHovering, isSticky } = useCustomCursor();
    const [isMobile, setIsMobile] = useState(false);
    const [magnetOffset, setMagnetOffset] = useState({ x: 0, y: 0 });
    const [isMagnetic, setIsMagnetic] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Compute magnetic offset whenever the cursor moves
    useEffect(() => {
        if (isMobile) return;
        const { snapX, snapY, snapped } = getMagneticOffset(position.x, position.y);
        setMagnetOffset({ x: snapX, y: snapY });
        setIsMagnetic(snapped);
    }, [position.x, position.y, isMobile]);

    if (isMobile) return null;

    const cursorContent = (
        <>
            {/* Dust particle trail — always follows raw mouse (no magnet) */}
            <DustCanvas />

            {/* Dot — follows magnetic position */}
            <motion.div
                className="custom-cursor-dot"
                style={{ zIndex: 2000000, pointerEvents: 'none' }}
                animate={{
                    x: position.x + magnetOffset.x - 4,
                    y: position.y + magnetOffset.y - 4,
                    scale: isSticky ? 0 : isMagnetic ? 1.4 : 1,
                }}
                transition={{ type: 'spring', stiffness: 600, damping: 35, mass: 0.5 }}
            />

            {/* Ring — follows magnetic position with slight lag */}
            <motion.div
                className="custom-cursor-ring"
                style={{ zIndex: 1999999, pointerEvents: 'none' }}
                animate={{
                    x: position.x + magnetOffset.x - 16,
                    y: position.y + magnetOffset.y - 16,
                    scale: isMagnetic ? 1.8 : isHovering ? 1.5 : isSticky ? 2 : 1,
                    rotate: isHovering || isMagnetic ? 135 : 45,
                    borderColor: isMagnetic
                        ? '#ffffff'
                        : isSticky
                            ? 'var(--color-silver)'
                            : isHovering
                                ? '#fff'
                                : 'rgba(255, 255, 255, 0.5)',
                    backgroundColor: isMagnetic
                        ? 'rgba(255,255,255,0.06)'
                        : isSticky
                            ? 'transparent'
                            : isHovering
                                ? 'rgba(255, 255, 255, 0.05)'
                                : 'transparent',
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 28, mass: 0.8 }}
            />
        </>
    );

    return typeof document !== 'undefined' ? createPortal(cursorContent, document.body) : null;
};
