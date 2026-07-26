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
      where = { leadId: user.id };
    } else {
      const fullUser = await prisma.user.findUnique({ where: { id: user.id }, select: { teamId: true } });
      if (!fullUser?.teamId) {
        return NextResponse.json({ meetings: [] });
      }
      where = { leadId: fullUser.teamId };
    }

    const meetings = await prisma.meeting.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        tasks: {
          select: { id: true, status: true },
        },
        lead: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({ meetings });
  } catch (error) {
    console.error('Get meetings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'lead') {
      return NextResponse.json({ error: 'Only team leads can create meetings' }, { status: 403 });
    }

    const { title, date, transcript, summary, decisions, tasks } = await request.json();

    if (!title || !date) {
      return NextResponse.json({ error: 'Title and date are required' }, { status: 400 });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
    }

    const meeting = await prisma.meeting.create({
      data: {
        title,
        date: new Date(date),
        transcript,
        summary,
        decisions: decisions ? JSON.stringify(decisions) : null,
        leadId: user.id,
        tasks: tasks ? {
          create: tasks.map((task: { title: string; description?: string; assigneeId: string; deadline?: string; priority?: string }) => ({
            title: task.title,
            description: task.description,
            assigneeId: task.assigneeId,
            creatorId: user.id,
            deadline: task.deadline ? new Date(task.deadline) : null,
            priority: task.priority || 'medium',
          })),
        } : undefined,
      },
      include: {
        tasks: true,
      },
    });

    return NextResponse.json({ meeting });
  } catch (error) {
    console.error('Create meeting error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
