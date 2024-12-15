// components/exercise/MCQExercise.tsx
import React from 'react';
import { MCQExercise as MCQExerciseType, ExerciseResult, ExerciseStatus, MCQExerciseState, ExerciseState } from '../../types/exercise';
import { useExercise } from '../../hooks/useExercise';
import { useTimer } from '../../contexts/TimerContext';
import { Button } from '../common/Button';
import Feedback from './Feedback';

interface MCQExerciseProps {
  exercise: MCQExerciseType;
  onComplete: (result: ExerciseResult) => Promise<{ isCorrect: boolean; points: number; correctAnswer: string; feedback: string; isTimeout?: boolean } | null>;
  onNext: () => void;
}

export const MCQExercise: React.FC<MCQExerciseProps> = ({ 
  exercise, 
  onComplete,
  onNext 
}) => {
  const { state, setAnswer, setStatus } = useExercise();
  const { stopTimer, state: timerState } = useTimer();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [serverCorrectAnswer, setServerCorrectAnswer] = React.useState<string | null>(null);
  const [serverFeedback, setServerFeedback] = React.useState<string | null>(null);
  const [isTimeout, setIsTimeout] = React.useState(false);

  // Handle timer expiration
  React.useEffect(() => {
    if (timerState.isExpired && state?.status === ExerciseStatus.IN_PROGRESS) {
      handleTimeUp();
    }
  }, [timerState.isExpired, state?.status]);

  const handleTimeUp = async () => {
    setStatus(ExerciseStatus.TIMER_EXPIRED);
    
    // Create result for timer expiration
    const result: ExerciseResult = {
      exerciseId: exercise.id,
      type: 'mcq',
      isCorrect: false,
      selectedAnswer: '',
      timeTaken: exercise.timeLimit,
      points: 0
    };

    try {
      const verification = await onComplete(result);
      if (verification) {
        setServerCorrectAnswer(verification.correctAnswer);
        setServerFeedback(verification.feedback);
        setIsTimeout(verification.isTimeout || false);
        setAnswer('', false, 0); // Empty answer for timer expiration
      }
    } catch (error) {
      console.error('Error processing timer expiration:', error);
    }
  };

  const handleAnswerClick = async (selectedKey: string) => {
    if (state?.status !== ExerciseStatus.IN_PROGRESS || isProcessing) return;

    setIsProcessing(true);
    stopTimer();
    setStatus(ExerciseStatus.ANSWERED);
    
    const result: ExerciseResult = {
      exerciseId: exercise.id,
      type: 'mcq',
      isCorrect: false,
      selectedAnswer: selectedKey,
      timeTaken: exercise.timeLimit - (state?.timeRemaining || 0),
      points: 0
    };

    try {
      const verification = await onComplete(result);
      
      if (verification) {
        setServerCorrectAnswer(verification.correctAnswer);
        setServerFeedback(verification.feedback);
        setIsTimeout(verification.isTimeout || false);
        setAnswer(selectedKey, verification.isCorrect, verification.points);
        setStatus(ExerciseStatus.COMPLETED);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const isMCQState = (state: ExerciseState): state is MCQExerciseState => {
    return 'selectedAnswer' in state;
  };

  const getButtonClassName = (key: string) => {
    const baseClass = "w-full p-4 text-left rounded-lg border-2 transition-colors";
    
    if (!state || state.status === ExerciseStatus.IN_PROGRESS) {
      return `${baseClass} border-gray-200 hover:border-primary-500 hover:bg-gray-50`;
    }

    if (!isMCQState(state)) {
      console.error('Invalid state type for MCQ exercise');
      return baseClass;
    }

    const isAnswered = state.status === ExerciseStatus.ANSWERED || 
                      state.status === ExerciseStatus.COMPLETED;
    const isTimeUp = state.status === ExerciseStatus.TIMER_EXPIRED;

    // Base disabled style
    const className = `${baseClass} cursor-not-allowed`;

    // If timer expired or answer submitted
    if (isTimeUp || isAnswered) {
      // If this is the correct answer (from server)
      if (serverCorrectAnswer && key === serverCorrectAnswer) {
        return `${className} border-success-500 bg-success-50 text-success-700`;
      }

      // If this is the selected answer and it's wrong
      if (key === state.selectedAnswer && !state.isCorrect) {
        return `${className} border-error-500 bg-error-50 text-error-700`;
      }

      // Other options
      return `${className} border-gray-200 bg-gray-100 opacity-50`;
    }

    return `${baseClass} border-gray-200`;
  };

  if (!state) return null;

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="w-full">
          <p className="text-xl text-gray-800 whitespace-pre-wrap break-words leading-relaxed">
            {exercise.sentence}
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {Object.entries(exercise.options).map(([key, value]) => (
          <button
            key={key}
            onClick={() => handleAnswerClick(key)}
            disabled={state.status !== ExerciseStatus.IN_PROGRESS || isProcessing}
            className={getButtonClassName(key)}
            aria-disabled={state.status !== ExerciseStatus.IN_PROGRESS || isProcessing}
          >
            {value}
          </button>
        ))}
      </div>

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

export default MCQExercise;
