// Email service configuration for different purposes
export const EmailConfig = {
  // Original EmailJS account for business operations
  business: {
    serviceId: 'service_huwxfin',
    userId: 'aFnOBMy5siQAFBFJ1',
    templates: {
      businessOrder: 'template_5sle4gl',
      customerConfirmation: 'template_w6rt2f5'
    }
  },
  
  // New EmailJS account for OTP verification
  otp: {
    serviceId: 'service_cptn2cy', // Your new OTP service ID
    userId: 'v6s-segYWe6b1Q8ZT', // Your new user ID/public key
    templates: {
      verification: 'template_otp_verify'
    }
  }
};

// Email service endpoints
export const EMAIL_API_URL = 'https://api.emailjs.com/api/v1.0/email/send';
