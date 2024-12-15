// src/services/exerciseService.ts
import { Exercise, ExerciseResult } from '../types/exercise';
import api from './api';

interface VerificationResponse {
  isCorrect: boolean;
  points: number;
  correctAnswer: string;
  feedback: string;
  isTimeout?: boolean;
}

class ExerciseService {
  async getExercises(): Promise<Exercise[]> {
    try {
      const response = await api.get('/exercises');
      return response.data;
    } catch (error) {
      console.error('Error fetching exercises:', error);
      throw error;
    }
  }

  async verifyAnswer(exerciseId: string, result: ExerciseResult): Promise<VerificationResponse> {
    try {
      // Extract the answer from the result based on exercise type
      const answer = result.type === 'mcq' 
        ? result.selectedAnswer 
        : result.userInput;

      const response = await api.post(`/exercises/${exerciseId}/verify`, { answer });
      
      return {
        isCorrect: response.data.isCorrect,
        points: response.data.points,
        correctAnswer: response.data.correctAnswer,
        feedback: response.data.feedback,
        isTimeout: response.data.isTimeout
      };
    } catch (error) {
      console.error('Error verifying answer:', error);
      throw error;
    }
  }

  async processExerciseAnswer(result: ExerciseResult): Promise<VerificationResponse> {
    try {
      const verification = await this.verifyAnswer(result.exerciseId, result);
      return {
        isCorrect: verification.isCorrect,
        points: verification.points,
        correctAnswer: verification.correctAnswer,
        feedback: verification.feedback,
        isTimeout: verification.isTimeout
      };
    } catch (error) {
      console.error('Error processing exercise answer:', error);
      throw error;
    }
  }
}

export const exerciseService = new ExerciseService();
