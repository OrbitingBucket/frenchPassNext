// packages/client/src/components/exercise/MCQExercise.tsx

import React from 'react';
import { Exercise } from '../../types/exercise';

interface MCQExerciseProps {
  question: Exercise;
  selectedAnswer: string | null;
  onAnswer: (answer: string) => void;
}

const MCQExercise = ({ question, selectedAnswer, onAnswer }: MCQExerciseProps) => {
  return (
    <div className="space-y-6">
      {/* Category Section */}
      {question.category && question.subcategory && (
        <div className="text-sm text-gray-600 flex items-center space-x-2">
          <span>{question.category}</span>
          <span>•</span>
          <span>{question.subcategory}</span>
        </div>
      )}

      {/* Question Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 break-words">
          {question.instruction}
        </h2>

        {/* Main Sentence */}
        <div className="w-full">
          <p className="text-lg text-gray-700 whitespace-pre-wrap break-words">
            {question.sentence.split('___').map((part, index, array) => (
              <React.Fragment key={index}>
                <span className="inline-block">{part}</span>
                {index < array.length - 1 && (
                  <span className="inline-block mx-1 w-12 border-b-2 border-blue-500 text-center">
                    ___
                  </span>
                )}
              </React.Fragment>
            ))}
          </p>
        </div>
      </div>

      {/* Options Grid */}
      <div className="grid gap-3">
        {Object.entries(question.options).map(([key, value]) => (
          <button
            key={key}
            onClick={() => onAnswer(key)}
            disabled={selectedAnswer !== null}
            className={`
              w-full p-4 text-left rounded-lg border-2 transition-colors
              break-words whitespace-normal
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
              }
            `}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MCQExercise;
