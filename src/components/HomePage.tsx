import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Leaf, Clock, Award, ArrowRight, Star, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { ResponsiveImage } from './ResponsiveImage';
import { JazzCashService } from '../utils/jazzcashService';
import { useEffect, useState } from 'react';
import { testConsoleNinja } from '../utils/consoleTest';

export function HomePage() {
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<{
    isValid: boolean;
    isSuccess: boolean;
    message: string;
    orderId?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Test Console Ninja extension
  useEffect(() => {
    testConsoleNinja();
  }, []);

  // Handle payment confirmation
  useEffect(() => {
    const paymentParam = searchParams.get('payment');
    if (paymentParam === 'confirmation') {
      setIsLoading(true);
      
      try {
        // Extract JazzCash response parameters
        const responseData: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          responseData[key] = value;
        });

        // DEBUG: Log all parameters JazzCash sent
        console.log('🔍 ALL JAZZCASH PARAMETERS RECEIVED:');
        console.log('URL:', window.location.href);
        console.log('Parameters:', responseData);
        console.log('Parameter count:', Object.keys(responseData).length);
        
        // Log each parameter individually
        Object.entries(responseData).forEach(([key, value]) => {
          console.log(`${key}: ${value}`);
        });

        // Verify payment response
        const verification = JazzCashService.verifyPaymentResponse(responseData);
        console.log('🔍 VERIFICATION RESULT:', verification);
        setPaymentStatus(verification);
      } catch (error) {
        console.error('Payment confirmation error:', error);
        setPaymentStatus({
          isValid: false,
          isSuccess: false,
          message: 'Payment verification failed. Please contact support.'
        });
      } finally {
        setIsLoading(false);
      }
    }
  }, [searchParams]);
  const heroImage = "/images/hero/heropagesamosa.jpg";
  const samosaImage = "/images/hero/CHICKKE~2.jpg";
  const spicesImage = "https://images.unsplash.com/photo-1733046894155-1eed0e133b51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwc3BpY2VzJTIwbWluaW1hbGlzdCUyMHBob3RvZ3JhcGh5fGVufDF8fHx8MTc1OTA1Mjc4N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

  const features = [
    {
      icon: Leaf,
      title: "Premium Quality",
      description: "Handcrafted with the finest ingredients, sourced directly from trusted suppliers across Pakistan."
    },
    {
      icon: Clock,
      title: "Instant Convenience",
      description: "Restaurant-quality frozen foods ready in minutes, perfect for today's busy lifestyle."
    },
    {
      icon: Award,
      title: "Authentic Taste",
      description: "Traditional recipes passed down through generations, now preserved in modern convenience."
    }
  ];

  // Show payment confirmation if payment parameter is present
  if (searchParams.get('payment') === 'confirmation') {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center"
        >
          <div className="mb-6 flex justify-center">
            {isLoading ? (
              <Loader2 className="w-24 h-24 text-blue-500 animate-spin" />
            ) : paymentStatus?.isSuccess ? (
              <CheckCircle className="w-24 h-24 text-green-500" />
            ) : (
              <XCircle className="w-24 h-24 text-red-500" />
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {isLoading ? 'Processing Payment...' : paymentStatus?.isSuccess ? 'Payment Successful!' : 'Payment Failed'}
          </h1>
          
          <p className="text-gray-600 mb-6">
            {isLoading ? 'Please wait while we verify your payment...' : paymentStatus?.message}
          </p>

          {paymentStatus?.orderId && (
            <p className="text-sm text-gray-500 mb-6">
              Order Reference: <span className="font-mono font-semibold text-gray-700">{paymentStatus.orderId}</span>
            </p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = '/'}
            className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-md"
          >
            Continue Shopping
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-0 bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-50 to-gray-50">
        {/* 3D Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-full blur-3xl opacity-40 animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-amber-50 to-orange-100 rounded-full blur-3xl opacity-40 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h1 className="text-6xl lg:text-7xl text-slate-900 brand-font tracking-tight">
                Lahori
                <span className="text-emerald-800 italic block">Samosa</span>
              </h1>
              
              <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
                Authentic Pakistani cuisine, expertly crafted and perfectly preserved. 
                Experience traditional flavors with modern convenience.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/products">
                <motion.button
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 25px 50px -12px rgba(6, 78, 59, 0.25)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-8 py-4 bg-emerald-800 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-2xl relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span className="font-medium">Explore Products</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-emerald-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.button>
              </Link>
              
              <Link to="/contact">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-emerald-200 hover:bg-emerald-50 transition-all duration-300"
                >
                  Get in Touch
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex space-x-8 pt-8"
            >
              <div className="text-center">
                <div className="text-3xl text-emerald-800 brand-font">7+</div>
                <div className="text-sm text-slate-500">Premium Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-emerald-800 brand-font">100%</div>
                <div className="text-sm text-slate-500">Fresh Guarantee</div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-emerald-800 brand-font">24/7</div>
                <div className="text-sm text-slate-500">Quick Service</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative group">
              <motion.div
                whileHover={{ scale: 1.02, rotateY: 5 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 bg-white rounded-2xl shadow-2xl overflow-hidden"
                style={{
                  boxShadow: "0 25px 60px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.5)"
                }}
              >
                <ResponsiveImage
                  src={heroImage}
                  alt="Premium Pakistani Food"
                  className="w-full h-96"
                  aspectRatio="16/9"
                  objectFit="cover"
                  priority={true}
                />
              </motion.div>
              
              {/* 3D Shadow */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-200/20 to-amber-200/20 rounded-2xl blur-xl translate-x-6 translate-y-6 -z-10"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-emerald-200 to-transparent"></div>
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-amber-200 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="text-4xl text-slate-900 brand-font">
              Why Choose Lahori Samosa?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Every product reflects our commitment to quality, tradition, and convenience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ 
                  y: -8,
                  scale: 1.02,
                  rotateX: 5
                }}
                className="group p-8 bg-white rounded-xl hover:shadow-2xl transition-all duration-300 border border-slate-100"
                style={{
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center mb-6 group-hover:shadow-lg transition-all duration-300"
                >
                  <feature.icon className="w-8 h-8 text-emerald-700" />
                </motion.div>
                
                <h3 className="text-xl text-slate-900 mb-4 group-hover:text-emerald-800 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Product Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-gray-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-100/40 to-transparent rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <motion.div
                whileHover={{ scale: 1.05, rotateY: -5 }}
                transition={{ duration: 0.3 }}
                className="relative group"
              >
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden relative z-10">
                  <ResponsiveImage
                    src={samosaImage}
                    alt="Premium Samosas"
                    className="w-full h-96"
                    aspectRatio="4/3"
                    objectFit="cover"
                  />
                </div>
                {/* 3D Shadow */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-200/30 to-emerald-200/30 rounded-2xl blur-xl translate-x-8 translate-y-8 -z-10"></div>
              </motion.div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-slate-500">Bestseller</span>
                </div>
                
                <h3 className="text-4xl text-slate-900 brand-font">
                  Signature Samosas
                </h3>
                
                <p className="text-xl text-slate-600 leading-relaxed">
                  Our most popular item - crispy, golden samosas filled with perfectly 
                  spiced ingredients. Each bite delivers authentic Pakistani flavors 
                  that transport you to the streets of Lahore.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-slate-600">Hand-crafted with traditional recipes</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-slate-600">Premium ingredients, no preservatives</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-slate-600">Ready to cook in minutes</span>
                </div>
              </div>

              <Link to="/products">
                <motion.button
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 20px 40px -12px rgba(6, 78, 59, 0.3)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-8 py-4 bg-emerald-800 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span className="flex items-center space-x-2">
                    <span>View All Products</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-amber-50/50"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="text-4xl text-slate-900 brand-font">
              Ready to Experience Authentic Flavors?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust Lahori Samosa 
              for their authentic Pakistani cuisine needs.
            </p>
          </motion.div>
          
          <Link to="/products">
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 25px 50px -12px rgba(6, 78, 59, 0.25)"
              }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-6 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white rounded-lg transition-all duration-300 shadow-xl hover:shadow-2xl text-lg"
            >
              Start Shopping Now
            </motion.button>
          </Link>
        </div>
      </section>
    </div>
  );
}