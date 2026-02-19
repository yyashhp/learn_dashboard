export interface TopicSource {
  url: string;
  title: string;
  author: string;
  publishedDate?: string;
}

export interface TopicFormula {
  name: string;
  latex: string;
  explanation: string;
}

export interface TopicHierarchy {
  parent: string | null;
  level: number;
  category: string;
  subcategory?: string;
}

export interface Topic {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  content: string;
  parentId: string | null;
  level: number;
  orderIndex: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  estimatedMinutes: number;
  sourceUrls: TopicSource[];
  sourceType: string;
  publishedAt: string | null;
  keyTakeaways: string[];
  formulas: TopicFormula[] | null;
  children?: Topic[];
  createdAt: string;
  updatedAt: string;
}

export interface TopicTree extends Topic {
  children: TopicTree[];
}

export interface TopicWithProgress extends Topic {
  progress?: {
    status: 'not_started' | 'in_progress' | 'completed';
    timeSpent: number;
    lastVisited: string;
    completed: boolean;
  };
  questionCount?: number;
  completedQuestions?: number;
}
