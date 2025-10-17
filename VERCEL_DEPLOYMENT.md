# 🚀 Vercel Deployment Guide - Lahori Samosa

## Your Setup:
- **Repository**: https://github.com/samosastash/lahori-samosa-website
- **Domain**: lahorisamosa.shop (GoDaddy → Vercel)
- **Platform**: Vercel

## ✅ JazzCash Fixes Included:
- Hash verification fixed
- Enhanced debugging
- Error boundaries added
- Dependencies pinned

## 🔧 Vercel Deployment Steps:

### 1. Push Your Changes to GitHub
```bash
git add .
git commit -m "Fix JazzCash hash verification"
git push origin main
```

### 2. Vercel Auto-Deploy
- Vercel will automatically detect changes
- It will build and deploy your site
- Your domain will be updated automatically

### 3. Vercel Build Settings
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`
- **Node.js Version**: 18.x

### 4. Environment Variables (if needed)
In Vercel Dashboard → Settings → Environment Variables:
- `NODE_ENV` = `production`

## 🧪 Test After Deployment:
1. Visit: https://lahorisamosa.shop
2. Add items to cart
3. Go to checkout
4. Verify email with OTP
5. Test JazzCash payment
6. Should work without hash errors!

## 📊 What's Fixed:
- ✅ JazzCash hash verification
- ✅ Separate request/response hash generation
- ✅ Enhanced error handling
- ✅ Better debugging logs
- ✅ Error boundaries
- ✅ Dependencies pinned

## 🎯 Expected Result:
Payment should now work correctly without "Hash verification failed" error!

## 📞 Support:
- Email: samosastash@gmail.com
- Phone: +92 324 4060113
