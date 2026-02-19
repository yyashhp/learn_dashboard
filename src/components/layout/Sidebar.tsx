'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Home, Search, Map, X, Menu } from 'lucide-react';
import { cn } from '@/lib/utils/helpers';
import { TopicTree } from './TopicTree';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  tree: unknown[];
  progressMap: Map<string, string>;
  stats: { categorySlug: string; categoryTitle: string; total: number; completed: number }[];
}

const navLinks = [
  { href: '/', icon: Home, label: 'Dashboard' },
  { href: '/search', icon: Search, label: 'Search' },
  { href: '/paths', icon: Map, label: 'Learning Paths' },
];

function SidebarContent({ tree, progressMap, stats, onClose }: SidebarProps & { onClose?: () => void }) {
  const pathname = usePathname();
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
        <Link href="/" className="flex items-center gap-2" onClick={onClose}>
          <BookOpen className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-lg text-gray-900 dark:text-white">Moontower</span>
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Nav Links */}
      <div className="px-2 py-3 border-b border-gray-200 dark:border-gray-700">
        {navLinks.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              pathname === href
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </div>

      {/* Topic Tree */}
      <div className="flex-1 overflow-y-auto py-3">
        <p className="px-4 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Topics</p>
        <TopicTree tree={tree as Parameters<typeof TopicTree>[0]['tree']} progressMap={progressMap} stats={stats} />
      </div>
    </div>
  );
}

export function Sidebar(props: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden fixed top-3 left-3 z-50">
        <Button variant="outline" size="icon" onClick={() => setMobileOpen(true)} className="bg-white dark:bg-gray-900 shadow-md">
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 bg-white dark:bg-gray-900 shadow-xl z-50">
            <SidebarContent {...props} onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-72 shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 h-screen sticky top-0">
        <SidebarContent {...props} />
      </aside>
    </>
  );
}
