'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
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

  if (user) {
    return (
      <div className="text-center p-4 bg-green-100 dark:bg-green-900 rounded-lg">
        <p className="text-lg">Welcome, {user.email}</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <Button 
        size="lg"
        className="w-full bg-blue-500 hover:bg-blue-600"
        onClick={() => onToggleForm()}
      >
        Create Account
      </Button>
      
      <Button 
        variant="outline"
        size="lg"
        className="w-full bg-gray-50 hover:bg-gray-100"
        onClick={handleEmailLogin}
      >
        <span className="material-icons mr-2"></span>
        Sign in using email
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">OR</span>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handleGoogleLogin}
          className="rounded-full"
        >
          <img src="/icons/google.svg" alt="Google" className="w-6 h-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
        >
          <img src="/icons/apple.svg" alt="Apple" className="w-6 h-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
        >
          <img src="/icons/facebook.svg" alt="Facebook" className="w-6 h-6" />
        </Button>
      </div>

      <div className="text-center text-sm text-gray-500 mt-8">
        By signing up, you agree to our Terms. See how we use your data in our Privacy Policy.
      </div>
    </div>
  );
} 