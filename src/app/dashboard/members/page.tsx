'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Users,
  UserPlus,
  Copy,
  Check,
  Mail,
  Calendar,
  CheckSquare,
} from 'lucide-react';
import { getInitials } from '@/lib/utils';

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  _count: {
    assignedTasks: number;
  };
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteLink, setInviteLink] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

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
    } finally {
      setLoading(false);
    }
  };

  const generateInvite = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/invite', {
        method: 'POST',
      });
      const data = await res.json();
      setInviteLink(data.inviteLink);
      setDialogOpen(true);
    } catch (error) {
      console.error('Failed to generate invite:', error);
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = inviteLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
          <h1 className="text-2xl font-bold text-blue-950 dark:text-blue-100">Team Members</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {members.length} member{members.length !== 1 ? 's' : ''} in your team
          </p>
        </div>
        <Button
          onClick={generateInvite}
          disabled={generating}
          className="gradient-bg text-white hover:opacity-90"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          {generating ? 'Generating...' : 'Invite Member'}
        </Button>
      </div>

      {/* Members Grid */}
      {members.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 mb-4">No team members yet</p>
            <Button onClick={generateInvite} className="gradient-bg text-white">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Your First Member
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <Card key={member.id} className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-medium">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-slate-900 dark:text-slate-100">{member.name}</h3>
                      <Badge
                        className={
                          member.role === 'lead'
                            ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 dark:text-slate-600'
                        }
                      >
                        {member.role === 'lead' ? 'Lead' : 'Member'}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {member.email}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <CheckSquare className="w-4 h-4" />
                        {member._count.assignedTasks} tasks
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Joined {new Date(member.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Invite Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-blue-950 dark:text-blue-100">Invite Team Member</DialogTitle>
            <DialogDescription>
              Share this link with your team member to join your team.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                value={inviteLink}
                readOnly
                className="bg-slate-50 dark:bg-slate-800/50 font-mono text-sm"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={copyToClipboard}
                className="flex-shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              This link expires in 7 days. The invited person will create an account
              as a Team Member.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
