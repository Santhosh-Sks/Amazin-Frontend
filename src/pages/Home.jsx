import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard.jsx';
import productsData from '../data/products.json';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    setProducts(productsData);
  }, []);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(query), 250);
    return () => clearTimeout(id);
  }, [query]);

  const categories = useMemo(() => {
    const map = new Map();
    products.forEach(p => {
      if (!map.has(p.category)) map.set(p.category, []);
      map.get(p.category).push(p);
    });
    return ['All', ...Array.from(map.keys())].map(name => ({
      name,
      items: map.get(name) || [],
      image: (map.get(name) && map.get(name)[0]?.image) || '/avatar.png'
    }));
  }, [products]);

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    return products.filter(p => {
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (!q) return true;
      return [p.title, p.category].some(f => f.toLowerCase().includes(q));
    });
  }, [products, debounced, selectedCategory]);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(99,102,241,0.18),transparent_40%),radial-gradient(circle_at_80%_50%,rgba(236,72,153,0.14),transparent_40%)]" />
        <div className="max-w-7xl mx-auto px-4 pt-12 pb-16 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <h1 className="text-4xl sm:text-5xl font-extrabold">Amazin Mart — curated deals</h1>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">Find top products across categories with great affiliate deals. Optimized for modern apps and mobile-first experiences.</p>

              <div className="mt-6 flex gap-3">
                <a href="#products" className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-indigo-600 text-white font-semibold shadow-lg hover:scale-[1.02] transform transition">Shop featured</a>
                <a href="/categories" className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-gray-200 hover:bg-gray-50 transition">Browse categories</a>
              </div>

              <div className="mt-8 max-w-lg">
                <div className="relative">
                  <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products, brands, categories..." className="w-full px-4 py-3 rounded-full border focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm" />
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="hidden md:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-6 shadow-xl">
                  <h3 className="text-xl font-bold">Exclusive Picks</h3>
                  <p className="mt-2 text-sm opacity-90">Handpicked items with best discounts.</p>
                </div>
                <div className="rounded-2xl bg-white p-6 shadow-inner border border-gray-100">
                  <h3 className="text-lg font-semibold">Fast delivery</h3>
                  <p className="mt-2 text-sm text-gray-600">Partnered stores with quick shipping.</p>
                </div>
                <div className="rounded-2xl bg-white p-6 shadow-inner border border-gray-100">
                  <h3 className="text-lg font-semibold">Secure checkout</h3>
                  <p className="mt-2 text-sm text-gray-600">Trusted payment flows via partners.</p>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-pink-500 to-yellow-400 text-white p-6 shadow-xl">
                  <h3 className="text-lg font-semibold">Mobile friendly</h3>
                  <p className="mt-2 text-sm opacity-90">Optimized for small screens.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modern Category Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <h2 className="text-2xl font-semibold mb-4">Shop by Category</h2>
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map(cat => (
            <motion.button
              layout
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-shadow shadow-sm ${selectedCategory === cat.name ? 'ring-2 ring-indigo-400 bg-indigo-50' : 'bg-white'} border border-gray-100`}
            >
              <div className="h-20 w-20 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                <img src={cat.image} alt={cat.name} className="object-cover w-full h-full" />
              </div>
              <div className="text-center">
                <div className={`font-semibold ${selectedCategory===cat.name ? 'text-indigo-700' : 'text-gray-800'}`}>{cat.name}</div>
                <div className="text-xs text-gray-500">{cat.name === 'All' ? products.length : cat.items.length} items</div>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </section>

      <section id="products" className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <span className="text-sm text-gray-500">{filtered.length} items</span>
        </div>
        {filtered.length === 0 && (
          <p className="text-sm text-gray-500 mb-6">No products match "{debounced}".</p>
        )}
        <motion.div
          className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
        >
          {filtered.map(p => (
            <motion.div key={p.id} variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
              <ProductCard product={p} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Why shop with us</h2>
          <p className="text-gray-600">Fast, curated deals optimized for mobile and desktop. Easy checkout via affiliate partners.</p>
        </div>
      </section>
    </div>
  );
}
