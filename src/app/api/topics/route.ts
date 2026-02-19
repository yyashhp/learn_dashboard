import { NextResponse } from 'next/server';
import { getTopicTree, getAllTopics } from '@/lib/db/queries';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tree = searchParams.get('tree');

  if (tree) {
    const data = await getTopicTree();
    return NextResponse.json(data);
  }

  const topics = await getAllTopics();
  return NextResponse.json(topics);
}
