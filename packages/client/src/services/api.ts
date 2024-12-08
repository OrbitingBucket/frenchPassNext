// client/src/services/api.ts
export interface Exercise {
    id: string;
    category: string;
    subcategory: string;
    type: 'mcq';
    difficultyLevel: string;
    instruction: string;
    sentence: string;
    options: Record<string, string>;
    feedback: Record<string, string>;
    points: number;
    timeLimit: number;
    tags: string[];
  }
  
  export const exerciseApi = {
    async getExercises(params: { 
      category?: string; 
      difficulty?: string; 
      limit?: number; 
    }): Promise<Omit<Exercise, 'correctAnswer'>[]> {
      const response = await fetch('/api/exercises?' + new URLSearchParams({
        ...params,
        limit: params.limit?.toString() || '10'
      }));
      if (!response.ok) {
        throw new Error('Failed to fetch exercises');
      }
      return response.json();
    },
  
    async verifyAnswer(exerciseId: string, answer: string): Promise<{
      isCorrect: boolean;
      feedback: string;
      points: number;
    }> {
      const response = await fetch(`/api/exercises/${exerciseId}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answer }),
      });
      if (!response.ok) {
        throw new Error('Failed to verify answer');
      }
      return response.json();
    }
  };