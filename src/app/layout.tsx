import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { getTopicTree, getAllUserProgress, getDashboardStats } from '@/lib/db/queries';
import { Sidebar } from '@/components/layout/Sidebar';
import './globals.css';

export const metadata: Metadata = {
  title: 'Moontower Learning Dashboard',
  description: 'Quantitative trading education — options, volatility, and market microstructure',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [tree, allProgress, stats] = await Promise.all([
    getTopicTree(),
    getAllUserProgress(),
    getDashboardStats(),
  ]);

  const progressMap = new Map(allProgress.map((p) => [p.topicId, p.status]));

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen">
            <Sidebar tree={tree} progressMap={progressMap} stats={stats.categoryProgress} />
            <main className="flex-1 min-w-0 pt-14 lg:pt-0">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 lg:py-10">
                {children}
              </div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
