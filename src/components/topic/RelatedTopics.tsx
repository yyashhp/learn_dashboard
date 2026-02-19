import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { TopicWithProgress } from '@/types/topic';

interface RelatedTopicsProps {
  topics: TopicWithProgress[];
  title?: string;
}

export function RelatedTopics({ topics, title = 'Continue Learning' }: RelatedTopicsProps) {
  if (!topics.length) return null;
  return (
    <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>
      <div className="grid gap-2 sm:grid-cols-2">
        {topics.map((t) => (
          <Link
            key={t.id}
            href={`/topic/${t.slug}`}
            className="group flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{t.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{t.difficulty} · {t.estimatedMinutes}m</p>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 shrink-0 ml-2 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
