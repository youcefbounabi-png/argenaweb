import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from './components/layout/MainLayout';
import Footer from './components/layout/Footer';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { HelmetProvider } from 'react-helmet-async';

const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const AvailableSoonPage = lazy(() => import('./pages/AvailableSoonPage'));
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const CustomOrdersPage = lazy(() => import('./pages/CustomOrdersPage'));

// Admin Pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

const PageLoader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg">
    <motion.div
      animate={{ opacity: [0.2, 1, 0.2], filter: ['blur(4px)', 'blur(0px)', 'blur(4px)'] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      className="font-mono text-xs text-silver tracking-[0.5em] uppercase"
    >
      Materializing...
    </motion.div>
  </div>
);

// Extract internal routes into a separate component so they can be nested under /:lang or /
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/available-soon" element={<AvailableSoonPage />} />
      <Route path="/testimonials" element={<TestimonialsPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/custom-orders" element={<CustomOrdersPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const AppInner = () => {
  const location = useLocation();

  return (
    <MainLayout>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }}
          exit={{ opacity: 0, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } }}
        >
          <Suspense fallback={<PageLoader />}>
            <Routes location={location}>
              {/* Optional language prefix routes */}
              <Route path="/:lang/*" element={<AppRoutes />} />
              {/* Fallback routes without prefix */}
              <Route path="/*" element={<AppRoutes />} />
            </Routes>
          </Suspense>
          <Footer />
        </motion.div>
      </AnimatePresence>
    </MainLayout>
  );
};

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <HelmetProvider>
          <Router>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Admin Area */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/*" element={<AdminDashboard />} />
                
                {/* Storefront Area */}
                <Route path="/*" element={<AppInner />} />
              </Routes>
            </Suspense>
          </Router>
        </HelmetProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
