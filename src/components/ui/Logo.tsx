import React from 'react';

interface LogoProps {
    className?: string;
    forceImageOnly?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "", forceImageOnly = false }) => (
    <div className={`flex items-center justify-center gap-6 ${className}`}>
        <img
            src="/pictures/logo0.webp"
            alt="Argana Logo"
            className="w-auto h-[1.2em] object-contain"
        />
        {!forceImageOnly && (
            <span className="font-[UnifrakturMaguntia] metallic-text whitespace-nowrap">
                Argana
            </span>
        )}
    </div>
);

export default Logo;
