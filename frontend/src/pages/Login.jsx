import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      if (user.role === 'teacher') navigate('/teacher');
      else navigate('/student');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password');
    }
  };

  return (
    <div className="flex items-center justify-center py-16 px-4">
      <Card className="max-w-md w-full">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-1">Welcome Back</h2>
        <p className="text-xs text-slate-500 text-center mb-6">Log in to access your assessment portal</p>
        {error && <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-lg mb-4">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
              placeholder="candidate@institution.edu"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <Button type="submit" variant="primary" className="w-full py-2.5">Sign In</Button>
        </form>
        <p className="text-xs text-slate-500 text-center mt-6">
          Need an account? <Link to="/register" className="text-indigo-600 font-semibold hover:underline">Register</Link>
        </p>
      </Card>
    </div>
  );
};
