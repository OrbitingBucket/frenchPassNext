// src/components/exercise/MCQExercise.tsx
import React, { useEffect } from 'react';
import { Exercise } from '../../types/exercise';

interface MCQExerciseProps {
  question: Exercise;
  selectedAnswer: string | null;
  onAnswer: (answer: string) => void;
  disabled: boolean;
}

const MCQExercise: React.FC<MCQExerciseProps> = ({ 
  question, 
  selectedAnswer, 
  onAnswer,
  disabled 
}) => {
  useEffect(() => {
    console.log('[MCQExercise] Rendered with:', {
      questionId: question.id,
      selectedAnswer,
      disabled
    });
  }, [question.id, selectedAnswer, disabled]);

  const handleAnswerClick = (key: string) => {
    console.log('[MCQExercise] Answer clicked:', {
      key,
      disabled,
      currentlySelected: selectedAnswer
    });
    onAnswer(key);
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
                  <span className="inline-block mx-2 w-16 border-b border-black text-center" />
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
            disabled={disabled || selectedAnswer !== null}
            className={`w-full p-4 text-left rounded-lg border-2 transition-colors
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${
                selectedAnswer === key
                  ? selectedAnswer === question.correctAnswer
                    ? 'border-success-500 bg-success-50'
                    : 'border-error-500 bg-error-50'
                  : 'border-gray-200 hover:border-primary-500'
              }
              ${
                selectedAnswer !== null && key === question.correctAnswer
                  ? 'border-success-500 bg-success-50'
                  : ''
              }`}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MCQExercise;