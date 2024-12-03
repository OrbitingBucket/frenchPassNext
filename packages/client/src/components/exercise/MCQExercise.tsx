// client/src/components/exercise/MCQExercise.tsx
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
      <div className="space-y-4">
        {question.category && question.subcategory && (
          <div className="text-sm text-gray-600">
            {question.category} • {question.subcategory}
          </div>
        )}

        <h2 className="text-xl font-semibold text-gray-800">
          {question.instruction}
        </h2>

        <p className="text-lg">
          {question.sentence.split('___').map((part, index, array) => (
            <React.Fragment key={index}>
              {part}
              {index < array.length - 1 && (
                <span className="mx-2 inline-block min-w-[40px] border-b-2 border-blue-500">
                  {'___'}
                </span>
              )}
            </React.Fragment>
          ))}
        </p>
      </div>

      <div className="grid gap-3">
        {Object.entries(question.options).map(([key, value]) => (
          <button
            key={key}
            onClick={() => onAnswer(key)}
            disabled={selectedAnswer !== null}
            className={`
              p-4 text-left rounded-lg border-2 transition-all
              ${
                selectedAnswer === key
                  ? selectedAnswer === question.correctAnswer
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-blue-300'
              }
              ${
                selectedAnswer !== null && key === question.correctAnswer
                  ? 'border-green-500 bg-green-50'
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