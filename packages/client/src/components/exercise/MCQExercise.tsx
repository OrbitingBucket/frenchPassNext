// packages/client/src/components/exercise/MCQExercise.tsx

import React from 'react';
import { Exercise } from '../../types/exercise';

interface MCQExerciseProps {
  question: Exercise;
  selectedAnswer: string | null;
  onAnswer: (answer: string) => void;
}

const MCQExercise: React.FC<MCQExerciseProps> = ({ question, selectedAnswer, onAnswer }) => {
  return (
    <div className="space-y-8"> {/* Added more vertical spacing */}
      {/* Main Sentence */}
      <div className="space-y-4">
        <div className="w-full">
          <p className="text-xl text-gray-800 whitespace-pre-wrap break-words leading-relaxed">
            {/* Left-aligned the question */}
            {question.sentence.split('___').map((part, index, array) => (
              <React.Fragment key={index}>
                <span className="inline-block">{part}</span>
                {/* Add underline only if it's not the last fragment */}
                {index < array.length - 1 && (
                  <span className="inline-block mx-2 w-16 border-b border-black text-center" />
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
            className={`w-full p-4 text-left rounded-lg border-2 transition-colors
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
