'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, CheckSquare, Users, TrendingUp, Plus, ArrowRight } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Stats {
  totalMeetings: number;
  pendingTasks: number;
  completedTasks: number;
  totalMembers: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalMeetings: 0,
    pendingTasks: 0,
    completedTasks: 0,
    totalMembers: 0,
  });
  const [recentMeetings, setRecentMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, meetingsRes, tasksRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/meetings'),
        fetch('/api/tasks'),
      ]);

      if (!userRes.ok) {
        window.location.href = '/login';
        return;
      }
      const userData = await userRes.json();
      setUser(userData.user);

      const meetingsData = meetingsRes.ok ? await meetingsRes.json() : { meetings: [] };
      setRecentMeetings(meetingsData.meetings?.slice(0, 5) || []);

      const tasksData = tasksRes.ok ? await tasksRes.json() : { tasks: [] };
      const tasks = tasksData.tasks || [];
      
      let membersCount = 0;
      if (userData.user?.role === 'lead') {
        try {
          const membersRes = await fetch('/api/members');
          if (membersRes.ok) {
            const membersData = await membersRes.json();
            membersCount = membersData.members?.length || 0;
          }
        } catch {
          membersCount = 0;
        }
      }

      setStats({
        totalMeetings: meetingsData.meetings?.length || 0,
        pendingTasks: tasks.filter((t: any) => t.status !== 'completed').length,
        completedTasks: tasks.filter((t: any) => t.status === 'completed').length,
        totalMembers: membersCount,
      });
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Meetings',
      value: stats.totalMeetings,
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Pending Tasks',
      value: stats.pendingTasks,
      icon: CheckSquare,
      color: 'from-amber-500 to-amber-600',
    },
    {
      title: 'Completed Tasks',
      value: stats.completedTasks,
      icon: TrendingUp,
      color: 'from-emerald-500 to-emerald-600',
    },
    ...(user?.role === 'lead'
      ? [
          {
            title: 'Team Members',
            value: stats.totalMembers,
            icon: Users,
            color: 'from-purple-500 to-purple-600',
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-950 dark:text-blue-100">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {user?.role === 'lead'
              ? "Here's what's happening with your team's meetings."
              : "Here are your assigned tasks and updates."}
          </p>
        </div>
        {user?.role === 'lead' && (
          <Link href="/dashboard/meetings/new">
            <Button className="gradient-bg text-white hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              New Meeting
            </Button>
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="glass-card overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-blue-950 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Meetings */}
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-blue-950">
            Recent Meetings
          </CardTitle>
          <Link href="/dashboard/meetings">
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentMeetings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No meetings yet</p>
              {user?.role === 'lead' && (
                <Link href="/dashboard/meetings/new" className="mt-4 inline-block">
                  <Button size="sm" className="gradient-bg text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Meeting
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {recentMeetings.map((meeting) => (
                <Link
                  key={meeting.id}
                  href={`/dashboard/meetings/${meeting.id}`}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{meeting.title}</p>
                      <p className="text-sm text-slate-500">
                        {new Date(meeting.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {meeting.tasks?.filter((t: any) => t.status === 'completed').length || 0}/
                      {meeting.tasks?.length || 0} tasks
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
