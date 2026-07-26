'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Search, CheckSquare, Clock } from 'lucide-react';

interface Meeting {
  id: string;
  title: string;
  date: string;
  summary: string | null;
  tasks: { id: string; status: string }[];
  lead: { id: string; name: string };
}

export default function MeetingsPage() {
  const router = useRouter();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole, setUserRole] = useState<string>('member');

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const [meetingsRes, userRes] = await Promise.all([
        fetch('/api/meetings'),
        fetch('/api/auth/me'),
      ]);
      
      if (!userRes.ok) {
        window.location.href = '/login';
        return;
      }
      const userData = await userRes.json();
      setUserRole(userData.user?.role || 'member');
      
      const meetingsData = meetingsRes.ok ? await meetingsRes.json() : { meetings: [] };
      setMeetings(meetingsData.meetings || []);
    } catch (error) {
      console.error('Failed to fetch meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMeetings = meetings.filter((meeting) =>
    meeting.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusStats = (tasks: { status: string }[]) => {
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const total = tasks.length;
    return { completed, total };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-950 dark:text-blue-100">
            {userRole === 'lead' ? 'All Meetings' : 'My Meetings'}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {meetings.length} meeting{meetings.length !== 1 ? 's' : ''} total
          </p>
        </div>
        {userRole === 'lead' && (
          <Link href="/dashboard/meetings/new">
            <Button className="gradient-bg text-white hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              New Meeting
            </Button>
          </Link>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          placeholder="Search meetings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
        />
      </div>

      {/* Meetings Grid */}
      {filteredMeetings.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="py-12 text-center">
            <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              {searchQuery ? 'No meetings found' : 'No meetings yet'}
            </p>
            {userRole === 'lead' && !searchQuery && (
              <Link href="/dashboard/meetings/new">
                <Button className="gradient-bg text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Meeting
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeetings.map((meeting) => {
            const stats = getStatusStats(meeting.tasks);
            return (
              <Link key={meeting.id} href={`/dashboard/meetings/${meeting.id}`}>
                <Card className="glass-card h-full cursor-pointer hover:scale-[1.02] transition-transform">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <Badge variant="secondary">
                        {stats.completed}/{stats.total} tasks
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-semibold text-blue-950 dark:text-blue-100 mt-4 line-clamp-1">
                      {meeting.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                      {meeting.summary || 'No summary available'}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <Clock className="w-4 h-4" />
                        {new Date(meeting.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <CheckSquare className="w-4 h-4" />
                        {stats.total} action items
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
