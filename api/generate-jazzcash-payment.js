// Generate JazzCash Payment Request - Backend API
// This endpoint securely generates JazzCash payment requests using server-side credentials

const crypto = require('crypto-js');

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, billReference, customerInfo } = req.body;

    // Validate required fields
    if (!amount || !billReference || !customerInfo) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get credentials from environment variables (secure, server-side only)
    const MERCHANT_ID = process.env.JAZZCASH_MERCHANT_ID || 'MC407733';
    const PASSWORD = process.env.JAZZCASH_PASSWORD || 'v58y3xx959';
    const INTEGRITY_SALT = process.env.JAZZCASH_INTEGRITY_SALT || 'c78ust11gu';
    const SANDBOX_URL = process.env.VITE_JAZZCASH_SANDBOX_URL || 'https://sandbox.jazzcash.com.pk/CustomerPortal/TransactionManagement/TransactionProcessing';
    const LIVE_URL = process.env.VITE_JAZZCASH_LIVE_URL || 'https://payments.jazzcash.com.pk/CustomerPortal/TransactionManagement/TransactionProcessing';
    const RETURN_URL = process.env.VITE_JAZZCASH_RETURN_URL || 'https://www.lahorisamosa.shop/api/payment-return';
    const IPN_URL = process.env.VITE_JAZZCASH_IPN_URL || 'https://www.lahorisamosa.shop/api/jazzcash-ipn';
    const CURRENCY = process.env.VITE_JAZZCASH_CURRENCY || 'PKR';
    const LANGUAGE = process.env.VITE_JAZZCASH_LANGUAGE || 'EN';
    const VERSION = process.env.VITE_JAZZCASH_VERSION || '1.1';
    const TXN_TYPE = process.env.VITE_JAZZCASH_TXN_TYPE || 'MPAY';

    // Generate transaction reference
    const txnRefNo = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Generate transaction datetime
    const now = new Date();
    const txnDateTime = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, '');
    
    // Generate expiry datetime (30 minutes from now)
    const expiryDateTime = new Date(now.getTime() + 30 * 60 * 1000).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, '');

    // Prepare payment data
    const paymentData = {
      pp_Version: VERSION,
      pp_TxnType: TXN_TYPE,
      pp_MerchantID: MERCHANT_ID,
      pp_Password: PASSWORD,
      pp_TxnRefNo: txnRefNo,
      pp_Amount: Math.round(amount * 100).toString(), // Convert to paisa and string
      pp_TxnCurrency: CURRENCY,
      pp_TxnDateTime: txnDateTime,
      pp_BillReference: billReference,
      pp_Description: 'LAHORI SAMOSA INVOICE',
      pp_TxnExpiryDateTime: expiryDateTime,
      pp_ReturnURL: RETURN_URL,
      pp_MobileNumber: customerInfo.phone?.replace(/\s/g, '') || '',
      pp_CNIC: customerInfo.cnic || '',
      pp_ContactNumber: customerInfo.phone?.replace(/\s/g, '') || '',
      pp_Language: LANGUAGE
    };

    // Generate secure hash
    const hash = generateSecureHash(paymentData, INTEGRITY_SALT, 'REQUEST');
    
    // Add hash to payment data
    paymentData.pp_SecureHash = hash;

    // Determine which URL to use (sandbox or live)
    const paymentUrl = process.env.NODE_ENV === 'production' ? LIVE_URL : SANDBOX_URL;

    // Return the payment data and URL to the frontend
    res.status(200).json({
      success: true,
      paymentData,
      paymentUrl,
      txnRefNo
    });

  } catch (error) {
    console.error('Error generating JazzCash payment:', error);
    res.status(500).json({ 
      error: 'Failed to generate payment request',
      details: error.message 
    });
  }
}

// Secure hash generation function (server-side only)
function generateSecureHash(data, integritySalt, type) {
  // Define the order of parameters for hash generation
  const requestParams = [
    'pp_Amount', 'pp_BillReference', 'pp_CNIC', 'pp_ContactNumber', 'pp_Currency',
    'pp_Description', 'pp_Language', 'pp_MerchantID', 'pp_MobileNumber', 'pp_Password',
    'pp_ReturnURL', 'pp_TxnCurrency', 'pp_TxnDateTime', 'pp_TxnExpiryDateTime',
    'pp_TxnRefNo', 'pp_TxnType', 'pp_Version'
  ];

  // Sort and filter the data according to JazzCash requirements
  const sortedData = {};
  Object.keys(data)
    .filter(key => requestParams.includes(key) && key !== 'pp_SecureHash')
    .sort()
    .forEach(key => {
      sortedData[key] = data[key] || '';
    });

  // Create concatenated string
  const concatenatedString = Object.values(sortedData).join('&');
  
  // Prepend the integrity salt
  const hashString = `${integritySalt}&${concatenatedString}`;
  
  console.log(`JazzCash ${type} params:`, sortedData);
  console.log(`Hash string (${type}):`, hashString);
  console.log(`Hash string length (${type}):`, hashString.length);
  
  // Use HMAC-SHA256 with salt as key
  const hash = crypto.HmacSHA256(hashString, integritySalt).toString(crypto.enc.Hex).toUpperCase();
  console.log(`Generated hash (${type}):`, hash);
  
  return hash;
}
