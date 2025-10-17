// JazzCash Payment Service
// Handles payment requests and integration with JazzCash API

import crypto from 'crypto-js';

// JazzCash Configuration
export const JAZZCASH_CONFIG = {
  // Sandbox Credentials
  MERCHANT_ID: 'MC407733',
  PASSWORD: 'v58y3xx959',
  INTEGRITY_SALT: 'c78ust11gu',
  
  // URLs
  SANDBOX_URL: 'https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform',
  LIVE_URL: 'https://payments.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform',
  
  // Return URLs - Using your live domain
  RETURN_URL: 'https://www.lahorisamosa.shop/api/payment-return',
  IPN_URL: 'https://www.lahorisamosa.shop/api/jazzcash-ipn',
  
  // Other settings
  CURRENCY: 'PKR',
  LANGUAGE: 'EN',
  VERSION: '1.1',
  TXN_TYPE: 'MPAY'
};

export interface JazzCashPaymentData {
  amount: number;
  billReference: string;
  description: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
}

export interface JazzCashResponse {
  success: boolean;
  message: string;
  paymentUrl?: string;
  error?: string;
}

export class JazzCashService {
  /**
   * Generate secure hash for JazzCash API
   */
  private static generateHash(data: Record<string, string>): string {
    // For REQUEST hash, we only include the fields that should be in the initial request
    // Response fields (pp_ResponseCode, pp_ResponseMessage, etc.) should be empty for requests
    const pp_Amount = data.pp_Amount || '';
    const pp_BillReference = data.pp_BillReference || '';
    const pp_CNIC = data.pp_CNIC || '';
    const pp_ContactNumber = data.pp_ContactNumber || '';
    const pp_TxnCurrency = data.pp_TxnCurrency || '';
    const pp_Language = data.pp_Language || '';
    const pp_MerchantID = data.pp_MerchantID || '';
    const pp_MobileNumber = data.pp_MobileNumber || '';
    const pp_TxnDateTime = data.pp_TxnDateTime || '';
    const pp_TxnRefNo = data.pp_TxnRefNo || '';
    const pp_TxnType = data.pp_TxnType || '';
    const pp_Version = data.pp_Version || '';
    
    // For requests, response fields should be empty
    const pp_ResponseCode = '';
    const pp_ResponseMessage = '';
    const pp_RetreivalReferenceNumber = '';
    
    const hashString = `${JAZZCASH_CONFIG.INTEGRITY_SALT}&${pp_Amount}&${pp_BillReference}&${pp_CNIC}&${pp_ContactNumber}&${pp_TxnCurrency}&${pp_Language}&${pp_MerchantID}&${pp_MobileNumber}&${pp_ResponseCode}&${pp_ResponseMessage}&${pp_RetreivalReferenceNumber}&${pp_TxnDateTime}&${pp_TxnRefNo}&${pp_TxnType}&${pp_Version}`;
    
    console.log('Hash string:', hashString);
    console.log('Hash string length:', hashString.length);
    
    // Use HMAC-SHA256 with salt as key
    const hash = crypto.HmacSHA256(hashString, JAZZCASH_CONFIG.INTEGRITY_SALT).toString(crypto.enc.Hex).toUpperCase();
    console.log('Generated hash:', hash);
    return hash;
  }

