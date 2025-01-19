'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { loginWithEmail, loginWithGoogle } from '../lib/auth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LoginForm({ onToggleForm }: { onToggleForm: () => void }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { error } = await loginWithEmail(email, password);
    if (error) {
      console.error('Login error:', error);
      setError('Failed to log in');
    } else {
      router.push('/profile');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      const { data, error } = await loginWithGoogle();
      
      if (error) {
        console.error('Google login error:', error);
        setError('Failed to log in with Google');
        return;
      }
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        setError('Authentication failed');
      }
    } catch (e) {
      console.error('Login handler error:', e);
      setError('An unexpected error occurred');
    }
  };

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
      
      {showEmailForm ? (
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
            required
          />
          <Button 
            type="submit"
            variant="outline"
            size="lg"
            className="w-full bg-gray-50 hover:bg-gray-100"
          >
            <Image 
              src="/icons/email.svg"
              alt="Email"
              width={24}
              height={24}
              className="mr-2"
            />
            Sign in
          </Button>
        </form>
      ) : (
        <Button 
          variant="outline"
          size="lg"
          className="w-full bg-gray-50 hover:bg-gray-100"
          onClick={() => setShowEmailForm(true)}
        >
          <Image 
            src="/icons/email.svg"
            alt="Email"
            width={24}
            height={24}
            className="mr-2"
          />
          Sign in using email
        </Button>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">OR</span>
        </div>
      </div>

      <Button
        variant="outline"
        size="lg"
        onClick={handleGoogleLogin}
        className="w-full bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
      >
        <div className="flex items-center justify-center">
          <Image 
            src="/icons/google.svg"
            alt="Google"
            width={20}
            height={20}
            className="mr-3"
          />
          <span className="text-gray-600 dark:text-gray-300">Continue with Google</span>
        </div>
      </Button>
    </div>
  );
} 