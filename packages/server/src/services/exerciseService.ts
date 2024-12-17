// server/src/services/exerciseService.ts
import { PrismaClient } from '@prisma/client'
import { Exercise, MCQExercise, TextInputExercise } from '../data/exercises'

const prisma = new PrismaClient()

interface ValidateAnswerResult {
  isCorrect: boolean;
  feedback: string;
}

export const exerciseService = {
  async getAllExercises() {
    return await prisma.exercise.findMany()
  },

  async getExerciseById(id: string) {
    return await prisma.exercise.findUnique({
      where: { id }
    })
  },

  async getExercisesByLevel(level: string) {
    return await prisma.exercise.findMany({
      where: { difficultyLevel: level }
    })
  },

  async createExercise(data: Omit<Exercise, 'id' | 'createdAt'>) {
    return await prisma.exercise.create({
      data
    })
  },

  async validateAnswer(exerciseId: string, answer: string): Promise<ValidateAnswerResult> {
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId }
    });

    if (!exercise) {
      throw new Error('Exercise not found');
    }

    // Parse JSON fields
    const options = typeof exercise.options === 'string' 
      ? JSON.parse(exercise.options) 
      : exercise.options;
    
    const feedback = typeof exercise.feedback === 'string' 
      ? JSON.parse(exercise.feedback) 
      : exercise.feedback;

    // Normalize answer by trimming whitespace and converting to lowercase
    const normalizedAnswer = answer.trim().toLowerCase();

    if (exercise.type === 'mcq') {
      const isCorrect = normalizedAnswer === exercise.correctAnswer.toLowerCase();
      return {
        isCorrect,
        feedback: isCorrect ? feedback[exercise.correctAnswer] : feedback[normalizedAnswer] || 'Réponse incorrecte'
      };
    } 
    
    if (exercise.type === 'text_input') {
      // Check for exact match with correct answer
      if (normalizedAnswer === exercise.correctAnswer.toLowerCase()) {
        return {
          isCorrect: true,
          feedback: feedback.default
        };
      }

      // Check for accepted variations
      if (options.accepted && options.accepted.some(
        (accepted: string) => accepted.toLowerCase() === normalizedAnswer
      )) {
        return {
          isCorrect: true,
          feedback: feedback.default
        };
      }

      // Check for common mistakes
      if (options.common_mistakes && options.common_mistakes[normalizedAnswer]) {
        return {
          isCorrect: false,
          feedback: options.common_mistakes[normalizedAnswer]
        };
      }

      // Default case: incorrect answer
      return {
        isCorrect: false,
        feedback: feedback.default
      };
    }

    throw new Error('Unsupported exercise type');
  }
}
