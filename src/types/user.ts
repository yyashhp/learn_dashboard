export interface UserProgress {
  id: string;
  userId: string;
  topicId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  timeSpent: number;
  lastVisited: string;
  completed: boolean;
  completedAt: string | null;
  notes: string | null;
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  topicSequence: string[];
  estimatedHours: number;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalTopics: number;
  completedTopics: number;
  inProgressTopics: number;
  totalQuestions: number;
  completedQuestions: number;
  totalTimeSpent: number;
  categoryProgress: {
    categorySlug: string;
    categoryTitle: string;
    total: number;
    completed: number;
  }[];
}
