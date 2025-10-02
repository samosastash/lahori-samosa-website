import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CreditCard, MapPin, Phone, User } from 'lucide-react';
import { useCart } from './CartContext';
import { supabase } from '../utils/supabase/client';

export function CheckoutPage() {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  // Redirect to cart if no items - use useEffect to avoid render-time navigation
  useEffect(() => {
    if (state.items.length === 0) {
      navigate('/cart');
    }
  }, [state.items.length, navigate]);

  // Test Supabase connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing Supabase connection...');
        const { data, error } = await supabase
          .from('orders')
          .select('id')
          .limit(1);
        
        if (error) {
          console.error('Supabase connection test failed:', error);
        } else {
          console.log('Supabase connection successful:', data);
        }
      } catch (err) {
        console.error('Supabase connection error:', err);
      }
    };
    
    testConnection();
  }, []);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate order ID
      const orderId = `LAHORI-${Date.now().toString(36).toUpperCase()}`;
      
      const orderData = {
        id: orderId,
        order_details: {
          items: state.items,
          total: state.total + 100,
          payment_method: 'Cash on Delivery'
        },
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        total_price: state.total + 100
      };

      console.log('Attempting to save order:', orderData);

      // Insert order into Supabase database
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        throw new Error(`Database error: ${error.message}`);
      }

      console.log('Order saved successfully:', data);

      // Send email notification using EmailJS from frontend
      await sendOrderEmail(orderId, {
        items: state.items,
        total: state.total + 100,
        customerInfo,
        paymentMethod: 'Cash on Delivery'
      });
      
      // Clear cart
      dispatch({ type: 'CLEAR_CART' });
      // Navigate to confirmation page
      navigate(`/confirmation/${orderId}`);
      
    } catch (error) {
      console.error('Order submission error:', error);
      console.error('Error type:', typeof error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      alert(`Failed to place order: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Send order emails using EmailJS (both to business and customer)
  const sendOrderEmail = async (orderId: string, orderData: any) => {
    try {
      const items = orderData.items.map((item: any) => 
        `• ${item.name} x${item.quantity} - Rs.${item.price * item.quantity}`
      ).join('\n');

      // Send email to business (you)
      const businessEmailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: 'service_huwxfin',
          template_id: 'template_5sle4gl', // Business order template
          user_id: 'aFnOBMy5siQAFBFJ1',
          template_params: {
            order_id: orderId,
            customer_name: orderData.customerInfo.name,
            customer_phone: orderData.customerInfo.phone,
            customer_address: orderData.customerInfo.address,
            order_items: items,
            total_amount: orderData.total
          }
        })
      });

      // Send email to customer (if they provided email)
      let customerEmailResponse = null;
      if (orderData.customerInfo.email) {
        customerEmailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            service_id: 'service_huwxfin',
            template_id: 'template_w6rt2f5',
            user_id: 'aFnOBMy5siQAFBFJ1',
            template_params: {
              order_id: orderId,
              customer_name: orderData.customerInfo.name,
              customer_phone: orderData.customerInfo.phone,
              customer_address: orderData.customerInfo.address,
              order_items: items,
              total_amount: orderData.total,
              customer_email: orderData.customerInfo.email,
              to_email: orderData.customerInfo.email
            }
          })
        });
      }

      if (businessEmailResponse?.ok) {
        console.log('✅ Business order email sent successfully');
      } else {
        console.log('❌ Failed to send business order email');
        console.log('Business email response status:', businessEmailResponse?.status);
        if (businessEmailResponse) {
          const errorText = await businessEmailResponse.text();
          console.log('Business email response:', errorText);
        }
      }

      if (customerEmailResponse?.ok) {
        console.log('✅ Customer confirmation email sent successfully');
      } else if (orderData.customerInfo.email) {
        console.log('❌ Failed to send customer confirmation email');
        console.log('Customer email response status:', customerEmailResponse?.status);
        console.log('Customer email:', orderData.customerInfo.email);
        if (customerEmailResponse) {
          const errorText = await customerEmailResponse.text();
          console.log('Customer email response:', errorText);
        }
      }
    } catch (error) {
      console.log('Error sending emails:', error);
    }
  };

  // Don't render the page if there are no items (will redirect via useEffect)
  if (state.items.length === 0) {
    return null;
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order details</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Customer Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl text-gray-900 mb-6 flex items-center">
                <User className="w-5 h-5 mr-2 text-orange-600" />
                Customer Information
              </h2>
              
              <form onSubmit={handleSubmitOrder} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={customerInfo.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="+92 XXX XXXXXXX"
                    />
                  </div>
                </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Email Address <span className="text-orange-500">*</span>
                      <span className="text-xs text-gray-500 ml-1">(for order confirmation)</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Delivery Address *
                  </label>
                  <textarea
                    name="address"
                    required
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your complete delivery address"
                  />
                </div>

              </form>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl text-gray-900 mb-6 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-orange-600" />
                Payment Method
              </h2>
              
              <div className="p-4 border-2 border-orange-600 rounded-lg bg-orange-50">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="cod"
                    name="payment"
                    checked
                    readOnly
                    className="w-4 h-4 text-orange-600"
                  />
                  <label htmlFor="cod" className="ml-3 text-gray-900">
                    Cash on Delivery
                  </label>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Pay when your order is delivered to your doorstep
                </p>
              </div>
            </div>

          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {state.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2">
                    <div>
                      <h3 className="text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-orange-600">Rs.{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">Rs.{state.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="text-gray-900">Rs.100</span>
                </div>
                <div className="flex justify-between text-lg pt-2 border-t">
                  <span className="text-gray-900">Total</span>
                  <span className="text-orange-600">Rs.{state.total + 100}</span>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmitOrder}
              disabled={loading}
              className="w-full px-6 py-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </motion.button>

            {/* Delivery Info */}
            <div className="bg-orange-50 rounded-xl p-4">
              <h3 className="text-sm text-orange-800 mb-2 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Delivery Information
              </h3>
              <ul className="text-xs text-orange-700 space-y-1">
                <li>• Standard delivery: 2-3 business days</li>
                <li>• Free delivery on orders over Rs.1000</li>
                <li>• We deliver within Lahore city limits</li>
                <li>• Email confirmation will be sent</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}