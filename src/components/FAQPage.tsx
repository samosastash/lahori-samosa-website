import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, HelpCircle, Phone, Mail, Clock, MapPin } from 'lucide-react';

export function FAQPage() {
  const [openItems, setOpenItems] = React.useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: "What are your delivery hours?",
      answer: "We deliver from 11:00 AM to 11:00 PM, seven days a week. Orders placed after 10:30 PM will be delivered the next day."
    },
    {
      question: "What is your minimum order amount?",
      answer: "Our minimum order is Rs. 500 for delivery. For pickup orders, there's no minimum amount."
    },
    {
      question: "How long does delivery take?",
      answer: "Delivery typically takes 30-45 minutes depending on your location and current order volume. You'll receive an estimated delivery time when you place your order."
    },
    {
      question: "Do you deliver to my area?",
      answer: "We deliver to most areas in Lahore. Enter your address during checkout to see if we deliver to your location. If you're unsure, feel free to call us."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept cash on delivery, JazzCash, EasyPaisa, and bank transfers. Online payment options are also available."
    },
    {
      question: "Can I customize my order?",
      answer: "Yes! You can request customizations like extra spice, less oil, or specific ingredients. Just mention your preferences in the order notes."
    },
    {
      question: "What if I'm not satisfied with my order?",
      answer: "We want you to be completely satisfied! If there's any issue with your order, please contact us within 30 minutes of delivery and we'll make it right."
    },
    {
      question: "Do you have vegetarian options?",
      answer: "Yes! We offer a variety of vegetarian samosas and rolls. Look for the green leaf icon next to vegetarian items on our menu."
    },
    {
      question: "Can I place a bulk order for events?",
      answer: "Absolutely! We cater to events, parties, and corporate orders. Please call us at least 24 hours in advance for bulk orders to ensure availability."
    },
    {
      question: "How do I track my order?",
      answer: "You'll receive WhatsApp updates about your order status. You can also call us for real-time updates on your delivery."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-4">
              <HelpCircle className="h-8 w-8 text-orange-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">Frequently Asked Questions</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our delicious Lahori samosas and delivery service.
            </p>
          </motion.div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openItems.includes(index) ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                </motion.div>
              </button>
              
              <motion.div
                initial={false}
                animate={{
                  height: openItems.includes(index) ? "auto" : 0,
                  opacity: openItems.includes(index) ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 bg-white rounded-lg shadow-sm border border-gray-200 p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Still Have Questions?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Phone className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600 text-sm">+92 324 4060113</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Mail className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600 text-sm">info@lahorisamosa.com</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Hours</h3>
              <p className="text-gray-600 text-sm">11 AM - 11 PM Daily</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
