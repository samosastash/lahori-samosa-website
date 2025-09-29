import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, Package, MessageCircle, Home, ShoppingBag } from 'lucide-react';
import { supabase } from '../utils/supabase/client';

interface Order {
  id: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  customer_info: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
  };
  payment_method: string;
  status: string;
  created_at: string;
}

export function ConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      try {
        // Fetch order from Supabase database
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (error) {
          console.error('Supabase error:', error);
          throw new Error('Failed to fetch order');
        }

        if (data) {
          setOrder(data);
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-gray-900 mb-4">Order not found</h2>
          <Link to="/" className="text-orange-600 hover:text-orange-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          
          {/* Confetti animation */}
          <div className="relative">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -10, opacity: 1 }}
                animate={{ 
                  y: [0, -50, 100],
                  x: [0, Math.random() * 200 - 100],
                  opacity: [1, 1, 0],
                  rotate: [0, 360]
                }}
                transition={{ 
                  duration: 2,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
                className="absolute top-0 left-1/2 w-2 h-2 bg-orange-400 rounded-full"
                style={{ 
                  backgroundColor: ['#f97316', '#22c55e', '#3b82f6', '#f59e0b'][i % 4]
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Thank You Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl text-gray-900 mb-4">
            Thank You for Your Order!
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Your order has been successfully placed and is being processed.
          </p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="flex items-center mb-6">
            <Package className="w-6 h-6 text-orange-600 mr-3" />
            <h2 className="text-2xl text-gray-900">Order Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Order Info */}
            <div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Order Number</label>
                  <p className="text-lg text-gray-900">{order.id}</p>
                </div>
                
                <div>
                  <label className="text-sm text-gray-500">Customer Name</label>
                  <p className="text-lg text-gray-900">{order.customer_info.name}</p>
                </div>
                
                <div>
                  <label className="text-sm text-gray-500">Phone Number</label>
                  <p className="text-lg text-gray-900">{order.customer_info.phone}</p>
                </div>
                
                <div>
                  <label className="text-sm text-gray-500">Email Address</label>
                  <p className="text-lg text-gray-900">{order.customer_info.email}</p>
                </div>
                
                <div>
                  <label className="text-sm text-gray-500">Delivery Address</label>
                  <p className="text-lg text-gray-900">{order.customer_info.address}, {order.customer_info.city}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-lg text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                      <span className="text-gray-900">{item.name}</span>
                      <span className="text-gray-500 ml-2">x{item.quantity}</span>
                    </div>
                    <span className="text-orange-600">Rs.{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3 border-t-2 border-gray-200">
                  <span className="text-lg text-gray-900">Total</span>
                  <span className="text-xl text-orange-600">Rs.{order.total}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* WhatsApp Confirmation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-start">
            <MessageCircle className="w-8 h-8 text-green-600 mt-1 mr-4" />
            <div>
              <h3 className="text-lg text-green-800 mb-2">WhatsApp Confirmation Sent!</h3>
              <p className="text-green-700 mb-3">
                Your order details and confirmation have been sent to our WhatsApp number: 
                <span className="font-semibold"> +92 324 4060113</span>
              </p>
              <p className="text-green-700 text-sm">
                Please check your messages. Our team will contact you shortly to confirm delivery details.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <h3 className="text-lg text-gray-900 mb-4">What's Next?</h3>
          <div className="space-y-3 text-gray-600">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-orange-600 rounded-full mr-3"></div>
              <span>Our team will contact you via WhatsApp within 30 minutes</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-orange-600 rounded-full mr-3"></div>
              <span>We'll confirm your delivery address and timing</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-orange-600 rounded-full mr-3"></div>
              <span>Your order will be prepared and delivered within 2-3 business days</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-orange-600 rounded-full mr-3"></div>
              <span>Payment will be collected upon delivery (Cash on Delivery)</span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-lg"
            >
              <Home className="w-5 h-5 mr-2" />
              Return to Home
            </motion.button>
          </Link>
          
          <Link to="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-6 py-3 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-600 hover:text-white transition-colors"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Continue Shopping
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}