import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminLogin() {
  const { user, stage, loading, error, loginWithEmail, resendOtp, verifyOtp, otpInput, setOtpInput, timeLeft, otpEmail, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (user) return (
    <div className="max-w-md mx-auto py-20 text-center space-y-4">
      <h1 className="text-2xl font-bold">Welcome {user.name ? <span className="text-indigo-600">{user.name}</span> : <span className="text-indigo-600">{user.role}</span>}</h1>
      <p className="text-gray-600 break-all text-sm">Role: <strong className="text-indigo-600">{user.role}</strong></p>
      <button onClick={logout} className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm">Logout</button>
    </div>
  );

  return (
    <div className="max-w-lg mx-auto py-16 px-4">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Secure Login</h1>
        <p className="text-gray-500 text-sm mt-2">Step {stage === 'credentials' ? '1' : '2'} of 2</p>
      </div>

      {stage === 'credentials' && (
        <div className="bg-white rounded-xl shadow p-8 space-y-6 border border-gray-100">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} type="email" autoComplete="email" className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input value={password} onChange={e=>setPassword(e.target.value)} type="password" autoComplete="current-password" className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500" placeholder="••••••••" />
          </div>
          <button disabled={loading || !email || !password} onClick={()=>loginWithEmail(email,password,true)} className="w-full py-3 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">Continue</button>
          <p className="text-xs text-gray-500">Enter admin email and password. Emails are validated against the admin list in the database.</p>
        </div>
      )}

      {stage === 'otp' && (
        <div className="bg-white rounded-xl shadow p-8 space-y-6 border border-gray-100">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Verify OTP</h2>
            <p className="text-sm text-gray-500">Code sent to <span className="font-medium text-gray-700">{otpEmail}</span></p>
          </div>
          <div className="flex gap-2 items-center">
            <input value={otpInput} onChange={e=>setOtpInput(e.target.value)} maxLength={6} placeholder="Enter 6-digit code" className="flex-1 px-4 py-3 rounded-lg border tracking-widest text-center font-mono focus:ring-2 focus:ring-indigo-500" />
            <button onClick={verifyOtp} disabled={otpInput.length!==6} className="px-4 py-3 rounded-lg bg-indigo-600 text-white font-semibold disabled:opacity-40">Verify</button>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{timeLeft > 0 ? `Expires in ${Math.floor(timeLeft/60)}m ${timeLeft%60}s` : 'Expired'}</span>
            <button onClick={resendOtp} className="text-indigo-600 hover:underline disabled:opacity-40" disabled={timeLeft===0 ? false : false}>Resend</button>
          </div>
          <button onClick={() => window.location.reload()} className="w-full text-xs text-gray-400 hover:text-gray-500 mt-2">Start over</button>
        </div>
      )}

      {error && <p className="mt-6 text-sm text-red-600 text-center">{error}</p>}
    </div>
  );
}
