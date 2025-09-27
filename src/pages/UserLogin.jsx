import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';

export default function UserLogin() {
  const { user, stage, loading, error, loginWithEmail, resendOtp, verifyOtp, otpInput, setOtpInput, timeLeft, otpEmail, logout, forgotPassword, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);

  if (user) return (
    <div className="max-w-xl mx-auto py-20 text-center space-y-4">
      <h1 className="text-3xl font-extrabold">Welcome back, {user.name || user.email}</h1>
      <p className="text-gray-500">Role: <strong className="text-indigo-600">{user.role}</strong></p>
      <div className="flex items-center justify-center gap-3">
        <button onClick={logout} className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700">Logout</button>
        <Link to="/" className="px-5 py-2 rounded-lg bg-indigo-600 text-white">Go to shop</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left hero */}
        <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="hidden md:flex flex-col gap-4 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl p-10 shadow-xl">
          <h2 className="text-3xl font-bold">Sign in to Amazin Mart</h2>
          <p className="text-indigo-100/90">Fast checkout, personalized deals and saved favorites. Customers can also browse without signing in.</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="p-4 bg-white/10 rounded-lg">Secure payments</div>
            <div className="p-4 bg-white/10 rounded-lg">Personalized deals</div>
            <div className="p-4 bg-white/10 rounded-lg">Order tracking</div>
            <div className="p-4 bg-white/10 rounded-lg">Easy returns</div>
          </div>
          <div className="mt-auto text-sm text-indigo-200">Dont have an account? Use the sign up button on the logo or <Link to="/register" className="font-semibold underline">Create one</Link> — OTP verification will be sent to your email.</div>
        </motion.div>

        {/* Right form */}
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
          <h3 className="text-xl font-semibold mb-4">{isAdminMode ? 'Admin Login' : 'User Login'}</h3>

          {/* Mode selector */}
          <div className="flex gap-3 mb-4">
            <button onClick={() => { setIsAdminMode(false); setEmail(''); setPassword(''); }} className={`flex-1 py-2 rounded-lg ${!isAdminMode ? 'bg-indigo-600 text-white' : 'border'}`}>Continue as user</button>
            <button onClick={() => { setIsAdminMode(true); setEmail(''); setPassword(''); }} className={`flex-1 py-2 rounded-lg ${isAdminMode ? 'bg-indigo-600 text-white' : 'border'}`}>Continue as admin</button>
          </div>

          {stage === 'credentials' && !showForgot && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <input value={email} onChange={e=>setEmail(e.target.value)} type="email" autoComplete="email" className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500" placeholder="you@example.com" />
                <span className="absolute right-3 top-3 text-sm text-gray-400">@</span>
              </div>

              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input value={password} onChange={e=>setPassword(e.target.value)} type="password" autoComplete="current-password" className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500" placeholder="••••••••" />

              <div className="flex gap-3">
                <button disabled={loading || !email || !password} onClick={()=>loginWithEmail(email,password,isAdminMode)} className="flex-1 py-3 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">Login</button>
                {!isAdminMode && <button onClick={()=>setShowForgot(true)} className="px-4 py-3 rounded-lg border">Forgot</button>}
              </div>

              <div className="text-center text-sm text-gray-500">Or continue with</div>
              <div className="flex gap-3">
                <button className="flex-1 py-2 rounded-lg border hover:shadow-sm">Continue with Google</button>
                <button className="flex-1 py-2 rounded-lg border hover:shadow-sm">Continue with Apple</button>
              </div>

              {!isAdminMode && <p className="text-sm text-gray-500 text-center">New here? <Link to="/register" className="text-indigo-600 font-semibold">Create account</Link></p>}

              {error && <div className="text-sm text-red-600 text-center">{error}</div>}
            </div>
          )}

          {stage === 'otp' && !isAdminMode && (
            <div className="space-y-4">
              <h4 className="font-semibold">Verify OTP</h4>
              <p className="text-sm text-gray-500">A 6-digit code was sent to <span className="font-medium text-gray-700">{otpEmail}</span></p>
              <div className="flex gap-2 items-center">
                <input value={otpInput} onChange={e=>setOtpInput(e.target.value)} maxLength={6} placeholder="Enter 6-digit code" className="flex-1 px-4 py-3 rounded-lg border tracking-widest text-center font-mono focus:ring-2 focus:ring-indigo-500" />
                <button onClick={()=>verifyOtp()} disabled={otpInput.length!==6} className="px-4 py-3 rounded-lg bg-indigo-600 text-white font-semibold disabled:opacity-40">Verify</button>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{timeLeft > 0 ? `Expires in ${Math.floor(timeLeft/60)}m ${timeLeft%60}s` : 'Expired'}</span>
                <button onClick={() => resendOtp()} className="text-indigo-600 hover:underline disabled:opacity-40">Resend</button>
              </div>
              <button onClick={() => window.location.reload()} className="w-full text-xs text-gray-400 hover:text-gray-500 mt-2">Start over</button>
              {error && <div className="text-sm text-red-600 text-center">{error}</div>}
            </div>
          )}

          {showForgot && !isAdminMode && (
            <div className="space-y-3">
              <h4 className="font-semibold">Forgot Password</h4>
              <p className="text-sm text-gray-500">Enter your email to receive a reset token.</p>
              <input value={forgotEmail} onChange={e=>setForgotEmail(e.target.value)} type="email" className="w-full px-4 py-3 rounded-lg border" placeholder="you@example.com" />
              <div className="flex gap-2">
                <button onClick={async ()=>{ await forgotPassword(forgotEmail); alert('If your email exists, you will receive a reset token'); }} className="flex-1 py-2 rounded bg-indigo-600 text-white">Send</button>
                <button onClick={()=>setShowForgot(false)} className="px-4 py-2 border rounded">Cancel</button>
              </div>
              <hr />
              <h4 className="text-sm font-medium">Have a reset token?</h4>
              <input value={resetToken} onChange={e=>setResetToken(e.target.value)} placeholder="token" className="w-full px-4 py-2 rounded-lg border" />
              <input value={newPassword} onChange={e=>setNewPassword(e.target.value)} type="password" placeholder="New password" className="w-full px-4 py-2 rounded-lg border" />
              <button onClick={async ()=>{ const ok = await resetPassword(forgotEmail, resetToken, newPassword); if (ok) { alert('Password reset, please login'); setShowForgot(false); } }} className="w-full py-2 rounded bg-green-600 text-white">Reset password</button>
            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
}
