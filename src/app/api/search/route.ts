import { NextRequest, NextResponse } from 'next/server';
import { getAllTopics, getAllQuestions } from '@/lib/db/queries';
import { buildIndex, search, type SearchItem } from '@/lib/search';

let indexed = false;

async function ensureIndex() {
  if (indexed) return;
  const [topics, questions] = await Promise.all([getAllTopics(), getAllQuestions()]);
  const items: SearchItem[] = [
    ...topics.map((t) => ({
      id: t.id,
      type: 'topic' as const,
      title: t.title,
      description: t.description ?? '',
      slug: t.slug,
      difficulty: t.difficulty,
      tags: t.tags,
      content: t.content.slice(0, 500),
    })),
    ...questions.map((q) => ({
      id: q.id,
      type: 'question' as const,
      title: q.questionText.slice(0, 100),
      description: q.questionText,
      topicId: q.topicId,
      difficulty: q.difficulty,
      tags: q.metadata.tags ?? [],
      content: q.questionText,
    })),
  ];
  buildIndex(items);
  indexed = true;
}

export async function GET(request: NextRequest) {
  await ensureIndex();
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') ?? '';
  const type = searchParams.get('type') as 'topic' | 'question' | undefined;
  const difficulty = searchParams.get('difficulty') ?? undefined;
  const results = search(q, { type: type || undefined, difficulty });
  return NextResponse.json(results);
}
