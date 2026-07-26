import prisma from './prisma';

export interface ExtractedTask {
  title: string;
  description: string;
  assignee: string;
  deadline: string | null;
  priority: 'low' | 'medium' | 'high';
}

export interface ExtractedData {
  summary: string;
  tasks: ExtractedTask[];
}

const getSystemPrompt = () => `You are a meeting analyst. Extract structured data from meeting transcripts.

Rules:
- Return ONLY valid JSON. No markdown, no code blocks, no explanation.
- Today's date is ${new Date().toISOString().split('T')[0]}.
- For deadlines: if a specific day is mentioned (e.g. "by Wednesday", "by Friday"), calculate the actual date. If it's in the past this week, use next week. Format as YYYY-MM-DD.
- If no deadline is mentioned, set deadline to null.
- Assignee must match exactly as spoken in the transcript (e.g. if transcript says "Rohit", assignee is "Rohit").
- Priority: "high" for urgent/critical/deadline-soon, "medium" for normal tasks, "low" for nice-to-have/research.`;

const USER_PROMPT = (transcript: string) => `Extract action items from this meeting transcript:

${transcript}

Return JSON with this exact structure:
{
  "summary": "2-3 sentence summary",
  "tasks": [
    {
      "title": "short task title (max 50 chars)",
      "description": "detailed description",
      "assignee": "exact person name from transcript",
      "deadline": "YYYY-MM-DD or null",
      "priority": "low or medium or high"
    }
  ]
}`;

async function callAnthropic(apiKey: string, baseUrl: string, model: string, transcript: string): Promise<string> {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: 2000,
      system: getSystemPrompt(),
      messages: [
        { role: 'user', content: USER_PROMPT(transcript) },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('Anthropic API error:', response.status, err);
    throw new Error(`Anthropic API error ${response.status}: ${err.substring(0, 300)}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || '';
}

async function callGemini(apiKey: string, model: string, transcript: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: getSystemPrompt() }] },
      contents: [{ parts: [{ text: USER_PROMPT(transcript) }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 2000 },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('Gemini API error:', response.status, err);
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function callOpenAICompatible(apiKey: string, baseUrl: string, model: string, transcript: string): Promise<string> {
  const isOpenRouter = baseUrl.includes('openrouter.ai');
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
  if (isOpenRouter) {
    headers['HTTP-Referer'] = 'https://meetflow.ai';
    headers['X-Title'] = 'MeetFlow AI';
  }

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      temperature: 0.3,
      max_tokens: 2000,
      messages: [
        { role: 'system', content: getSystemPrompt() },
        { role: 'user', content: USER_PROMPT(transcript) },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('AI API error:', response.status, err);
    throw new Error(`AI API error ${response.status}: ${err.substring(0, 300)}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

export async function extractMeetingData(transcript: string, userId: string): Promise<ExtractedData> {
  const settings = await prisma.settings.findUnique({ where: { userId } });

  const provider = settings?.aiProvider || 'groq';
  const apiKey = settings?.aiApiKey || '';
  let baseUrl = settings?.aiBaseUrl || '';
  const model = settings?.aiModel || '';

  if (!apiKey) {
    throw new Error('No API key configured. Go to Settings to add your AI provider key.');
  }

  const providerDefaults: Record<string, { url: string; model: string }> = {
    groq: { url: 'https://api.groq.com/openai/v1/chat/completions', model: 'llama-3.3-70b-versatile' },
    openai: { url: 'https://api.openai.com/v1/chat/completions', model: 'gpt-4o-mini' },
    anthropic: { url: 'https://api.anthropic.com/v1/messages', model: 'claude-sonnet-4-20250514' },
    deepseek: { url: 'https://api.deepseek.com/chat/completions', model: 'deepseek-chat' },
    google: { url: '', model: 'gemini-2.0-flash' },
    mistral: { url: 'https://api.mistral.ai/v1/chat/completions', model: 'mistral-small-latest' },
    together: { url: 'https://api.together.xyz/v1/chat/completions', model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo' },
    openrouter: { url: 'https://openrouter.ai/api/v1/chat/completions', model: 'meta-llama/llama-3.3-70b-instruct:free' },
    custom: { url: '', model: '' },
  };

  const defaults = providerDefaults[provider] || providerDefaults.groq;
  const finalUrl = baseUrl || defaults.url;
  const finalModel = model || defaults.model;

  if (!finalUrl || !finalModel) {
    throw new Error('Missing API URL or model. Check your Settings.');
  }

  let content: string;

  if (provider === 'anthropic') {
    content = await callAnthropic(apiKey, finalUrl, finalModel, transcript);
  } else if (provider === 'google') {
    content = await callGemini(apiKey, finalModel, transcript);
  } else {
    content = await callOpenAICompatible(apiKey, finalUrl, finalModel, transcript);
  }

  if (!content) {
    throw new Error('No content returned from AI');
  }

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON found in AI response');
  }

  const parsed = JSON.parse(jsonMatch[0]);
  return {
    summary: parsed.summary || '',
    tasks: parsed.tasks || [],
  };
}
