// JazzCash Payment Service
// Handles payment requests and integration with JazzCash API
// Note: Sensitive credentials (PASSWORD, INTEGRITY_SALT) are handled securely on the backend

// JazzCash Configuration (Non-sensitive data only)
export const JAZZCASH_CONFIG = {
  // Merchant ID (safe to expose to frontend)
  MERCHANT_ID: import.meta.env.VITE_JAZZCASH_MERCHANT_ID || 'MC407733',
  
  // URLs (safe to expose to frontend)
  SANDBOX_URL: import.meta.env.VITE_JAZZCASH_SANDBOX_URL || 'https://sandbox.jazzcash.com.pk/CustomerPortal/TransactionManagement/TransactionProcessing',
  LIVE_URL: import.meta.env.VITE_JAZZCASH_LIVE_URL || 'https://payments.jazzcash.com.pk/CustomerPortal/TransactionManagement/TransactionProcessing',
  
  // Return URLs - Using your live domain
  RETURN_URL: import.meta.env.VITE_JAZZCASH_RETURN_URL || 'https://www.lahorisamosa.shop/api/payment-return',
  IPN_URL: import.meta.env.VITE_JAZZCASH_IPN_URL || 'https://www.lahorisamosa.shop/api/jazzcash-ipn',
  
  // Other settings (safe to expose to frontend)
  CURRENCY: import.meta.env.VITE_JAZZCASH_CURRENCY || 'PKR',
  LANGUAGE: import.meta.env.VITE_JAZZCASH_LANGUAGE || 'EN',
  VERSION: import.meta.env.VITE_JAZZCASH_VERSION || '1.1',
  TXN_TYPE: import.meta.env.VITE_JAZZCASH_TXN_TYPE || 'MPAY'
};

export interface JazzCashPaymentData {
  amount: number;
  billReference: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    cnic?: string;
  };
}

export interface JazzCashResponse {
  success: boolean;
  paymentUrl?: string;
  txnRefNo?: string;
  error?: string;
}

export class JazzCashService {
  /**
   * Create payment request and redirect to JazzCash
   * This method calls the secure backend API to generate payment data
   */
  static async initiatePayment(paymentData: JazzCashPaymentData): Promise<JazzCashResponse> {
    try {
      console.log('🚀 Initiating JazzCash payment:', paymentData);

      // Call the secure backend API to generate payment request
      const response = await fetch('/api/generate-jazzcash-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate payment request');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Payment request generation failed');
      }

      console.log('✅ Payment request generated successfully:', result.txnRefNo);

      // Redirect to JazzCash payment page
      this.redirectToJazzCash(result.paymentData, result.paymentUrl);

      return {
        success: true,
        paymentUrl: result.paymentUrl,
        txnRefNo: result.txnRefNo
      };

    } catch (error) {
      console.error('❌ JazzCash payment initiation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment initiation failed'
      };
    }
  }

  /**
   * Redirect to JazzCash payment page
   */
  private static redirectToJazzCash(paymentData: any, paymentUrl: string): void {
    try {
      // Create a form to submit to JazzCash
    const form = document.createElement('form');
    form.method = 'POST';
      form.action = paymentUrl;
      form.target = '_self'; // Open in same window

      // Add all payment data as hidden fields
      Object.keys(paymentData).forEach(key => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
        input.value = paymentData[key];
      form.appendChild(input);
    });

      // Add form to document and submit
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

      console.log('🔄 Redirecting to JazzCash payment page...');
    } catch (error) {
      console.error('❌ Failed to redirect to JazzCash:', error);
      throw new Error('Failed to redirect to payment page');
    }
  }

  /**
   * Verify JazzCash response hash (for payment return page)
   * This method calls the backend API to verify the response
   */
  static async verifyPaymentResponse(responseData: any): Promise<{ isValid: boolean; isSuccess: boolean; message: string }> {
    try {
      console.log('🔍 Verifying JazzCash payment response:', responseData);

      // Call the backend API to verify the response
      const response = await fetch('/api/verify-jazzcash-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(responseData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to verify payment response');
      }

      const result = await response.json();
      
      console.log('✅ Payment response verification result:', result);
      
      return {
        isValid: result.isValid,
        isSuccess: result.isSuccess,
        message: result.message
      };

    } catch (error) {
      console.error('❌ JazzCash payment verification failed:', error);
      return {
        isValid: false,
        isSuccess: false,
        message: error instanceof Error ? error.message : 'Payment verification failed'
      };
    }
  }

  /**
   * Get payment status from JazzCash response
   */
  static getPaymentStatus(responseData: any): { isSuccess: boolean; message: string } {
    const responseCode = responseData.pp_ResponseCode;
    const responseMessage = responseData.pp_ResponseMessage || '';

    // JazzCash success response codes
    const successCodes = ['000', '121', '200'];
    const isSuccess = successCodes.includes(responseCode);

    let message = '';
    if (isSuccess) {
      message = 'Payment completed successfully!';
    } else {
      message = responseMessage || 'Payment failed. Please try again.';
    }

    return { isSuccess, message };
  }

  /**
   * Format amount for JazzCash (convert to paisa)
   */
  static formatAmount(amount: number): string {
    return Math.round(amount * 100).toString();
  }

  /**
   * Generate bill reference
   */
  static generateBillReference(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `LAHORI${timestamp}${random}`;
  }
}