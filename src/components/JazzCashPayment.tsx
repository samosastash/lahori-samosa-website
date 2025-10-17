import { useState } from 'react';
import { motion } from 'motion/react';
import { CreditCard, Loader2 } from 'lucide-react';
import { JazzCashService, JazzCashPaymentData } from '../utils/jazzcashService';

interface JazzCashPaymentProps {
  orderData: {
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
    }>;
    total: number;
    customerInfo: {
      name: string;
      phone: string;
      email: string;
      address: string;
    };
    orderId: string;
  };
  onPaymentInitiated: () => void;
  onPaymentError: (error: string) => void;
}

export function JazzCashPayment({ orderData, onPaymentInitiated, onPaymentError }: JazzCashPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleJazzCashPayment = async () => {
    setIsProcessing(true);
    try {
      // Prepare payment data
      const paymentData: JazzCashPaymentData = {
        amount: orderData.total,
        billReference: orderData.orderId,
        description: `Order from Lahori Samosa - ${orderData.items.length} item(s)`,
        customerName: orderData.customerInfo.name,
        customerEmail: orderData.customerInfo.email,
        customerPhone: orderData.customerInfo.phone,
        customerAddress: orderData.customerInfo.address
      };


      // Initiate payment
      const result = await JazzCashService.initiatePayment(paymentData);
      
      if (result.success) {
        onPaymentInitiated();
        // The page will redirect to JazzCash automatically
      } else {
        onPaymentError(result.message || 'Failed to initiate payment');
        setIsProcessing(false);
      }

    } catch (error) {
      console.error('JazzCash payment error:', error);
      onPaymentError('An unexpected error occurred. Please try again.');
      setIsProcessing(false);
    }
  };


  return (
    <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="text-lg font-medium text-blue-800 mb-4 flex items-center">
        <CreditCard className="w-5 h-5 mr-2" />
        Online Payment
      </h3>
      
      <div className="space-y-4">
        <div className="text-sm text-blue-700">
          <p>Pay securely with JazzCash wallet, mobile banking, or cards</p>
          <div className="mt-2 flex items-center text-xs text-blue-600">
            <span className="mr-4">• Instant payment confirmation</span>
            <span>• 24/7 customer support</span>
          </div>
        </div>

        {/* Payment Button */}
        <button
          onClick={handleJazzCashPayment}
          disabled={isProcessing}
          style={{
            width: '100%',
            padding: '16px 24px',
            backgroundColor: isProcessing ? '#9CA3AF' : '#2563EB',
            color: 'white',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            border: 'none',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!isProcessing) {
              e.currentTarget.style.backgroundColor = '#1D4ED8';
            }
          }}
          onMouseLeave={(e) => {
            if (!isProcessing) {
              e.currentTarget.style.backgroundColor = '#2563EB';
            }
          }}
        >
          {isProcessing ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Loader2 className="w-6 h-6 mr-3 animate-spin" />
              Processing Payment...
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard className="w-6 h-6 mr-3" />
              Pay Online - Rs.{orderData.total}
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
