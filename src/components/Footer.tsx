import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Facebook, Instagram, MessageCircle, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: MessageCircle, href: 'https://wa.me/923244060113', label: 'WhatsApp' },
  ];

  return (
    <footer className="bg-white border-t border-slate-200 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 lg:col-span-2"
          >
            <div className="space-y-4">
              <div className="text-2xl text-slate-900 brand-font tracking-tight">
                Lahori<span className="text-emerald-800 italic"> Samosa</span>
              </div>
              <p className="text-slate-600 max-w-md leading-relaxed">
                Discover our premium range of frozen foods crafted with authentic Pakistani flavors. 
                From classic samosas to innovative rolls, we bring traditional taste with modern convenience.
              </p>
            </div>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ 
                    scale: 1.1, 
                    y: -2,
                    boxShadow: "0 8px 25px -8px rgba(6, 78, 59, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-slate-100 hover:bg-emerald-100 rounded-lg flex items-center justify-center text-slate-600 hover:text-emerald-700 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <h3 className="text-lg text-slate-900 font-medium">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-slate-600 hover:text-emerald-700 transition-colors text-sm group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform inline-block">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-lg text-slate-900 font-medium">Get In Touch</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm text-slate-600">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-emerald-700" />
                </div>
                <span>+92 324 4060113</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-slate-600">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-emerald-700" />
                </div>
                <span>samosastash@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-slate-600">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                </div>
                <span>Lahore, Pakistan</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="border-t border-slate-200 mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-slate-500">
              © 2023 Lahori Samosa. All rights reserved.
            </p>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <div className="flex space-x-6 text-sm text-slate-500">
                <Link to="/privacy-policy" className="hover:text-slate-700 transition-colors">Privacy Policy</Link>
                <Link to="/terms-of-service" className="hover:text-slate-700 transition-colors">Terms of Service</Link>
                <Link to="/shipping-info" className="hover:text-slate-700 transition-colors">Shipping Info</Link>
              </div>
              <p className="text-xs text-slate-400">
                Made by <span className="font-medium text-slate-600">TheMirMeister</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}