import { prisma } from './client';
import type { Topic, Question, UserProgress, LearningPath } from '@prisma/client';

// ── helpers ────────────────────────────────────────────────────────────────

function parseTopic(t: Topic) {
  return {
    ...t,
    tags: JSON.parse(t.tags ?? '[]') as string[],
    sourceUrls: JSON.parse(t.sourceUrls ?? '[]'),
    keyTakeaways: JSON.parse(t.keyTakeaways ?? '[]') as string[],
    formulas: t.formulas ? JSON.parse(t.formulas) : null,
  };
}

function parseQuestion(q: Question) {
  return {
    ...q,
    hints: JSON.parse(q.hints ?? '[]') as string[],
    solution: JSON.parse(q.solution ?? '{}'),
    metadata: JSON.parse(q.metadata ?? '{}'),
  };
}

// ── Topics ─────────────────────────────────────────────────────────────────

export async function getAllTopics() {
  const topics = await prisma.topic.findMany({ orderBy: [{ level: 'asc' }, { orderIndex: 'asc' }] });
  return topics.map(parseTopic);
}

export async function getTopicBySlug(slug: string) {
  const t = await prisma.topic.findUnique({ where: { slug } });
  return t ? parseTopic(t) : null;
}

export async function getTopicById(id: string) {
  const t = await prisma.topic.findUnique({ where: { id } });
  return t ? parseTopic(t) : null;
}

export async function getRootTopics() {
  const topics = await prisma.topic.findMany({
    where: { parentId: null },
    orderBy: { orderIndex: 'asc' },
  });
  return topics.map(parseTopic);
}

export async function getTopicChildren(parentId: string) {
  const topics = await prisma.topic.findMany({
    where: { parentId },
    orderBy: { orderIndex: 'asc' },
  });
  return topics.map(parseTopic);
}

export async function getTopicTree() {
  const all = await getAllTopics();
  const map = new Map(all.map((t) => [t.id, { ...t, children: [] as ReturnType<typeof parseTopic>[] }]));
  const roots: ReturnType<typeof parseTopic>[] = [];
  for (const t of map.values()) {
    if (t.parentId) {
      map.get(t.parentId)?.children.push(t);
    } else {
      roots.push(t);
    }
  }
  return roots;
}

// ── Questions ──────────────────────────────────────────────────────────────

export async function getQuestionsByTopicId(topicId: string) {
  const qs = await prisma.question.findMany({
    where: { topicId },
    orderBy: { orderIndex: 'asc' },
  });
  return qs.map(parseQuestion);
}

export async function getQuestionById(id: string) {
  const q = await prisma.question.findUnique({ where: { id } });
  return q ? parseQuestion(q) : null;
}

export async function getAllQuestions() {
  const qs = await prisma.question.findMany({ orderBy: { createdAt: 'asc' } });
  return qs.map(parseQuestion);
}

// ── Progress ───────────────────────────────────────────────────────────────

const USER_ID = 'local_user';

export async function getUserProgress(topicId: string): Promise<UserProgress | null> {
  return prisma.userProgress.findUnique({ where: { userId_topicId: { userId: USER_ID, topicId } } });
}

export async function getAllUserProgress(): Promise<UserProgress[]> {
  return prisma.userProgress.findMany({ where: { userId: USER_ID } });
}

export async function upsertProgress(topicId: string, data: Partial<Omit<UserProgress, 'id' | 'userId' | 'topicId'>>) {
  return prisma.userProgress.upsert({
    where: { userId_topicId: { userId: USER_ID, topicId } },
    create: { userId: USER_ID, topicId, status: 'in_progress', ...data },
    update: { lastVisited: new Date(), ...data },
  });
}

export async function recordAttempt(questionId: string, data: { hintsUsed: number; correct?: boolean; timeSpent: number }) {
  return prisma.questionAttempt.create({
    data: { userId: USER_ID, questionId, ...data },
  });
}

export async function getAttemptsByUser() {
  return prisma.questionAttempt.findMany({
    where: { userId: USER_ID },
    orderBy: { attemptedAt: 'desc' },
  });
}

// ── Learning Paths ─────────────────────────────────────────────────────────

export async function getLearningPaths() {
  const paths = await prisma.learningPath.findMany({ orderBy: { createdAt: 'asc' } });
  return paths.map((p: LearningPath) => ({ ...p, topicSequence: JSON.parse(p.topicSequence ?? '[]') as string[] }));
}

export async function getLearningPathById(id: string) {
  const p = await prisma.learningPath.findUnique({ where: { id } });
  return p ? { ...p, topicSequence: JSON.parse(p.topicSequence ?? '[]') as string[] } : null;
}

// ── Stats ──────────────────────────────────────────────────────────────────

export async function getDashboardStats() {
  const [allTopics, allProgress, allAttempts, allQuestions] = await Promise.all([
    getAllTopics(),
    getAllUserProgress(),
    getAttemptsByUser(),
    getAllQuestions(),
  ]);

  const progressMap = new Map(allProgress.map((p) => [p.topicId, p]));
  const completedTopics = allTopics.filter((t) => progressMap.get(t.id)?.completed).length;
  const inProgressTopics = allTopics.filter((t) => progressMap.get(t.id)?.status === 'in_progress' && !progressMap.get(t.id)?.completed).length;
  const totalTimeSpent = allProgress.reduce((sum, p) => sum + p.timeSpent, 0);

  const completedAttempts = new Set(allAttempts.filter((a) => a.correct !== false).map((a) => a.questionId));

  const roots = allTopics.filter((t) => t.level === 0);
  const categoryProgress = roots.map((root) => {
    const catTopics = allTopics.filter((t) => t.id === root.id || t.parentId === root.id);
    const completed = catTopics.filter((t) => progressMap.get(t.id)?.completed).length;
    return { categorySlug: root.slug, categoryTitle: root.title, total: catTopics.length, completed };
  });

  return {
    totalTopics: allTopics.length,
    completedTopics,
    inProgressTopics,
    totalQuestions: allQuestions.length,
    completedQuestions: completedAttempts.size,
    totalTimeSpent,
    categoryProgress,
  };
}
