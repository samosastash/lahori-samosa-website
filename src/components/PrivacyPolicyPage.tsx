import { motion } from 'motion/react';
import { ArrowLeft, Mail, Phone, Shield, Lock, Eye, Users, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PrivacyPolicyPage() {
  const sections = [
    {
      icon: Users,
      title: "Information We Collect",
      content: [
        "Personal Information: Name, phone number, email address, or delivery address (if you place an order or contact us).",
        "Non-Personal Information: Browser type, device information, and general website usage data."
      ]
    },
    {
      icon: FileText,
      title: "How We Use Your Information",
      content: [
        "Process and deliver your orders.",
        "Respond to your inquiries and provide customer support.",
        "Improve our website and services.",
        "Send you promotional offers or updates (only if you opt-in)."
      ]
    },
    {
      icon: Shield,
      title: "Sharing of Information",
      content: [
        "We do not sell or rent your personal information. Your details may only be shared with:",
        "Delivery partners, for order fulfillment.",
        "Service providers helping us operate the website (e.g., payment processors, hosting).",
        "If required by law or legal process."
      ]
    },
    {
      icon: Eye,
      title: "Cookies",
      content: [
        "Our website may use cookies to enhance user experience, analyze traffic, and personalize content.",
        "You can manage or disable cookies in your browser settings."
      ]
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        "We take reasonable measures to protect your data from unauthorized access, alteration, or misuse.",
        "However, no method of online transmission is 100% secure."
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
              Privacy <span className="text-emerald-800 italic">Policy</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              At Lahori Samosa, we value your trust and are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information.
            </p>
            <p className="text-sm text-slate-500">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Privacy Policy Content */}
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

            {/* Additional Sections */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-emerald-50 to-amber-50 rounded-2xl p-8 border border-emerald-100"
            >
              <h2 className="text-2xl text-slate-900 font-semibold mb-4">
                Your Choices
              </h2>
              <div className="space-y-3">
                <p className="text-slate-600 leading-relaxed">
                  You can request access, correction, or deletion of your personal data.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  You can opt-out of marketing messages anytime by contacting us.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="bg-slate-50 rounded-2xl p-8 border border-slate-100"
            >
              <h2 className="text-2xl text-slate-900 font-semibold mb-4">
                Updates to Policy
              </h2>
              <p className="text-slate-600 leading-relaxed">
                We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated date.
              </p>
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
              Questions About This Policy?
            </h2>
            <p className="text-emerald-100 mb-8 text-lg">
              If you have any questions about this Privacy Policy, please contact us:
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
