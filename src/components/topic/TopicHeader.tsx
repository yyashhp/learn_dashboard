'use client';

import { Clock, Tag, BookOpen, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn, difficultyColor, formatTime } from '@/lib/utils/helpers';
import type { TopicWithProgress } from '@/types/topic';

interface TopicHeaderProps {
  topic: TopicWithProgress;
  onMarkComplete?: () => void;
}

export function TopicHeader({ topic, onMarkComplete }: TopicHeaderProps) {
  const progress = topic.progress;
  const isCompleted = progress?.completed;
  const questionProgress = topic.questionCount
    ? Math.round(((topic.completedQuestions ?? 0) / topic.questionCount) * 100)
    : 0;

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">{topic.title}</h1>
          {topic.description && (
            <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">{topic.description}</p>
          )}
        </div>
        <Button
          onClick={onMarkComplete}
          variant={isCompleted ? 'success' : 'outline'}
          className="shrink-0"
        >
          <CheckCircle2 className={cn('h-4 w-4', isCompleted ? 'text-white' : 'text-gray-400')} />
          {isCompleted ? 'Completed' : 'Mark Complete'}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-4">
        <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize', difficultyColor(topic.difficulty))}>
          {topic.difficulty}
        </span>
        <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <Clock className="h-3.5 w-3.5" />
          {formatTime(topic.estimatedMinutes)}
        </span>
        {topic.tags.slice(0, 4).map((tag) => (
          <Badge key={tag} variant="secondary">
            <Tag className="h-2.5 w-2.5 mr-1" />
            {tag}
          </Badge>
        ))}
      </div>

      {topic.questionCount && topic.questionCount > 0 && (
        <div className="mt-4 flex items-center gap-3">
          <BookOpen className="h-4 w-4 text-gray-400 shrink-0" />
          <div className="flex-1">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>{topic.completedQuestions ?? 0}/{topic.questionCount} practice problems</span>
              <span>{questionProgress}%</span>
            </div>
            <Progress value={questionProgress} className="h-1.5" />
          </div>
        </div>
      )}
    </div>
  );
}
