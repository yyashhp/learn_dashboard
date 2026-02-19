import { NextResponse } from 'next/server';
import { getTopicBySlug, getTopicChildren, getQuestionsByTopicId } from '@/lib/db/queries';

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = await getTopicBySlug(slug);
  if (!topic) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const [children, questions] = await Promise.all([
    getTopicChildren(topic.id),
    getQuestionsByTopicId(topic.id),
  ]);

  return NextResponse.json({ topic, children, questions });
}
