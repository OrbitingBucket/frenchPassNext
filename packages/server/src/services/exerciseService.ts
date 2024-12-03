// server/src/services/exerciseService.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

  async createExercise(data: any) {
    return await prisma.exercise.create({
      data
    })
  }
}