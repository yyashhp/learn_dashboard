import Link from 'next/link';
import { BookOpen, Clock, CheckCircle2, Target, TrendingUp, Zap, ArrowRight, Brain, BarChart3 } from 'lucide-react';
import { getDashboardStats, getTopicTree, getLearningPaths } from '@/lib/db/queries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { SearchBar } from '@/components/search/SearchBar';
import { formatTime, progressPercent } from '@/lib/utils/helpers';

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'options-fundamentals': BookOpen,
  'options-pricing': TrendingUp,
  'greeks-risk': BarChart3,
  'volatility': Zap,
  'market-microstructure': Brain,
  'trading-strategies': Target,
};

export default async function HomePage() {
  const [stats, tree, paths] = await Promise.all([getDashboardStats(), getTopicTree(), getLearningPaths()]);
  const overallPct = progressPercent(stats.completedTopics, stats.totalTopics);
  const questionPct = progressPercent(stats.completedQuestions, stats.totalQuestions);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          Moontower Learning Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Quantitative trading education — options, volatility & market microstructure
        </p>
      </div>

      {/* Search */}
      <SearchBar className="max-w-xl" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Topics', value: `${stats.completedTopics}/${stats.totalTopics}`, sub: `${overallPct}% complete`, icon: BookOpen, color: 'text-blue-500' },
          { label: 'Questions', value: `${stats.completedQuestions}/${stats.totalQuestions}`, sub: `${questionPct}% complete`, icon: CheckCircle2, color: 'text-emerald-500' },
          { label: 'Time Spent', value: formatTime(stats.totalTimeSpent), sub: 'total study time', icon: Clock, color: 'text-purple-500' },
          { label: 'In Progress', value: String(stats.inProgressTopics), sub: 'topics started', icon: Target, color: 'text-amber-500' },
        ].map(({ label, value, sub, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="pt-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{sub}</p>
                </div>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-2">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overall progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
            <span>{stats.completedTopics} of {stats.totalTopics} topics completed</span>
            <span className="font-medium">{overallPct}%</span>
          </div>
          <Progress value={overallPct} className="h-2.5" />

          <div className="mt-6 space-y-4">
            {stats.categoryProgress.map((cat) => {
              const pct = progressPercent(cat.completed, cat.total);
              const Icon = categoryIcons[cat.categorySlug] ?? BookOpen;
              return (
                <div key={cat.categorySlug}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat.categoryTitle}</span>
                    </div>
                    <span className="text-xs text-gray-400">{cat.completed}/{cat.total}</span>
                  </div>
                  <Progress value={pct} className="h-1.5" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Learning Paths */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Learning Paths</h2>
          <Link href="/paths" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paths.slice(0, 3).map((path) => (
            <Link key={path.id} href={`/paths#${path.id}`}>
              <Card className="h-full hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer">
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant={path.level === 'beginner' ? 'success' : path.level === 'intermediate' ? 'warning' : 'danger'} className="capitalize">
                      {path.level}
                    </Badge>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />{path.estimatedHours}h
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{path.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{path.description}</p>
                  <p className="text-xs text-gray-400 mt-3">{path.topicSequence.length} topics</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Topic overview */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Topics</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {tree.map((category: { id: string; slug: string; title: string; description?: string | null; children?: unknown[] }) => {
            const Icon = categoryIcons[category.slug] ?? BookOpen;
            const childCount = (category.children as unknown[])?.length ?? 0;
            return (
              <Link key={category.id} href={`/topic/${category.slug}`}>
                <Card className="hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-2">
                        <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white">{category.title}</p>
                        {category.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{category.description}</p>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 shrink-0">{childCount} topics</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
