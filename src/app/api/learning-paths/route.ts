import { NextResponse } from 'next/server';
import { getLearningPaths } from '@/lib/db/queries';

export async function GET() {
  const paths = await getLearningPaths();
  return NextResponse.json(paths);
}
