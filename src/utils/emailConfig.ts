// Email service configuration for different purposes
export const EmailConfig = {
  // Original EmailJS account for business operations
  business: {
    serviceId: import.meta.env.VITE_EMAILJS_BUSINESS_SERVICE_ID || 'service_huwxfin',
    userId: import.meta.env.VITE_EMAILJS_BUSINESS_USER_ID || 'aFnOBMy5siQAFBFJ1',
    templates: {
      businessOrder: import.meta.env.VITE_EMAILJS_BUSINESS_ORDER_TEMPLATE || 'template_5sle4gl',
      customerConfirmation: import.meta.env.VITE_EMAILJS_BUSINESS_CUSTOMER_TEMPLATE || 'template_w6rt2f5'
    }
  },
  
  // New EmailJS account for OTP verification
  otp: {
    serviceId: import.meta.env.VITE_EMAILJS_OTP_SERVICE_ID || 'service_cptn2cy',
    userId: import.meta.env.VITE_EMAILJS_OTP_USER_ID || 'v6s-segYWe6b1Q8ZT',
    templates: {
      verification: import.meta.env.VITE_EMAILJS_OTP_VERIFICATION_TEMPLATE || 'template_otp_verify'
    }
  }
};

// Email service endpoints
export const EMAIL_API_URL = import.meta.env.VITE_EMAIL_API_URL || 'https://api.emailjs.com/api/v1.0/email/send';
