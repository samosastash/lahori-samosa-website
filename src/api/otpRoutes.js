import express from 'express';
import TwilioWhatsAppService from '../utils/twilio/twilioWhatsAppService.js';

const router = express.Router();
const twilioService = new TwilioWhatsAppService();

// Send OTP endpoint
router.post('/send-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number is required' 
      });
    }

    console.log('📱 Send OTP endpoint called');
    
    const result = await twilioService.sendOTP(phoneNumber);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'OTP sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message || 'Failed to send OTP'
      });
    }
  } catch (error) {
    console.error('❌ Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Verify OTP endpoint
router.post('/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    
    if (!phoneNumber || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number and OTP are required' 
      });
    }

    console.log('🔐 Verify OTP endpoint called');
    
    const result = await twilioService.verifyOTP(phoneNumber, otp);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'OTP verified successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message || 'Invalid OTP'
      });
    }
  } catch (error) {
    console.error('❌ Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Send order confirmation endpoint
router.post('/send-order-confirmation', async (req, res) => {
  try {
    const { phoneNumber, orderId, customerName, totalAmount } = req.body;
    
    if (!phoneNumber || !orderId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number and order ID are required' 
      });
    }

    console.log('📋 Send order confirmation endpoint called');
    
    const result = await twilioService.sendOrderConfirmation(
      phoneNumber, 
      orderId, 
      customerName, 
      totalAmount
    );
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Order confirmation sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message || 'Failed to send order confirmation'
      });
    }
  } catch (error) {
    console.error('❌ Send order confirmation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
