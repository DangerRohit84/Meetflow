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
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-blue-950">MeetFlow AI</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="text-slate-600 hover:text-blue-600">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="gradient-bg text-white hover:opacity-90">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              Powered by AI
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-blue-950 leading-tight">
              Never Lose Track of{' '}
              <span className="gradient-text">Meeting Action Items</span>{' '}
              Again
            </h1>
            <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">
              Paste your meeting transcript and let AI extract every action item,
              assign it to the right person, and send automatic reminders until
              it's done.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="gradient-bg text-white hover:opacity-90 px-8">
                  Start For Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="px-8">
                  See How It Works
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 relative max-w-5xl mx-auto">
            <div className="glass-card p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-blue-950">1. Upload Transcript</h3>
                  <p className="text-sm text-slate-600">
                    Paste your meeting notes or transcript into MeetFlow AI
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-blue-950">2. AI Extracts Tasks</h3>
                  <p className="text-sm text-slate-600">
                    Our AI identifies action items, assignees, and deadlines
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-blue-950">3. Auto Reminders</h3>
                  <p className="text-sm text-slate-600">
                    Team members get reminders until tasks are completed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-950">
              Everything You Need
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Powerful features to transform how your team follows up on meetings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Bot,
                title: 'AI-Powered Extraction',
                description:
                  'Advanced AI analyzes your transcripts and extracts actionable tasks with assignees and deadlines.',
                color: 'from-blue-500 to-blue-600',
              },
              {
                icon: Users,
                title: 'Team Collaboration',
                description:
                  'Invite team members, assign tasks, and track progress across your entire organization.',
                color: 'from-emerald-500 to-emerald-600',
              },
              {
                icon: Bell,
                title: 'Automatic Reminders',
                description:
                  'Never let tasks slip through the cracks with automated email reminders.',
                color: 'from-amber-500 to-amber-600',
              },
              {
                icon: BarChart3,
                title: 'Analytics Dashboard',
                description:
                  "Visualize your team's productivity with beautiful charts and insights.",
                color: 'from-purple-500 to-purple-600',
              },
              {
                icon: Shield,
                title: 'Role-Based Access',
                description:
                  'Team leads manage everything, members focus on their assigned tasks.',
                color: 'from-rose-500 to-rose-600',
              },
              {
                icon: Clock,
                title: 'Real-Time Updates',
                description:
                  'Task statuses update instantly across the team for complete visibility.',
                color: 'from-cyan-500 to-cyan-600',
              },
            ].map((feature) => (
              <Card key={feature.title} className="glass-card hover:scale-[1.02] transition-transform">
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-blue-950 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-950">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Three simple steps to never miss an action item again
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Paste Transcript',
                description:
                  'Copy and paste your meeting notes, chat logs, or transcript into MeetFlow AI.',
              },
              {
                step: '02',
                title: 'AI Extracts Tasks',
                description:
                  'Our AI identifies action items, assigns them to team members, and sets deadlines.',
              },
              {
                step: '03',
                title: 'Track & Follow Up',
                description:
                  'Monitor progress on your dashboard and receive automatic reminders until completion.',
              },
            ].map((item, i) => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-bold text-blue-100 mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-blue-950 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600">{item.description}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 right-0 w-24 h-0.5 bg-gradient-to-r from-blue-200 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="glass-card overflow-hidden">
            <div className="gradient-bg p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Meetings?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                Join teams who never miss an action item. Start for free today.
              </p>
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-white/90 px-8"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-blue-950">MeetFlow AI</span>
            </div>
            <p className="text-sm text-slate-500">
              Built for INNOVA HACK 2026. Never miss an action item again.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
