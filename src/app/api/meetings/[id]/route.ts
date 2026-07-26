import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;

    const meeting = await prisma.meeting.findUnique({
      where: { id },
      include: {
        tasks: {
          include: {
            assignee: { select: { id: true, name: true, email: true } },
            creator: { select: { id: true, name: true, email: true } },
          },
        },
        lead: { select: { id: true, name: true, email: true } },
      },
    });

    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    if (user.role === 'lead') {
      if (meeting.leadId !== user.id) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
      }
    } else {
      const fullUser = await prisma.user.findUnique({ where: { id: user.id }, select: { teamId: true } });
      if (meeting.leadId !== fullUser?.teamId) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
      }
    }

    return NextResponse.json({ meeting });
  } catch (error) {
    console.error('Get meeting error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'lead') {
      return NextResponse.json({ error: 'Only team leads can update meetings' }, { status: 403 });
    }

    const { id } = await params;

    const meeting = await prisma.meeting.findUnique({ where: { id } });
    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }
    if (meeting.leadId !== user.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const body = await request.json();
    const allowedFields = ['title', 'date', 'summary'];
    const updateData: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        updateData[key] = body[key];
      }
    }

    const updated = await prisma.meeting.update({
      where: { id },
      data: updateData,
      include: { tasks: true },
    });

    return NextResponse.json({ meeting: updated });
  } catch (error) {
    console.error('Update meeting error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'lead') {
      return NextResponse.json({ error: 'Only team leads can delete meetings' }, { status: 403 });
    }

    const { id } = await params;

    const meeting = await prisma.meeting.findUnique({ where: { id } });
    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }
    if (meeting.leadId !== user.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    await prisma.meeting.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete meeting error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
