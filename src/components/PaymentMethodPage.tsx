import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CreditCard, Smartphone, Wallet, Banknote, ArrowLeft, CheckCircle } from 'lucide-react';
import { JazzCashPayment } from './JazzCashPayment';
import { supabase } from '../utils/supabase/client';
import { EmailConfig, EMAIL_API_URL } from '../utils/emailConfig';

interface CheckoutData {
  customerInfo: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
}

export function PaymentMethodPage() {
  const navigate = useNavigate();
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Payment methods configuration
  const paymentMethods = [
    {
      id: 'jazzcash',
      name: 'Online Payment',
      icon: <CreditCard className="w-8 h-8 text-blue-600" />,
      description: 'Pay securely with JazzCash wallet, mobile banking, or cards',
      available: true
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: <Banknote className="w-8 h-8 text-green-600" />,
      description: 'Pay when your order is delivered',
      available: true
    }
  ];

  useEffect(() => {
    // Get checkout data from localStorage
    const storedData = localStorage.getItem('checkoutData');
    if (storedData) {
      setCheckoutData(JSON.parse(storedData));
    } else {
      // Redirect back to checkout if no data
      navigate('/checkout');
    }
  }, [navigate]);

  const handlePaymentSelection = (paymentId: string) => {
    const method = paymentMethods.find(m => m.id === paymentId);
    if (method?.available) {
      setSelectedPayment(paymentId);
      setPaymentError('');
    }
  };

  const handleJazzCashPayment = async () => {
    if (!checkoutData) return;

    try {
      // Generate order ID
      const orderId = `LAHORI-${Date.now().toString(36).toUpperCase()}`;
      
      const orderData = {
        id: orderId,
        order_details: {
          items: checkoutData.items,
          total: checkoutData.total,
          payment_method: 'JazzCash'
        },
        customer_name: checkoutData.customerInfo.name,
        customer_phone: checkoutData.customerInfo.phone,
        total_price: checkoutData.total
      };


      // Insert order into Supabase database with pending status
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      
      // The JazzCash component will handle the payment flow
      // Order will be updated via IPN when payment is completed
      
    } catch (error) {
      console.error('JazzCash order creation error:', error);
      setPaymentError(`Failed to create order: ${error.message}`);
    }
  };

  const handleCashOnDelivery = async () => {
    if (!checkoutData) return;
    
    setLoading(true);

    try {
      // Generate order ID
      const orderId = `LAHORI-${Date.now().toString(36).toUpperCase()}`;
      
      const orderData = {
        id: orderId,
        order_details: {
          items: checkoutData.items,
          total: checkoutData.total,
          payment_method: 'Cash on Delivery'
        },
        customer_name: checkoutData.customerInfo.name,
        customer_phone: checkoutData.customerInfo.phone,
        total_price: checkoutData.total
      };


      // Insert order into Supabase database
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', error);
        throw new Error(`Database error: ${error.message}`);
      }


      // Send email notification
      await sendOrderEmail(orderId, {
        items: checkoutData.items,
        total: checkoutData.total,
        customerInfo: checkoutData.customerInfo,
        paymentMethod: 'Cash on Delivery'
      });
      
      // Clear checkout data
      localStorage.removeItem('checkoutData');
      
      // Navigate to confirmation page
      navigate(`/confirmation/${orderId}`);
      
    } catch (error) {
      console.error('Order submission error:', error);
      setPaymentError(`Failed to place order: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Send order emails using EmailJS
  const sendOrderEmail = async (orderId: string, orderData: any) => {
    try {
      const items = orderData.items.map((item: any) => 
        `• ${item.name} x${item.quantity} - Rs.${item.price * item.quantity}`
      ).join('\n');

      // Send email to business
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

      // Send email to customer
      if (orderData.customerInfo.email) {
        const customerEmailResponse = await fetch(EMAIL_API_URL, {
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

    } catch (error) {
    }
  };

  if (!checkoutData) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate('/checkout')}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-3xl lg:text-4xl text-gray-900">Select Payment Method</h1>
          </div>
          <p className="text-gray-600">Choose your preferred payment method to complete your order</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl text-gray-900 mb-6">Available Payment Methods</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <motion.div
                    key={method.id}
                    whileHover={{ scale: method.available ? 1.02 : 1 }}
                    whileTap={{ scale: method.available ? 0.98 : 1 }}
                    onClick={() => handlePaymentSelection(method.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedPayment === method.id
                        ? 'border-orange-600 bg-orange-50'
                        : method.available
                        ? 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <div className="flex items-center mb-3">
                      <div className="mr-3">
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{method.name}</h3>
                        {!method.available && (
                          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">Coming Soon</span>
                        )}
                      </div>
                      {selectedPayment === method.id && (
                        <CheckCircle className="w-5 h-5 text-orange-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </motion.div>
                ))}
              </div>

              {/* Selected Payment Component */}
              {selectedPayment === 'jazzcash' && (
                <div className="mt-6">
                  <JazzCashPayment
                    orderData={{
                      items: checkoutData.items,
                      total: checkoutData.total,
                      customerInfo: checkoutData.customerInfo,
                      orderId: `LAHORI-${Date.now().toString(36).toUpperCase()}`
                    }}
                    onPaymentInitiated={handleJazzCashPayment}
                    onPaymentError={setPaymentError}
                  />
                </div>
              )}


              {/* Payment Error */}
              {paymentError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-5 h-5 text-red-600">⚠️</div>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Payment Error</h3>
                      <p className="text-sm text-red-700 mt-1">{paymentError}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>

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
                {checkoutData.items.map((item) => (
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
                  <span className="text-gray-900">Rs.{checkoutData.total - 100}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="text-gray-900">Rs.100</span>
                </div>
                <div className="flex justify-between text-lg pt-2 border-t">
                  <span className="text-gray-900">Total</span>
                  <span className="text-orange-600">Rs.{checkoutData.total}</span>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg text-gray-900 mb-4">Delivery Details</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {checkoutData.customerInfo.name}</p>
                <p><span className="font-medium">Phone:</span> {checkoutData.customerInfo.phone}</p>
                <p><span className="font-medium">Email:</span> {checkoutData.customerInfo.email}</p>
                <p><span className="font-medium">Address:</span> {checkoutData.customerInfo.address}</p>
              </div>
            </div>

            {/* Place Order Button */}
            {selectedPayment === 'cod' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCashOnDelivery}
                disabled={loading}
                className="w-full px-6 py-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Placing Order...' : 'Place Order (Cash on Delivery)'}
              </motion.button>
            )}

            {/* Payment Info */}
            {selectedPayment === 'jazzcash' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <CreditCard className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-800 mb-1">Online Payment</h3>
                    <p className="text-xs text-blue-700">
                      Click the "Pay Online" button above to complete your payment securely.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
