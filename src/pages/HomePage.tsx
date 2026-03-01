import React from 'react';
import Hero from '../components/sections/Hero';
import Marquee from '../components/sections/Marquee';
import FeaturedCollections from '../components/sections/FeaturedCollections';
import ProductGrid from '../components/sections/ProductGrid';

interface HomePageProps {
    onAddToCart?: (product: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onAddToCart }) => {
    return (
        <>
            <Hero />
            <Marquee />
            <FeaturedCollections />
            <ProductGrid onAddToCart={onAddToCart} />
        </>
    );
};

export default HomePage;