  /**
   * Create payment request and redirect to JazzCash
   */
  static async initiatePayment(paymentData: JazzCashPaymentData): Promise<JazzCashResponse> {
    try {
      // Generate unique transaction reference
      const txnRefNo = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Prepare payment data - only include REQUEST fields
      const paymentRequest = {
        pp_Version: JAZZCASH_CONFIG.VERSION,
        pp_TxnType: JAZZCASH_CONFIG.TXN_TYPE,
        pp_MerchantID: JAZZCASH_CONFIG.MERCHANT_ID,
        pp_Password: JAZZCASH_CONFIG.PASSWORD,
        pp_TxnRefNo: txnRefNo,
        pp_Amount: Math.round(paymentData.amount * 100).toString(), // Convert to paisa and string
        pp_TxnCurrency: JAZZCASH_CONFIG.CURRENCY,
        pp_TxnDateTime: new Date().toISOString().replace(/[-:]/g, '').split('.')[0],
        pp_BillReference: paymentData.billReference,
        pp_Description: paymentData.description || 'Order from Lahori Samosa', // Ensure description is not empty
        pp_TxnExpiryDateTime: new Date(Date.now() + 30 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0], // 30 minutes
        pp_ReturnURL: JAZZCASH_CONFIG.RETURN_URL,
        pp_SecureHash: '', // Will be calculated
        pp_MobileNumber: paymentData.customerPhone.replace(/\D/g, ''), // Remove non-digits
        pp_CNIC: '', // Optional for food orders
        pp_ContactNumber: paymentData.customerPhone.replace(/\D/g, ''),
        pp_Language: JAZZCASH_CONFIG.LANGUAGE
        // Removed response fields - they should not be in the request
      };

      // Generate secure hash
      paymentRequest.pp_SecureHash = this.generateHash(paymentRequest);
      
      console.log('=== JAZZCASH PAYMENT REQUEST DEBUG ===');
      console.log('Generated hash:', paymentRequest.pp_SecureHash);
      console.log('Payment request:', JSON.stringify(paymentRequest, null, 2));
      console.log('Sandbox URL:', JAZZCASH_CONFIG.SANDBOX_URL);
      console.log('=== END DEBUG ===');

      // Create form and submit to JazzCash
      this.submitToJazzCash(paymentRequest);

      return {
        success: true,
        message: 'Redirecting to JazzCash payment...',
        paymentUrl: JAZZCASH_CONFIG.SANDBOX_URL
      };

    } catch (error) {
      console.error('JazzCash payment initiation error:', error);
      return {
        success: false,
        message: 'Failed to initiate payment',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Submit payment form to JazzCash
   */
  private static submitToJazzCash(paymentData: Record<string, string>): void {
    
    // Create form element
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = JAZZCASH_CONFIG.SANDBOX_URL;
    form.target = '_self';

    // Add all payment data as hidden inputs
    Object.entries(paymentData).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    // Add form to DOM and submit
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }

  /**
   * Verify payment response from JazzCash
   */
  static verifyPaymentResponse(responseData: Record<string, string>): {
    isValid: boolean;
    isSuccess: boolean;
    message: string;
    orderId?: string;
  } {
    try {
      // Check if response has required fields
      if (!responseData.pp_ResponseCode || !responseData.pp_SecureHash) {
        return {
          isValid: false,
          isSuccess: false,
          message: 'Invalid response from JazzCash'
        };
      }

      // Verify secure hash
      const calculatedHash = this.generateHash(responseData);
      if (calculatedHash !== responseData.pp_SecureHash) {
        return {
          isValid: false,
          isSuccess: false,
          message: 'Hash verification failed'
        };
      }

      // Check payment status
      const isSuccess = responseData.pp_ResponseCode === '000' || responseData.pp_ResponseCode === '00';
      
      return {
        isValid: true,
        isSuccess,
        message: responseData.pp_ResponseMessage || (isSuccess ? 'Payment successful' : 'Payment failed'),
        orderId: responseData.pp_BillReference
      };

    } catch (error) {
      console.error('Payment verification error:', error);
      return {
        isValid: false,
        isSuccess: false,
        message: 'Payment verification failed'
      };
    }
  }

  /**
   * Format amount for display
   */
  static formatAmount(amount: number): string {
    return `Rs.${amount.toLocaleString()}`;
  }

  /**
   * Validate payment data before submission
   */
  static validatePaymentData(data: JazzCashPaymentData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.amount || data.amount <= 0) {
      errors.push('Amount must be greater than 0');
    }

    if (!data.billReference || data.billReference.trim() === '') {
      errors.push('Order reference is required');
    }

    if (!data.customerName || data.customerName.trim() === '') {
      errors.push('Customer name is required');
    }

    if (!data.customerPhone || data.customerPhone.trim() === '') {
      errors.push('Customer phone is required');
    }

    // Validate phone number format (Pakistani mobile) - very lenient
    const cleanPhone = data.customerPhone.replace(/\D/g, '');
    if (data.customerPhone && cleanPhone.length < 10) {
      errors.push('Please enter a valid Pakistani mobile number');
    }

    if (!data.customerEmail || data.customerEmail.trim() === '') {
      errors.push('Customer email is required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.customerEmail && !emailRegex.test(data.customerEmail)) {
      errors.push('Please enter a valid email address');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
