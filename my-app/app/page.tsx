'use client';

import { useState } from 'react';
import Image from "next/image";
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Welcome to Biomë</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {isLogin ? 'Please sign in to continue' : 'Create your account'}
          </p>
        </div>
        
        <div className="mt-8">
          {isLogin ? (
            <LoginForm onToggleForm={toggleForm} />
          ) : (
            <SignUpForm onToggleForm={toggleForm} />
          )}
        </div>
      </div>
    </main>
  );
}
