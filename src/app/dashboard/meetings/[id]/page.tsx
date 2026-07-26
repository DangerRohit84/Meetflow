'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Calendar,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2,
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  deadline: string | null;
  assignee: { id: string; name: string; email: string };
  creator: { id: string; name: string };
}

interface Meeting {
  id: string;
  title: string;
  date: string;
  transcript: string | null;
  summary: string | null;
  decisions: string | null;
  lead: { id: string; name: string };
  tasks: Task[];
}

export default function MeetingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('member');
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    fetchMeeting();
  }, [id]);

  const fetchMeeting = async () => {
    try {
      const [meetingRes, userRes] = await Promise.all([
        fetch(`/api/meetings/${id}`),
        fetch('/api/auth/me'),
      ]);

      const meetingData = await meetingRes.json();
      const userData = await userRes.json();

      setMeeting(meetingData.meeting);
      setUserRole(userData.user?.role || 'member');
      setUserId(userData.user?.id || '');
    } catch (error) {
      console.error('Failed to fetch meeting:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        fetchMeeting();
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this meeting?')) return;

    try {
      const res = await fetch(`/api/meetings/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.push('/dashboard/meetings');
      }
    } catch (error) {
      console.error('Failed to delete meeting:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
        <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
        <p className="text-slate-500 dark:text-slate-400">Meeting not found</p>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mt-4"
        >
          Go Back
        </Button>
      </div>
    );
  }

  let decisions: string[] = [];
  try {
    decisions = meeting.decisions ? JSON.parse(meeting.decisions) : [];
  } catch {
    decisions = [];
  }
  const completedCount = meeting.tasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-800 mt-1"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-blue-950 dark:text-blue-100">{meeting.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(meeting.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {meeting.lead.name}
              </div>
            </div>
          </div>
        </div>
        {userRole === 'lead' && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="text-rose-500 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/50"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Progress */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Task Progress
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {completedCount}/{meeting.tasks.length} completed
            </span>
          </div>
          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full gradient-bg rounded-full transition-all duration-500"
              style={{
                width: `${meeting.tasks.length > 0 ? (completedCount / meeting.tasks.length) * 100 : 0}%`,
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      {meeting.summary && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-blue-950 dark:text-blue-100 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 dark:text-slate-300 dark:text-slate-600 leading-relaxed">{meeting.summary}</p>
          </CardContent>
        </Card>
      )}

      {/* Tasks */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-blue-950 dark:text-blue-100">
            Action Items ({meeting.tasks.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {meeting.tasks.length === 0 ? (
            <p className="text-center text-slate-500 dark:text-slate-400 py-8">No action items</p>
          ) : (
            <div className="space-y-4">
              {meeting.tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border transition-all ${
                    task.status === 'completed'
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4
                          className={`font-medium ${
                            task.status === 'completed'
                              ? 'text-emerald-700 dark:text-emerald-300 line-through'
                              : 'text-slate-900 dark:text-slate-100'
                          }`}
                        >
                          {task.title}
                        </h4>
                        <Badge
                          className={
                            task.priority === 'high'
                              ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300'
                              : task.priority === 'medium'
                              ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                              : 'bg-sky-100 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300'
                          }
                        >
                          {task.priority}
                        </Badge>
                      </div>
                      {task.description && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {task.assignee.name}
                        </div>
                        {task.deadline && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(task.deadline).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {task.status !== 'completed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(task.id, 'in_progress')}
                          className={
                            task.status === 'in_progress'
                              ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200'
                              : ''
                          }
                        >
                          <Clock className="w-4 h-4 mr-1" />
                          In Progress
                        </Button>
                      )}
                      {task.status !== 'completed' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(task.id, 'completed')}
                          className="bg-emerald-100 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 border-emerald-200 dark:border-emerald-800"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Complete
                        </Button>
                      )}
                      {task.status === 'completed' && (
                        <Badge className="bg-emerald-100 text-emerald-700 dark:text-emerald-300">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Done
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transcript */}
      {meeting.transcript && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-blue-950 dark:text-blue-100">
              Original Transcript
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap font-mono bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
              {meeting.transcript}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
