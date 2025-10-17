// JazzCash IPN (Instant Payment Notification) Handler for Vercel
// This function receives payment notifications from JazzCash

const crypto = require('crypto');

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('JazzCash IPN received:', req.body);

    // Extract JazzCash response data
    const {
      pp_Amount,
      pp_AuthCode,
      pp_BillReference,
      pp_CNIC,
      pp_ContactNumber,
      pp_Currency,
      pp_Language,
      pp_MerchantID,
      pp_MobileNumber,
      pp_ResponseCode,
      pp_ResponseMessage,
      pp_RetreivalReferenceNumber,
      pp_SecureHash,
      pp_TxnDateTime,
      pp_TxnRefNo,
      pp_TxnType,
      pp_Version
    } = req.body;

    // JazzCash Sandbox Credentials
    const MERCHANT_ID = 'MC407733';
    const PASSWORD = 'v58y3xx959';
    const INTEGRITY_SALT = 'c78ust11gu';

    // Verify the secure hash
    const hashString = `${INTEGRITY_SALT}&${pp_Amount}&${pp_BillReference}&${pp_CNIC}&${pp_ContactNumber}&${pp_Currency}&${pp_Language}&${pp_MerchantID}&${pp_MobileNumber}&${pp_ResponseCode}&${pp_ResponseMessage}&${pp_RetreivalReferenceNumber}&${pp_TxnDateTime}&${pp_TxnRefNo}&${pp_TxnType}&${pp_Version}`;
    
    const calculatedHash = crypto
      .createHash('sha256')
      .update(hashString)
      .digest('hex')
      .toUpperCase();

    // Verify hash matches
    if (calculatedHash !== pp_SecureHash) {
      console.error('Hash verification failed');
      return res.status(400).json({ error: 'Hash verification failed' });
    }

    // Check if payment was successful
    const isSuccess = pp_ResponseCode === '000' || pp_ResponseCode === '00';

    console.log('Payment Status:', {
      isSuccess,
      responseCode: pp_ResponseCode,
      responseMessage: pp_ResponseMessage,
      amount: pp_Amount,
      billReference: pp_BillReference,
      txnRefNo: pp_TxnRefNo
    });

    // Here you would typically:
    // 1. Update your database with payment status
    // 2. Send confirmation emails
    // 3. Update inventory
    // 4. Trigger any other business logic

    if (isSuccess) {
      console.log('✅ Payment successful for order:', pp_BillReference);
      
      // TODO: Update order status in your database
      // Example: await updateOrderStatus(pp_BillReference, 'paid');
      
      // TODO: Send confirmation email
      // Example: await sendPaymentConfirmation(pp_BillReference);
    } else {
      console.log('❌ Payment failed for order:', pp_BillReference);
      console.log('Failure reason:', pp_ResponseMessage);
      
      // TODO: Update order status to failed
      // Example: await updateOrderStatus(pp_BillReference, 'payment_failed');
    }

    // Always respond with success to JazzCash
    // JazzCash expects a 200 response to stop retrying
    return res.status(200).json({ 
      status: 'success',
      message: 'IPN processed successfully'
    });

  } catch (error) {
    console.error('IPN processing error:', error);
    
    // Still return 200 to JazzCash to prevent retries
    return res.status(200).json({ 
      status: 'error',
      message: 'IPN processing failed but acknowledged'
    });
  }
}
