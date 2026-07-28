'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bot, Loader2, ArrowRight, User, Users, Sparkles, CheckCircle, Zap } from 'lucide-react';

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
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold">!</span>
          </div>
          {error}
        </div>
      )}
      
      {!inviteToken && (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole('lead')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-center ${
              role === 'lead'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50 dark:border-blue-400'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center ${role === 'lead' ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-slate-100 dark:bg-slate-800'}`}>
              <User className={`w-5 h-5 ${role === 'lead' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
            </div>
            <span className={`text-sm font-semibold ${role === 'lead' ? 'text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400'}`}>
              Team Lead
            </span>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Create & manage</p>
          </button>
          <button
            type="button"
            onClick={() => setRole('member')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-center ${
              role === 'member'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50 dark:border-blue-400'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center ${role === 'member' ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-slate-100 dark:bg-slate-800'}`}>
              <Users className={`w-5 h-5 ${role === 'member' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
            </div>
            <span className={`text-sm font-semibold ${role === 'member' ? 'text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400'}`}>
              Team Member
            </span>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">View & update</p>
          </button>
        </div>
      )}
      
      {inviteToken && (
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <span>You&apos;re joining as a Team Member</span>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
        />
      </div>
      
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
          minLength={6}
          autoComplete="new-password"
          className="h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
        />
        <p className="text-xs text-slate-400 dark:text-slate-500">Minimum 6 characters</p>
      </div>
      
      <Button 
        type="submit" 
        className="w-full h-12 gradient-bg text-white hover:opacity-90 rounded-xl text-base font-medium"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creating account...
          </>
        ) : (
          <>
            {inviteToken ? 'Join Team' : 'Create Account'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </form>
  );
}

export default function RegisterPage() {
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
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-blue-600">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center p-16 text-white">
          <img src="/logo.svg" alt="MeetFlow AI" className="w-16 h-16 mb-8" />
          
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Start managing<br />
            <span className="text-blue-200">meetings smarter</span>
          </h1>
          
          <p className="text-lg text-white/80 mb-10 max-w-md">
            Create your free account and never miss an action item again.
          </p>

          <div className="space-y-4">
            {[
              { icon: Zap, text: 'Extract tasks in seconds with AI' },
              { icon: CheckCircle, text: 'Assign and track team progress' },
              { icon: Sparkles, text: '9 AI providers to choose from' },
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
            <h2 className="text-3xl font-bold text-blue-950 dark:text-white mb-2">Create your account</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
              Free to start. No credit card required.
            </p>
          </div>

          <div className="animate-fade-in-delay">
            <Suspense fallback={<div className="h-96 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" /></div>}>
              <RegisterForm />
            </Suspense>
          </div>

          <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400 animate-fade-in-delay-2">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
