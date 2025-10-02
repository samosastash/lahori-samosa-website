# Lahori Samosa Website

A modern e-commerce website for Lahori Samosa, featuring frozen samosas and Pakistani snacks.

## Features

- 🛒 Online ordering system with cart management
- 🔐 Email verification with OTP system
- 📧 Dual email system (business & customer notifications)
- 🛡️ Supabase database integration
- 📱 Responsive design with mobile-first approach
- 🎨 Modern UI/UX with Framer Motion animations
- 🛒 Dynamic side-cart drawer
- 📄 Complete policy pages (Privacy, Terms, Shipping)

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **Database**: Supabase (PostgreSQL)
- **Email Services**: Dual EmailJS accounts
- **Backend**: Node.js + Express
- **Icons**: Lucide React

## Getting Started

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
```

### Backend Server
```bash
npm run server
```

## Email Configuration

### Business EmailJS Account (Orders & Contact)
- **Service ID**: `service_huwxfin`
- **Business Template**: `template_5sle4gl`
- **Customer Template**: `template_w6rt2f5`
- **User ID**: `aFnOBMy5siQAFBFJ1`

### OTP EmailJS Account (Email Verification)
- **Service ID**: `service_cptn2cy`
- **OTP Template**: `template_otp_verify`
- **User ID**: `v6s-segYWe6b1Q8ZT`

## Database Configuration

### Supabase
- **Project ID**: `xdjndwdeepruvhprtjvt`
- **Database**: PostgreSQL with Row Level Security
- **Tables**: `orders` (with JSONB support)

## Contact

- Email: samosastash@gmail.com
- Phone: +92 324 4060113
- Location: Lahore, Pakistan