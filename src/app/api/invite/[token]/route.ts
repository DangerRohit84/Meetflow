import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    
    const invite = await prisma.invite.findUnique({
      where: { token },
      include: { lead: { select: { name: true, email: true } } },
    });

    if (!invite) {
      return NextResponse.json({ error: 'Invalid invite link' }, { status: 404 });
    }

    if (invite.used) {
      return NextResponse.json({ error: 'Invite link already used' }, { status: 400 });
    }

    if (new Date() > invite.expiresAt) {
      return NextResponse.json({ error: 'Invite link expired' }, { status: 400 });
    }

    return NextResponse.json({
      valid: true,
      leadName: invite.lead.name,
      expiresAt: invite.expiresAt,
    });
  } catch (error) {
    console.error('Validate invite error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
