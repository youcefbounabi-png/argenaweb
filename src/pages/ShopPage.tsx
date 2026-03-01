import React from 'react';
import ProductGrid from '../components/sections/ProductGrid';

interface ShopPageProps {
    onAddToCart?: (product: any) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ onAddToCart }) => {
    return (
        <div className="pt-32 min-h-screen">
            <div className="px-6 md:px-12 max-w-[1600px] mx-auto mb-12">
                <p className="font-mono text-[10px] text-silver tracking-[0.4em] uppercase">Collections // All Items</p>
            </div>
            <ProductGrid onAddToCart={onAddToCart} />
        </div>
    );
};

export default ShopPage;
