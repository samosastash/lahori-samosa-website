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
   * Generate secure hash for JazzCash API requests
   */
  private static generateRequestHash(data: Record<string, string>): string {
    // JazzCash request parameters for hash generation
    const requestParams = [
      'pp_Amount', 'pp_BillReference', 'pp_CNIC', 'pp_ContactNumber', 'pp_Currency',
      'pp_Description', 'pp_Language', 'pp_MerchantID', 'pp_MobileNumber', 'pp_Password',
      'pp_ReturnURL', 'pp_TxnCurrency', 'pp_TxnDateTime', 'pp_TxnExpiryDateTime',
      'pp_TxnRefNo', 'pp_TxnType', 'pp_Version'
    ];
    
    return this.generateHash(data, requestParams, 'REQUEST');
  }

  /**
   * Generate secure hash for JazzCash API responses
   */
  private static generateResponseHash(data: Record<string, string>): string {
    // JazzCash response parameters for hash generation (in alphabetical order)
    // EXCLUDE pp_Password and pp_TxnExpiryDateTime as they are not used in response hash
    const responseParams = [
      'pp_Amount', 'pp_BillReference', 'pp_CNIC', 'pp_ContactNumber', 'pp_Currency',
      'pp_Description', 'pp_Language', 'pp_MerchantID', 'pp_MobileNumber',
      'pp_ResponseCode', 'pp_ResponseMessage', 'pp_RetreivalReferenceNumber', 'pp_ReturnURL', 
      'pp_TxnCurrency', 'pp_TxnDateTime', 'pp_TxnRefNo', 'pp_TxnType', 'pp_Version'
    ];
    
    return this.generateHash(data, responseParams, 'RESPONSE');
  }

  /**
   * Generate secure hash for JazzCash API (internal method)
   */
  private static generateHash(data: Record<string, string>, allowedParams: string[], type: string): string {
    // JazzCash official method: Sort all fields alphabetically, then concatenate
    const sortedData: Record<string, string> = {};
    
    console.log(`🔍 DEBUG: Allowed params for ${type}:`, allowedParams);
    console.log(`🔍 DEBUG: Available data keys:`, Object.keys(data));
    
    // Filter and sort only allowed parameters
    Object.keys(data)
      .filter(key => allowedParams.includes(key) && key !== 'pp_SecureHash')
      .sort()
      .forEach(key => {
        sortedData[key] = data[key] || '';
      });
    
    console.log(`🔍 DEBUG: Filtered and sorted data:`, sortedData);
    console.log(`🔍 DEBUG: Missing params:`, allowedParams.filter(param => !Object.keys(sortedData).includes(param)));
    
    // Create array of key-value pairs for debugging
    const keyValuePairs = Object.entries(sortedData).map(([key, value]) => `${key}=${value}`);
    
    // Concatenate sorted fields with '&' separator
    const concatenatedString = Object.values(sortedData).join('&');
    
    // Prepend the integrity salt
    const hashString = `${JAZZCASH_CONFIG.INTEGRITY_SALT}&${concatenatedString}`;
    
    console.log(`JazzCash ${type} params:`, sortedData);
    console.log(`Key-value pairs (${type}):`, keyValuePairs);
    console.log(`Concatenated string (${type}):`, concatenatedString);
    console.log(`Hash string (${type}):`, hashString);
    console.log(`Hash string length (${type}):`, hashString.length);
    
    // Use HMAC-SHA256 with salt as key
    const hash = crypto.HmacSHA256(hashString, JAZZCASH_CONFIG.INTEGRITY_SALT).toString(crypto.enc.Hex).toUpperCase();
    console.log(`Generated hash (${type}):`, hash);
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
        pp_Description: 'LAHORI SAMOSA INVOICE', // Simple description for JazzCash
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
      paymentRequest.pp_SecureHash = this.generateRequestHash(paymentRequest);
      
      console.log('=== JAZZCASH PAYMENT REQUEST DEBUG ===');
      console.log('Generated hash:', paymentRequest.pp_SecureHash);
      console.log('Payment request:', JSON.stringify(paymentRequest, null, 2));
      console.log('Sandbox URL:', JAZZCASH_CONFIG.SANDBOX_URL);
      console.log('Date format check:', {
        txnDateTime: paymentRequest.pp_TxnDateTime,
        expiryDateTime: paymentRequest.pp_TxnExpiryDateTime,
        description: paymentRequest.pp_Description
      });
      console.log('🚀 About to redirect to JazzCash...');
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

      // Create a copy of response data for hash verification
      const jazzcashResponseParams: Record<string, string> = {};
      
      // JazzCash response parameters that should be included in hash verification
      // EXCLUDE pp_Password and pp_TxnExpiryDateTime as they are not used in response hash
      const responseFields = [
        'pp_Amount', 'pp_BillReference', 'pp_CNIC', 'pp_ContactNumber', 'pp_Currency',
        'pp_Description', 'pp_Language', 'pp_MerchantID', 'pp_MobileNumber',
        'pp_ResponseCode', 'pp_ResponseMessage', 'pp_RetreivalReferenceNumber', 'pp_ReturnURL', 
        'pp_TxnCurrency', 'pp_TxnDateTime', 'pp_TxnRefNo', 'pp_TxnType', 'pp_Version'
      ];

      // Only include fields that exist in the response and are in our allowed list
      responseFields.forEach(field => {
        if (responseData[field] !== undefined && responseData[field] !== null) {
          jazzcashResponseParams[field] = responseData[field];
        }
      });

      console.log('Filtered JazzCash response params:', jazzcashResponseParams);

      // Verify secure hash using only JazzCash parameters
      const calculatedHash = this.generateResponseHash(jazzcashResponseParams);
      
      console.log('Hash verification details:', {
        calculated: calculatedHash,
        received: responseData.pp_SecureHash,
        match: calculatedHash === responseData.pp_SecureHash
      });
      
      if (calculatedHash !== responseData.pp_SecureHash) {
        console.log('Hash mismatch details:', {
          calculated: calculatedHash,
          received: responseData.pp_SecureHash,
          calculatedLength: calculatedHash.length,
          receivedLength: responseData.pp_SecureHash.length
        });
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
