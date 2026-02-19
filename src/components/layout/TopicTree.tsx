'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, CheckCircle2, Circle, BookOpen, TrendingUp, BarChart3, Zap, Brain, Target } from 'lucide-react';
import { cn } from '@/lib/utils/helpers';
import { Progress } from '@/components/ui/progress';

interface TreeNode {
  id: string;
  slug: string;
  title: string;
  level: number;
  children: TreeNode[];
  progressStatus?: string;
  completed?: boolean;
}

interface CategoryStats {
  total: number;
  completed: number;
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'options-fundamentals': BookOpen,
  'options-pricing': TrendingUp,
  'greeks-risk': BarChart3,
  'volatility': Zap,
  'market-microstructure': Brain,
  'trading-strategies': Target,
};

function getIcon(slug: string) {
  const Icon = categoryIcons[slug] ?? BookOpen;
  return Icon;
}

function TopicNode({ node, depth = 0, progressMap }: { node: TreeNode; depth?: number; progressMap: Map<string, string> }) {
  const pathname = usePathname();
  const isActive = pathname === `/topic/${node.slug}`;
  const status = progressMap.get(node.id) ?? 'not_started';
  const isCompleted = status === 'completed';
  const isInProgress = status === 'in_progress';
  const hasChildren = node.children.length > 0;
  const [open, setOpen] = useState(depth < 1 || isActive);

  const Icon = depth === 0 ? getIcon(node.slug) : null;

  return (
    <div>
      <div className={cn('flex items-center gap-1 rounded-md group', depth === 0 ? 'mb-1' : '')}>
        {hasChildren ? (
          <button
            onClick={() => setOpen((o) => !o)}
            className={cn(
              'flex-1 flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors',
              depth === 0 ? 'font-semibold text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800' : 'text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
              isActive && 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
            )}
          >
            {Icon && <Icon className="h-4 w-4 shrink-0 text-blue-500" />}
            <span className={cn('flex-1 truncate', depth > 0 && 'ml-' + Math.min(depth * 2, 8))}>{node.title}</span>
            <ChevronRight className={cn('h-3 w-3 shrink-0 transition-transform text-gray-400', open && 'rotate-90')} />
          </button>
        ) : (
          <Link
            href={`/topic/${node.slug}`}
            className={cn(
              'flex-1 flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors',
              depth === 0 ? 'font-semibold text-gray-700 dark:text-gray-200' : 'text-gray-600 dark:text-gray-400',
              isActive
                ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          >
            {Icon && <Icon className="h-4 w-4 shrink-0 text-blue-500" />}
            <span className="flex-1 truncate" style={{ marginLeft: depth > 0 ? `${Math.min(depth, 3) * 0.75}rem` : undefined }}>{node.title}</span>
            {isCompleted ? (
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
            ) : isInProgress ? (
              <Circle className="h-3.5 w-3.5 shrink-0 text-amber-500 fill-amber-200" />
            ) : null}
          </Link>
        )}
      </div>

      {hasChildren && open && (
        <div className={cn('ml-2 border-l border-gray-200 dark:border-gray-700 pl-2', depth === 0 ? 'mb-2' : '')}>
          {node.children.map((child) => (
            <TopicNode key={child.id} node={child} depth={depth + 1} progressMap={progressMap} />
          ))}
        </div>
      )}
    </div>
  );
}

interface TopicTreeProps {
  tree: TreeNode[];
  progressMap: Map<string, string>;
  stats: { categorySlug: string; categoryTitle: string; total: number; completed: number }[];
}

export function TopicTree({ tree, progressMap, stats }: TopicTreeProps) {
  const statsMap = new Map(stats.map((s) => [s.categorySlug, s]));

  return (
    <nav className="space-y-1 px-2">
      {tree.map((node) => {
        const s = statsMap.get(node.slug);
        const pct = s && s.total > 0 ? Math.round((s.completed / s.total) * 100) : 0;
        return (
          <div key={node.id} className="mb-3">
            <TopicNode node={node} depth={0} progressMap={progressMap} />
            {s && s.total > 0 && (
              <div className="px-2 pb-1">
                <Progress value={pct} className="h-1" />
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
