'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Loader2, User, Users } from 'lucide-react';

function RegisterForm() {
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get('token');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'lead' | 'member'>(inviteToken ? 'member' : 'lead');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, inviteToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm">
          {error}
        </div>
      )}
      
      {!inviteToken && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setRole('lead')}
            className={`flex-1 p-4 rounded-xl border-2 transition-all cursor-pointer ${
              role === 'lead'
                ? 'border-blue-500 dark:border-blue-400 bg-blue-50'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <User className={`w-5 h-5 mx-auto mb-2 ${role === 'lead' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
            <span className={`text-sm font-medium ${role === 'lead' ? 'text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400'}`}>
              Team Lead
            </span>
          </button>
          <button
            type="button"
            onClick={() => setRole('member')}
            className={`flex-1 p-4 rounded-xl border-2 transition-all cursor-pointer ${
              role === 'member'
                ? 'border-blue-500 dark:border-blue-400 bg-blue-50'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <Users className={`w-5 h-5 mx-auto mb-2 ${role === 'member' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
            <span className={`text-sm font-medium ${role === 'member' ? 'text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400'}`}>
              Team Member
            </span>
          </button>
        </div>
      )}
      
      {inviteToken && (
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-sm flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>You&apos;re joining as a Team Member</span>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="name" className="text-slate-700 dark:text-slate-300 dark:text-slate-600">Full Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="bg-white dark:bg-slate-800/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:border-blue-400 focus:ring-blue-500"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 dark:text-slate-600">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
          className="bg-white dark:bg-slate-800/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:border-blue-400 focus:ring-blue-500"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 dark:text-slate-600">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
          className="bg-white dark:bg-slate-800/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:border-blue-400 focus:ring-blue-500"
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full gradient-bg text-white hover:opacity-90"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creating account...
          </>
        ) : (
          inviteToken ? 'Join Team' : 'Create Account'
        )}
      </Button>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
      
      <Card className="w-full max-w-md glass-card relative z-10">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 gradient-bg rounded-xl flex items-center justify-center mb-4">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-blue-950 dark:text-blue-100">
            Create Account
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Get started with MeetFlow AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="h-96 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" /></div>}>
            <RegisterForm />
          </Suspense>
          
          <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:text-blue-300 font-medium">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
