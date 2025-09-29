import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from './CartContext';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { state } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const cartItemCount = state.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-slate-200/60' 
          : 'bg-white/80 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <span className="text-2xl text-slate-900 brand-font tracking-tight">
                Lahori<span className="text-emerald-800 italic"> Samosa</span>
              </span>
              {/* Subtle underline on hover */}
              <motion.div
                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-emerald-600 to-amber-500 rounded-full"
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  location.pathname === link.path 
                    ? 'text-emerald-800' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-full"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* CTA Button */}
            <Link to="/products" className="hidden lg:block">
              <motion.button
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 8px 25px -8px rgba(6, 78, 59, 0.3)"
                }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 bg-emerald-800 text-white rounded-lg text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Order Now
              </motion.button>
            </Link>

            {/* Cart Button */}
            <Link to="/cart">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 text-slate-600 hover:text-slate-900 transition-colors bg-slate-50 hover:bg-slate-100 rounded-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-lg"
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </motion.button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors bg-slate-50 hover:bg-slate-100 rounded-lg"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.nav
          initial={false}
          animate={{
            height: isMobileMenuOpen ? 'auto' : 0,
            opacity: isMobileMenuOpen ? 1 : 0,
          }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-2 border-t border-slate-200/60">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname === link.path 
                    ? 'text-emerald-800 bg-emerald-50 rounded-lg' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-left px-3 py-2 mt-4 bg-emerald-800 text-white rounded-lg text-sm font-medium"
            >
              Order Now
            </Link>
          </div>
        </motion.nav>
      </div>
    </motion.header>
  );
}