import { NextResponse } from 'next/server';
import { getQuestionsByTopicId, getAllQuestions } from '@/lib/db/queries';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topicId = searchParams.get('topicId');
  if (topicId) {
    const questions = await getQuestionsByTopicId(topicId);
    return NextResponse.json(questions);
  }
  const all = await getAllQuestions();
  return NextResponse.json(all);
}
