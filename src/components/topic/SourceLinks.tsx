import { ExternalLink, FileText } from 'lucide-react';
import type { TopicSource } from '@/types/topic';

interface SourceLinksProps {
  sources: TopicSource[];
}

export function SourceLinks({ sources }: SourceLinksProps) {
  if (!sources.length) return null;
  return (
    <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Sources</h3>
      <div className="space-y-2">
        {sources.map((s, i) => (
          <a
            key={i}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors group"
          >
            <FileText className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">{s.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{s.author}{s.publishedDate ? ` · ${s.publishedDate}` : ''}</p>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
          </a>
        ))}
      </div>
    </div>
  );
}
