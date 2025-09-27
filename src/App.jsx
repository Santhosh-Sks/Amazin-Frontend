import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Landing from './pages/Landing.jsx';
import Home from './pages/Home.jsx';
import Categories from './pages/Categories.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Orders from './pages/Orders.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import UserLogin from './pages/UserLogin.jsx';
import Register from './pages/Register.jsx';
import Cart from './pages/Cart.jsx';

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
};

const Protected = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <AdminLogin />;
  if (role && user.role !== role) {
    return <div className="p-8 text-center">Access Denied</div>;
  }
  return children;
};

export default function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* Show Landing page first */}
              <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />

              {/* Then allow navigation to Home and others */}
              <Route path="/home" element={<PageWrapper><Home /></PageWrapper>} />
              <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />
              <Route path="/categories" element={<PageWrapper><Categories /></PageWrapper>} />
              <Route path="/orders" element={<PageWrapper><Orders /></PageWrapper>} />
              <Route path="/login" element={<PageWrapper><UserLogin /></PageWrapper>} />
              <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
              <Route
                path="/dashboard"
                element={
                  <Protected role="admin">
                    <PageWrapper><Dashboard /></PageWrapper>
                  </Protected>
                }
              />
              <Route path="/admin" element={<PageWrapper><AdminLogin /></PageWrapper>} />

              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
