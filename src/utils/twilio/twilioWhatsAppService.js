import twilio from 'twilio';

class TwilioWhatsAppService {
  constructor() {
    this.config = {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      whatsappNumber: '+14155238886', // Twilio WhatsApp Sandbox number
      otpLength: 6,
      otpExpiryMinutes: 5,
      whatsappOnly: true // Force WhatsApp only, no SMS fallback
    };

    this.client = twilio(this.config.accountSid, this.config.authToken);
    this.otpStorage = new Map(); // In production, use Redis or database
    
    console.log('✅ Twilio WhatsApp client initialized successfully');
  }

  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOTP(phoneNumber) {
    try {
      const otp = this.generateOTP();
      const expiryTime = Date.now() + (this.config.otpExpiryMinutes * 60 * 1000);
      
      // Store OTP with expiry
      this.otpStorage.set(phoneNumber, {
        otp,
        expiry: expiryTime,
        attempts: 0
      });

      const message = `🥟 Lahori Samosa - Order Verification

Your verification code is: ${otp}

⏰ Valid for ${this.config.otpExpiryMinutes} minutes
🔒 Do not share this code with anyone

Thank you for choosing Lahori Samosa! 🥟`;

      const result = await this.client.messages.create({
        body: message,
        from: `whatsapp:${this.config.whatsappNumber}`,
        to: `whatsapp:${phoneNumber}`
      });

      console.log('✅ WhatsApp OTP sent successfully to', phoneNumber);
      console.log('📱 Message ID:', result.sid);
      console.log('🔐 OTP Code:', otp);

      return {
        success: true,
        messageId: result.sid,
        otp: otp // For testing purposes only
      };

    } catch (error) {
      console.error('❌ Twilio send error:', error);
      return {
        success: false,
        message: error.message || 'Failed to send OTP'
      };
    }
  }

  async verifyOTP(phoneNumber, inputOtp) {
    try {
      const storedData = this.otpStorage.get(phoneNumber);
      
      if (!storedData) {
        return {
          success: false,
          message: 'No OTP found for this phone number'
        };
      }

      if (Date.now() > storedData.expiry) {
        this.otpStorage.delete(phoneNumber);
        return {
          success: false,
          message: 'OTP has expired. Please request a new one.'
        };
      }

      if (storedData.attempts >= 3) {
        this.otpStorage.delete(phoneNumber);
        return {
          success: false,
          message: 'Too many failed attempts. Please request a new OTP.'
        };
      }

      if (inputOtp === storedData.otp) {
        this.otpStorage.delete(phoneNumber);
        return {
          success: true,
          message: 'OTP verified successfully'
        };
      } else {
        storedData.attempts++;
        this.otpStorage.set(phoneNumber, storedData);
        
        return {
          success: false,
          message: 'Invalid OTP. Please try again.'
        };
      }

    } catch (error) {
      console.error('❌ Verify OTP error:', error);
      return {
        success: false,
        message: 'Verification failed. Please try again.'
      };
    }
  }

  async sendOrderConfirmation(phoneNumber, orderId, customerName, totalAmount) {
    try {
      const message = `🎉 Lahori Samosa - Order Confirmation

Dear ${customerName || 'Customer'},

Your order has been confirmed!

📋 Order ID: ${orderId}
💰 Total Amount: Rs. ${totalAmount}

🚚 We're preparing your delicious samosas and will deliver them soon!

Thank you for choosing Lahori Samosa! 🥟`;

      const result = await this.client.messages.create({
        body: message,
        from: `whatsapp:${this.config.whatsappNumber}`,
        to: `whatsapp:${phoneNumber}`
      });

      console.log('✅ WhatsApp order confirmation sent successfully to', phoneNumber);
      console.log('📱 Order Confirmation Message ID:', result.sid);
      console.log('📋 Order ID:', orderId);

      return {
        success: true,
        messageId: result.sid
      };

    } catch (error) {
      console.error('❌ Send order confirmation error:', error);
      return {
        success: false,
        message: error.message || 'Failed to send order confirmation'
      };
    }
  }

  async sendOwnerNotification(phoneNumber, orderId, customerName, totalAmount) {
    try {
      const message = `🔔 New Order Alert - Lahori Samosa

📋 Order ID: ${orderId}
👤 Customer: ${customerName}
💰 Total: Rs. ${totalAmount}

Please check your dashboard for order details.`;

      const result = await this.client.messages.create({
        body: message,
        from: `whatsapp:${this.config.whatsappNumber}`,
        to: `whatsapp:${phoneNumber}`
      });

      console.log('✅ Owner notification sent successfully');
      console.log('📱 Notification Message ID:', result.sid);

      return {
        success: true,
        messageId: result.sid
      };

    } catch (error) {
      console.error('❌ Send owner notification error:', error);
      return {
        success: false,
        message: error.message || 'Failed to send owner notification'
      };
    }
  }
}

export default TwilioWhatsAppService;
