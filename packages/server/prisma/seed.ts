// server/prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import { exercises } from '../src/data/exercises'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')
  
  await prisma.exercise.deleteMany({})
  
  for (const exercise of exercises) {
    const result = await prisma.exercise.upsert({
      where: {
        id: exercise.id
      },
      update: {
        category: exercise.category,
        subcategory: exercise.subcategory,
        type: exercise.type,
        difficultyLevel: exercise.difficultyLevel,
        instruction: exercise.instruction,
        sentence: exercise.sentence,
        options: exercise.options,
        correctAnswer: exercise.correctAnswer,
        feedback: exercise.feedback,
        points: exercise.points,
        timeLimit: exercise.timeLimit,
        tags: exercise.tags,
      },
      create: {
        id: exercise.id,
        category: exercise.category,
        subcategory: exercise.subcategory,
        type: exercise.type,
        difficultyLevel: exercise.difficultyLevel,
        instruction: exercise.instruction,
        sentence: exercise.sentence,
        options: exercise.options,
        correctAnswer: exercise.correctAnswer,
        feedback: exercise.feedback,
        points: exercise.points,
        timeLimit: exercise.timeLimit,
        tags: exercise.tags,
      },
    })
    console.log(`Upserted exercise with id: ${result.id}`)
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