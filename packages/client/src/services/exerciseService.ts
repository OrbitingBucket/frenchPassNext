// client/src/services/exerciseService.ts
import axios from 'axios'
import { Exercise } from '../types/exercise'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const exerciseService = {
  async getExercises() {
    try {
      const response = await axios.get<Exercise[]>(`${API_URL}/exercises`);
      return response.data;
    } catch (error) {
      console.error('Error fetching exercises:', error);
      throw error;
    }
  },

  async verifyAnswer(exerciseId: string, answer: string) {
    try {
      const response = await axios.post<{
        isCorrect: boolean;
        feedback: string;
        points: number;
      }>(`${API_URL}/exercises/${exerciseId}/verify`, { answer });
      return response.data;
    } catch (error) {
      console.error('Error verifying answer:', error);
      throw error;
    }
  }
};