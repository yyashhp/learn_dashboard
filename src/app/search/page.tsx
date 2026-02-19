import Link from 'next/link';
import { FileText, HelpCircle, ChevronRight } from 'lucide-react';
import { SearchBar } from '@/components/search/SearchBar';
import { Badge } from '@/components/ui/badge';
import { cn, difficultyColor } from '@/lib/utils/helpers';

interface PageProps {
  searchParams: Promise<{ q?: string; type?: string; difficulty?: string }>;
}

async function getResults(q: string, type?: string, difficulty?: string) {
  const params = new URLSearchParams({ q });
  if (type) params.set('type', type);
  if (difficulty) params.set('difficulty', difficulty);
  // In a real app we'd call the search endpoint; here we import directly
  const { getAllTopics, getAllQuestions } = await import('@/lib/db/queries');
  const { buildIndex, search } = await import('@/lib/search');
  const [topics, questions] = await Promise.all([getAllTopics(), getAllQuestions()]);
  buildIndex([
    ...topics.map((t) => ({
      id: t.id, type: 'topic' as const, title: t.title,
      description: t.description ?? '', slug: t.slug,
      difficulty: t.difficulty, tags: t.tags, content: t.content.slice(0, 300),
    })),
    ...questions.map((qn) => ({
      id: qn.id, type: 'question' as const,
      title: qn.questionText.slice(0, 100), description: qn.questionText,
      topicId: qn.topicId, difficulty: qn.difficulty,
      tags: (qn.metadata as { tags?: string[] }).tags ?? [], content: qn.questionText,
    })),
  ]);
  return search(q, { type: type as 'topic' | 'question' | undefined, difficulty });
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = '', type, difficulty } = await searchParams;
  const results = q ? await getResults(q, type, difficulty) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Search</h1>
        <SearchBar defaultValue={q} autoFocus className="max-w-xl" />
      </div>

      {q && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;<strong className="text-gray-900 dark:text-white">{q}</strong>&rdquo;
          </span>
          <div className="flex gap-2">
            {['', 'topic', 'question'].map((t) => (
              <Link
                key={t}
                href={`/search?q=${encodeURIComponent(q)}${t ? `&type=${t}` : ''}`}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                  type === t || (!type && !t)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                )}
              >
                {t === '' ? 'All' : t === 'topic' ? 'Topics' : 'Questions'}
              </Link>
            ))}
          </div>
        </div>
      )}

      {results.length > 0 ? (
        <div className="space-y-3">
          {results.map((item) => (
            <Link
              key={item.id}
              href={item.type === 'topic' ? `/topic/${item.slug}` : `/topic/${(item as { topicId?: string }).topicId ?? ''}`}
              className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 transition-colors group"
            >
              <div className={cn('rounded-lg p-2 shrink-0 mt-0.5', item.type === 'topic' ? 'bg-blue-50 dark:bg-blue-950' : 'bg-purple-50 dark:bg-purple-950')}>
                {item.type === 'topic'
                  ? <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  : <HelpCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">{item.title}</p>
                  <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize', difficultyColor(item.difficulty))}>
                    {item.difficulty}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">{item.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={item.type === 'topic' ? 'default' : 'secondary'} className="text-xs">
                    {item.type}
                  </Badge>
                  {item.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs text-gray-400">#{tag}</span>
                  ))}
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 shrink-0 mt-1 transition-colors" />
            </Link>
          ))}
        </div>
      ) : q ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <HelpCircle className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">No results found</p>
          <p className="text-sm mt-1">Try different keywords or browse topics from the sidebar</p>
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium text-gray-500 dark:text-gray-400">Search across all topics and practice problems</p>
          <p className="text-sm mt-1">Try &ldquo;black-scholes&rdquo;, &ldquo;delta&rdquo;, &ldquo;volatility smile&rdquo;…</p>
        </div>
      )}
    </div>
  );
}
