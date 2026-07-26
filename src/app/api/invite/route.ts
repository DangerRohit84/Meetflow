import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { generateInviteToken } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'lead') {
      return NextResponse.json({ error: 'Only team leads can create invites' }, { status: 403 });
    }

    const token = generateInviteToken();

    const invite = await prisma.invite.create({
      data: {
        token,
        leadId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/register?token=${token}`;

    return NextResponse.json({
      inviteLink,
      token: invite.token,
      expiresAt: invite.expiresAt,
    });
  } catch (error) {
    console.error('Create invite error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'lead') {
      return NextResponse.json({ error: 'Only team leads can view invites' }, { status: 403 });
    }

    const invites = await prisma.invite.findMany({
      where: { leadId: user.id },
      orderBy: { createdAt: 'desc' },
      include: { users: { select: { id: true, name: true, email: true } } },
    });

    return NextResponse.json({ invites });
  } catch (error) {
    console.error('Get invites error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
