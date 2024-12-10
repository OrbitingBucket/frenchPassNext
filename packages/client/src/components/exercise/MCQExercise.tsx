// src/components/exercise/MCQExercise.tsx
import React, { useEffect } from 'react';
import { Exercise } from '../../types/exercise';
import { useTimer } from '../../contexts/TimerContext';
import classNames from 'classnames'; // Consider adding this package for better class handling

interface MCQExerciseProps {
  question: Exercise;
  onAnswer: (answer: string) => void;
  selectedAnswer: string | null;
  showFeedback: boolean;
  isTimeUp: boolean;
  correctAnswer: string | null;
}

const MCQExercise: React.FC<MCQExerciseProps> = ({ 
  question, 
  selectedAnswer, 
  onAnswer,
  showFeedback,
  isTimeUp,
  correctAnswer
}) => {
  const { state, startTimer, stopTimer } = useTimer();

  useEffect(() => {
    startTimer(question.timeLimit);
    return () => stopTimer();
  }, [question.id, startTimer, stopTimer]);

  const handleAnswerClick = (key: string) => {
    if (!state.isRunning || showFeedback || isTimeUp) return;
    stopTimer();
    onAnswer(key);
  };

  const getButtonClassName = (key: string) => {
    const baseClasses = "w-full p-4 text-left rounded-lg border-2 transition-colors";
    
    // If feedback is shown (answer selected) or time is up
    if (showFeedback || isTimeUp) {
      // Correct answer - always show in green
      if (key === correctAnswer) {
        return classNames(baseClasses, 
          "border-success-500 bg-success-50 text-success-700",
          "ring-2 ring-success-500 ring-opacity-50"
        );
      }
      
      // Selected wrong answer - show in red
      if (key === selectedAnswer && key !== correctAnswer) {
        return classNames(baseClasses,
          "border-error-500 bg-error-50 text-error-700",
          "ring-2 ring-error-500 ring-opacity-50"
        );
      }
      
      // Non-selected answers - show as disabled
      return classNames(baseClasses,
        "border-neutral-200 bg-neutral-50 text-neutral-500",
        "opacity-50 cursor-not-allowed"
      );
    }

    // Default state (no feedback shown)
    return classNames(baseClasses,
      "border-neutral-200 hover:border-primary-500",
      "bg-white hover:bg-primary-50",
      "cursor-pointer"
    );
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="w-full">
          <p className="text-xl text-gray-800 whitespace-pre-wrap break-words leading-relaxed">
            {question.sentence.split('___').map((part, index, array) => (
              <React.Fragment key={index}>
                <span className="inline-block">{part}</span>
                {index < array.length - 1 && (
                  <span className="inline-block mx-2 w-16 border-b-2 border-neutral-400" />
                )}
              </React.Fragment>
            ))}
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {Object.entries(question.options).map(([key, value]) => (
          <button
            key={key}
            onClick={() => handleAnswerClick(key)}
            disabled={showFeedback || isTimeUp}
            className={getButtonClassName(key)}
          >
            <div className="flex items-center">
              <span className="flex-grow">{value}</span>
              {(showFeedback || isTimeUp) && (
                <>
                  {key === correctAnswer && (
                    <span className="ml-2 text-success-600">
                      <CheckIcon className="h-5 w-5" />
                    </span>
                  )}
                  {key === selectedAnswer && key !== correctAnswer && (
                    <span className="ml-2 text-error-600">
                      <XIcon className="h-5 w-5" />
                    </span>
                  )}
                </>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Simple icons components (you can use any icon library you prefer)
const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default MCQExercise;