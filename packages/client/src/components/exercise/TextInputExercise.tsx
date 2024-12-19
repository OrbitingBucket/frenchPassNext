// components/exercise/TextInputExercise.tsx
import React, { useRef, useEffect, useState } from 'react';
import { TextInputExercise as TextInputExerciseType, ExerciseResult, ExerciseStatus, TextInputExerciseState, ExerciseState } from '../../types/exercise';
import { useExercise } from '../../hooks/useExercise';
import { useTimer } from '../../contexts/TimerContext';
import { Button } from '../common/Button';
import Feedback from './Feedback';

interface TextInputExerciseProps {
  exercise: TextInputExerciseType;
  onComplete: (result: ExerciseResult) => Promise<{ isCorrect: boolean; points: number; correctAnswer: string; feedback: string; isTimeout?: boolean } | null>;
  onNext: () => void;
}

export const TextInputExercise: React.FC<TextInputExerciseProps> = ({ 
  exercise, 
  onComplete,
  onNext 
}) => {
  const { state, setAnswer, setStatus } = useExercise();
  const { stopTimer, state: timerState } = useTimer();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [userInput, setUserInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [serverCorrectAnswer, setServerCorrectAnswer] = useState<string | null>(null);
  const [serverFeedback, setServerFeedback] = useState<string | null>(null);
  const [isTimeout, setIsTimeout] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  // Extract initial value from sentence
  const getInitialValue = () => {
    const match = exercise.sentence.match(/\[(.*?)\]/);
    return match ? match[1] : '';
  };

  // Update input width based on content
  const updateInputWidth = () => {
    if (inputRef.current && measureRef.current) {
      const textToMeasure = userInput || (!isFocused ? getInitialValue() : '');
      measureRef.current.textContent = textToMeasure;
      // Add extra padding to account for border (4px) and input padding (24px)
      const width = Math.max(measureRef.current.offsetWidth + 32, 80);
      inputRef.current.style.width = `${width}px`;
    }
  };

  // Auto-resize input based on content
  useEffect(() => {
    updateInputWidth();
  }, [userInput, isFocused]);

  // Handle timer expiration
  useEffect(() => {
    if (timerState.isExpired && state?.status === ExerciseStatus.IN_PROGRESS) {
      handleTimeUp();
    }
  }, [timerState.isExpired, state?.status]);

  const handleTimeUp = async () => {
    setStatus(ExerciseStatus.TIMER_EXPIRED);
    
    const result: ExerciseResult = {
      exerciseId: exercise.id,
      type: 'text_input',
      isCorrect: false,
      userInput: '',
      timeTaken: exercise.timeLimit,
      points: 0
    };

    try {
      const verification = await onComplete(result);
      if (verification) {
        setServerCorrectAnswer(verification.correctAnswer);
        setServerFeedback(verification.feedback);
        setIsTimeout(verification.isTimeout || false);
        setAnswer('', false, 0);
      }
    } catch (error) {
      console.error('Error processing timer expiration:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state?.status !== ExerciseStatus.IN_PROGRESS || isProcessing) return;

    setIsProcessing(true);
    stopTimer();
    setStatus(ExerciseStatus.ANSWERED);
    
    const result: ExerciseResult = {
      exerciseId: exercise.id,
      type: 'text_input',
      isCorrect: false,
      userInput: userInput.trim(),
      timeTaken: exercise.timeLimit - (state?.timeRemaining || 0),
      points: 0
    };

    try {
      const verification = await onComplete(result);
      
      if (verification) {
        setServerCorrectAnswer(verification.correctAnswer);
        setServerFeedback(verification.feedback);
        setIsTimeout(verification.isTimeout || false);
        setAnswer(userInput.trim(), verification.isCorrect, verification.points);
        setStatus(ExerciseStatus.COMPLETED);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const isTextInputState = (state: ExerciseState): state is TextInputExerciseState => {
    return 'userInput' in state;
  };

  const getInputClassName = () => {
    const baseClass = "px-3 py-1 rounded border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 text-left font-medium placeholder:text-gray-500 placeholder:font-medium";
    
    if (!state || state.status === ExerciseStatus.IN_PROGRESS) {
      return `${baseClass} border-gray-200 bg-white`;
    }

    if (!isTextInputState(state)) {
      console.error('Invalid state type for Text Input exercise');
      return baseClass;
    }

    const isAnswered = state.status === ExerciseStatus.ANSWERED || 
                      state.status === ExerciseStatus.COMPLETED;
    const isTimeUp = state.status === ExerciseStatus.TIMER_EXPIRED;

    if (isTimeUp || isAnswered) {
      if (state.isCorrect) {
        return `${baseClass} border-success-500 bg-success-50 text-success-700`;
      } else {
        return `${baseClass} border-error-500 bg-error-50 text-error-700`;
      }
    }

    return `${baseClass} border-gray-200`;
  };

  const renderSentence = () => {
    const parts = exercise.sentence.split(/(\[.*?\])/);
    return (
      <p className="text-xl text-gray-800 whitespace-pre-wrap break-words leading-relaxed">
        {/* Hidden span for measuring text width */}
        <span
          ref={measureRef}
          className="invisible fixed -left-[9999px] whitespace-pre text-xl font-medium"
          aria-hidden="true"
        />
        {parts.map((part, index) => {
          if (part.startsWith('[') && part.endsWith(']')) {
            return (
              <input
                key={index}
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={getInitialValue()}
                disabled={state?.status !== ExerciseStatus.IN_PROGRESS || isProcessing}
                className={getInputClassName()}
                aria-disabled={state?.status !== ExerciseStatus.IN_PROGRESS || isProcessing}
              />
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </p>
    );
  };

  if (!state) return null;

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="w-full">
          {renderSentence()}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {state.status === ExerciseStatus.IN_PROGRESS && (
          <Button
            type="submit"
            disabled={isProcessing || !userInput.trim()}
            className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit
          </Button>
        )}
      </form>

      {(state.status === ExerciseStatus.ANSWERED || 
        state.status === ExerciseStatus.COMPLETED ||
        state.status === ExerciseStatus.TIMER_EXPIRED) && (
        <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
          <p className="font-medium text-gray-700">Correct answer: {serverCorrectAnswer}</p>
        </div>
      )}

      <Feedback 
        exercise={exercise} 
        serverFeedback={serverFeedback || undefined}
        isTimeout={isTimeout}
      />

      {(state.status === ExerciseStatus.ANSWERED || 
        state.status === ExerciseStatus.COMPLETED ||
        state.status === ExerciseStatus.TIMER_EXPIRED) && (
        <div className="mt-6">
          <Button
            onClick={onNext}
            className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default TextInputExercise;
