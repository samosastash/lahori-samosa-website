// This is a Vercel Serverless Function to handle JazzCash payment returns
// Path: /api/payment-return.js

export default async function handler(req, res) {
  // Handle both GET and POST requests from JazzCash
  if (req.method === 'GET' || req.method === 'POST') {
    // Extract payment parameters from query string or body
    const paymentData = req.method === 'GET' ? req.query : req.body;
    
    // Log the payment data for debugging
    console.log('Payment return data:', paymentData);
    
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
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
