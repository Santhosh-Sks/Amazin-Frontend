import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register, stage, otpEmail, otpInput, setOtpInput, verifyOtp, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  async function onRegister(e){
    e.preventDefault();
    const res = await register(email, password, name);
    if (res.ok) {
      // stay on page, user will see OTP stage from context
    }
  }

  if (stage === 'otp') {
    return (
      <div className="max-w-md mx-auto py-20">
        <h2 className="text-xl font-semibold">Verify your account</h2>
        <p className="text-sm text-gray-500">A code was sent to {otpEmail}</p>
        <div className="mt-4 flex gap-2">
          <input value={otpInput} onChange={e=>setOtpInput(e.target.value)} maxLength={6} className="flex-1 px-3 py-2 border rounded" />
          <button onClick={()=>verifyOtp()} className="px-4 py-2 bg-indigo-600 text-white rounded">Verify</button>
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <h2 className="text-2xl font-bold mb-4">Create account</h2>
      <form onSubmit={onRegister} className="space-y-4 bg-white p-6 rounded shadow">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="w-full px-3 py-2 border rounded" />
        <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Email" className="w-full px-3 py-2 border rounded" />
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full px-3 py-2 border rounded" />
        <div className="flex gap-2">
          <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded">Create account</button>
          <button type="button" onClick={()=>navigate('/login')} className="px-4 py-2 border rounded">Login</button>
        </div>
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </div>
  );
}
