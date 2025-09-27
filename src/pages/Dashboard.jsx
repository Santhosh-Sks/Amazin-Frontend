import React, { useEffect, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Pie, PieChart, Cell, Legend } from 'recharts';
import ordersData from '../data/orders.json'; // Import directly instead of axios call

export default function Dashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Load data from imported JSON instead of API call
    setOrders(ordersData);
  }, []);

  const byCategory = useMemo(() => {
    const map = {};
    orders.forEach(o => { map[o.category] = (map[o.category] || 0) + 1; });
    return Object.entries(map).map(([category, count]) => ({ category, count }));
  }, [orders]);

  const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'];

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(orders.map(o => ({
      'Order ID': o.id,
      'Product Name': o.productName,
      'Category': o.category,
      'Date': o.date,
      'Status': o.status,
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    XLSX.writeFile(wb, 'orders_report.xlsx');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <button onClick={exportExcel} className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow">
          Export to Excel
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
          <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-500">Delivered</h3>
          <p className="text-2xl font-bold text-green-600">
            {orders.filter(o => o.status === 'Delivered').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-500">Shipped</h3>
          <p className="text-2xl font-bold text-blue-600">
            {orders.filter(o => o.status === 'Shipped').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-500">Processing</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {orders.filter(o => o.status === 'Processing').length}
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 mb-12">
        <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
          <h2 className="font-semibold mb-4">Orders by Category (Bar)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byCategory}>
                <XAxis dataKey="category" stroke="#6B7280" />
                <YAxis stroke="#6B7280" allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366F1" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
          <h2 className="font-semibold mb-4">Orders Share (Pie)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byCategory} dataKey="count" nameKey="category" outerRadius={100} label>
                  {byCategory.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-100 p-6 overflow-x-auto">
        <h2 className="font-semibold mb-4">Recent Orders</h2>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="py-2 pr-4 font-medium">Order ID</th>
              <th className="py-2 pr-4 font-medium">Product Name</th>
              <th className="py-2 pr-4 font-medium">Category</th>
              <th className="py-2 pr-4 font-medium">Date</th>
              <th className="py-2 pr-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-b last:border-0">
                <td className="py-2 pr-4 font-mono text-xs">{o.id}</td>
                <td className="py-2 pr-4">{o.productName}</td>
                <td className="py-2 pr-4">{o.category}</td>
                <td className="py-2 pr-4">{o.date}</td>
                <td className="py-2 pr-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    o.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                    o.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 
                    o.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}