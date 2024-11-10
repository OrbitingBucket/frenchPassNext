// client/src/types/exercise.ts
export interface MCQQuestion {
    id: string;
    instruction: string;
    sentence: string;
    options: Record<string, string>;
    correctAnswer: string;
    feedback: {
      general: string;
    };
  }