// Vercel Serverless Function for JazzCash Payment Return
// This handles the redirect from JazzCash after payment

import crypto from 'crypto';

// JazzCash Sandbox Credentials
const JAZZCASH_INTEGRITY_SALT = 'c78ust11gu';

// Function to generate secure hash (same as frontend)
function generateResponseHash(data) {
  // JazzCash response parameters for hash generation (in alphabetical order)
  const responseParams = [
    'pp_Amount', 'pp_BillReference', 'pp_CNIC', 'pp_ContactNumber', 'pp_Currency',
    'pp_Description', 'pp_Language', 'pp_MerchantID', 'pp_MobileNumber', 'pp_ResponseCode',
    'pp_ResponseMessage', 'pp_RetreivalReferenceNumber', 'pp_ReturnURL', 'pp_TxnCurrency',
    'pp_TxnDateTime', 'pp_TxnRefNo', 'pp_TxnType', 'pp_Version'
  ];
  
  const sortedData = {};
  Object.keys(data)
    .filter(key => responseParams.includes(key) && key !== 'pp_SecureHash')
    .sort()
    .forEach(key => {
      sortedData[key] = data[key] || '';
    });
  
  const concatenatedString = Object.values(sortedData).join('&');
  const hashString = `${JAZZCASH_INTEGRITY_SALT}&${concatenatedString}`;
  
  return crypto.createHmac('sha256', JAZZCASH_INTEGRITY_SALT).update(hashString).digest('hex').toUpperCase();
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle both GET and POST requests from JazzCash
  if (req.method === 'GET' || req.method === 'POST') {
    try {
      // Extract payment parameters from query string or body
      const paymentData = req.method === 'GET' ? req.query : req.body;
      
      // Log the payment data for debugging
      console.log('Payment return data:', paymentData);
      
      // Verify hash if we have the required fields
      if (paymentData.pp_SecureHash && paymentData.pp_ResponseCode) {
        const calculatedHash = generateResponseHash(paymentData);
        console.log('Hash verification:', {
          calculated: calculatedHash,
          received: paymentData.pp_SecureHash,
          match: calculatedHash === paymentData.pp_SecureHash
        });
      }
      
      // Redirect to homepage with payment confirmation parameters
      const params = new URLSearchParams();
      
      // Add all JazzCash response parameters
      Object.keys(paymentData).forEach(key => {
        if (paymentData[key]) {
          params.append(key, paymentData[key]);
        }
      });
      
      // Add our confirmation parameter
      params.append('payment', 'confirmation');
      
      // Redirect to homepage with all parameters
      const redirectUrl = `https://www.lahorisamosa.shop/?${params.toString()}`;
      
      console.log('Redirecting to:', redirectUrl);
      
      res.redirect(302, redirectUrl);
      
    } catch (error) {
      console.error('Payment return error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}