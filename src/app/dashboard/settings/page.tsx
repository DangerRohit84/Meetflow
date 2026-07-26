'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, Save, Loader2, Key, Mail, Info, ExternalLink, Check, User, Lock, Shield } from 'lucide-react';
import { getInitials } from '@/lib/utils';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

const providers = [
  {
    id: 'groq',
    name: 'Groq',
    url: 'https://api.groq.com/openai/v1/chat/completions',
    models: [
      { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B', free: false },
      { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B', free: false },
      { id: 'openai/gpt-oss-120b', name: 'GPT-OSS 120B', free: false },
      { id: 'openai/gpt-oss-20b', name: 'GPT-OSS 20B', free: false },
      { id: 'qwen/qwen3.6-27b', name: 'Qwen 3.6 27B', free: false },
      { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', free: false },
      { id: 'gemma2-9b-it', name: 'Gemma 2 9B', free: false },
      { id: 'groq/compound', name: 'Groq Compound', free: false },
      { id: 'groq/compound-mini', name: 'Groq Compound Mini', free: false },
    ],
    keyUrl: 'https://console.groq.com/keys',
    description: 'Fastest inference speeds',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    url: 'https://api.openai.com/v1/chat/completions',
    models: [
      { id: 'gpt-5.6-sol', name: 'GPT-5.6 Sol (Flagship)', free: false },
      { id: 'gpt-5.6-terra', name: 'GPT-5.6 Terra', free: false },
      { id: 'gpt-5.6-luna', name: 'GPT-5.6 Luna', free: false },
      { id: 'gpt-5.5', name: 'GPT-5.5', free: false },
      { id: 'gpt-5.4', name: 'GPT-5.4', free: false },
      { id: 'gpt-5.4-mini', name: 'GPT-5.4 Mini', free: false },
      { id: 'gpt-5.4-nano', name: 'GPT-5.4 Nano', free: false },
      { id: 'gpt-4.1', name: 'GPT-4.1', free: false },
      { id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini', free: false },
      { id: 'gpt-4o', name: 'GPT-4o', free: false },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', free: false },
      { id: 'o3', name: 'o3 (Reasoning)', free: false },
      { id: 'o3-pro', name: 'o3 Pro', free: false },
      { id: 'o4-mini', name: 'o4 Mini', free: false },
      { id: 'gpt-oss-120b', name: 'GPT-OSS 120B (Open)', free: false },
      { id: 'gpt-oss-20b', name: 'GPT-OSS 20B (Open)', free: false },
    ],
    keyUrl: 'https://platform.openai.com/api-keys',
    description: 'Most popular AI provider',
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    url: 'https://api.anthropic.com/v1/messages',
    models: [
      { id: 'claude-fable-5', name: 'Claude Fable 5 (Best)', free: false },
      { id: 'claude-opus-5', name: 'Claude Opus 5', free: false },
      { id: 'claude-opus-4-8', name: 'Claude Opus 4.8', free: false },
      { id: 'claude-opus-4-7', name: 'Claude Opus 4.7', free: false },
      { id: 'claude-sonnet-5', name: 'Claude Sonnet 5', free: false },
      { id: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6', free: false },
      { id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5', free: false },
    ],
    keyUrl: 'https://console.anthropic.com/settings/keys',
    description: 'Best for analysis and coding',
  },
  {
    id: 'google',
    name: 'Google Gemini',
    url: 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent',
    models: [
      { id: 'gemini-2.5-pro-preview-05-06', name: 'Gemini 2.5 Pro', free: false },
      { id: 'gemini-2.5-flash-preview-05-20', name: 'Gemini 2.5 Flash', free: false },
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', free: true },
      { id: 'gemini-2.0-flash-lite', name: 'Gemini 2.0 Flash Lite', free: true },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', free: true },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', free: false },
    ],
    keyUrl: 'https://aistudio.google.com/apikey',
    description: 'Free tier available, multimodal',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    url: 'https://api.deepseek.com/chat/completions',
    models: [
      { id: 'deepseek-chat', name: 'DeepSeek V3 (Chat)', free: false },
      { id: 'deepseek-reasoner', name: 'DeepSeek R1 (Reasoner)', free: false },
    ],
    keyUrl: 'https://platform.deepseek.com/api_keys',
    description: 'Affordable, strong coding',
  },
  {
    id: 'mistral',
    name: 'Mistral',
    url: 'https://api.mistral.ai/v1/chat/completions',
    models: [
      { id: 'mistral-large-latest', name: 'Mistral Large', free: false },
      { id: 'mistral-small-latest', name: 'Mistral Small', free: false },
      { id: 'codestral-latest', name: 'Codestral', free: false },
      { id: 'open-mistral-nemo', name: 'Mistral Nemo (Open)', free: true },
      { id: 'open-mixtral-8x22b', name: 'Mixtral 8x22B (Open)', free: true },
      { id: 'open-mixtral-8x7b', name: 'Mixtral 8x7B (Open)', free: true },
    ],
    keyUrl: 'https://console.mistral.ai/api-keys/',
    description: 'European AI, open models available',
  },
  {
    id: 'together',
    name: 'Together AI',
    url: 'https://api.together.xyz/v1/chat/completions',
    models: [
      { id: 'meta-llama/Llama-3.3-70B-Instruct-Turbo', name: 'Llama 3.3 70B Turbo', free: false },
      { id: 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo', name: 'Llama 3.1 405B', free: false },
      { id: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo', name: 'Llama 3.1 70B', free: false },
      { id: 'Qwen/Qwen2.5-72B-Instruct-Turbo', name: 'Qwen 2.5 72B', free: false },
      { id: 'deepseek-ai/DeepSeek-V3', name: 'DeepSeek V3', free: false },
      { id: 'mistralai/Mixtral-8x22B-Instruct-v0.1', name: 'Mixtral 8x22B', free: false },
    ],
    keyUrl: 'https://api.together.xyz/settings/api-keys',
    description: 'Open-source model hosting',
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    url: 'https://openrouter.ai/api/v1/chat/completions',
    models: [
      { id: 'openrouter/free', name: 'Auto Free (Recommended)', free: true },
      { id: 'nvidia/nemotron-3-ultra-550b-a55b:free', name: 'Nemotron 3 Ultra 550B', free: true },
      { id: 'nvidia/nemotron-3-super-120b-a12b:free', name: 'Nemotron 3 Super 120B', free: true },
      { id: 'nvidia/nemotron-3-nano-30b-a3b:free', name: 'Nemotron 3 Nano 30B', free: true },
      { id: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free', name: 'Nemotron 3 Nano Omni 30B', free: true },
      { id: 'nvidia/nemotron-nano-12b-v2-vl:free', name: 'Nemotron Nano 12B VL', free: true },
      { id: 'nvidia/nemotron-nano-9b-v2:free', name: 'Nemotron Nano 9B', free: true },
      { id: 'nvidia/nemotron-3.5-content-safety:free', name: 'Nemotron 3.5 Content Safety', free: true },
      { id: 'google/gemma-4-31b-it:free', name: 'Gemma 4 31B', free: true },
      { id: 'google/gemma-4-26b-a4b-it:free', name: 'Gemma 4 26B', free: true },
      { id: 'openai/gpt-oss-20b:free', name: 'OpenAI GPT-OSS 20B', free: true },
      { id: 'poolside/laguna-m.1:free', name: 'Poolside Laguna M.1', free: true },
      { id: 'poolside/laguna-s-2.1:free', name: 'Poolside Laguna S 2.1', free: true },
      { id: 'poolside/laguna-xs-2.1:free', name: 'Poolside Laguna XS 2.1', free: true },
      { id: 'cohere/north-mini-code:free', name: 'Cohere North Mini Code', free: true },
      { id: 'inclusionai/ling-3.0-flash:free', name: 'Ling 3.0 Flash', free: true },
      { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B (Paid)', free: false },
      { id: 'openai/gpt-4o', name: 'GPT-4o (Paid)', free: false },
      { id: 'anthropic/claude-sonnet-4', name: 'Claude Sonnet 4 (Paid)', free: false },
      { id: 'google/gemini-2.5-pro-preview', name: 'Gemini 2.5 Pro (Paid)', free: false },
      { id: 'deepseek/deepseek-chat', name: 'DeepSeek V3 (Paid)', free: false },
    ],
    keyUrl: 'https://openrouter.ai/keys',
    description: '16 free models + auto-router, unified API',
  },
  {
    id: 'custom',
    name: 'Custom (OpenAI-compatible)',
    url: '',
    models: [],
    keyUrl: '',
    description: 'Any OpenAI-compatible API (Ollama, LM Studio, etc.)',
  },
];

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'ai' | 'security'>('profile');

  const [user, setUser] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');
  const [profileMsg, setProfileMsg] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  const [aiProvider, setAiProvider] = useState('groq');
  const [aiApiKey, setAiApiKey] = useState('');
  const [aiBaseUrl, setAiBaseUrl] = useState('');
  const [aiModel, setAiModel] = useState('');

  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const [userRes, settingsRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/settings'),
      ]);

      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData.user);
        setName(userData.user.name);
      }

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        const s = settingsData.settings;
        setAiProvider(s.aiProvider || 'groq');
        setAiBaseUrl(s.aiBaseUrl || '');
        setAiModel(s.aiModel || '');
        setSmtpHost(s.smtpHost || '');
        setSmtpPort(s.smtpPort || '587');
        setSmtpUser(s.smtpUser || '');
      }
    } catch (error) {
      console.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setProfileMsg('');
    try {
      const res = await fetch('/api/settings/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        setProfileMsg('Profile updated!');
        setUser((prev) => prev ? { ...prev, name } : prev);
      } else {
        const data = await res.json();
        setProfileMsg(data.error || 'Failed to update');
      }
    } catch {
      setProfileMsg('Something went wrong');
    } finally {
      setSaving(false);
      setTimeout(() => setProfileMsg(''), 3000);
    }
  };

  const handleChangePassword = async () => {
    setPasswordMsg('');
    if (newPassword !== confirmPassword) {
      setPasswordMsg('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg('Password must be at least 6 characters');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/settings/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordMsg('Password changed!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMsg(data.error || 'Failed to change password');
      }
    } catch {
      setPasswordMsg('Something went wrong');
    } finally {
      setSaving(false);
      setTimeout(() => setPasswordMsg(''), 3000);
    }
  };

  const handleSaveAI = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aiProvider,
          aiApiKey,
          aiBaseUrl,
          aiModel,
          smtpHost,
          smtpPort,
          smtpUser,
          smtpPass,
        }),
      });
      if (res.ok) {
        setSaved(true);
        setAiApiKey('');
        setSmtpPass('');
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {
      console.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const currentProvider = providers.find((p) => p.id === aiProvider);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'ai' as const, label: 'AI Provider', icon: Bot },
    { id: 'security' as const, label: 'Security', icon: Shield },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-blue-950 dark:text-blue-100">Settings</h1>
        <p className="text-slate-600 dark:text-slate-400">Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="glass-card lg:col-span-1">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-20 h-20 mb-4">
                  <AvatarFallback className="bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-2xl font-bold">
                    {user ? getInitials(user.name) : '?'}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-blue-950 dark:text-blue-100 text-lg">{user?.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
                <span className="mt-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300">
                  {user?.role === 'lead' ? 'Team Lead' : 'Team Member'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-blue-950 dark:text-blue-100">
                <User className="w-5 h-5" />
                Edit Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">Full Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white dark:bg-slate-800"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">Email</Label>
                <Input
                  value={user?.email || ''}
                  disabled
                  className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400"
                />
                <p className="text-xs text-slate-400">Email cannot be changed</p>
              </div>
              {profileMsg && (
                <p className={`text-sm ${profileMsg.includes('updated') ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {profileMsg}
                </p>
              )}
              <Button onClick={handleSaveProfile} disabled={saving} className="gradient-bg text-white">
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Provider Tab */}
      {activeTab === 'ai' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-blue-950 dark:text-blue-100">
                  <Bot className="w-5 h-5" />
                  AI Provider
                </CardTitle>
                <CardDescription>Choose a provider for transcript extraction</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {providers.map((provider) => (
                    <button
                      key={provider.id}
                      onClick={() => {
                        setAiProvider(provider.id);
                        if (provider.url) setAiBaseUrl(provider.url);
                        if (provider.models.length) setAiModel(provider.models[0].id);
                        else setAiModel('');
                      }}
                      className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                        aiProvider === provider.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50 dark:border-blue-400'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${aiProvider === provider.id ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}`}>
                          {provider.name}
                        </span>
                        {aiProvider === provider.id && <Check className="w-4 h-4 text-blue-600" />}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{provider.description}</p>
                    </button>
                  ))}
                </div>

                <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <div className="space-y-2">
                    <Label className="text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      API Key
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        type="password"
                        placeholder="Enter your API key"
                        value={aiApiKey}
                        onChange={(e) => setAiApiKey(e.target.value)}
                        className="bg-white dark:bg-slate-800 flex-1"
                      />
                      {currentProvider?.keyUrl && (
                        <a href={currentProvider.keyUrl} target="_blank" rel="noopener noreferrer">
                          <Button type="button" variant="outline" size="sm" className="whitespace-nowrap">
                            Get Key <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Leave empty to keep current key</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700 dark:text-slate-300">Base URL</Label>
                    <Input
                      placeholder="https://api.groq.com/openai/v1/chat/completions"
                      value={aiBaseUrl}
                      onChange={(e) => setAiBaseUrl(e.target.value)}
                      className="bg-white dark:bg-slate-800 font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700 dark:text-slate-300">Model</Label>
                    {currentProvider && currentProvider.models.length > 0 ? (
                      <select
                        value={aiModel}
                        onChange={(e) => setAiModel(e.target.value)}
                        className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm cursor-pointer"
                      >
                        {currentProvider.models.map((m) => (
                          <option key={m.id} value={m.id}>{m.name} {m.free ? '(Free)' : '(Paid)'}</option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        placeholder="Model name"
                        value={aiModel}
                        onChange={(e) => setAiModel(e.target.value)}
                        className="bg-white dark:bg-slate-800"
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-blue-950 dark:text-blue-100">
                  <Mail className="w-5 h-5" />
                  Email Notifications
                </CardTitle>
                <CardDescription>SMTP for task reminders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label className="text-slate-700 dark:text-slate-300">SMTP Host</Label>
                    <Input placeholder="smtp.gmail.com" value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} className="bg-white dark:bg-slate-800" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 dark:text-slate-300">Port</Label>
                    <Input placeholder="587" value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} className="bg-white dark:bg-slate-800" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-700 dark:text-slate-300">Email</Label>
                    <Input placeholder="your-email@gmail.com" value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} className="bg-white dark:bg-slate-800" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 dark:text-slate-300">App Password</Label>
                    <Input type="password" placeholder="••••••••" value={smtpPass} onChange={(e) => setSmtpPass(e.target.value)} className="bg-white dark:bg-slate-800" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Button onClick={handleSaveAI} disabled={saving} className="w-full gradient-bg text-white hover:opacity-90">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : saved ? <Check className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save AI Settings'}
            </Button>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="max-w-xl">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-blue-950 dark:text-blue-100">
                <Lock className="w-5 h-5" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">Current Password</Label>
                <Input
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-white dark:bg-slate-800"
                  autoComplete="current-password"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">New Password</Label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-white dark:bg-slate-800"
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">Confirm New Password</Label>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-white dark:bg-slate-800"
                  autoComplete="new-password"
                />
              </div>
              {passwordMsg && (
                <p className={`text-sm ${passwordMsg.includes('changed') ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {passwordMsg}
                </p>
              )}
              <Button onClick={handleChangePassword} disabled={saving} className="gradient-bg text-white">
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Lock className="w-4 h-4 mr-2" />}
                Change Password
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
