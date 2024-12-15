// components/exercise/BaseExercise.tsx
import React from 'react';
import { Exercise, ExerciseResult } from '../../types/exercise';
import { useExercise } from '../../hooks/useExercise';
import { MCQExercise } from './MCQExercise';

interface VerificationResponse {
  isCorrect: boolean;
  points: number;
  correctAnswer: string;
  feedback: string;
  isTimeout?: boolean;
}

interface BaseExerciseProps {
  exercise: Exercise;
  onComplete: (result: ExerciseResult) => Promise<VerificationResponse | null>;
  onNext: () => void;
}

export const BaseExercise: React.FC<BaseExerciseProps> = ({ 
  exercise, 
  onComplete,
  onNext 
}) => {
  const {
    state,
    startExercise,
  } = useExercise();

  React.useEffect(() => {
    startExercise(exercise);
  }, [exercise, startExercise]);

  const renderExercise = () => {
    switch (exercise.type) {
      case 'mcq':
        return (
          <MCQExercise 
            exercise={exercise} 
            onComplete={onComplete} 
            onNext={onNext}
          />
        );
      default:
        return <div>Unsupported exercise type</div>;
    }
  };

  if (!state) return <div>Loading...</div>;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {renderExercise()}
    </div>
  );
};
