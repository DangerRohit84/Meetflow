'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  Calendar,
  User,
  ArrowLeft,
} from 'lucide-react';

interface Member {
  id: string;
  name: string;
  email: string;
}

interface ExtractedTask {
  title: string;
  description: string;
  assignee: string;
  deadline: string | null;
  priority: 'low' | 'medium' | 'high';
}

interface ExtractedData {
  summary: string;
  tasks: ExtractedTask[];
}

export default function NewMeetingPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [transcript, setTranscript] = useState('');
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'input' | 'review'>('input');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/members');
      const data = await res.json();
      setMembers(data.members || []);
    } catch (error) {
      console.error('Failed to fetch members:', error);
    }
  };

  const handleExtract = async () => {
    if (!transcript.trim()) {
      setError('Please enter a meeting transcript');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/ai/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Extraction failed');
      }

      const data: ExtractedData = await res.json();
      setExtractedData(data);
      if (!title) {
        setTitle(`Meeting on ${new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`);
      }
      setStep('review');
    } catch (err: any) {
      setError(err.message || 'Failed to extract meeting data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!extractedData) return;

    setSaving(true);
    setError('');

    try {
      // Map assignee names to member IDs
      const tasksWithIds = extractedData.tasks.map((task) => {
        const assigneeLower = task.assignee.toLowerCase();
        const member = members.find(
          (m) =>
            m.name.toLowerCase() === assigneeLower ||
            m.name.toLowerCase().includes(assigneeLower) ||
            assigneeLower.includes(m.name.toLowerCase()) ||
            m.name.toLowerCase().split(' ')[0] === assigneeLower.split(' ')[0]
        );
        return {
          ...task,
          assigneeId: member?.id || members[0]?.id,
        };
      });

      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          date,
          transcript,
          summary: extractedData.summary,
          tasks: tasksWithIds,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save meeting');
      }

      router.push('/dashboard/meetings');
    } catch (err: any) {
      setError(err.message || 'Failed to save meeting');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-blue-950 dark:text-blue-100">New Meeting</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Upload a transcript and let AI extract action items
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {step === 'input' ? (
        <div className="space-y-6">
          {/* Meeting Details */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-blue-950 dark:text-blue-100">
                Meeting Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-slate-700 dark:text-slate-300">
                    Meeting Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., Weekly Team Standup"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-slate-700 dark:text-slate-300">
                    Meeting Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transcript Input */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-blue-950 dark:text-blue-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Meeting Transcript
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="transcript" className="text-slate-700 dark:text-slate-300">
                  Paste the meeting transcript or notes below
                </Label>
                <Textarea
                  id="transcript"
                  placeholder={`Example:\n\nJohn: Let's discuss the project timeline. We need the backend ready by Friday.\nSarah: I can have the UI mockups done by Wednesday.\nDavid: I'll coordinate with John on the backend updates.\nJohn: What about the budget allocation? We still need approval.\nSarah: That's still pending. We should escalate to the manager.`}
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  rows={12}
                  className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 font-mono text-sm"
                />
              </div>
              <Button
                onClick={handleExtract}
                disabled={loading || !transcript.trim()}
                className="gradient-bg text-white hover:opacity-90"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Extracting with AI...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Extract with AI
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-blue-950 dark:text-blue-100 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                AI-Generated Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {extractedData?.summary}
              </p>
            </CardContent>
          </Card>

          {/* Tasks */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-blue-950 dark:text-blue-100">
                Action Items ({extractedData?.tasks.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {extractedData?.tasks.map((task, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900 dark:text-slate-100">{task.title}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          {task.description}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                            <User className="w-4 h-4" />
                            {task.assignee}
                          </div>
                          {task.deadline && (
                            <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                              <Calendar className="w-4 h-4" />
                              {new Date(task.deadline).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge
                        className={
                          task.priority === 'high'
                            ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300'
                            : task.priority === 'medium'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-sky-100 text-sky-700'
                        }
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setStep('input')}
              className="flex-1"
            >
              Back to Edit
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 gradient-bg text-white hover:opacity-90"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Meeting'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
