import { motion } from 'motion/react';
import { ArrowLeft, Mail, Phone, FileText, CreditCard, Truck, RotateCcw, User, Shield, AlertTriangle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TermsOfServicePage() {
  const sections = [
    {
      icon: FileText,
      title: "Use of Website",
      content: [
        "You agree to use this website only for lawful purposes.",
        "You must not misuse the site, attempt to hack it, or disrupt its operation."
      ]
    },
    {
      icon: CreditCard,
      title: "Orders and Payments",
      content: [
        "All orders placed through our website are subject to availability.",
        "Prices are listed in Pakistani Rupees (PKR) and may change without prior notice.",
        "Payments must be made using the methods available on our website."
      ]
    },
    {
      icon: Truck,
      title: "Delivery and Pickup",
      content: [
        "We aim to deliver your orders on time; however, delivery times may vary due to traffic, weather, or other conditions.",
        "Delivery charges may apply depending on your location.",
        "Customers are responsible for providing correct delivery details."
      ]
    },
    {
      icon: RotateCcw,
      title: "Refunds and Cancellations",
      content: [
        "Orders once confirmed cannot always be canceled.",
        "Refunds may be offered only in cases of wrong, incomplete, or damaged orders.",
        "For refund or complaint requests, please contact us within 24 hours of receiving your order."
      ]
    },
    {
      icon: User,
      title: "User Accounts (if applicable)",
      content: [
        "If you create an account, you are responsible for maintaining confidentiality of your login details.",
        "You agree to provide accurate and updated information."
      ]
    },
    {
      icon: Shield,
      title: "Intellectual Property",
      content: [
        "All content on this website (logo, text, images) is owned by Lahori Samosa and cannot be copied, used, or reproduced without permission."
      ]
    },
    {
      icon: AlertTriangle,
      title: "Limitation of Liability",
      content: [
        "We are not responsible for delays, damages, or losses beyond our reasonable control.",
        "Consumption of our products is at your own risk if you have allergies or dietary restrictions."
      ]
    }
  ];

  return (
    <div className="pt-16 bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-gray-50 relative">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-100/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-amber-100/30 to-transparent rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <Link 
              to="/"
              className="inline-flex items-center text-emerald-700 hover:text-emerald-800 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            
            <h1 className="text-5xl lg:text-6xl text-slate-900 brand-font tracking-tight">
              Terms of <span className="text-emerald-800 italic">Service</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Welcome to Lahori Samosa. By accessing or using our website, you agree to the following terms and conditions. Please read them carefully before placing an order or using our services.
            </p>
            <p className="text-sm text-slate-500">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Terms of Service Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-50 rounded-2xl p-8 border border-slate-100"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-2xl text-slate-900 font-semibold">
                      {section.title}
                    </h2>
                    <div className="space-y-3">
                      {section.content.map((item, itemIndex) => (
                        <p key={itemIndex} className="text-slate-600 leading-relaxed">
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Changes to Terms */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-br from-emerald-50 to-amber-50 rounded-2xl p-8 border border-emerald-100"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-emerald-700" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-2xl text-slate-900 font-semibold">
                    Changes to Terms
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    We may update these Terms of Service at any time. Updates will be posted on this page with the new effective date.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-br from-emerald-800 to-emerald-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <h2 className="text-3xl font-semibold mb-6 brand-font">
              Questions About These Terms?
            </h2>
            <p className="text-emerald-100 mb-8 text-lg">
              If you have any questions about these Terms of Service, please reach us at:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <motion.a
                href="mailto:samosastash@gmail.com"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center space-x-3 bg-white/10 rounded-lg px-6 py-4 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 w-full"
              >
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm md:text-base text-center">samosastash@gmail.com</span>
              </motion.a>
              
              <motion.a
                href="tel:+923244060113"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center space-x-3 bg-white/10 rounded-lg px-6 py-4 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 w-full"
              >
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm md:text-base text-center">+92 324 4060113</span>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
