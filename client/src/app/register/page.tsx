'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // If already logged in, redirect to cms page immediately
    const token = localStorage.getItem('portfolio_token');
    if (token) {
      router.push('/cms');
    }
  }, [router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';
      const res = await fetch(`${apiBase}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess('Admin account created successfully! Redirecting to login...');
      setEmail('');
      setPassword('');
      setName('');
      
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Server connection failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#050507] text-[#e2e8f0] px-4 font-mono">
      <div className="w-full max-w-md border border-zinc-800 bg-zinc-950 p-8 rounded-xl shadow-2xl">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-500 mb-2 text-center">
          CREATE ADMIN ACCOUNT
        </h1>
        <p className="text-zinc-500 text-[10px] uppercase text-center mb-6 tracking-widest">
          Terminal Setup Route
        </p>
        
        {error && (
          <div className="text-red-500 mb-4 text-sm bg-red-950/30 border border-red-900/50 p-2 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="text-emerald-400 mb-4 text-sm bg-emerald-950/30 border border-emerald-900/50 p-2 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-zinc-800 bg-zinc-900 p-3 rounded text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="Rohan"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-zinc-800 bg-zinc-900 p-3 rounded text-sm focus:outline-none focus:border-emerald-500 transition-colors"
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
              className="w-full border border-zinc-800 bg-zinc-900 p-3 rounded text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 text-zinc-950 py-3 rounded font-bold hover:opacity-90 transition-opacity text-sm uppercase tracking-wider"
          >
            {isLoading ? <RefreshCw className="animate-spin" size={16} /> : 'CREATE ADMIN SESSION'}
          </button>
        </form>
      </div>
    </main>
  );
}
