import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function ProductCard({ product }) {
  const [clicks, setClicks] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchCount() {
      try {
        const res = await axios.get(`/api/affiliate/count?asin=${encodeURIComponent(product.affiliateLink)}`);
        if (!mounted) return;
        setClicks(res.data.count || 0);
      } catch (e) {
        // ignore errors for this non-critical feature
      }
    }
    fetchCount();
    return () => { mounted = false; };
  }, [product]);

  async function handleBuyClick(e) {
    e.preventDefault();
    try {
      // Register the click with the backend using the correct 'asin' key
      await axios.post('/api/affiliate/click', { asin: product.affiliateLink });
    } catch (err) { 
      // Ignore errors, the user should still be redirected
    }
    // Open the affiliate link in a new tab
    window.open(product.affiliateLink, '_blank', 'noopener');
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition p-4 border border-gray-100 flex flex-col relative overflow-hidden"
    >
      <div className="aspect-square overflow-hidden rounded-lg mb-4 relative bg-gray-50">
        <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      </div>
      <h3 className="font-semibold text-gray-800 line-clamp-2 flex-1 group-hover:text-indigo-600 transition-colors">{product.title}</h3>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-lg font-bold text-indigo-600">${product.price}</span>
        <a
          href={product.affiliateLink}
          onClick={handleBuyClick}
          className="inline-flex items-center justify-center px-3 py-1.5 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Buy
        </a>
      </div>
      <span className="absolute top-3 left-3 text-[10px] uppercase tracking-wide font-semibold bg-white/90 px-2 py-0.5 rounded-full text-indigo-600 shadow">Deal</span>
      {clicks !== null && (
        <div className="absolute top-3 right-3 text-[11px] bg-white/90 px-2 py-0.5 rounded-full text-gray-800 font-medium">{clicks} clicks</div>
      )}
    </motion.div>
    );
  }