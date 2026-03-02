import ProductGrid from '../components/sections/ProductGrid';
import SEO from '../components/ui/SEO';

interface ShopPageProps {
    onAddToCart?: (product: any) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ onAddToCart }) => {
    return (
        <div className="pt-32 min-h-screen">
            <SEO
                title="Shop"
                description="Browse Argena Streetwear's collections. Elite headwear, vintage caps, and structured minimalist apparel."
            />
            <div className="px-6 md:px-12 max-w-[1600px] mx-auto mb-12">
                <p className="font-mono text-[10px] text-silver tracking-[0.4em] uppercase">Collections // All Items</p>
            </div>
            <ProductGrid onAddToCart={onAddToCart} />
        </div>
    );
};

export default ShopPage;
