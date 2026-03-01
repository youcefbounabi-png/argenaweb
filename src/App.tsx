import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MainLayout from './components/layout/MainLayout';
import CheckoutModal from './components/ui/CheckoutModal';
import { CartDrawer } from './components/ui/CartDrawer';
import { LanguageProvider } from './contexts/LanguageContext';
import { CartProvider, useCart } from './contexts/CartContext';

const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const AvailableSoonPage = lazy(() => import('./pages/AvailableSoonPage'));
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const CustomOrdersPage = lazy(() => import('./pages/CustomOrdersPage'));

const PageLoader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg">
    <motion.div
      animate={{ opacity: [0.2, 1, 0.2], filter: ['blur(4px)', 'blur(0px)', 'blur(4px)'] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      className="font-mono text-xs text-silver tracking-[0.5em] uppercase"
    >
      Materializing...
    </motion.div>
  </div>
);

// Inner app has access to CartContext
const AppInner = () => {
  const { addItem, isOpen: _cartOpen } = useCart();

  // CheckoutModal is now driven by the cart
  // Kept for backward compat if needed in future
  return (
    <MainLayout>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage onAddToCart={addItem} />} />
          <Route path="/shop" element={<ShopPage onAddToCart={addItem} />} />
          <Route path="/available-soon" element={<AvailableSoonPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/custom-orders" element={<CustomOrdersPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </MainLayout>
  );
};

function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <Router>
          <AppInner />
        </Router>
      </CartProvider>
    </LanguageProvider>
  );
}

export default App;
