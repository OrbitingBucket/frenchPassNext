// client/src/components/exercise/MCQExercise.tsx
import React from 'react';
import { MCQQuestion } from '../../types/exercise';

interface MCQExerciseProps {
  question: MCQQuestion;  // Changed from string to MCQQuestion
  selectedAnswer: string | null;
  onAnswer: (answer: string) => void;
}

const MCQExercise = ({ question, selectedAnswer, onAnswer }: MCQExerciseProps) => {
    return (
      <div className="w-full space-y-6 overflow-hidden">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 break-words">
            {question.instruction}
          </h2>
          
          <p className="text-lg break-words whitespace-normal overflow-wrap-anywhere">
            {question.sentence.split('___').map((part, index, array) => (
              <React.Fragment key={index}>
                {part}
                {index < array.length - 1 && (
                  <span className="mx-2 inline-block min-w-[40px] border-b-2 border-primary" />
                )}
              </React.Fragment>
            ))}
          </p>
        </div>
  
        <div className="flex flex-col gap-3 w-full">
          {Object.entries(question.options).map(([key, value]) => (
            <button
              key={key}
              onClick={() => onAnswer(key)}
              disabled={selectedAnswer !== null}
              className={`
                w-full p-4 text-left rounded-lg border transition-all break-words
                ${selectedAnswer === key 
                  ? selectedAnswer === question.correctAnswer
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-blue-300'
                }
                ${selectedAnswer !== null && key === question.correctAnswer 
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