export interface SolutionStep {
  stepNumber: number;
  title: string;
  content: string;
  reasoning: string;
}

export interface QuestionSolution {
  steps: SolutionStep[];
  finalAnswer: string;
  explanation: string;
  commonMistakes: string[];
}

export interface QuestionMetadata {
  estimatedMinutes: number;
  tags: string[];
  skillsTested: string[];
}

export interface Question {
  id: string;
  topicId: string;
  questionText: string;
  difficulty: 'easy' | 'medium' | 'hard';
  orderIndex: number;
  hints: string[];
  solution: QuestionSolution;
  metadata: QuestionMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionAttempt {
  id: string;
  userId: string;
  questionId: string;
  hintsUsed: number;
  correct: boolean | null;
  timeSpent: number;
  attemptedAt: string;
}
