import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    let settings = await prisma.settings.findUnique({
      where: { userId: user.id },
    });

    if (!settings) {
      settings = await prisma.settings.create({
        data: { userId: user.id },
      });
    }

    return NextResponse.json({
      settings: {
        aiProvider: settings.aiProvider,
        aiApiKey: settings.aiApiKey ? '••••••••' + settings.aiApiKey.slice(-4) : '',
        aiBaseUrl: settings.aiBaseUrl || '',
        aiModel: settings.aiModel || '',
        smtpHost: settings.smtpHost || '',
        smtpPort: settings.smtpPort || '',
        smtpUser: settings.smtpUser || '',
        smtpPass: settings.smtpPass ? '••••••••' : '',
        appUrl: settings.appUrl || '',
      },
    });
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();

    const data: Record<string, string | null> = {};
    if (body.aiProvider !== undefined) data.aiProvider = body.aiProvider;
    if (body.aiApiKey !== undefined && body.aiApiKey !== '') data.aiApiKey = body.aiApiKey;
    if (body.aiBaseUrl !== undefined) data.aiBaseUrl = body.aiBaseUrl || null;
    if (body.aiModel !== undefined) data.aiModel = body.aiModel || null;
    if (body.smtpHost !== undefined) data.smtpHost = body.smtpHost || null;
    if (body.smtpPort !== undefined) data.smtpPort = body.smtpPort || null;
    if (body.smtpUser !== undefined) data.smtpUser = body.smtpUser || null;
    if (body.smtpPass !== undefined && body.smtpPass !== '') data.smtpPass = body.smtpPass;
    if (body.appUrl !== undefined) data.appUrl = body.appUrl || null;

    const settings = await prisma.settings.upsert({
      where: { userId: user.id },
      update: data,
      create: {
        userId: user.id,
        aiProvider: body.aiProvider || 'groq',
        aiApiKey: body.aiApiKey || null,
        aiBaseUrl: body.aiBaseUrl || null,
        aiModel: body.aiModel || null,
        smtpHost: body.smtpHost || null,
        smtpPort: body.smtpPort || null,
        smtpUser: body.smtpUser || null,
        smtpPass: body.smtpPass || null,
        appUrl: body.appUrl || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
