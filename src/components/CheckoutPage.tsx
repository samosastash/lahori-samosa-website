import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CreditCard, MapPin, Phone, User, Mail, Shield, CheckCircle } from 'lucide-react';
import { useCart } from './CartContext';
import { supabase } from '../utils/supabase/client';
import { OTPService } from '../utils/otpService';
import { EmailConfig, EMAIL_API_URL } from '../utils/emailConfig';

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
  
  // OTP verification states
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');
  const [otpError, setOtpError] = useState('');
  
  // Remove payment method state - will be handled in PaymentMethodPage

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
    
    // Reset OTP states when email changes
    if (e.target.name === 'email') {
      setOtpSent(false);
      setOtpVerified(false);
      setOtpCode('');
      setOtpMessage('');
      setOtpError('');
    }
  };

  // Send OTP to customer email
  const handleSendOTP = async () => {
    if (!customerInfo.email) {
      setOtpError('Please enter your email address first');
      return;
    }

    if (!customerInfo.name) {
      setOtpError('Please enter your name first');
      return;
    }

    setOtpLoading(true);
    setOtpError('');
    setOtpMessage('');

    try {
      const result = await OTPService.sendOTP(customerInfo.email, customerInfo.name);
      
      if (result.success) {
        setOtpSent(true);
        setOtpMessage(result.message);
      } else {
        setOtpError(result.message);
      }
    } catch (error) {
      setOtpError('Failed to send verification code. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify OTP - Manual verification only
  const handleVerifyOTP = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setOtpError('Please enter the complete 6-digit verification code');
      return;
    }

    setOtpLoading(true);
    setOtpError('');
    setOtpMessage('');

    try {
      const result = OTPService.verifyOTP(customerInfo.email, otpCode);
      
      if (result.success) {
        setOtpVerified(true);
        setOtpMessage(result.message);
        setOtpError('');
        setOtpCode(''); // Clear the code after successful verification
      } else {
        setOtpError(result.message);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setOtpError('Failed to verify code. Please try again.');
    } finally {
      setOtpLoading(false);
    }
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
        const { data, error } = await supabase
          .from('orders')
          .select('id')
          .limit(1);
        
        if (error) {
          console.error('Supabase connection test failed:', error);
        } else {
        }
      } catch (err) {
        console.error('Supabase connection error:', err);
      }
    };
    
    testConnection();
  }, []);

  // Handle proceed to payment method page
  const handleProceedToCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if email is verified
    if (!otpVerified) {
      alert('Please verify your email address before proceeding.');
      return;
    }
    
    // Validate required fields
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert('Please fill in all required fields.');
      return;
    }

    // Store customer info in localStorage for PaymentMethodPage
    localStorage.setItem('checkoutData', JSON.stringify({
      customerInfo,
      items: state.items,
      total: state.total + 100
    }));

    // Navigate to payment method selection page
    navigate('/payment-method');
  };

  // Send order emails using EmailJS (both to business and customer)
  const sendOrderEmail = async (orderId: string, orderData: any) => {
    try {
      const items = orderData.items.map((item: any) => 
        `• ${item.name} x${item.quantity} - Rs.${item.price * item.quantity}`
      ).join('\n');

      // Send email to business (you) using original EmailJS account
      const businessEmailResponse = await fetch(EMAIL_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: EmailConfig.business.serviceId,
          template_id: EmailConfig.business.templates.businessOrder,
          user_id: EmailConfig.business.userId,
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

      // Send email to customer (if they provided email) using original EmailJS account
      let customerEmailResponse = null;
      if (orderData.customerInfo.email) {
        customerEmailResponse = await fetch(EMAIL_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            service_id: EmailConfig.business.serviceId,
            template_id: EmailConfig.business.templates.customerConfirmation,
            user_id: EmailConfig.business.userId,
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
      } else {
        if (businessEmailResponse) {
          const errorText = await businessEmailResponse.text();
        }
      }

      if (customerEmailResponse?.ok) {
      } else if (orderData.customerInfo.email) {
        if (customerEmailResponse) {
          const errorText = await customerEmailResponse.text();
        }
      }
    } catch (error) {
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
              
              <form onSubmit={handleProceedToCheckout} className="space-y-4">
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
                    <div className="flex gap-3">
                      <input
                        type="email"
                        name="email"
                        required
                        value={customerInfo.email}
                        onChange={handleInputChange}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="your@email.com"
                        disabled={otpVerified}
                      />
                      {!otpVerified && (
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleSendOTP}
                          disabled={otpLoading || !customerInfo.email || !customerInfo.name}
                          className="px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          {otpLoading ? 'Sending...' : otpSent ? 'Resend OTP' : 'Send OTP'}
                        </motion.button>
                      )}
                      {otpVerified && (
                        <div className="flex items-center px-4 py-3 bg-green-100 text-green-700 rounded-lg">
                          <CheckCircle className="w-5 h-5 mr-2" />
                          <span className="text-sm font-medium">Verified</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* OTP Verification Section */}
                  {otpSent && !otpVerified && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                    >
                      <div className="flex items-start">
                        <Shield className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-blue-800 mb-2">Email Verification</h3>
                          <p className="text-xs text-blue-700 mb-3">
                            We've sent a 6-digit verification code to your email. Please enter it below.
                          </p>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-blue-700 mb-1">
                                Enter Verification Code
                              </label>
                              <input
                                type="text"
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-xl font-mono tracking-widest"
                                placeholder="000000"
                                maxLength={6}
                                disabled={otpLoading}
                              />
                            </div>
                            
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handleVerifyOTP}
                              disabled={otpLoading || otpCode.length !== 6}
                              className={`w-full px-6 py-4 rounded-lg font-bold text-lg transition-all duration-200 ${
                                otpLoading || otpCode.length !== 6
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-2 border-gray-200'
                                  : 'bg-emerald-600 text-white hover:bg-emerald-700 border-2 border-emerald-600 shadow-lg hover:shadow-xl'
                              }`}
                            >
                              {otpLoading ? (
                                <div className="flex items-center justify-center">
                                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400 mr-3"></div>
                                  Verifying Code...
                                </div>
                              ) : (
                                <div className="flex items-center justify-center">
                                  <span>🔐 Verify Code</span>
                                </div>
                              )}
                            </motion.button>
                            
                            <div className="text-center">
                              <p className="text-sm text-blue-700 font-medium">
                                {otpCode.length < 6 
                                  ? `Enter ${6 - otpCode.length} more digit${6 - otpCode.length !== 1 ? 's' : ''} to enable verification`
                                  : 'Ready to verify! Click the button above.'
                                }
                              </p>
                              {otpCode.length === 6 && (
                                <p className="text-xs text-emerald-600 mt-1">
                                  ✅ Code complete - button is now active
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* OTP Messages */}
                  {otpMessage && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center p-3 bg-green-100 border border-green-200 rounded-lg"
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-sm text-green-700">{otpMessage}</span>
                    </motion.div>
                  )}

                  {otpError && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center p-3 bg-red-100 border border-red-200 rounded-lg"
                    >
                      <Mail className="w-5 h-5 text-red-600 mr-2" />
                      <span className="text-sm text-red-700">{otpError}</span>
                    </motion.div>
                  )}

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

            {/* Email Verification Warning */}
            {!otpVerified && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Shield className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800 mb-1">Email Verification Required</h3>
                    <p className="text-xs text-yellow-700">
                      Please verify your email address before placing your order to ensure you receive confirmation details.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Proceed to Checkout Button */}
            <motion.button
              whileHover={{ scale: otpVerified ? 1.02 : 1 }}
              whileTap={{ scale: otpVerified ? 0.98 : 1 }}
              onClick={handleProceedToCheckout}
              disabled={loading || !otpVerified}
              className={`w-full px-6 py-4 rounded-lg transition-colors shadow-lg text-lg disabled:cursor-not-allowed ${
                otpVerified 
                  ? 'bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? 'Processing...' : otpVerified ? 'Proceed to Checkout' : 'Verify Email to Continue'}
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