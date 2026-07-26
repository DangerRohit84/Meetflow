import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    let where;
    if (user.role === 'lead') {
      where = { creatorId: user.id };
    } else {
      where = { assigneeId: user.id };
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        creator: { select: { id: true, name: true, email: true } },
        meeting: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'lead') {
      return NextResponse.json({ error: 'Only team leads can create tasks' }, { status: 403 });
    }

    const { title, description, assigneeId, meetingId, deadline, priority } = await request.json();

    if (!title || !assigneeId || !meetingId) {
      return NextResponse.json({ error: 'Title, assignee, and meeting are required' }, { status: 400 });
    }

    if (!['low', 'medium', 'high'].includes(priority || 'medium')) {
      return NextResponse.json({ error: 'Invalid priority value' }, { status: 400 });
    }

    const [assignee, meeting] = await Promise.all([
      prisma.user.findUnique({ where: { id: assigneeId }, select: { id: true, teamId: true } }),
      prisma.meeting.findUnique({ where: { id: meetingId }, select: { id: true, leadId: true } }),
    ]);

    if (!assignee || (assignee.teamId !== user.id && assignee.id !== user.id)) {
      return NextResponse.json({ error: 'Assignee is not a valid team member' }, { status: 400 });
    }

    if (!meeting || meeting.leadId !== user.id) {
      return NextResponse.json({ error: 'Meeting not found or not owned by you' }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        assigneeId,
        creatorId: user.id,
        meetingId,
        deadline: deadline ? new Date(deadline) : null,
        priority: priority || 'medium',
      },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        meeting: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json({ task });
  } catch (error) {
    console.error('Create task error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
