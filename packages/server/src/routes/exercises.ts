// server/src/routes/exercises.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get exercises
router.get('/exercises', async (req, res) => {
  try {
    const { category, difficulty, limit = 10 } = req.query;
    
    const exercises = await prisma.exercise.findMany({
      where: {
        ...(category ? { category: String(category) } : {}),
        ...(difficulty ? { difficulty_level: String(difficulty) } : {})
      },
      take: Number(limit)
    });

    // Remove correct answers from response
    const safeExercises = exercises.map(({ correct_answer, ...exercise }) => exercise);
    
    res.json(safeExercises);
  } catch (error) {
    console.error('Error fetching exercises:', error);
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
});

// Verify answer
router.post('/exercises/:id/verify', async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;

    const exercise = await prisma.exercise.findUnique({
      where: { id }
    });

    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    const isCorrect = answer === exercise.correct_answer;
    const feedback = exercise.feedback as Record<string, string>;
    
    res.json({
      isCorrect,
      feedback: feedback[answer],
      points: isCorrect ? exercise.points : 0
    });
  } catch (error) {
    console.error('Error verifying answer:', error);
    res.status(500).json({ error: 'Failed to verify answer' });
  }
});

export default router;