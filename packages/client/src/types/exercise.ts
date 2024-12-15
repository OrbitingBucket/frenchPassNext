// client/src/types/exercise.ts
export type DifficultyLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type ExerciseType = 'mcq' | 'fillInGap';

export interface BaseExercise {
  id: string;
  category: string;
  subcategory: string;
  type: ExerciseType;
  difficultyLevel: DifficultyLevel;
  instruction: string;
  points: number;
  timeLimit: number;
  tags: string[];
}

export interface MCQExercise extends BaseExercise {
  type: 'mcq';
  sentence: string;
  options: Record<string, string>;
  correctAnswer: string;
  feedback: Record<string, string>;
}

export interface FillInGapExercise extends BaseExercise {
  type: 'fillInGap';
  sentence: string;
  correctAnswer: string;
  feedback: string;
  acceptableAnswers?: string[];
}

export type Exercise = MCQExercise | FillInGapExercise;

export interface BaseExerciseResult {
  exerciseId: string;
  type: ExerciseType;
  isCorrect: boolean;
  timeTaken: number;
  points: number;
}

export interface MCQExerciseResult extends BaseExerciseResult {
  type: 'mcq';
  selectedAnswer: string;
}

export interface FillInGapExerciseResult extends BaseExerciseResult {
  type: 'fillInGap';
  userInput: string;
}

export type ExerciseResult = MCQExerciseResult | FillInGapExerciseResult;

export interface VerificationResponse {
  isCorrect: boolean;
  points: number;
  correctAnswer: string;
  feedback: string;
  isTimeout?: boolean;
}

export enum ExerciseStatus {
  INITIAL = 'initial',
  IN_PROGRESS = 'in_progress',
  ANSWERED = 'answered',
  TIMER_EXPIRED = 'timer_expired',
  FEEDBACK_SHOWN = 'feedback_shown',
  COMPLETED = 'completed'
}

export interface BaseExerciseState {
  status: ExerciseStatus;
  timeRemaining: number;
  points: number;
  isCorrect: boolean | null;
}

export interface MCQExerciseState extends BaseExerciseState {
  selectedAnswer: string | null;
}

export interface FillInGapExerciseState extends BaseExerciseState {
  userInput: string;
}

export type ExerciseState = MCQExerciseState | FillInGapExerciseState;
