'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  CheckSquare,
  Clock,
  User,
  Calendar,
  Search,
  Filter,
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
  meeting: { id: string; title: string };
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [userRole, setUserRole] = useState<string>('member');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const [tasksRes, userRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/auth/me'),
      ]);

      if (!userRes.ok) {
        window.location.href = '/login';
        return;
      }
      const userData = await userRes.json();
      setUserRole(userData.user?.role || 'member');

      const tasksData = tasksRes.ok ? await tasksRes.json() : { tasks: [] };
      setTasks(tasksData.tasks || []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
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
        fetchTasks();
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    in_progress: tasks.filter((t) => t.status === 'in_progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-blue-950 dark:text-blue-100">
          {userRole === 'lead' ? 'All Tasks' : 'My Tasks'}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          {tasks.length} task{tasks.length !== 1 ? 's' : ''} total
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { key: 'all', label: 'All Tasks', icon: CheckSquare, color: 'from-slate-500 to-slate-600' },
          { key: 'pending', label: 'Pending', icon: Clock, color: 'from-amber-500 to-amber-600' },
          { key: 'in_progress', label: 'In Progress', icon: Clock, color: 'from-blue-500 to-blue-600' },
          { key: 'completed', label: 'Completed', icon: CheckSquare, color: 'from-emerald-500 to-emerald-600' },
        ].map((stat) => (
          <Card
            key={stat.key}
            className={`glass-card cursor-pointer transition-all ${
              statusFilter === stat.key ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setStatusFilter(stat.key)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-950 dark:text-blue-100">
                    {statusCounts[stat.key as keyof typeof statusCounts]}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
        />
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="py-12 text-center">
            <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">
              {searchQuery || statusFilter !== 'all'
                ? 'No tasks match your filters'
                : 'No tasks yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`font-medium ${
                          task.status === 'completed'
                            ? 'text-emerald-700 dark:text-emerald-300 line-through'
                            : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {task.title}
                      </h3>
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
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {task.assignee.name}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {task.meeting.title}
                      </div>
                      {task.deadline && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Due {new Date(task.deadline).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {task.status !== 'completed' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(task.id, 'in_progress')}
                          className={
                            task.status === 'in_progress'
                              ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                              : ''
                          }
                        >
                          <Clock className="w-4 h-4 mr-1" />
                          In Progress
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(task.id, 'completed')}
                          className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 border-emerald-200 dark:border-emerald-800"
                        >
                          <CheckSquare className="w-4 h-4 mr-1" />
                          Complete
                        </Button>
                      </>
                    )}
                    {task.status === 'completed' && (
                      <Badge className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300">
                        <CheckSquare className="w-4 h-4 mr-1" />
                        Done
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
