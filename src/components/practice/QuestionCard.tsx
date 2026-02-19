'use client';

import { useState, useCallback } from 'react';
import { Lightbulb, Eye, Clock, ChevronRight, ChevronDown, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MarkdownRenderer } from '@/components/common/MarkdownRenderer';
import { cn, difficultyColor } from '@/lib/utils/helpers';
import type { Question } from '@/types/practice';

interface QuestionCardProps {
  question: Question;
  index: number;
  total: number;
  onAttempt?: (questionId: string, data: { hintsUsed: number; timeSpent: number }) => void;
}

export function QuestionCard({ question, index, total, onAttempt }: QuestionCardProps) {
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showAllSteps, setShowAllSteps] = useState(false);
  const [startTime] = useState(() => Date.now());

  const revealHint = useCallback(() => {
    if (hintsRevealed < question.hints.length) {
      setHintsRevealed((h) => h + 1);
    }
  }, [hintsRevealed, question.hints.length]);

  const handleShowSolution = useCallback(() => {
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    setShowSolution(true);
    onAttempt?.(question.id, { hintsUsed: hintsRevealed, timeSpent: elapsed });
  }, [startTime, question.id, hintsRevealed, onAttempt]);

  const steps = question.solution.steps ?? [];

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Question {index + 1} of {total}
        </span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="h-3 w-3" />
            ~{question.metadata.estimatedMinutes}m
          </span>
          <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium capitalize', difficultyColor(question.difficulty))}>
            {question.difficulty}
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="px-5 py-5">
        <MarkdownRenderer content={question.questionText} />
      </div>

      {/* Hints */}
      {hintsRevealed > 0 && (
        <div className="px-5 pb-4 space-y-2">
          {question.hints.slice(0, hintsRevealed).map((hint, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
              <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">Hint {i + 1}</p>
                <p className="text-sm text-amber-800 dark:text-amber-300">{hint}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action buttons */}
      {!showSolution && (
        <div className="flex items-center gap-3 px-5 py-4 border-t border-gray-100 dark:border-gray-700">
          <Button
            variant="outline"
            size="sm"
            onClick={revealHint}
            disabled={hintsRevealed >= question.hints.length}
          >
            <Lightbulb className="h-3.5 w-3.5" />
            {hintsRevealed === 0 ? 'Show Hint' : `Next Hint (${hintsRevealed}/${question.hints.length})`}
          </Button>
          <Button variant="secondary" size="sm" onClick={handleShowSolution}>
            <Eye className="h-3.5 w-3.5" />
            Show Solution
          </Button>
        </div>
      )}

      {/* Solution */}
      {showSolution && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="px-5 py-4 bg-emerald-50 dark:bg-emerald-950/30 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Solution Walkthrough</p>
          </div>

          {/* Steps */}
          <div className="px-5 py-4 space-y-4">
            {(showAllSteps ? steps : steps.slice(0, currentStep + 1)).map((step, i) => (
              <div key={i} className="relative pl-8">
                <div className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
                  {step.stepNumber}
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{step.title}</p>
                  </div>
                  <div className="px-4 py-3">
                    <MarkdownRenderer content={step.content} />
                    {step.reasoning && (
                      <div className="mt-2 flex gap-2 p-2 rounded bg-blue-50 dark:bg-blue-950/30 text-xs text-blue-700 dark:text-blue-300">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                        <span>{step.reasoning}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Final answer */}
            {(showAllSteps || currentStep >= steps.length - 1) && (
              <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">Final Answer</p>
                <MarkdownRenderer content={question.solution.finalAnswer} />
              </div>
            )}

            {/* Common mistakes */}
            {(showAllSteps || currentStep >= steps.length - 1) && question.solution.commonMistakes?.length > 0 && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" /> Common Mistakes
                </p>
                <ul className="space-y-1">
                  {question.solution.commonMistakes.map((m, i) => (
                    <li key={i} className="text-sm text-red-700 dark:text-red-300">• {m}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Navigation */}
          {!showAllSteps && steps.length > 1 && (
            <div className="px-5 pb-4 flex items-center gap-3 border-t border-gray-100 dark:border-gray-700 pt-3">
              {currentStep < steps.length - 1 ? (
                <Button size="sm" onClick={() => setCurrentStep((s) => s + 1)}>
                  Next Step <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              ) : null}
              <Button variant="ghost" size="sm" onClick={() => setShowAllSteps(true)}>
                <ChevronDown className="h-3.5 w-3.5" />
                Show All Steps
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
