// Verify JazzCash Payment Response - Backend API
// This endpoint securely verifies JazzCash payment responses using server-side credentials

const crypto = require('crypto-js');

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const responseData = req.body;

    // Validate required fields
    if (!responseData.pp_ResponseCode || !responseData.pp_SecureHash) {
      return res.status(400).json({ error: 'Missing required response fields' });
    }

    // Get credentials from environment variables (secure, server-side only)
    const INTEGRITY_SALT = process.env.VITE_JAZZCASH_INTEGRITY_SALT || 'c78ust11gu';

    // Verify the response hash
    const isValid = verifyResponseHash(responseData, INTEGRITY_SALT);
    
    // Determine if payment was successful
    const successCodes = ['000', '121', '200'];
    const isSuccess = isValid && successCodes.includes(responseData.pp_ResponseCode);

    let message = '';
    if (isSuccess) {
      message = 'Payment completed successfully!';
    } else if (!isValid) {
      message = 'Payment verification failed - invalid response';
    } else {
      message = responseData.pp_ResponseMessage || 'Payment failed. Please try again.';
    }

    console.log('🔍 JazzCash response verification:', {
      isValid,
      isSuccess,
      responseCode: responseData.pp_ResponseCode,
      message
    });

    res.status(200).json({
      isValid,
      isSuccess,
      message,
      responseCode: responseData.pp_ResponseCode
    });

  } catch (error) {
    console.error('Error verifying JazzCash response:', error);
    res.status(500).json({ 
      error: 'Failed to verify payment response',
      details: error.message 
    });
  }
}

// Secure response hash verification function (server-side only)
function verifyResponseHash(data, integritySalt) {
  try {
    // Define the order of parameters for response verification
    const responseParams = [
      'pp_Amount', 'pp_BillReference', 'pp_CNIC', 'pp_ContactNumber', 'pp_Currency',
      'pp_Description', 'pp_Language', 'pp_MerchantID', 'pp_MobileNumber', 'pp_Password',
      'pp_ResponseCode', 'pp_ResponseMessage', 'pp_RetreivalReferenceNo', 'pp_ReturnURL',
      'pp_TxnCurrency', 'pp_TxnDateTime', 'pp_TxnRefNo', 'pp_TxnType', 'pp_Version'
    ];

    // Sort and filter the data according to JazzCash requirements
    const sortedData = {};
    Object.keys(data)
      .filter(key => responseParams.includes(key) && key !== 'pp_SecureHash')
      .sort()
      .forEach(key => {
        sortedData[key] = data[key] || '';
      });

    // Create concatenated string
    const concatenatedString = Object.values(sortedData).join('&');
    
    // Prepend the integrity salt
    const hashString = `${integritySalt}&${concatenatedString}`;
    
    console.log('JazzCash RESPONSE params:', sortedData);
    console.log('Concatenated string (RESPONSE):', concatenatedString);
    console.log('Hash string (RESPONSE):', hashString);
    console.log('Hash string length (RESPONSE):', hashString.length);
    
    // Use HMAC-SHA256 with salt as key
    const hash = crypto.HmacSHA256(hashString, integritySalt).toString(crypto.enc.Hex).toUpperCase();
    console.log('Generated hash (RESPONSE):', hash);
    console.log('Received hash (RESPONSE):', data.pp_SecureHash);
    
    // Compare hashes
    const isValid = hash === data.pp_SecureHash;
    console.log('Hash verification result:', isValid);
    
    return isValid;
  } catch (error) {
    console.error('Error in hash verification:', error);
    return false;
  }
}
