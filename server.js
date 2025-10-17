const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the build directory (for production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
}

// Generate order ID (max 20 chars for JazzCash)
function generateOrderId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `LAHORI${timestamp}${random}`.toUpperCase().substring(0, 20);
}

// Email sending is now handled by frontend using EmailJS

// Submit order endpoint
app.post('/make-server-88c4ddbd/orders', async (req, res) => {
  try {
    const orderData = req.body;
    const orderId = generateOrderId();
    
    // Create order object
    const order = {
      id: orderId,
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    console.log('Processing order:', orderId);
    
    // Email will be sent from frontend using EmailJS
    console.log('Order processed successfully - email will be sent from frontend');
    
    res.json({ 
      success: true, 
      orderId,
      message: 'Order placed successfully! Email confirmation will be sent shortly.'
    });
    
  } catch (error) {
    console.log('Error placing order:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to place order' 
    });
  }
});

// Get order endpoint
app.get('/make-server-88c4ddbd/orders/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    
    // For demo purposes, return a mock order
    const order = {
      id: orderId,
      items: [{ name: 'Pizza Samosa (12p)', quantity: 1, price: 650 }],
      total: 750,
      customerInfo: {
        name: 'Sample Customer',
        phone: '+923244060113',
        address: 'Sample Address'
      },
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    
    res.json({ success: true, order });
    
  } catch (error) {
    console.log('Error fetching order:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch order' 
    });
  }
});

// Health check
app.get('/make-server-88c4ddbd/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Serve React app for all non-API routes (for production)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

console.log(`Starting Node.js server on port ${PORT}...`);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
