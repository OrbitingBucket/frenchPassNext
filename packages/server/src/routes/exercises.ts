// server/src/routes/exercises.ts
import express from 'express';
import { exerciseService } from '../services/exerciseService';
import { Exercise } from '../data/exercises';

const router = express.Router();

// Get exercises
router.get('/exercises', async (req, res) => {
  try {
    const { category, difficulty, limit = 10 } = req.query;
    
    const exercises = await exerciseService.getAllExercises();
    
    // Filter exercises based on query parameters
    let filteredExercises = exercises;
    if (category) {
      filteredExercises = filteredExercises.filter((ex: Exercise) => ex.category === String(category));
    }
    if (difficulty) {
      filteredExercises = filteredExercises.filter((ex: Exercise) => ex.difficultyLevel === String(difficulty));
    }
    
    // Limit the number of exercises
    const limitedExercises = filteredExercises.slice(0, Number(limit));

    // Remove correct answers from response for security
    const safeExercises = limitedExercises.map(({ correctAnswer, ...exercise }: Exercise) => exercise);
    
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

    // Special case for timer expiration (empty answer)
    if (!answer) {
      const exercise = await exerciseService.getExerciseById(id);
      if (!exercise) {
        return res.status(404).json({ error: 'Exercise not found' });
      }

      return res.json({
        isCorrect: false,
        correctAnswer: exercise.correctAnswer,
        feedback: 'Le temps est écoulé...',
        points: 0,
        isTimeout: true
      });
    }

    // Validate answer using exerciseService
    const result = await exerciseService.validateAnswer(id, answer);
    const exercise = await exerciseService.getExerciseById(id);

    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    res.json({
      ...result,
      correctAnswer: exercise.correctAnswer,
      points: result.isCorrect ? exercise.points : 0,
      isTimeout: false
    });
  } catch (error) {
    console.error('Error verifying answer:', error);
    res.status(500).json({ error: 'Failed to verify answer' });
  }
});

// Create exercise
router.post('/exercises', async (req, res) => {
  try {
    const exercise = await exerciseService.createExercise(req.body);
    res.status(201).json(exercise);
  } catch (error) {
    console.error('Error creating exercise:', error);
    res.status(500).json({ error: 'Failed to create exercise' });
  }
});

// Get exercise by ID
router.get('/exercises/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const exercise = await exerciseService.getExerciseById(id);
    
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    // Remove correct answer from response for security
    const { correctAnswer, ...safeExercise } = exercise as Exercise;
    res.json(safeExercise);
  } catch (error) {
    console.error('Error fetching exercise:', error);
    res.status(500).json({ error: 'Failed to fetch exercise' });
  }
});

export default router;
