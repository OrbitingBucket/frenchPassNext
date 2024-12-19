// client/src/types/session.ts
import { Exercise, ExerciseResult } from './exercise';

export interface ExerciseSession {
  currentExerciseIndex: number;
  exercises: Exercise[];
  results: ExerciseResult[];
  totalPoints: number;
  startTime: number;
  endTime?: number;
  isComplete: boolean;
}

export interface SessionStats {
  totalExercises: number;
  completedExercises: number;
  correctAnswers: number;
  totalPoints: number;
  averageTimePerExercise: number;
  accuracy: number;
}

export interface ExerciseSessionState {
  session: ExerciseSession | null;
  loading: boolean;
  error: string | null;
  stats: SessionStats | null;
}

export type SessionAction =
  | { type: 'START_SESSION'; payload: Exercise[] }
  | { type: 'NEXT_EXERCISE' }
  | { type: 'ADD_RESULT'; payload: ExerciseResult }
  | { type: 'COMPLETE_SESSION' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'RESET_SESSION' };