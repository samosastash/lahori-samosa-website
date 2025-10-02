import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingCart, Star, Plus } from 'lucide-react';
import { useCart, Product } from './CartContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function ProductsPage() {
  const { dispatch } = useCart();
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const products: Product[] = [
    {
      id: '1',
      name: 'Pizza Samosa (12p)',
      price: 650,
      image: '/images/products/PIZZA.jpg',
      description: 'Delicious pizza-flavored samosas with melted cheese and savory toppings.'
    },
    {
      id: '2',
      name: 'Bar.B.Q Samosa (12p)',
      price: 600,
      image: '/images/products/BBQ.jpg',
      description: 'Smoky barbecue flavored samosas with tender meat and aromatic spices.'
    },
    {
      id: '3',
      name: 'Malai Boti Samosa (12p)',
      price: 480,
      image: '/images/products/BOTI.jpg',
      description: 'Creamy malai boti samosas with rich, flavorful filling.'
    },
    {
      id: '4',
      name: 'Macaroni Samosa (12p)',
      price: 350,
      image: '/images/products/MAC.png',
      description: 'Unique macaroni-filled samosas with cheesy goodness.'
    },
    {
      id: '5',
      name: 'Potato Samosa (12p)',
      price: 300,
      image: '/images/products/POTATO.jpg',
      description: 'Classic potato samosas with perfectly spiced filling.'
    },
    {
      id: '6',
      name: 'Chicken Qeema Samosa',
      price: 450,
      image: '/images/hero/CHICKKE~2.jpg',
      description: 'Tender chicken qeema samosas with authentic Pakistani flavors.'
    },
    {
      id: '7',
      name: 'Chicken Vegetable Roll',
      price: 560,
      image: '/images/products/VEGCHICROLL.jpg',
      description: 'Chicken and vegetable rolls perfect for any occasion.'
    }
  ];

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: 'ADD_TO_CART', product });
  };

  return (
    <div className="pt-16 bg-white min-h-screen">
      {/* Page Header */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-gray-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-100/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-amber-100/30 to-transparent rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h1 className="text-5xl text-slate-900 brand-font tracking-tight">
              Premium Products
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Discover our complete range of authentic frozen foods, 
              crafted with care and bursting with traditional flavors.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  rotateX: 5
                }}
                onHoverStart={() => setHoveredProduct(product.id)}
                onHoverEnd={() => setHoveredProduct(null)}
                className="group cursor-pointer"
              >
                <Link to={`/product/${product.id}`}>
                  <div 
                    className="bg-white rounded-xl overflow-hidden transition-all duration-300 border border-slate-100 hover:border-emerald-200"
                    style={{
                      boxShadow: hoveredProduct === product.id 
                        ? "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(6, 78, 59, 0.1)"
                        : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                    }}
                  >
                    {/* Product Image */}
                    <div className="relative overflow-hidden bg-slate-50">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Add to Cart Button - appears on hover */}
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ 
                          opacity: hoveredProduct === product.id ? 1 : 0,
                          scale: hoveredProduct === product.id ? 1 : 0.8
                        }}
                        onClick={(e) => handleAddToCart(product, e)}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 flex items-center justify-center text-emerald-700"
                      >
                        <Plus className="w-5 h-5" />
                      </motion.button>
                    </div>

                    {/* Product Info */}
                    <div className="p-6 space-y-4">
                      {/* Rating */}
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                        ))}
                      </div>
                      
                      {/* Product Name */}
                      <h3 className="text-lg text-slate-900 group-hover:text-emerald-800 transition-colors font-medium">
                        {product.name}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                        {product.description}
                      </p>
                      
                      {/* Price and Action */}
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-2xl text-slate-900 font-medium brand-font">
                          Rs.{product.price}
                        </span>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => handleAddToCart(product, e)}
                          className="p-2 bg-emerald-800 text-white rounded-lg hover:bg-emerald-900 transition-colors shadow-sm hover:shadow-md"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="text-3xl text-slate-900 brand-font">
              Need Help Choosing?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our team is here to help you find the perfect products for your taste and occasion.
            </p>
          </motion.div>
          
          <Link to="/contact">  
            <motion.button
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 20px 40px -12px rgba(6, 78, 59, 0.25)"
              }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-emerald-800 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
            >
              Get in Touch
            </motion.button>
          </Link>
        </div>
      </section>
    </div>
  );
}