'use client';

import { useState } from 'react';
import { loginWithEmail, loginWithGoogle } from '../firebase/auth';
import { useAuth } from '../context/AuthContext';

export default function LoginForm({ onToggleForm }: { onToggleForm: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { error } = await loginWithEmail(email, password);
    if (error) {
      console.error('Login error:', error);
      setError('Failed to log in');
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    const { error } = await loginWithGoogle();
    if (error) {
      console.error('Google login error:', error);
      setError('Failed to log in with Google');
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      {user ? (
        <div className="text-center p-4 bg-green-100 dark:bg-green-900 rounded-lg">
          <p className="text-lg">Welcome, {user.email}</p>
        </div>
      ) : (
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
              required
            />
          </div>
          <div className="space-y-2">
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Login with Email
            </button>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Login with Google
            </button>
          </div>
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={onToggleForm}
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Need an account? Sign up
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 