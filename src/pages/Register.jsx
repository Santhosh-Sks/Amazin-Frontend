import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register, stage, otpEmail, otpInput, setOtpInput, verifyOtp, loading, error, timeLeft, resetRegistrationState } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  // Reset registration state when component mounts (unless coming from a successful registration)
  React.useEffect(() => {
    // Only reset if we're not in OTP stage (which means user just registered successfully)
    if (stage !== 'otp') {
      resetRegistrationState();
    }
  }, []); // Run only on mount

  // Debug: Track stage changes for troubleshooting
  React.useEffect(() => {
    console.log('Register component - Stage changed to:', stage);
  }, [stage]);

  async function onRegister(e){
    e.preventDefault();
    
    // Basic validation
    if (!name.trim() || !email.trim() || !password.trim()) {
      // Error will be handled by the context if needed
      return;
    }
    
    const res = await register(email, password, name);
    
    if (res.ok) {
      // The component will re-render and show OTP stage from context
      console.log('Registration successful, transitioning to OTP stage');
    } else {
      // Registration failed - user will see error message and stay on form
      console.log('Registration failed:', res.error);
    }
  }

  if (stage === 'otp') {
    return (
      <div className="max-w-md mx-auto py-20">
        <h2 className="text-xl font-semibold">Verify your account</h2>
        <p className="text-sm text-gray-500">A code was sent to {otpEmail}</p>
        <div className="mt-4 flex gap-2">
          <input 
            value={otpInput} 
            onChange={e=>setOtpInput(e.target.value)} 
            maxLength={6} 
            placeholder="Enter 6-digit code"
            className="flex-1 px-3 py-2 border rounded" 
          />
          <button 
            onClick={()=>verifyOtp()} 
            disabled={loading || otpInput.length !== 6}
            className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
        <p className="text-sm text-gray-500 mt-2">
          Time remaining: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </p>
        <button 
          onClick={resetRegistrationState}
          className="mt-4 text-sm text-indigo-600 hover:text-indigo-800"
        >
          ← Back to registration
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <h2 className="text-2xl font-bold mb-4">Create account</h2>
      <form onSubmit={onRegister} className="space-y-4 bg-white p-6 rounded shadow">
        <input 
          value={name} 
          onChange={e=>setName(e.target.value)} 
          placeholder="Full name" 
          required
          className="w-full px-3 py-2 border rounded" 
        />
        <input 
          value={email} 
          onChange={e=>setEmail(e.target.value)} 
          type="email" 
          placeholder="Email"
          required
          className="w-full px-3 py-2 border rounded" 
        />
        <input 
          value={password} 
          onChange={e=>setPassword(e.target.value)} 
          type="password" 
          placeholder="Password"
          required
          minLength={6}
          className="w-full px-3 py-2 border rounded" 
        />
        <div className="flex gap-2">
          <button 
            type="submit" 
            disabled={loading || !name.trim() || !email.trim() || !password.trim()}
            className="flex-1 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
          <button 
            type="button" 
            onClick={()=>navigate('/login')} 
            className="px-4 py-2 border rounded"
          >
            Login
          </button>
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </div>
  );
}
