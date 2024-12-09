// src/components/exercise/MCQExercise.tsx
import React, { useEffect } from 'react';
import { Exercise } from '../../types/exercise';
import { useTimer } from '../../contexts/TimerContext';

interface MCQExerciseProps {
  question: Exercise;
  selectedAnswer: string | null;
  onAnswer: (answer: string) => void;
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
    const baseClass = "w-full p-4 text-left rounded-lg border-2 transition-colors";
    const disabledClass = (showFeedback || isTimeUp) ? 'opacity-50 cursor-not-allowed' : '';
    
    if (showFeedback || isTimeUp) {
      if (key === correctAnswer) {
        return `${baseClass} ${disabledClass} border-success-500 bg-success-50`;
      }
      if (key === selectedAnswer && key !== correctAnswer) {
        return `${baseClass} ${disabledClass} border-error-500 bg-error-50`;
      }
    }
    
    return `${baseClass} ${disabledClass} border-gray-200 hover:border-primary-500`;
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
            disabled={showFeedback || isTimeUp}
            className={getButtonClassName(key)}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MCQExercise;