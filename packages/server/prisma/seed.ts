// server/prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import { exercises } from '../src/data/exercises'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')
  
  for (const exercise of exercises) {
    const result = await prisma.exercise.create({
      data: {
        category: exercise.category,
        subcategory: exercise.subcategory,
        type: exercise.type,
        difficultyLevel: exercise.difficulty_level,
        instruction: exercise.instruction,
        sentence: exercise.sentence,
        options: exercise.options,
        correctAnswer: exercise.correct_answer,
        feedback: exercise.feedback,
        points: exercise.points,
        timeLimit: exercise.time_limit,
        tags: exercise.tags,
      },
    })
    console.log(`Created exercise with id: ${result.id}`)
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })