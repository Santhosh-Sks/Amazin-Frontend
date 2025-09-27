import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import { motion } from 'framer-motion';
import productsData from '../data/products.json';

export default function Categories() {
  const [products, setProducts] = useState([]);
  const [active, setActive] = useState('All');
  const [companyFilter, setCompanyFilter] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    setProducts(productsData);
  }, []);

  // derive categories from products so new categories (e.g. Mobiles, Kitchen) are picked up automatically
  const categories = React.useMemo(() => {
    const setCats = new Set(products.map(p => p.category).filter(Boolean));
    return ['All', ...Array.from(setCats)];
  }, [products]);

  // helper to extract a brand/company name from product data
  const getBrand = (p) => {
    if (!p) return 'Other';
    if (p.company) return p.company;
    if (p.brand) return p.brand;
    if (p.title) {
      const m = p.title.match(/^(Redmi|Xiaomi|Samsung|Realme|POCO|VISMAY|PALAK|Zapcase|Vismay)/i);
      if (m) return m[1];
    }
    return 'Other';
  };

  const companies = React.useMemo(() => {
    const setC = new Set(products.map(p => getBrand(p)).filter(Boolean));
    return ['All', ...Array.from(setC)];
  }, [products]);

  // Apply category, company and price filters
  const visible = products.filter(p => {
    if (active !== 'All' && p.category !== active) return false;
    if (companyFilter !== 'All' && getBrand(p) !== companyFilter) return false;
    if (minPrice !== '') {
      const min = parseFloat(minPrice);
      if (!isNaN(min) && (typeof p.price !== 'number' || p.price < min)) return false;
    }
    if (maxPrice !== '') {
      const max = parseFloat(maxPrice);
      if (!isNaN(max) && (typeof p.price !== 'number' || p.price > max)) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Browse Categories</h1>
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActive(cat)} className={`px-4 py-2 rounded-full text-sm font-medium border transition shadow-sm ${active === cat ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>{cat}</button>
        ))}
      </div>

      {/* Filters: company and price */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">Company:</label>
          <select className="px-3 py-2 border rounded-md" value={companyFilter} onChange={e => setCompanyFilter(e.target.value)}>
            {companies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">Price:</label>
          <input type="number" placeholder="Min" className="w-24 px-3 py-2 border rounded-md" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
          <input type="number" placeholder="Max" className="w-24 px-3 py-2 border rounded-md" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
          <button onClick={() => { setMinPrice(''); setMaxPrice(''); setCompanyFilter('All'); }} className="px-3 py-2 bg-gray-100 rounded-md">Clear</button>
        </div>
      </div>

      <motion.div
        className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
      >
        {visible.map(p => (
          <motion.div key={p.id} variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
            <ProductCard product={p} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
