import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Ensure axios targets the backend API during development. Set VITE_API_BASE in .env to override.
const API_BASE = import.meta.env?.VITE_API_BASE || 'http://localhost:4000';
axios.defaults.baseURL = API_BASE;

const AuthContext = createContext(null);
const OTP_EXP_MIN = Number(import.meta.env?.VITE_OTP_EXP_MINUTES || 5);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('amazin_token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stage, setStage] = useState('credentials');
  const [otpEmail, setOtpEmail] = useState(null);
  const [otpInput, setOtpInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [adminLoginAttempt, setAdminLoginAttempt] = useState(false);

  // ensure axios has auth header when token exists
  useEffect(() => {
    if (token) {
      localStorage.setItem('amazin_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('amazin_token');
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // on mount, if token exists, fetch /me
  useEffect(() => {
    async function init() {
      if (!token) return;
      try {
        setLoading(true);
        const res = await axios.get('/api/auth/me');
        setUser(res.data.user);
      } catch (e) {
        console.warn('me fetch failed', e?.response?.data || e.message);
        setToken(null);
        setUser(null);
      } finally { 
        setLoading(false); 
      }
    }
    init();
  }, [token]);

  async function loginWithEmail(email, password, isAdmin = false) {
    setError(null); 
    setLoading(true);
    setAdminLoginAttempt(!!isAdmin);
    
    try {
      const res = await axios.post('/api/auth/login', { 
        email, 
        password, 
        asAdmin: !!isAdmin 
      });
      
      if (res.data.needsVerification) {
        setStage('otp');
        setOtpEmail(email);
        setTimeLeft(OTP_EXP_MIN * 60);
        const id = setInterval(() => 
          setTimeLeft(t => { 
            if (t <= 1) { 
              clearInterval(id); 
              return 0; 
            } 
            return t - 1; 
          }), 1000);
      } else if (res.data.token) {
        if (isAdmin && res.data.user && res.data.user.role !== 'admin') {
          setError('Not an admin — access denied');
          setAdminLoginAttempt(false);
          return;
        }
        setToken(res.data.token);
        setUser(res.data.user);
        navigate(isAdmin ? '/dashboard' : '/home');
      }
    } catch (e) {
      setError(e?.response?.data?.error || 'Login failed');
    } finally { 
      setLoading(false); 
    }
  }

  async function register(email, password, name) {
    setError(null); 
    setLoading(true);
    
    try {
      await axios.post('/api/auth/register', { email, password, name });
      setStage('otp');
      setOtpEmail(email);
      setTimeLeft(OTP_EXP_MIN * 60);
      const id = setInterval(() => 
        setTimeLeft(t => { 
          if (t <= 1) { 
            clearInterval(id); 
            return 0; 
          } 
          return t - 1; 
        }), 1000);
      return { ok: true };
    } catch (e) {
      const err = e?.response?.data?.error || 'Register failed';
      setError(err);
      return { ok: false, error: err };
    } finally { 
      setLoading(false); 
    }
  }

  async function verifyOtp(code) {
    const payloadCode = code || otpInput;
    if (!otpEmail) return setError('Missing email');
    
    try {
      const res = await axios.post('/api/auth/verify-otp', { 
        email: otpEmail, 
        code: payloadCode 
      });
      
      if (res.data.token) {
        if (adminLoginAttempt && res.data.user && res.data.user.role !== 'admin') {
          setError('Not an admin — access denied');
          setStage('credentials');
          setOtpEmail(null);
          setOtpInput('');
          setTimeLeft(0);
          setAdminLoginAttempt(false);
          return;
        }
        setToken(res.data.token);
        setUser(res.data.user);
        setStage('credentials');
        setOtpEmail(null);
        setOtpInput('');
        setTimeLeft(0);
        setError(null);
        navigate(adminLoginAttempt ? '/dashboard' : '/home');
        setAdminLoginAttempt(false);
      }
    } catch (e) {
      setError(e?.response?.data?.error || 'Verification failed');
    }
  }

  async function logout() {
    setToken(null);
    setUser(null);
    setStage('credentials');
    setOtpEmail(null);
    setOtpInput('');
    setTimeLeft(0);
    setError(null);
    setAdminLoginAttempt(false);
    navigate('/');
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      stage,
      loading,
      error,
      loginWithEmail,
      register,
      verifyOtp,
      otpInput,
      setOtpInput,
      timeLeft,
      otpEmail,
      logout,
      isAdmin: user?.role === 'admin',
      isLoggedIn: !!token
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { 
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context; 
}