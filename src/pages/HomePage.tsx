import React from 'react';
import Hero from '../components/sections/Hero';
import Marquee from '../components/sections/Marquee';
import FeaturedCollections from '../components/sections/FeaturedCollections';
import ProductGrid from '../components/sections/ProductGrid';
import SEO from '../components/ui/SEO';

interface HomePageProps {
    onAddToCart?: (product: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onAddToCart }) => {
    return (
        <>
            <SEO
                title="Home"
                description="Welcome to Argena Streetwear. Discover elite headwear and minimalist streetwear designed for the modern wardrobe."
            />
            <Hero />
            <Marquee />
            <FeaturedCollections />
            <ProductGrid onAddToCart={onAddToCart} />
        </>
    );
};

export default HomePage;
