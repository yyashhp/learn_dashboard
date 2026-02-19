import Link from 'next/link';
import { Clock, BookOpen, CheckCircle2, ChevronRight, Zap, Target, TrendingUp } from 'lucide-react';
import { getLearningPaths, getAllTopics, getAllUserProgress } from '@/lib/db/queries';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const pathIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen, TrendingUp, Zap, Target,
};

export default async function PathsPage() {
  const [paths, allTopics, allProgress] = await Promise.all([
    getLearningPaths(),
    getAllTopics(),
    getAllUserProgress(),
  ]);

  const topicMap = new Map(allTopics.map((t) => [t.id, t]));
  const progressMap = new Map(allProgress.map((p) => [p.topicId, p]));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Learning Paths</h1>
        <p className="text-gray-500 dark:text-gray-400">Structured sequences for systematic mastery</p>
      </div>

      <div className="space-y-6">
        {paths.map((path) => {
          const topics = path.topicSequence.map((id: string) => topicMap.get(id)).filter(Boolean);
          const completed = topics.filter((t) => progressMap.get(t!.id)?.completed).length;
          const pct = topics.length > 0 ? Math.round((completed / topics.length) * 100) : 0;
          const Icon = pathIcons[path.icon] ?? BookOpen;

          return (
            <Card key={path.id} id={path.id}>
              <CardContent className="pt-6">
                {/* Path header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-blue-50 dark:bg-blue-950 p-3">
                      <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{path.name}</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{path.description}</p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <Badge
                      variant={path.level === 'beginner' ? 'success' : path.level === 'intermediate' ? 'warning' : 'danger'}
                      className="capitalize mb-1"
                    >
                      {path.level}
                    </Badge>
                    <p className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                      <Clock className="h-3 w-3" />{path.estimatedHours}h estimated
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1.5">
                    <span>{completed}/{topics.length} topics complete</span>
                    <span className="font-medium">{pct}%</span>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>

                {/* Topic list */}
                <div className="space-y-1.5">
                  {topics.map((t, i) => {
                    if (!t) return null;
                    const prog = progressMap.get(t.id);
                    const isDone = prog?.completed;
                    const isNext = !isDone && topics.slice(0, i).every((prev) => progressMap.get(prev!.id)?.completed);

                    return (
                      <Link
                        key={t.id}
                        href={`/topic/${t.slug}`}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors group"
                      >
                        <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold
                          ${isDone ? 'bg-emerald-500 text-white' : isNext ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                          {isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                        </div>
                        <span className={`flex-1 text-sm font-medium ${isDone ? 'line-through text-gray-400' : isNext ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                          {t.title}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-gray-400">{t.estimatedMinutes}m</span>
                          {isNext && (
                            <Badge variant="default" className="text-xs">Start</Badge>
                          )}
                          <ChevronRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
