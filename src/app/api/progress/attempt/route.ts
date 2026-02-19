import { NextRequest, NextResponse } from 'next/server';
import { recordAttempt } from '@/lib/db/queries';

export async function POST(request: NextRequest) {
  const body = await request.json() as { questionId: string; hintsUsed: number; correct?: boolean; timeSpent: number };
  const { questionId, ...data } = body;
  if (!questionId) return NextResponse.json({ error: 'questionId required' }, { status: 400 });
  const attempt = await recordAttempt(questionId, data);
  return NextResponse.json(attempt);
}
