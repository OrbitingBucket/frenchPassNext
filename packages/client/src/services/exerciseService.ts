// client/src/services/exerciseService.ts
import axios from 'axios'
import { Exercise } from '../types/exercise'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const exerciseService = {
  async getExercises() {
    try {
      const response = await axios.get<Exercise[]>(`${API_URL}/exercises`)
      console.log('Received exercises:', response.data) // Add logging
      return response.data
    } catch (error) {
      console.error('Error fetching exercises:', error)
      if (axios.isAxiosError(error)) {
        console.error('Response:', error.response?.data)
      }
      throw error
    }
  }
}