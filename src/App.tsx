import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { ProductsPage } from './components/ProductsPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { ConfirmationPage } from './components/ConfirmationPage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { TermsOfServicePage } from './components/TermsOfServicePage';
import { ShippingInfoPage } from './components/ShippingInfoPage';
import { CartProvider } from './components/CartContext';
import { ScrollToTop } from './components/ScrollToTop';

export default function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-white flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/confirmation/:orderId" element={<ConfirmationPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage />} />
              <Route path="/shipping-info" element={<ShippingInfoPage />} />
              {/* Handle preview page and any other unmatched routes */}
              <Route path="/preview_page.html" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}