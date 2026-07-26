import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anonymous';
    const rateLimitKey = `register:${ip}`;
    const { allowed, retryAfter } = checkRateLimit(rateLimitKey);
    
    if (!allowed) {
      return NextResponse.json(
        { error: `Too many registration attempts. Please try again in ${retryAfter} seconds.` },
        { status: 429 }
      );
    }

    const { name, email, password, inviteToken } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    if (name.length > 100) {
      return NextResponse.json({ error: 'Name is too long' }, { status: 400 });
    }

    if (email.length > 255) {
      return NextResponse.json({ error: 'Email is too long' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    if (password.length > 128) {
      return NextResponse.json({ error: 'Password is too long' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    let invite = null;
    if (inviteToken) {
      invite = await prisma.invite.findUnique({ where: { token: inviteToken } });
      
      if (!invite) {
        return NextResponse.json({ error: 'Invalid invite link' }, { status: 400 });
      }
      
      if (invite.used) {
        return NextResponse.json({ error: 'Invite link already used' }, { status: 400 });
      }
      
      if (new Date() > invite.expiresAt) {
        return NextResponse.json({ error: 'Invite link expired' }, { status: 400 });
      }

      const updated = await prisma.invite.updateMany({
        where: { id: invite.id, used: false },
        data: { used: true, usedAt: new Date() },
      });

      if (updated.count === 0) {
        return NextResponse.json({ error: 'Invite link already used' }, { status: 400 });
      }
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: inviteToken ? 'member' : 'lead',
        teamId: invite?.leadId || null,
        inviteId: invite?.id || null,
      },
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
