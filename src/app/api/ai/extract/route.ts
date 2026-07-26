import { NextRequest, NextResponse } from 'next/server';
import { extractMeetingData } from '@/lib/groq';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'lead') {
      return NextResponse.json({ error: 'Only team leads can extract meetings' }, { status: 403 });
    }

    const { transcript } = await request.json();

    if (!transcript || transcript.trim().length === 0) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }

    const extractedData = await extractMeetingData(transcript, user.id);

    return NextResponse.json(extractedData);
  } catch (error: any) {
    console.error('AI extraction error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to extract meeting data' },
      { status: 500 }
    );
  }
}
