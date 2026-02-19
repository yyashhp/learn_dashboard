import { NextRequest, NextResponse } from 'next/server';
import { getAllUserProgress, upsertProgress, getDashboardStats } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('stats')) {
    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  }
  const progress = await getAllUserProgress();
  return NextResponse.json(progress);
}

export async function POST(request: NextRequest) {
  const body = await request.json() as { topicId: string; status?: string; completed?: boolean; timeSpent?: number };
  const { topicId, ...data } = body;
  if (!topicId) return NextResponse.json({ error: 'topicId required' }, { status: 400 });
  const progress = await upsertProgress(topicId, {
    ...data,
    ...(data.completed ? { completedAt: new Date() } : {}),
  });
  return NextResponse.json(progress);
}
