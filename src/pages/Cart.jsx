import React from 'react';
import { Link } from 'react-router-dom';

export default function Cart(){
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Cart</h1>
      <div className="border rounded p-6 text-center">
        <p className="mb-4">Your cart is empty.</p>
        <Link to="/home" className="px-4 py-2 bg-indigo-600 text-white rounded">Continue shopping</Link>
      </div>
    </div>
  );
}
