import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { getQuestionById, getTopicById } from '@/lib/db/queries';
import { QuestionCard } from '@/components/practice/QuestionCard';
import type { Question } from '@/types/practice';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PracticePage({ params }: PageProps) {
  const { id } = await params;
  const question = await getQuestionById(id);
  if (!question) notFound();

  const topic = await getTopicById(question.topicId);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back link */}
      <div className="flex items-center gap-2">
        {topic && (
          <Link
            href={`/topic/${topic.slug}`}
            className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to {topic.title}
          </Link>
        )}
      </div>

      <QuestionCard
        question={question as unknown as Question}
        index={0}
        total={1}
      />
    </div>
  );
}
