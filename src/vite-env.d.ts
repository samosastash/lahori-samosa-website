/// <reference types="vite/client" />

declare global {
  interface ImportMetaEnv {
  readonly VITE_JAZZCASH_MERCHANT_ID: string
  readonly VITE_JAZZCASH_PASSWORD: string
  readonly VITE_JAZZCASH_INTEGRITY_SALT: string
  readonly VITE_JAZZCASH_SANDBOX_URL: string
  readonly VITE_JAZZCASH_LIVE_URL: string
  readonly VITE_JAZZCASH_RETURN_URL: string
  readonly VITE_JAZZCASH_IPN_URL: string
  readonly VITE_JAZZCASH_CURRENCY: string
  readonly VITE_JAZZCASH_LANGUAGE: string
  readonly VITE_JAZZCASH_VERSION: string
  readonly VITE_JAZZCASH_TXN_TYPE: string
  readonly VITE_EMAILJS_BUSINESS_SERVICE_ID: string
  readonly VITE_EMAILJS_BUSINESS_USER_ID: string
  readonly VITE_EMAILJS_BUSINESS_ORDER_TEMPLATE: string
  readonly VITE_EMAILJS_BUSINESS_CUSTOMER_TEMPLATE: string
  readonly VITE_EMAILJS_OTP_SERVICE_ID: string
  readonly VITE_EMAILJS_OTP_USER_ID: string
  readonly VITE_EMAILJS_OTP_VERIFICATION_TEMPLATE: string
  readonly VITE_SUPABASE_PROJECT_ID: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_BUSINESS_EMAIL: string
  readonly VITE_BUSINESS_PHONE: string
  readonly VITE_BUSINESS_LOCATION: string
  readonly VITE_EMAIL_API_URL: string
}

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}
