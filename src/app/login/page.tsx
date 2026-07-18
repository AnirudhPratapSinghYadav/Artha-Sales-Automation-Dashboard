'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Card } from '@/components/ui/Card';
import { Lock } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({ title: 'Success', message: 'Logged in successfully', variant: 'success' });
        router.push('/dashboard');
      } else {
        setError('Invalid email or password');
        toast({ title: 'Error', message: 'Invalid email or password', variant: 'error' });
      }
    } catch (err) {
      setError('An error occurred during login');
      toast({ title: 'Error', message: 'An error occurred during login', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg !rounded-2xl p-8 border-none">
          <div className="text-center mb-8 flex flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="https://www.thinkartha.com/wp-content/uploads/2026/05/Artha-Solutions-logo.png" 
              alt="Artha Solutions Logo" 
              className="h-12 object-contain mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-zinc-100">Sales Automation Portal</h2>
            <p className="text-gray-500 dark:text-zinc-400 mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow bg-white dark:bg-zinc-900 dark:text-zinc-100"
                placeholder="you@artha.ai"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow bg-white dark:bg-zinc-900 dark:text-zinc-100"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 font-medium text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white font-medium py-2.5 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 flex justify-center items-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Sign in
                </>
              )}
            </button>
          </form>


        </Card>
      </div>
    </div>
  );
}
