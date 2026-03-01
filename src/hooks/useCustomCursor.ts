import { useState, useEffect } from 'react';

export const useCustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    let requestRef: number;
    let targetX = 0;
    let targetY = 0;
    const speed = 0.15;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      const target = e.target as HTMLElement;
      setIsHovering(
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button'
      );
    };

    const animate = () => {
      setPosition(prev => ({
        x: prev.x + (targetX - prev.x) * speed,
        y: prev.y + (targetY - prev.y) * speed
      }));
      requestRef = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    requestRef = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(requestRef);
    };
  }, []);

  return { position, isHovering, isSticky };
};
