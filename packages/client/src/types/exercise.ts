// client/src/types/exercise.ts
export interface Exercise {
  id: string;
  category: string;
  subcategory: string;
  type: 'mcq';
  difficultyLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  instruction: string;
  sentence: string;
  options: Record<string, string>;
  correctAnswer: string;
  feedback: Record<string, string>;
  points: number;
  timeLimit: number;
  tags: string[];
}