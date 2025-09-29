import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingCart, Star, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useCart, Product } from './CartContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { dispatch } = useCart();
  const [quantity, setQuantity] = useState(1);

  // In a real app, this would come from an API or database
  const products: Product[] = [
    {
      id: '1',
      name: 'Pizza Samosa (12p)',
      price: 650,
      image: '/images/products/PIZZA.jpg',
      description: 'Delicious pizza-flavored samosas with melted cheese and savory toppings. Made with premium ingredients and traditional recipes, each bite delivers the perfect combination of crispy exterior and cheesy, flavorful filling that will transport you to pizza heaven.'
    },
    {
      id: '2',
      name: 'Bar.B.Q Samosa (12p)',
      price: 600,
      image: '/images/products/BBQ.jpg',
      description: 'Smoky barbecue flavored samosas with tender meat and aromatic spices. These samosas are carefully crafted with authentic BBQ flavors, offering a unique twist on the traditional samosa that will satisfy your cravings for smoky, grilled goodness.'
    },
    {
      id: '3',
      name: 'Malai Boti Samosa (12p)',
      price: 480,
      image: '/images/products/BOTI.jpg',
      description: 'Creamy malai boti samosas with rich, flavorful filling. Made with tender boti pieces in a creamy malai sauce, these samosas offer a luxurious taste experience that combines the best of traditional Pakistani cuisine with modern convenience.'
    },
    {
      id: '4',
      name: 'Macaroni Samosa (12p)',
      price: 350,
      image: '/images/products/MAC.png',
      description: 'Unique macaroni-filled samosas with cheesy goodness. This innovative creation combines the comfort of macaroni and cheese with the crispy texture of samosas, creating a delightful fusion that appeals to both kids and adults.'
    },
    {
      id: '5',
      name: 'Potato Samosa (12p)',
      price: 300,
      image: '/images/products/POTATO.jpg',
      description: 'Classic potato samosas with perfectly spiced filling. Made with fresh potatoes and aromatic spices, these traditional samosas are a timeless favorite that never goes out of style. Perfect for any occasion.'
    },
    {
      id: '6',
      name: 'Chicken Qeema Samosa',
      price: 450,
      image: '/images/hero/CHICKKE~2.jpg',
      description: 'Tender chicken qeema samosas with authentic Pakistani flavors. Made with finely minced chicken and traditional spices, these samosas offer a rich and satisfying taste that represents the true essence of Pakistani cuisine.'
    },
    {
      id: '7',
      name: 'Chicken Veg Table Roll',
      price: 560,
      image: '/images/products/VEGCHICROLL.jpg',
      description: 'Chicken and vegetable rolls perfect for any occasion. These rolls combine tender chicken with fresh vegetables, wrapped in a crispy pastry shell. Ideal for parties, gatherings, or as a delicious snack any time of the day.'
    }
  ];

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-gray-900 mb-4">Product not found</h2>
          <Link to="/products" className="text-orange-600 hover:text-orange-700">
            Return to Products
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch({ type: 'ADD_TO_CART', product });
    }
  };

  return (
    <div className="pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link 
            to="/products"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl overflow-hidden">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-gray-600">(4.8/5 - 124 reviews)</span>
            </div>

            {/* Product Name */}
            <h1 className="text-3xl lg:text-4xl text-gray-900">
              {product.name}
            </h1>

            {/* Price */}
            <div className="text-3xl text-orange-600">
              Rs.{product.price}
            </div>

            {/* Description */}
            <p className="text-gray-600 text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Features */}
            <div className="space-y-3">
              <h3 className="text-lg text-gray-900">Features:</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-orange-600 rounded-full mr-3"></span>
                  Premium quality ingredients
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-orange-600 rounded-full mr-3"></span>
                  Ready to cook from frozen
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-orange-600 rounded-full mr-3"></span>
                  Authentic Pakistani flavors
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-orange-600 rounded-full mr-3"></span>
                  No artificial preservatives
                </li>
              </ul>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <h3 className="text-lg text-gray-900">Quantity:</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </motion.button>
                  <span className="px-4 py-3 text-lg">{quantity}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
                <span className="text-gray-600">
                  Total: Rs.{product.price * quantity}
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center space-x-3 px-8 py-4 bg-orange-600 text-white text-lg rounded-lg hover:bg-orange-700 transition-colors shadow-lg"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Add to Cart</span>
            </motion.button>

            {/* Additional Info */}
            <div className="border-t pt-6 space-y-4 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Cooking Time:</span>
                <span>8-10 minutes</span>
              </div>
              <div className="flex justify-between">
                <span>Storage:</span>
                <span>Keep frozen until ready to cook</span>
              </div>
              <div className="flex justify-between">
                <span>Shelf Life:</span>
                <span>6 months from date of manufacture</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}