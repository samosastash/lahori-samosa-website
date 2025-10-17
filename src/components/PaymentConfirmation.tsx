import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { JazzCashService } from '../utils/jazzcashService';

export function PaymentConfirmation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState<{
    isValid: boolean;
    isSuccess: boolean;
    message: string;
    orderId?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handlePaymentConfirmation = () => {
      try {
        // Extract JazzCash response parameters
        const responseData: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          responseData[key] = value;
        });


        // Verify payment response
        const verification = JazzCashService.verifyPaymentResponse(responseData);
        setPaymentStatus(verification);
        

      } catch (error) {
        console.error('Payment confirmation error:', error);
        setPaymentStatus({
          isValid: false,
          isSuccess: false,
          message: 'Failed to process payment confirmation'
        });
      } finally {
        setIsLoading(false);
      }
    };

    handlePaymentConfirmation();
  }, [searchParams]);

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleViewOrder = () => {
    if (paymentStatus?.orderId) {
      navigate(`/confirmation/${paymentStatus.orderId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl text-gray-900 mb-2">Processing Payment</h2>
          <p className="text-gray-600">Please wait while we verify your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8 text-center"
        >
          {/* Payment Status Icon */}
          <div className="mb-6">
            {paymentStatus?.isSuccess ? (
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
            ) : paymentStatus?.isValid === false ? (
              <XCircle className="w-16 h-16 text-red-600 mx-auto" />
            ) : (
              <AlertCircle className="w-16 h-16 text-yellow-600 mx-auto" />
            )}
          </div>

          {/* Payment Status Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {paymentStatus?.isSuccess ? 'Payment Successful!' : 'Payment Failed'}
          </h1>

          <p className="text-lg text-gray-600 mb-6">
            {paymentStatus?.message || 'Unable to determine payment status'}
          </p>

          {/* Order ID */}
          {paymentStatus?.orderId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Order Reference</p>
              <p className="text-lg font-mono text-gray-900">{paymentStatus.orderId}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {paymentStatus?.isSuccess ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleViewOrder}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  View Order Details
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleContinueShopping}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Continue Shopping
                </motion.button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContinueShopping}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Try Again
              </motion.button>
            )}
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-sm text-gray-500">
            {paymentStatus?.isSuccess ? (
              <p>
                Thank you for your order! You will receive a confirmation email shortly.
                Our team will process your order and contact you for delivery details.
              </p>
            ) : (
              <p>
                If you believe this is an error, please contact our support team or try placing your order again.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
