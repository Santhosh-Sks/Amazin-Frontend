import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import home from "./pages/Home";

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center px-6">
      <div className="max-w-6xl w-full grid md:grid-cols-2 items-center gap-12">
        
        {/* Left Side: Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-left"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
            Welcome to
          </h2>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6">
            Amazin Mart
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Discover amazing products at unbeatable prices. From electronics to fashion, 
            home essentials to beauty products - we have everything you need. 
            Shop with confidence and enjoy fast, reliable delivery to your doorstep.
          </p>

          <div className="flex gap-4">
            <Link to="/home">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-full shadow-md hover:bg-blue-700 transition-colors"
              >
                Shop Now
              </motion.button>
            </Link>
            
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-transparent border-2 border-blue-600 text-blue-600 font-bold rounded-full shadow-md hover:bg-blue-600 hover:text-white transition-all"
              >
                Join Now
              </motion.button>
            </Link>
          </div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 grid grid-cols-3 gap-4 text-center"
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h1.586a1 1 0 01.707.293l1.414 1.414a1 1 0 00.707.293H19a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <span className="text-sm text-gray-600 font-medium">Free Shipping</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm text-gray-600 font-medium">Quality Products</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm text-gray-600 font-medium">24/7 Support</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side: Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex justify-center"
        >
          <div className="relative">
            {/* Placeholder for shopping illustration */}
            <div className="w-96 h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-lg">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">Shop Amazing Products</h3>
                <p className="text-gray-500 text-sm">Thousands of items waiting for you</p>
              </div>
            </div>
            
            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
            >
              <span className="text-2xl">🛒</span>
            </motion.div>
            
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-4 -left-4 w-12 h-12 bg-red-400 rounded-full flex items-center justify-center shadow-lg"
            >
              <span className="text-lg">💎</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Landing;
