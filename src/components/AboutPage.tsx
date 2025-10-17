import { motion } from 'motion/react';
import { Heart, Users, Award, Leaf, Clock, ChefHat, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function AboutPage() {
  const heroImage = "https://images.unsplash.com/photo-1659354218430-ac7f0b31e977?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwa2l0Y2hlbiUyMGNoZWYlMjBjb29raW5nJTIwcHJvZmVzc2lvbmFsJTIwY2xlYW58ZW58MXx8fHwxNzU5MDUzMDMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
  
  const values = [
    {
      icon: Heart,
      title: "Passion for Quality",
      description: "Every product is crafted with love and attention to detail, ensuring the highest quality standards."
    },
    {
      icon: Users,
      title: "Family Tradition",
      description: "Our recipes are passed down through generations, preserving authentic Pakistani flavors."
    },
    {
      icon: Award,
      title: "Excellence in Taste",
      description: "We never compromise on taste, using only the finest ingredients and traditional cooking methods."
    },
    {
      icon: Leaf,
      title: "Fresh Ingredients",
      description: "We source our ingredients from trusted suppliers to ensure freshness and authenticity."
    }
  ];

  const team = [
    {
      name: "Chef Ahmed Khan",
      role: "Head Chef & Founder",
      image: "https://images.unsplash.com/photo-1659354219050-8ea76f10c2f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjaGVmJTIwcG9ydHJhaXQlMjBtaW5pbWFsJTIwZWxlZ2FudHxlbnwxfHx8fDE3NTkwNTMwMzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "With over 20 years of culinary experience, Chef Ahmed brings authentic Pakistani flavors to every dish."
    },
    {
      name: "Fatima Ali",
      role: "Quality Manager",
      image: "https://images.unsplash.com/photo-1650784854945-264d5b0b6b07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHRlYW0lMjBwb3J0cmFpdCUyMGNsZWFuJTIwbWluaW1hbHxlbnwxfHx8fDE3NTkwNTMwMzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Fatima ensures every product meets our rigorous quality standards before reaching your table."
    },
    {
      name: "Omar Sheikh",
      role: "Operations Director",
      image: "https://images.unsplash.com/photo-1650784854945-264d5b0b6b07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHRlYW0lMjBwb3J0cmFpdCUyMGNsZWFuJTIwbWluaW1hbHxlbnwxfHx8fDE3NTkwNTMwMzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Omar oversees our operations to ensure timely delivery and customer satisfaction."
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
            className="text-center mb-16 space-y-6"
          >
            <h1 className="text-5xl lg:text-6xl text-slate-900 brand-font tracking-tight">
              About <span className="text-emerald-800 italic">Lahori Samosa</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Bringing authentic Pakistani flavors to your home with premium quality frozen foods
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-8 text-center"
            >
              <div className="space-y-6">
                <h2 className="text-3xl text-slate-900 brand-font">Our Story</h2>
                <p className="text-slate-600 leading-relaxed">
                  Lahori Samosa was born from a simple yet powerful vision: to make authentic Pakistani cuisine accessible to everyone, everywhere. Founded in 2020 by a team of passionate food lovers, we recognized the need for high-quality, convenient frozen foods that don't compromise on traditional flavors.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Our journey began in a small kitchen in Lahore, where our founder, Chaudhry Sheraz Iqbal, started experimenting with freezing techniques that would preserve the authentic taste and texture of traditional Pakistani snacks.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Today, we're proud to serve thousands of customers who trust us to deliver restaurant-quality food to their homes. Every samosa, cutlet, and roll we produce carries with it the love and care of traditional cooking.
                </p>
              </div>

              <Link to="/products">
                <motion.button
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 20px 40px -12px rgba(6, 78, 59, 0.3)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-8 py-4 bg-emerald-800 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span className="flex items-center space-x-2">
                    <span>Explore Our Products</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 bg-white relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-emerald-200 to-transparent"></div>
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-amber-200 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="text-4xl text-slate-900 brand-font">Our Values</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              The principles that guide us in everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ 
                  y: -8,
                  scale: 1.02,
                  rotateX: 5
                }}
                className="group text-center p-8 bg-white rounded-xl hover:shadow-2xl transition-all duration-300 border border-slate-100"
                style={{
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-all duration-300"
                >
                  <value.icon className="w-8 h-8 text-emerald-700" />
                </motion.div>
                <h3 className="text-lg text-slate-900 mb-4 group-hover:text-emerald-800 transition-colors">
                  {value.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team - Hidden for now */}
      {/* 
      <section className="py-24 bg-gradient-to-br from-slate-50 to-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-100/40 to-transparent rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="text-4xl text-slate-900 brand-font">Meet Our Team</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              The passionate people behind Lahori Samosa who work tirelessly to bring you the best
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ 
                  y: -8,
                  scale: 1.02,
                  rotateX: 5
                }}
                className="group bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-slate-100"
              >
                <div className="relative overflow-hidden">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-xl text-slate-900 group-hover:text-emerald-800 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-emerald-700 font-medium">{member.role}</p>
                  <p className="text-slate-600 text-sm leading-relaxed">{member.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* Quality Promise */}
      <section className="py-24 bg-gradient-to-br from-emerald-800 to-emerald-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl text-white brand-font">Our Quality Promise</h2>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
              We guarantee that every product meets our stringent quality standards. If you're not completely satisfied, we'll make it right.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-center space-y-4"
              >
                <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center mx-auto backdrop-blur-sm">
                  <ChefHat className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg text-white">Expert Preparation</h3>
                <p className="text-emerald-100 text-sm leading-relaxed">
                  Every item is prepared by experienced chefs using traditional methods
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-center space-y-4"
              >
                <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center mx-auto backdrop-blur-sm">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg text-white">Fresh Daily</h3>
                <p className="text-emerald-100 text-sm leading-relaxed">
                  Our products are made fresh daily and frozen immediately to lock in flavor
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="text-center space-y-4"
              >
                <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center mx-auto backdrop-blur-sm">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg text-white">Quality Certified</h3>
                <p className="text-emerald-100 text-sm leading-relaxed">
                  All our facilities are certified and regularly inspected for quality assurance
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="text-4xl text-slate-900 brand-font">Ready to Taste the Difference?</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Experience the authentic flavors of Pakistan with our premium frozen foods. Order now and taste the tradition.
            </p>
          </motion.div>
          
          <Link to="/products">
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 25px 50px -12px rgba(6, 78, 59, 0.25)"
              }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-6 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white rounded-lg transition-all duration-300 shadow-xl hover:shadow-2xl text-lg"
            >
              Explore Our Products
            </motion.button>
          </Link>
        </div>
      </section>
    </div>
  );
}