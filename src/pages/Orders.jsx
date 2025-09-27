import React, { useEffect, useState } from 'react';
import products from '../data/products.json';
import { useAuth } from '../context/AuthContext.jsx';

export default function Orders() {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [placed, setPlaced] = useState([]);

  function addToCart(p) {
    setCart(c => [...c, p]);
  }

  function placeOrder() {
    if (!user) return alert('Login with OTP first (admin/customer)');
    const mapped = cart.map((p,i) => ({
      id: 'ORD-LIVE-' + Date.now() + '-' + i,
      productName: p.title,
      category: p.category,
      date: new Date().toISOString().slice(0,10),
      status: 'Processing',
      user: user.phone
    }));
    setPlaced(o => [...mapped, ...o]);
    setCart([]);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Place Orders</h1>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-12">
        {products.slice(0,8).map(p => (
          <div key={p.id} className="group p-4 rounded-xl border bg-white flex flex-col shadow-sm hover:shadow-lg transition relative overflow-hidden">
            <div className="aspect-square overflow-hidden rounded-lg mb-3 bg-gray-50">
              <img src={p.image} alt={p.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <h3 className="font-semibold text-sm flex-1 group-hover:text-indigo-600 transition-colors">{p.title}</h3>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-indigo-600 font-bold text-sm">${p.price}</span>
              <button onClick={()=>addToCart(p)} className="text-xs px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">Add</button>
            </div>
            <span className="absolute top-3 left-3 text-[10px] uppercase tracking-wide font-semibold bg-white/90 px-2 py-0.5 rounded-full text-indigo-600 shadow">Deal</span>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="bg-white rounded-xl p-6 border">
          <h2 className="font-semibold mb-4">Cart ({cart.length})</h2>
          {cart.length===0 && <p className="text-sm text-gray-500">No items.</p>}
          <ul className="space-y-2 text-sm">
            {cart.map((c,i)=>(<li key={i} className="flex justify-between border-b pb-1 last:border-0"><span>{c.title.slice(0,28)}...</span><span>${c.price}</span></li>))}
          </ul>
          <button disabled={!cart.length} onClick={placeOrder} className="mt-4 w-full py-2.5 rounded-md font-medium bg-green-600 disabled:opacity-40 text-white hover:bg-green-700">Place Order</button>
        </div>
        <div className="bg-white rounded-xl p-6 border">
          <h2 className="font-semibold mb-4">Recent Placed ({placed.length})</h2>
          {placed.length===0 && <p className="text-sm text-gray-500">No orders placed yet.</p>}
          <div className="max-h-72 overflow-auto text-xs">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-1 pr-2">Order ID</th>
                  <th className="py-1 pr-2">Product</th>
                  <th className="py-1 pr-2">User</th>
                  <th className="py-1 pr-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {placed.map(o => (
                  <tr key={o.id} className="border-b last:border-0">
                    <td className="py-1 pr-2 font-mono">{o.id.slice(-10)}</td>
                    <td className="py-1 pr-2">{o.productName.slice(0,18)}...</td>
                    <td className="py-1 pr-2">{o.user}</td>
                    <td className="py-1 pr-2">{o.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
