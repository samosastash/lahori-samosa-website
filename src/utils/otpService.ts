import { EmailConfig, EMAIL_API_URL } from './emailConfig';

// OTP Service for email verification
export class OTPService {
  private static otpStore = new Map<string, { otp: string; timestamp: number; attempts: number }>();
  private static readonly OTP_EXPIRY = 5 * 60 * 1000; // 5 minutes
  private static readonly MAX_ATTEMPTS = 3;

  // Generate a 6-digit OTP
  static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Store OTP for email
  static storeOTP(email: string, otp: string): void {
    this.otpStore.set(email.toLowerCase(), {
      otp,
      timestamp: Date.now(),
      attempts: 0
    });
  }

  // Verify OTP
  static verifyOTP(email: string, inputOTP: string): { success: boolean; message: string } {
    const normalizedEmail = email.toLowerCase();
    const otpData = this.otpStore.get(normalizedEmail);

    if (!otpData) {
      return { success: false, message: 'No OTP found. Please request a new one.' };
    }

    // Check if OTP has expired
    if (Date.now() - otpData.timestamp > this.OTP_EXPIRY) {
      this.otpStore.delete(normalizedEmail);
      return { success: false, message: 'OTP has expired. Please request a new one.' };
    }

    // Check attempts
    if (otpData.attempts >= this.MAX_ATTEMPTS) {
      this.otpStore.delete(normalizedEmail);
      return { success: false, message: 'Too many failed attempts. Please request a new OTP.' };
    }

    // Verify OTP
    if (otpData.otp === inputOTP) {
      this.otpStore.delete(normalizedEmail); // Clean up after successful verification
      return { success: true, message: 'Email verified successfully!' };
    } else {
      // Increment attempts
      otpData.attempts++;
      this.otpStore.set(normalizedEmail, otpData);
      return { 
        success: false, 
        message: `Invalid OTP. ${this.MAX_ATTEMPTS - otpData.attempts} attempts remaining.` 
      };
    }
  }

  // Check if email is already verified (OTP exists and not expired)
  static isOTPValid(email: string): boolean {
    const normalizedEmail = email.toLowerCase();
    const otpData = this.otpStore.get(normalizedEmail);
    
    if (!otpData) return false;
    
    return Date.now() - otpData.timestamp <= this.OTP_EXPIRY;
  }

  // Clean up expired OTPs (optional cleanup method)
  static cleanupExpiredOTPs(): void {
    const now = Date.now();
    for (const [email, otpData] of this.otpStore.entries()) {
      if (now - otpData.timestamp > this.OTP_EXPIRY) {
        this.otpStore.delete(email);
      }
    }
  }

  // Send OTP via EmailJS
  static async sendOTP(email: string, customerName: string = 'Customer'): Promise<{ success: boolean; message: string }> {
    try {
      const otp = this.generateOTP();
      
      // Send OTP email using dedicated EmailJS account
      const response = await fetch(EMAIL_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: EmailConfig.otp.serviceId,
          template_id: EmailConfig.otp.templates.verification,
          user_id: EmailConfig.otp.userId,
          template_params: {
            customer_name: customerName,
            otp_code: otp,
            customer_email: email,
            to_email: email
          }
        })
      });

      if (response.ok) {
        // Store OTP after successful email send
        this.storeOTP(email, otp);
        return { success: true, message: 'Verification code sent to your email!' };
      } else {
        return { success: false, message: 'Failed to send verification code. Please try again.' };
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      return { success: false, message: 'Failed to send verification code. Please check your connection.' };
    }
  }
}
