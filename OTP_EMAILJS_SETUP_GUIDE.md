# 🔐 OTP EmailJS Setup Guide - Lahori Samosa

## Overview
This guide will help you set up a separate EmailJS account specifically for OTP (One-Time Password) verification, keeping your original business email templates intact.

## 📧 Step 1: Create New EmailJS Account

### 1.1 Sign Up for New Account
1. Go to **https://www.emailjs.com**
2. Click **"Sign Up"**
3. **Use a different email** than your current account:
   - Option 1: Create new Gmail (e.g., `lahorisamosaotp@gmail.com`)
   - Option 2: Use email alias (e.g., `samosastash+otp@gmail.com`)
4. **Account Name**: "Lahori Samosa OTP Service"
5. Complete verification

### 1.2 Connect Email Service
1. **Dashboard** → **Email Services** → **Add New Service**
2. Choose **Gmail**
3. **Service Name**: "OTP Verification Service"
4. **Connect your Gmail** (same or different Gmail account)
5. **Copy the Service ID** (looks like `service_xyz123`)

## 🎨 Step 2: Create OTP Email Template

### 2.1 Create Template
1. **Dashboard** → **Email Templates** → **Create New Template**
2. **Template Name**: "OTP Verification - Lahori Samosa"
3. **Template ID**: `template_otp_verify` (important!)

### 2.2 Template Configuration

**Subject Line:**
```
Your Verification Code - Lahori Samosa
```

**HTML Content:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
        .header { background: linear-gradient(135deg, #059669, #047857); color: white; padding: 30px 20px; text-align: center; }
        .logo { font-size: 28px; font-weight: bold; margin-bottom: 5px; }
        .subtitle { font-size: 14px; opacity: 0.9; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 18px; margin-bottom: 20px; color: #374151; }
        .otp-section { background: #f0f9ff; border: 2px solid #059669; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; }
        .otp-label { font-size: 14px; color: #6b7280; margin-bottom: 10px; }
        .otp-code { font-size: 36px; font-weight: bold; color: #059669; letter-spacing: 8px; font-family: 'Courier New', monospace; margin: 15px 0; }
        .expiry-warning { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 25px 0; }
        .warning-icon { font-size: 20px; margin-right: 8px; }
        .instructions { background: #f9fafb; border-radius: 8px; padding: 20px; margin: 25px 0; }
        .footer { background: #f9fafb; padding: 25px; text-align: center; border-top: 1px solid #e5e7eb; }
        .contact-info { font-size: 12px; color: #6b7280; margin-top: 15px; }
        .security-note { font-size: 12px; color: #9ca3af; margin-top: 20px; font-style: italic; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo">🥟 Lahori Samosa</div>
            <div class="subtitle">Email Verification Service</div>
        </div>
        
        <!-- Main Content -->
        <div class="content">
            <div class="greeting">Hello {{customer_name}},</div>
            
            <p>Thank you for choosing Lahori Samosa! To complete your order and ensure secure delivery, please verify your email address using the verification code below:</p>
            
            <!-- OTP Section -->
            <div class="otp-section">
                <div class="otp-label">Your Verification Code</div>
                <div class="otp-code">{{otp_code}}</div>
                <p style="margin: 10px 0 0 0; font-size: 14px; color: #6b7280;">Enter this code on the checkout page</p>
            </div>
            
            <!-- Expiry Warning -->
            <div class="expiry-warning">
                <span class="warning-icon">⏰</span>
                <strong>Important:</strong> This verification code will expire in <strong>5 minutes</strong> for your security.
            </div>
            
            <!-- Instructions -->
            <div class="instructions">
                <strong>How to use this code:</strong>
                <ol style="margin: 10px 0; padding-left: 20px;">
                    <li>Return to the Lahori Samosa checkout page</li>
                    <li>Enter the 6-digit code in the verification field</li>
                    <li>Click "Verify" to complete your email verification</li>
                    <li>Proceed with your order placement</li>
                </ol>
            </div>
            
            <p>If you didn't request this verification code, please ignore this email. Your account security is important to us.</p>
            
            <p style="margin-top: 30px;">
                Best regards,<br>
                <strong>The Lahori Samosa Team</strong>
            </p>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="contact-info">
                📧 samosastash@gmail.com | 📞 +92 324 4060113<br>
                📍 Lahore, Pakistan
            </div>
            <div class="security-note">
                This is an automated security email. Please do not reply to this message.
            </div>
        </div>
    </div>
</body>
</html>
```

### 2.3 Template Variables
Set up these template variables:
- `{{customer_name}}` - Customer's name
- `{{otp_code}}` - 6-digit verification code  
- `{{customer_email}}` - Customer's email address

### 2.4 Email Settings
- **To Email**: `{{customer_email}}`
- **From Name**: "Lahori Samosa"
- **Reply To**: Your business email

## 🔑 Step 3: Get Your Credentials

After setup, you'll have:
1. **Service ID**: `service_[new_id]` (from Step 1.2)
2. **Template ID**: `template_otp_verify` (from Step 2.1)
3. **User ID**: Found in **Account** → **API Keys**

## ⚙️ Step 4: Update Configuration

Once you have the credentials, update the configuration file:

**File**: `src/utils/emailConfig.ts`

Replace these values:
```typescript
// New EmailJS account for OTP verification
otp: {
  serviceId: 'service_NEW_OTP_ID', // ← Replace with your new service ID
  userId: 'NEW_OTP_USER_ID', // ← Replace with your new user ID
  templates: {
    verification: 'template_otp_verify' // ← Should match your template ID
  }
}
```

## 🧪 Step 5: Test the Setup

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Test OTP sending**:
   - Go to checkout page
   - Enter your email
   - Click "Send OTP"
   - Check your inbox for the verification email

3. **Test OTP verification**:
   - Enter the 6-digit code
   - Click "Verify"
   - Should show "Email verified successfully!"

## 📋 Final Checklist

- [ ] New EmailJS account created
- [ ] Gmail service connected
- [ ] OTP template created with correct ID (`template_otp_verify`)
- [ ] Template variables configured
- [ ] Service ID, User ID, and Template ID copied
- [ ] `emailConfig.ts` updated with new credentials
- [ ] Project built and tested
- [ ] OTP emails received and working
- [ ] Original business emails still working

## 🔄 Email Service Architecture

**Original EmailJS Account** (Business Operations):
- Service: `service_huwxfin`
- Templates: 
  - `template_5sle4gl` (Business order notifications)
  - `template_w6rt2f5` (Customer order confirmations)

**New EmailJS Account** (OTP Verification):
- Service: `service_[new_id]`
- Templates:
  - `template_otp_verify` (Email verification codes)

## 🆘 Troubleshooting

**OTP emails not received?**
1. Check spam/junk folder
2. Verify template ID matches exactly
3. Ensure Gmail service is properly connected
4. Check EmailJS dashboard for send logs

**Configuration errors?**
1. Double-check all IDs in `emailConfig.ts`
2. Ensure template variables match exactly
3. Verify service is active in EmailJS dashboard

**Need help?**
- Check EmailJS documentation: https://www.emailjs.com/docs/
- Test templates in EmailJS dashboard before deploying
