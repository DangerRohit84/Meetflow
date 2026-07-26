'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Bot,
  Upload,
  Users,
  Bell,
  CheckCircle,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  BarChart3,
  Sparkles,
  FileText,
  Target,
  TrendingUp,
  Globe,
  Cpu,
} from 'lucide-react';

function FloatingCard({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <div
      className={`absolute hidden lg:block ${className}`}
      style={{
        animation: `float 6s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function StatCounter({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-bold gradient-text">{value}</div>
      <div className="mt-2 text-sm text-slate-500">{label}</div>
    </div>
  );
}

function FeatureIcon({ icon: Icon, color }: { icon: React.ElementType; color: string }) {
  return (
    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 shadow-lg`}>
      <Icon className="w-7 h-7 text-white" />
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
      `}</style>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-slate-100/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-blue-950">MeetFlow AI</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-slate-600 hover:text-blue-600 hidden sm:flex">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="gradient-bg text-white hover:opacity-90 shadow-lg shadow-blue-500/30">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-16 lg:py-28 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />

        {/* Floating elements */}
        <FloatingCard className="top-32 left-[8%]" delay={0}>
          <div className="glass-card p-3 rounded-2xl shadow-xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-xs font-medium text-slate-700">Task Completed</span>
            </div>
          </div>
        </FloatingCard>

        <FloatingCard className="top-48 right-[10%]" delay={1.5}>
          <div className="glass-card p-3 rounded-2xl shadow-xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Bot className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-slate-700">AI Extracting...</span>
            </div>
          </div>
        </FloatingCard>

        <FloatingCard className="bottom-32 left-[15%]" delay={3}>
          <div className="glass-card p-3 rounded-2xl shadow-xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <Bell className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-xs font-medium text-slate-700">Reminder Sent</span>
            </div>
          </div>
        </FloatingCard>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-8 animate-gradient">
              <Sparkles className="w-4 h-4" />
              AI-Powered Meeting Intelligence
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-blue-950 leading-[1.1] tracking-tight">
              Never Lose Track of{' '}
              <span className="relative inline-block">
                <span className="gradient-text">Meeting Tasks</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 8C40 2 80 2 100 6C120 10 160 10 198 4" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="200" y2="0">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              {' '}Again
            </h1>

            {/* Subheadline */}
            <p className="mt-8 text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Paste your meeting transcript and let AI extract every action item,
              assign it to the right person, and send automatic reminders — all in seconds.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="gradient-bg text-white hover:opacity-90 px-10 py-6 text-lg shadow-xl shadow-blue-500/30 rounded-2xl">
                  Start For Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="px-10 py-6 text-lg rounded-2xl border-2 hover:bg-slate-50">
                  See Demo
                </Button>
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500'].map((color, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full ${color} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>
                      {['A', 'S', 'D', 'E'][i]}
                    </div>
                  ))}
                </div>
                <span>500+ teams</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-1">4.9/5</span>
              </div>
            </div>
          </div>

          {/* Hero Visual - App Preview */}
          <div className="mt-20 relative max-w-6xl mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-3xl blur-xl" />
            <div className="glass-card rounded-3xl p-1 shadow-2xl shadow-blue-500/10">
              <div className="bg-white rounded-[22px] overflow-hidden">
                {/* Browser bar */}
                <div className="bg-slate-100 px-4 py-3 flex items-center gap-2 border-b border-slate-200">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-white rounded-lg px-3 py-1 text-xs text-slate-400 text-center border border-slate-200">
                      meetflow-flame.vercel.app/dashboard
                    </div>
                  </div>
                </div>
                {/* App content mockup */}
                <div className="p-6 md:p-8 bg-gradient-to-br from-slate-50 to-white">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {[
                      { label: 'Total Meetings', value: '24', icon: FileText, color: 'text-blue-600 bg-blue-100' },
                      { label: 'Tasks Created', value: '156', icon: Target, color: 'text-emerald-600 bg-emerald-100' },
                      { label: 'Completion Rate', value: '89%', icon: TrendingUp, color: 'text-amber-600 bg-amber-100' },
                      { label: 'Team Members', value: '12', icon: Users, color: 'text-purple-600 bg-purple-100' },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                        <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                          <stat.icon className="w-5 h-5" />
                        </div>
                        <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                        <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">AI Meeting Summary</div>
                        <div className="text-xs text-slate-500">Weekly Standup — 3 tasks extracted</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {[
                        { task: 'Complete API integration', assignee: 'David', status: 'In Progress', color: 'bg-amber-100 text-amber-700' },
                        { task: 'Design system updates', assignee: 'Sarah', status: 'Completed', color: 'bg-emerald-100 text-emerald-700' },
                        { task: 'Budget approval follow-up', assignee: 'Emma', status: 'Pending', color: 'bg-slate-100 text-slate-700' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${item.status === 'Completed' ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                              {item.status === 'Completed' && <CheckCircle className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-sm text-slate-700">{item.task}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">{item.assignee}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${item.color}`}>{item.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-slate-100 bg-white/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCounter value="10K+" label="Transcripts Processed" />
            <StatCounter value="50K+" label="Tasks Extracted" />
            <StatCounter value="99.2%" label="Accuracy Rate" />
            <StatCounter value="<2s" label="Extraction Time" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-medium mb-4">
              <Zap className="w-3 h-3" />
              POWERFUL FEATURES
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-blue-950">
              Everything Your Team Needs
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Powerful features to transform how your team follows up on meetings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Bot,
                title: 'AI-Powered Extraction',
                description: 'Advanced AI analyzes your transcripts and extracts actionable tasks with assignees, deadlines, and priorities.',
                color: 'from-blue-500 to-blue-600',
                bg: 'bg-blue-50',
              },
              {
                icon: Users,
                title: 'Team Collaboration',
                description: 'Invite team members via shareable links, assign tasks, and track progress across your entire organization.',
                color: 'from-emerald-500 to-emerald-600',
                bg: 'bg-emerald-50',
              },
              {
                icon: Bell,
                title: 'Smart Reminders',
                description: 'Never let tasks slip through the cracks with automated email and in-app reminders until completion.',
                color: 'from-amber-500 to-amber-600',
                bg: 'bg-amber-50',
              },
              {
                icon: BarChart3,
                title: 'Analytics Dashboard',
                description: 'Visualize your team\'s productivity with beautiful charts, completion rates, and meeting frequency insights.',
                color: 'from-purple-500 to-purple-600',
                bg: 'bg-purple-50',
              },
              {
                icon: Shield,
                title: 'Role-Based Access',
                description: 'Team leads manage everything, members focus on their assigned tasks with granular permissions.',
                color: 'from-rose-500 to-rose-600',
                bg: 'bg-rose-50',
              },
              {
                icon: Cpu,
                title: '9 AI Providers',
                description: 'Choose from Groq, OpenAI, Anthropic, Gemini, DeepSeek, Mistral, Together, OpenRouter, or custom APIs.',
                color: 'from-cyan-500 to-cyan-600',
                bg: 'bg-cyan-50',
              },
            ].map((feature) => (
              <Card key={feature.title} className="group glass-card hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 border-0">
                <CardContent className="p-7">
                  <FeatureIcon icon={feature.icon} color={feature.color} />
                  <h3 className="text-xl font-bold text-blue-950 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium mb-4">
              <Target className="w-3 h-3" />
              HOW IT WORKS
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-blue-950">
              Three Steps to Productivity
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Never miss an action item again
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-blue-200 via-emerald-200 to-amber-200" />

            {[
              {
                step: '01',
                title: 'Paste Transcript',
                description: 'Copy and paste your meeting notes, chat logs, or transcript into MeetFlow AI.',
                icon: Upload,
                color: 'from-blue-500 to-blue-600',
                bgColor: 'bg-blue-500',
              },
              {
                step: '02',
                title: 'AI Extracts Tasks',
                description: 'Our AI identifies action items, assigns them to team members, and sets deadlines.',
                icon: Sparkles,
                color: 'from-emerald-500 to-emerald-600',
                bgColor: 'bg-emerald-500',
              },
              {
                step: '03',
                title: 'Track & Follow Up',
                description: 'Monitor progress on your dashboard and receive automatic reminders until completion.',
                icon: CheckCircle,
                color: 'from-amber-500 to-amber-600',
                bgColor: 'bg-amber-500',
              },
            ].map((item, i) => (
              <div key={item.step} className="relative text-center">
                <div className="relative z-10 mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-6 shadow-lg" style={{background: `linear-gradient(135deg, var(--tw-gradient-stops))`}}>
                  <div className={`w-20 h-20 rounded-2xl ${item.bgColor} flex items-center justify-center shadow-lg`}>
                    <item.icon className="w-9 h-9 text-white" />
                  </div>
                </div>
                <div className="text-sm font-bold text-blue-600 mb-2">Step {item.step}</div>
                <h3 className="text-xl font-bold text-blue-950 mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-600 max-w-xs mx-auto">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Providers Showcase */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium mb-4">
              <Globe className="w-3 h-3" />
              UNIVERSAL COMPATIBILITY
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              9 AI Providers
            </h2>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
              Choose the AI provider that works best for your team. From free tiers to enterprise solutions.
            </p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {[
              { name: 'Groq', color: 'bg-orange-500', icon: '⚡' },
              { name: 'OpenAI', color: 'bg-green-600', icon: '🤖' },
              { name: 'Anthropic', color: 'bg-amber-600', icon: '🧠' },
              { name: 'Gemini', color: 'bg-blue-500', icon: '💎' },
              { name: 'DeepSeek', color: 'bg-blue-600', icon: '🔍' },
              { name: 'Mistral', color: 'bg-purple-600', icon: '🌀' },
              { name: 'Together', color: 'bg-teal-500', icon: '🤝' },
              { name: 'OpenRouter', color: 'bg-indigo-500', icon: '🔀' },
              { name: 'Custom', color: 'bg-slate-600', icon: '⚙️' },
            ].map((provider) => (
              <div key={provider.name} className="glass-card p-4 rounded-2xl text-center hover:scale-105 transition-transform cursor-pointer border border-white/10">
                <div className={`w-12 h-12 ${provider.color} rounded-xl flex items-center justify-center mx-auto mb-3 text-2xl`}>
                  {provider.icon}
                </div>
                <div className="text-sm font-semibold text-white">{provider.name}</div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-white/90 px-8">
                Try All Providers Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 gradient-bg" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="relative p-12 md:p-16 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Meetings?
              </h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                Join thousands of teams who never miss an action item. Start for free today — no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90 px-10 py-6 text-lg rounded-2xl shadow-xl">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="px-10 py-6 text-lg rounded-2xl border-white/30 text-white hover:bg-white/10">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-blue-950">MeetFlow AI</span>
              </div>
              <p className="text-slate-600 max-w-sm">
                AI-powered meeting intelligence that transforms transcripts into actionable tasks. Built for teams who value productivity.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-950 mb-4">Product</h4>
              <ul className="space-y-3 text-slate-600">
                <li><Link href="/register" className="hover:text-blue-600 transition-colors">Get Started</Link></li>
                <li><Link href="/login" className="hover:text-blue-600 transition-colors">Sign In</Link></li>
                <li><Link href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-950 mb-4">Legal</h4>
              <ul className="space-y-3 text-slate-600">
                <li><span className="hover:text-blue-600 transition-colors cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:text-blue-600 transition-colors cursor-pointer">Terms of Service</span></li>
                <li><span className="hover:text-blue-600 transition-colors cursor-pointer">Contact</span></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">© 2026 MeetFlow AI. All rights reserved.</p>
            <p className="text-sm text-slate-500">Never miss an action item again.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
