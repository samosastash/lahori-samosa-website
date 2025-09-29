# Lahori Samosa - Deployment Guide

## 🚀 Production Deployment Steps

### 1. Build the Frontend
```bash
npm run build
```
This creates a `dist` folder with optimized production files.

### 2. Set Environment Variables
```bash
export NODE_ENV=production
export PORT=3001  # or your preferred port
```

### 3. Start the Production Server
```bash
npm start
```

### 4. Domain Configuration

#### For Vercel/Netlify (Frontend Only):
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

#### For VPS/Dedicated Server (Full Stack):
- Upload all files to your server
- Run `npm install` to install dependencies
- Set `NODE_ENV=production`
- Run `npm run build` to build frontend
- Run `npm start` to start the server

### 5. EmailJS Configuration
Make sure your EmailJS templates are properly configured:
- **Business Template ID**: `template_5sle4gl`
- **Customer Template ID**: `template_w6rt2f5`
- **Service ID**: `service_huwxfin`
- **User ID**: `aFnOBMy5siQAFBFJ1`

### 6. Domain Setup
1. Point your domain to your server IP
2. Configure SSL certificate (Let's Encrypt recommended)
3. Set up reverse proxy if needed (Nginx/Apache)

### 7. Testing Checklist
- [ ] Frontend loads correctly
- [ ] All images display properly
- [ ] Contact form sends emails
- [ ] Order placement works
- [ ] Business emails are received
- [ ] Customer confirmation emails are sent
- [ ] All pages are accessible
- [ ] Mobile responsiveness works

### 8. Performance Optimization
- Images are optimized
- Code is minified
- Static assets are cached
- EmailJS is configured correctly

## 📧 Email Templates Required

### Business Order Template (`template_5sle4gl`)
- Order ID: `{{order_id}}`
- Customer Name: `{{customer_name}}`
- Customer Phone: `{{customer_phone}}`
- Customer Address: `{{customer_address}}`
- Order Items: `{{order_items}}`
- Total Amount: `{{total_amount}}`

### Customer Confirmation Template (`template_w6rt2f5`)
- Order ID: `{{order_id}}`
- Customer Name: `{{customer_name}}`
- Customer Phone: `{{customer_phone}}`
- Customer Address: `{{customer_address}}`
- Order Items: `{{order_items}}`
- Total Amount: `{{total_amount}}`
- Customer Email: `{{customer_email}}`
- To Email: `{{to_email}}`

## 🔧 Troubleshooting

### Common Issues:
1. **Emails not sending**: Check EmailJS template configuration
2. **Images not loading**: Verify image paths in public/images/
3. **API errors**: Check server logs and EmailJS dashboard
4. **Build errors**: Run `npm install` and `npm run build`

### Support:
- Email: samosastash@gmail.com
- Phone: +92 324 4060113
