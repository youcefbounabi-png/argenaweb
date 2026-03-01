import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    type?: string;
    image?: string;
    url?: string;
}

export const SEO = ({
    title = "G ARGINIA | Dystopian Luxury Streetwear",
    description = "A fusion of tactical brutalism and liquid elegance. Avant-garde performance streetwear, engineered for the void.",
    keywords = "luxury streetwear, tactical clothing, techwear, dark aesthetic, avant-garde fashion",
    type = "website",
    image = "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=2670&auto=format&fit=crop", // Placeholder open-graph image
    url = "https://g-arginia.com"
}: SEOProps) => {
    return (
        <Helmet>
            {/* Standard metadata */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Structured Data (JSON-LD) for Google */}
            <script type="application/ld+json">
                {`
                {
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    "name": "G ARGINIA",
                    "url": "${url}",
                    "logo": "${image}",
                    "sameAs": [
                        "https://www.instagram.com/argena.streetwear/"
                    ],
                    "description": "${description}"
                }
                `}
            </script>
        </Helmet>
    );
};
