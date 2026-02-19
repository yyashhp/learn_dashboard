'use client';

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { cn } from '@/lib/utils/helpers';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" />
      <div className={cn('prose prose-gray dark:prose-invert max-w-none', className)}>
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex, rehypeRaw]}
          components={{
            h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100">{children}</h1>,
            h2: ({ children }) => <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">{children}</h2>,
            h3: ({ children }) => <h3 className="text-xl font-semibold mt-5 mb-2 text-gray-800 dark:text-gray-200">{children}</h3>,
            h4: ({ children }) => <h4 className="text-lg font-medium mt-4 mb-2 text-gray-800 dark:text-gray-200">{children}</h4>,
            p: ({ children }) => <p className="text-base leading-7 text-gray-700 dark:text-gray-300 mb-4">{children}</p>,
            ul: ({ children }) => <ul className="list-disc list-outside ml-6 mb-4 space-y-1">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal list-outside ml-6 mb-4 space-y-1">{children}</ol>,
            li: ({ children }) => <li className="text-gray-700 dark:text-gray-300 leading-6">{children}</li>,
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 dark:bg-blue-950/30 rounded-r-md italic text-gray-700 dark:text-gray-300">
                {children}
              </blockquote>
            ),
            code: ({ inline, className: cls, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode }) => {
              if (inline) {
                return (
                  <code className="bg-gray-100 dark:bg-gray-800 rounded px-1.5 py-0.5 text-sm font-mono text-gray-800 dark:text-gray-200" {...props}>
                    {children}
                  </code>
                );
              }
              return (
                <code className={cn('block bg-gray-900 text-gray-100 rounded-lg p-4 my-4 overflow-x-auto text-sm font-mono', cls)} {...props}>
                  {children}
                </code>
              );
            },
            pre: ({ children }) => <>{children}</>,
            strong: ({ children }) => <strong className="font-semibold text-gray-900 dark:text-gray-100">{children}</strong>,
            em: ({ children }) => <em className="italic text-gray-700 dark:text-gray-300">{children}</em>,
            a: ({ href, children }) => (
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                {children}
              </a>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg text-sm">{children}</table>
              </div>
            ),
            thead: ({ children }) => <thead className="bg-gray-50 dark:bg-gray-800">{children}</thead>,
            th: ({ children }) => <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-semibold">{children}</th>,
            td: ({ children }) => <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">{children}</td>,
            hr: () => <hr className="my-6 border-gray-200 dark:border-gray-700" />,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </>
  );
}
