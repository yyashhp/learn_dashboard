import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import {
  getTopicBySlug,
  getTopicChildren,
  getQuestionsByTopicId,
  getUserProgress,
  getAllTopics,
} from '@/lib/db/queries';
import { TopicHeader } from '@/components/topic/TopicHeader';
import { MarkdownRenderer } from '@/components/common/MarkdownRenderer';
import { RelatedTopics } from '@/components/topic/RelatedTopics';
import { SourceLinks } from '@/components/topic/SourceLinks';
import { QuestionCard } from '@/components/practice/QuestionCard';
import { MarkCompleteButton } from '@/components/topic/MarkCompleteButton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const topics = await getAllTopics();
  return topics.map((t) => ({ slug: t.slug }));
}

export default async function TopicPage({ params }: PageProps) {
  const { slug } = await params;
  const topic = await getTopicBySlug(slug);
  if (!topic) notFound();

  const [children, questions, progress] = await Promise.all([
    getTopicChildren(topic.id),
    getQuestionsByTopicId(topic.id),
    getUserProgress(topic.id),
  ]);

  const topicWithProgress = {
    ...topic,
    difficulty: topic.difficulty as 'beginner' | 'intermediate' | 'advanced',
    progress: progress
      ? {
          status: progress.status as 'not_started' | 'in_progress' | 'completed',
          timeSpent: progress.timeSpent,
          lastVisited: progress.lastVisited.toISOString(),
          completed: progress.completed,
        }
      : undefined,
    questionCount: questions.length,
    completedQuestions: 0,
  };

  // Build breadcrumb
  const breadcrumb: { title: string; slug: string }[] = [];
  if (topic.parentId) {
    // We'll do a simple parent lookup
    const allTopics = await getAllTopics();
    const parentMap = new Map(allTopics.map((t) => [t.id, t]));
    let current = parentMap.get(topic.parentId);
    while (current) {
      breadcrumb.unshift({ title: current.title, slug: current.slug });
      current = current.parentId ? parentMap.get(current.parentId) : undefined;
    }
  }

  // Related topics from children or siblings
  const relatedTopics = children.slice(0, 4).map((c) => ({
    ...c,
    tags: c.tags,
    sourceUrls: c.sourceUrls,
    keyTakeaways: c.keyTakeaways,
    formulas: c.formulas,
  }));

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-6 flex-wrap">
        <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-200">Home</Link>
        {breadcrumb.map((b) => (
          <span key={b.slug} className="flex items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href={`/topic/${b.slug}`} className="hover:text-gray-700 dark:hover:text-gray-200">{b.title}</Link>
          </span>
        ))}
        <span className="flex items-center gap-1">
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-gray-900 dark:text-gray-100 font-medium">{topic.title}</span>
        </span>
      </nav>

      {/* Header with client complete button */}
      <MarkCompleteButton topic={topicWithProgress as unknown as import('@/types/topic').TopicWithProgress} />

      {/* Key takeaways */}
      {topic.keyTakeaways.length > 0 && (
        <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900">
          <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">Key Takeaways</p>
          <ul className="space-y-1">
            {topic.keyTakeaways.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-300">
                <span className="text-blue-400 mt-0.5">→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main content */}
      <MarkdownRenderer content={topic.content} />

      {/* Formulas */}
      {topic.formulas && topic.formulas.length > 0 && (
        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Key Formulas</h3>
          <div className="space-y-3">
            {(topic.formulas as import('@/types/topic').TopicFormula[]).map((f, i) => (
              <div key={i} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">{f.name}</p>
                <MarkdownRenderer content={`$$${f.latex}$$`} />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{f.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-topics */}
      {children.length > 0 && (
        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Sub-topics</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {children.map((child) => (
              <Link
                key={child.id}
                href={`/topic/${child.slug}`}
                className="group flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{child.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{child.difficulty} · {child.estimatedMinutes}m</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 shrink-0 ml-2 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Practice problems */}
      {questions.length > 0 && (
        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Practice Problems
            <Badge variant="secondary" className="ml-2">{questions.length}</Badge>
          </h3>
          <div className="space-y-4">
            {questions.map((q, i) => (
              <QuestionCard
                key={q.id}
                question={q as unknown as Parameters<typeof QuestionCard>[0]['question']}
                index={i}
                total={questions.length}
              />
            ))}
          </div>
        </div>
      )}

      {/* Related topics */}
      {relatedTopics.length > 0 && (
        <RelatedTopics topics={relatedTopics as unknown as Parameters<typeof RelatedTopics>[0]['topics']} />
      )}

      {/* Sources */}
      <SourceLinks sources={topic.sourceUrls} />
    </div>
  );
}
