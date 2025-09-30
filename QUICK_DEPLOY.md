# 🚀 Quick Deployment Guide for Lahori Samosa

## 📁 Files Ready for Upload

I've created a clean zip file: `lahori-samosa-clean.zip` with all your updated code (no secrets included).

## 🌐 Step-by-Step Deployment

### Option 1: Create New GitHub Repository

1. **Go to GitHub.com** and sign in
2. **Click "New Repository"**
3. **Name it**: `lahori-samosa-website`
4. **Make it Public**
5. **Don't initialize** with README (we have one)
6. **Click "Create Repository"**

### Option 2: Upload Files

1. **Download** `lahori-samosa-clean.zip` from your project folder
2. **Extract** the zip file
3. **Upload all files** to your new GitHub repository:
   - Drag and drop all files into the repository
   - Or use GitHub Desktop
   - Or use command line (if you prefer)

### Option 3: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com/)**
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Import** your `lahori-samosa-website` repository
5. **Configure**:
   - Framework: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `build`
6. **Add Environment Variables** (see below)
7. **Deploy!**

## 🔧 Environment Variables for Vercel

Add these in Vercel Dashboard → Project Settings → Environment Variables:

```
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
EMAILJS_SERVICE_ID=your_emailjs_service_id
EMAILJS_TEMPLATE_ID_CUSTOMER=your_customer_template_id
EMAILJS_TEMPLATE_ID_BUSINESS=your_business_template_id
EMAILJS_USER_ID=your_emailjs_user_id
NODE_ENV=production
```

## ✅ What's Included in the Clean Package

- ✅ All updated components (FAQ, Side Cart, etc.)
- ✅ Professional email templates
- ✅ Image optimization
- ✅ Security fixes (no hardcoded secrets)
- ✅ Build configuration
- ✅ Deployment files

## 🎯 Your Site Will Have

- **Responsive design** for all devices
- **WhatsApp OTP verification**
- **Side-cart with animations**
- **Professional email notifications**
- **Fast loading** (optimized)
- **SEO ready**

## 📞 Need Help?

If you run into any issues:
1. Check the `DEPLOYMENT_GUIDE.md` file
2. Make sure environment variables are set correctly
3. Verify all services (Twilio, Supabase, EmailJS) are configured

---

**Your Lahori Samosa website is ready to go live! 🎉**
