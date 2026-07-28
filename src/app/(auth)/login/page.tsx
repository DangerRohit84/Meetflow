'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bot, Loader2, ArrowRight, Sparkles, CheckCircle, Zap, Target } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      window.location.href = '/dashboard';
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex dark:bg-slate-950">
      <style jsx global>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in-up 0.6s ease-out forwards; }
        .animate-fade-in-delay { animation: fade-in-up 0.6s ease-out 0.1s forwards; opacity: 0; }
        .animate-fade-in-delay-2 { animation: fade-in-up 0.6s ease-out 0.2s forwards; opacity: 0; }
      `}</style>

      {/* Left Side — Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center p-16 text-white">
          <img src="/logo.svg" alt="MeetFlow AI" className="w-16 h-16 mb-8" />
          
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Welcome back to<br />
            <span className="text-emerald-300">MeetFlow AI</span>
          </h1>
          
          <p className="text-lg text-white/80 mb-10 max-w-md">
            Sign in to continue managing your meetings and team tasks.
          </p>

          <div className="space-y-4">
            {[
              { icon: Sparkles, text: 'AI-powered task extraction' },
              { icon: Target, text: 'Never miss a deadline' },
              { icon: CheckCircle, text: 'Track team progress' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-white/90">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side — Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-slate-900">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <img src="/logo.svg" alt="MeetFlow AI" className="w-10 h-10" />
            <span className="text-xl font-bold text-blue-950 dark:text-white">MeetFlow AI</span>
          </div>

          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-blue-950 dark:text-white mb-2">Sign in</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-delay">
            {error && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold">!</span>
                </div>
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
                className="h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 gradient-bg text-white hover:opacity-90 rounded-xl text-base font-medium"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 animate-fade-in-delay-2">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Demo Account</p>
            <div className="flex items-center justify-between">
              <code className="text-sm text-slate-700 dark:text-slate-300">alex@meetflow.ai</code>
              <span className="text-xs text-slate-400">password123</span>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400 animate-fade-in-delay-2">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
