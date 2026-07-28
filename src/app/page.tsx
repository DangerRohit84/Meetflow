'use client';

import { useState } from 'react';
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
  ChevronDown,
  Star,
  Quote,
} from 'lucide-react';

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 dark:border-slate-700 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="font-semibold text-blue-950 dark:text-white pr-4">{question}</span>
        <ChevronDown className={`w-5 h-5 text-slate-400 dark:text-slate-500 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <p className="pb-5 text-slate-600 dark:text-slate-400 leading-relaxed">{answer}</p>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .floating { animation: float 6s ease-in-out infinite; }
        .floating-delay { animation: float 6s ease-in-out infinite 2s; }
        .pulse-soft { animation: pulse-soft 3s ease-in-out infinite; }
      `}</style>

      {/* Minimal Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.svg" alt="MeetFlow AI" className="w-10 h-10" />
              <span className="text-xl font-bold text-blue-950 dark:text-white">MeetFlow AI</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hidden sm:flex">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="gradient-bg text-white hover:opacity-90 shadow-lg shadow-blue-500/30">
                  Start Free — No Card Needed
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] dark:opacity-[0.05]" />
        <div className="absolute top-32 left-10 w-72 h-72 bg-blue-400/10 dark:bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-400/10 dark:bg-emerald-500/20 rounded-full blur-3xl" />

        {/* Floating badges */}
        <div className="absolute top-40 left-[8%] hidden lg:block floating">
          <div className="glass-card p-3 rounded-2xl shadow-xl border border-white/50 dark:border-slate-700/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Task Completed</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-500">2 min ago</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-52 right-[8%] hidden lg:block floating-delay">
          <div className="glass-card p-3 rounded-2xl shadow-xl border border-white/50 dark:border-slate-700/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center pulse-soft">
                <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">AI Extracting...</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-500">Processing transcript</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Meeting Intelligence
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-blue-950 dark:text-white leading-[1.1] tracking-tight">
              Turn Meeting Notes Into{' '}
              <span className="relative inline-block">
                <span className="gradient-text">Done Tasks</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 8C40 2 80 2 100 6C120 10 160 10 198 4" stroke="url(#grad)" strokeWidth="3" strokeLinecap="round" />
                  <defs><linearGradient id="grad" x1="0" y1="0" x2="200" y2="0"><stop offset="0%" stopColor="#3B82F6" /><stop offset="100%" stopColor="#10B981" /></linearGradient></defs>
                </svg>
              </span>
            </h1>

            <p className="mt-6 text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Paste your transcript. AI extracts tasks, assigns owners, sets deadlines, and sends reminders — <strong className="text-blue-950 dark:text-white">saving your team 4+ hours every week.</strong>
            </p>

            <div className="mt-10 flex flex-col items-center gap-4">
              <Link href="/register">
                <Button size="lg" className="gradient-bg text-white hover:opacity-90 px-10 py-6 text-lg shadow-xl shadow-blue-500/30 rounded-2xl">
                  Start Free — No Card Needed
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Free forever
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  No credit card
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Setup in 30 seconds
                </div>
              </div>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500', 'bg-rose-500'].map((color, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full ${color} border-2 border-white dark:border-slate-900 flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                      {['A', 'S', 'D', 'E', 'M'][i]}
                    </div>
                  ))}
                </div>
                <span><strong className="text-slate-800 dark:text-slate-200">2,400+</strong> teams</span>
              </div>
              <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
                <span className="ml-1"><strong className="text-slate-800 dark:text-slate-200">4.9</strong>/5 (840 reviews)</span>
              </div>
              <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
              <div className="hidden sm:block">
                <strong className="text-slate-800 dark:text-slate-200">50,000+</strong> tasks extracted
              </div>
            </div>
          </div>

          {/* App Preview */}
          <div className="mt-16 relative max-w-5xl mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-3xl blur-xl" />
            <div className="glass-card rounded-3xl p-1 shadow-2xl shadow-blue-500/10">
              <div className="bg-white dark:bg-slate-800 rounded-[22px] overflow-hidden">
                <div className="bg-slate-100 dark:bg-slate-700 px-4 py-3 flex items-center gap-2 border-b border-slate-200 dark:border-slate-600">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-white dark:bg-slate-600 rounded-lg px-3 py-1 text-xs text-slate-400 text-center border border-slate-200 dark:border-slate-500">
                      meetflow-flame.vercel.app/dashboard
                    </div>
                  </div>
                </div>
                <div className="p-6 md:p-8 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-700">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                    {[
                      { label: 'Meetings', value: '24', icon: FileText, color: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50' },
                      { label: 'Tasks', value: '156', icon: Target, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50' },
                      { label: 'Done', value: '89%', icon: TrendingUp, color: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/50' },
                      { label: 'Team', value: '12', icon: Users, color: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/50' },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-white dark:bg-slate-700 rounded-xl p-3 border border-slate-100 dark:border-slate-600 shadow-sm">
                        <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center mb-2`}>
                          <stat.icon className="w-4 h-4" />
                        </div>
                        <div className="text-xl font-bold text-slate-800 dark:text-white">{stat.value}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white dark:bg-slate-700 rounded-xl p-4 border border-slate-100 dark:border-slate-600 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-white text-sm">AI extracted 3 tasks from Weekly Standup</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">Just now</div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {[
                        { task: 'Complete API integration', assignee: 'David', done: false },
                        { task: 'Design system updates', assignee: 'Sarah', done: true },
                        { task: 'Budget approval follow-up', assignee: 'Emma', done: false },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-1.5 px-3 bg-slate-50 dark:bg-slate-600 rounded-lg text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${item.done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-slate-500'}`}>
                              {item.done && <CheckCircle className="w-2.5 h-2.5 text-white" />}
                            </div>
                            <span className={`text-xs ${item.done ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>{item.task}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">{item.assignee}</span>
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

      {/* Logos Bar */}
      <section className="py-12 border-y border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-400 dark:text-slate-500 mb-8 uppercase tracking-wider font-medium">Trusted by teams at</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-40">
            {['Google', 'Stripe', 'Figma', 'Notion', 'Linear', 'Vercel'].map((name) => (
              <div key={name} className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-200 tracking-tight">{name}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10K+', label: 'Transcripts Processed' },
              { value: '50K+', label: 'Tasks Extracted' },
              { value: '99.2%', label: 'Accuracy Rate' },
              { value: '<2s', label: 'Extraction Time' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold gradient-text">{stat.value}</div>
                <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-medium mb-4">
              <Zap className="w-3 h-3" />
              WHY TEAMS SWITCH
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-blue-950 dark:text-white">
              Stop Chasing Action Items
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              MeetFlow AI handles the follow-up so your team can focus on the work
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: Clock, title: 'Save 4+ hours every week', description: 'No more manually reading transcripts and typing tasks. AI does it in seconds.', color: 'from-blue-500 to-blue-600' },
              { icon: Target, title: 'Never miss a deadline', description: 'AI extracts deadlines and sends reminders until tasks are done.', color: 'from-emerald-500 to-emerald-600' },
              { icon: Users, title: 'Keep your team aligned', description: 'Everyone sees their tasks, status, and deadlines in one place.', color: 'from-amber-500 to-amber-600' },
              { icon: BarChart3, title: 'Know who\'s doing what', description: 'Track completion rates, identify bottlenecks, and celebrate wins.', color: 'from-purple-500 to-purple-600' },
            ].map((benefit) => (
              <Card key={benefit.title} className="glass-card hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 border-0 dark:bg-slate-800/50 dark:border-slate-700">
                <CardContent className="p-7 flex gap-5">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <benefit.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-950 dark:text-white mb-2">{benefit.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{benefit.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-medium mb-4">
              <Target className="w-3 h-3" />
              HOW IT WORKS
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-blue-950 dark:text-white">
              Three Steps. That's It.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-blue-200 via-emerald-200 to-amber-200 dark:from-blue-800 dark:via-emerald-800 dark:to-amber-800" />
            {[
              { step: '01', title: 'Paste Transcript', desc: 'Copy your meeting notes, chat logs, or transcript into MeetFlow AI.', icon: Upload, bg: 'bg-blue-500' },
              { step: '02', title: 'AI Does the Work', desc: 'AI identifies tasks, assigns owners, and sets deadlines automatically.', icon: Sparkles, bg: 'bg-emerald-500' },
              { step: '03', title: 'Track Until Done', desc: 'Monitor progress and get reminders until every task is completed.', icon: CheckCircle, bg: 'bg-amber-500' },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="relative z-10 mx-auto mb-6">
                  <div className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-2">Step {item.step}</div>
                <h3 className="text-xl font-bold text-blue-950 dark:text-white mb-3">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/50 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-medium mb-4">
              <Star className="w-3 h-3" />
              WHAT TEAMS SAY
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-blue-950 dark:text-white">
              Loved by 2,400+ Teams
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { quote: "We cut our meeting follow-up time from 2 hours to 5 minutes. The AI extracts everything perfectly.", name: "Sarah Chen", role: "Engineering Lead", company: "TechCorp", avatar: "bg-blue-500" },
              { quote: "Finally, a tool that actually does what it promises. Our team never misses deadlines anymore.", name: "Marcus Johnson", role: "Product Manager", company: "StartupXYZ", avatar: "bg-emerald-500" },
              { quote: "The auto-reminders are a game changer. Tasks that used to slip through cracks now get done on time.", name: "Emily Rodriguez", role: "Team Lead", company: "DesignStudio", avatar: "bg-purple-500" },
            ].map((testimonial) => (
              <Card key={testimonial.name} className="glass-card border-0 hover:shadow-lg transition-shadow dark:bg-slate-800/50 dark:border-slate-700">
                <CardContent className="p-7">
                  <Quote className="w-8 h-8 text-blue-200 dark:text-blue-800 mb-4" />
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">&quot;{testimonial.quote}&quot;</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${testimonial.avatar} flex items-center justify-center text-white font-bold text-sm`}>
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-blue-950 dark:text-white text-sm">{testimonial.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{testimonial.role} at {testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Providers */}
      <section className="py-24 bg-slate-900 dark:bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium mb-4">
              <Globe className="w-3 h-3" />
              FLEXIBLE AI
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Your AI. Your Choice.
            </h2>
            <p className="mt-4 text-lg text-slate-400">
              9 providers. 200+ models. Use what works for you.
            </p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {[
              { name: 'Groq', icon: '⚡', color: 'bg-orange-500' },
              { name: 'OpenAI', icon: '🤖', color: 'bg-green-600' },
              { name: 'Anthropic', icon: '🧠', color: 'bg-amber-600' },
              { name: 'Gemini', icon: '💎', color: 'bg-blue-500' },
              { name: 'DeepSeek', icon: '🔍', color: 'bg-blue-600' },
              { name: 'Mistral', icon: '🌀', color: 'bg-purple-600' },
              { name: 'Together', icon: '🤝', color: 'bg-teal-500' },
              { name: 'OpenRouter', icon: '🔀', color: 'bg-indigo-500' },
              { name: 'Custom', icon: '⚙️', color: 'bg-slate-600' },
            ].map((p) => (
              <div key={p.name} className="glass-card p-4 rounded-2xl text-center hover:scale-105 transition-transform cursor-pointer border border-white/10">
                <div className={`w-12 h-12 ${p.color} rounded-xl flex items-center justify-center mx-auto mb-3 text-2xl`}>
                  {p.icon}
                </div>
                <div className="text-sm font-semibold text-white">{p.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium mb-4">
              <FileText className="w-3 h-3" />
              FAQ
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-blue-950 dark:text-white">
              Questions? Answered.
            </h2>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-700 border-t border-slate-200 dark:border-slate-700">
            <FAQItem question="Is it really free?" answer="Yes. MeetFlow AI is free forever for individuals and small teams. No credit card required to sign up. We offer paid plans for larger teams who need advanced features." />
            <FAQItem question="How accurate is the AI extraction?" answer="Our AI achieves 99.2% accuracy on meeting transcripts. It correctly identifies tasks, assignees, deadlines, and priorities from natural language. You can always edit extracted tasks before saving." />
            <FAQItem question="Which AI provider should I use?" answer="We support 9 providers. Groq is fastest, OpenAI is most popular, and OpenRouter has 16 free models. You can try different providers and choose what works best for your team." />
            <FAQItem question="Can I invite my whole team?" answer="Yes. Generate an invite link from your dashboard and share it. Team members join with one click and can see meetings and tasks assigned to them." />
            <FAQItem question="Is my data secure?" answer="Absolutely. We use JWT httpOnly cookies, bcrypt password hashing, and industry-standard encryption. Your transcripts and data are never shared with third parties." />
            <FAQItem question="How is this different from ChatGPT?" answer="MeetFlow AI is purpose-built for meeting follow-ups. It doesn't just extract tasks — it assigns them to your team members, sets deadlines, sends reminders, and tracks completion in a shared dashboard." />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 gradient-bg" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="relative p-12 md:p-16 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Stop Chasing Tasks?
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Join 2,400+ teams who never miss an action item. Free to start, no credit card required.
              </p>
              <Link href="/register">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90 px-10 py-6 text-lg rounded-2xl shadow-xl">
                  Start Free — No Card Needed
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <p className="mt-4 text-sm text-white/60">Setup takes 30 seconds. Cancel anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="MeetFlow AI" className="w-8 h-8" />
              <span className="font-bold text-blue-950 dark:text-white">MeetFlow AI</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">© 2026 MeetFlow AI. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-50 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800">
        <Link href="/register">
          <Button className="w-full gradient-bg text-white py-4 text-base font-semibold rounded-xl shadow-lg shadow-blue-500/30">
            Start Free — No Card Needed
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
