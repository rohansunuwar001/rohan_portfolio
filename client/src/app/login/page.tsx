'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';
import { useUserLogin } from '../../api/userApi';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useUserLogin();
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    // If already logged in, redirect to cms page immediately
    const token = localStorage.getItem('portfolio_token');
    if (token) {
      router.push('/cms');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    try {
      const token = await login(email, password);
      // Save token
      localStorage.setItem('portfolio_token', token);

      // Clear input fields
      setEmail('');
      setPassword('');

      // Redirect to cms dashboard
      router.push('/cms');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setLocalError(message || 'Server connection failed');
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#050507] text-[#e2e8f0] px-4 font-mono">
      <div className="w-full max-w-md border border-zinc-800 bg-zinc-950 p-8 rounded-xl shadow-2xl">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-sky-400 to-rose-500 mb-6 text-center">
          CMS SECURITY PORTAL
        </h1>
        
        {(localError || error) && (
          <div className="text-red-500 mb-4 text-sm bg-red-950/30 border border-red-900/50 p-2 rounded">
            {localError || error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-zinc-800 bg-zinc-900 p-3 rounded text-sm focus:outline-none focus:border-sky-500 transition-colors"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-zinc-800 bg-zinc-900 p-3 rounded text-sm focus:outline-none focus:border-sky-500 transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-sky-500 to-rose-500 text-zinc-950 py-3 rounded font-bold hover:opacity-90 transition-opacity text-sm uppercase tracking-wider"
          >
            {isLoading ? <RefreshCw className="animate-spin" size={16} /> : 'INITIALIZE SYSTEM'}
          </button>
        </form>
      </div>
    </main>
  );
}
