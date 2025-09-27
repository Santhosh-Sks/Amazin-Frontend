import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';

const navLinks = [
  { to: '/home', label: 'Home' },
  { to: '/categories', label: 'Categories' },
  { to: '/orders', label: 'Orders' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/admin', label: 'Admin' },
];

export default function Navbar(){
  const { user, logout, updateName } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{ if(user) setNameInput(user.name || ''); }, [user]);

  const avatarLetter = user ? ((user.name && user.name.trim()[0]) || user.email[0]).toUpperCase() : null;

  return (
    <header className="backdrop-blur-md bg-white/60 border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-16 md:h-20">

          {/* Left: mobile menu button + logo */}
          <div className="flex items-center gap-3 w-1/3 md:w-auto">
            <button onClick={()=>setMenuOpen(true)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <motion.button onClick={() => navigate('/home')} whileHover={{ scale: 1.02 }} className="flex items-center gap-3 focus:outline-none">
              <img src="/avatar.png" alt="logo" className="h-10 w-10 rounded-full shadow-md" />
              <div className="hidden sm:block">
                <div className="text-lg font-bold leading-none">Amazin Mart</div>
                <div className="text-xs text-gray-500 -mt-0.5">Curated deals</div>
              </div>
            </motion.button>
          </div>

          {/* Center: Search (prominent) */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="w-full max-w-2xl">
              <div className="relative">
                <input placeholder="Search products, categories or brands" className="w-full px-4 py-3 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-indigo-700">Search</button>
              </div>
            </div>
          </div>

          {/* Right: links, cart, avatar */}
          <div className="ml-auto flex items-center gap-3 w-1/3 md:w-auto justify-end">
            <nav className="hidden md:flex items-center gap-4">
              {navLinks.slice(0,3).map(l=> (
                <NavLink key={l.to} to={l.to} className={({isActive}) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-600'}`}>
                  {l.label}
                </NavLink>
              ))}
            </nav>

            <button onClick={() => navigate('/cart')} aria-label="Open cart" className="relative p-2 rounded-full hover:bg-gray-100">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4"/></svg>
              {/* cart count badge (update later when cart state is wired) */}
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-xs bg-red-500 text-white" style={{display:'none'}}>0</span>
            </button>

            {/* Avatar / login */}
            <div className="relative">
              {user ? (
                <>
                  <motion.button whileTap={{ scale: 0.98 }} onClick={() => setProfileOpen(s => !s)} className="flex items-center gap-2 p-1 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-400 text-white flex items-center justify-center font-semibold shadow">{avatarLetter}</div>
                    <div className="hidden lg:block text-sm text-gray-700">{user.name || user.email}</div>
                  </motion.button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute right-0 mt-2 w-56 bg-white border rounded shadow-lg p-3 z-50">
                        {!editing ? (
                          <div>
                            <div className="text-sm font-semibold mb-2">{user.name || user.email}</div>
                            <button onClick={() => { setEditing(true); setProfileOpen(false); }} className="w-full text-left px-2 py-2 hover:bg-gray-100 rounded">Edit name</button>
                            <button onClick={() => { logout(); setProfileOpen(false); navigate('/home'); }} className="w-full text-left px-2 py-2 hover:bg-gray-100 rounded">Logout</button>
                          </div>
                        ) : (
                          <div>
                            <input value={nameInput} onChange={e=>setNameInput(e.target.value)} className="w-full px-2 py-2 border rounded mb-2" />
                            <div className="flex gap-2">
                              <button onClick={async ()=>{ const ok = await updateName(nameInput); if(ok) setEditing(false); }} className="flex-1 py-2 bg-indigo-600 text-white rounded">Save</button>
                              <button onClick={()=>setEditing(false)} className="py-2 px-3 border rounded">Cancel</button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link to="/login" className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-indigo-600 text-white shadow-sm hover:bg-indigo-700">Login</Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 z-40 bg-black/40">
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="w-80 max-w-full bg-white h-full p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <img src="/avatar.png" className="h-10 w-10 rounded-full" alt="logo" />
                  <div>
                    <div className="font-bold">Amazin Mart</div>
                    <div className="text-xs text-gray-500">Curated deals</div>
                  </div>
                </div>
                <button onClick={()=>setMenuOpen(false)} className="p-2 rounded hover:bg-gray-100">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>

              <nav className="flex flex-col gap-2">
                {navLinks.map(l => (
                  <Link key={l.to} to={l.to} onClick={()=>setMenuOpen(false)} className="py-3 px-2 rounded hover:bg-gray-50 font-medium">{l.label}</Link>
                ))}
              </nav>

              <div className="mt-6 border-t pt-4">
                {user ? (
                  <div>
                    <div className="font-semibold">{user.name || user.email}</div>
                    <button onClick={() => { logout(); setMenuOpen(false); navigate('/home'); }} className="mt-2 w-full text-left py-2 rounded hover:bg-gray-50">Logout</button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login" onClick={()=>setMenuOpen(false)} className="block w-full text-center py-3 rounded bg-indigo-600 text-white">Login</Link>
                    <Link to="/register" onClick={()=>setMenuOpen(false)} className="block w-full text-center py-3 rounded border">Sign up</Link>
                  </div>
                )}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
