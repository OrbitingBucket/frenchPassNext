// packages/client/src/App.tsx
import { useState, useEffect, useCallback } from 'react';
import Layout from './components/layout/Layout';
import { BaseExercise } from './components/exercise/BaseExercise';
import { Exercise, ExerciseResult } from './types/exercise';
import { exerciseService } from './services/exerciseService';
import { TimerProvider } from './contexts/TimerContext';
import { ExerciseProvider } from './contexts/ExerciseContext';

function App() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [results, setResults] = useState<ExerciseResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      setLoading(true);
      const fetchedExercises = await exerciseService.getExercises();
      setExercises(fetchedExercises);
    } catch (error) {
      console.error('Failed to load exercises:', error);
      setError('Failed to load exercises');
    } finally {
      setLoading(false);
    }
  };

  const handleExerciseComplete = async (result: ExerciseResult) => {
    try {
      console.log('Processing exercise result:', result);
      const verification = await exerciseService.processExerciseAnswer(result);
      console.log('Received verification:', verification);
      
      // Update the result with the server verification
      const updatedResult: ExerciseResult = {
        ...result,
        isCorrect: verification.isCorrect,
        points: verification.points
      };

      console.log('Updated result:', updatedResult);
      setResults(prev => [...prev, updatedResult]);

      // Return the verification to update the exercise state
      return {
        isCorrect: verification.isCorrect,
        points: verification.points,
        correctAnswer: verification.correctAnswer,
        feedback: verification.feedback,
        isTimeout: verification.isTimeout
      };
    } catch (error) {
      console.error('Error processing exercise result:', error);
      return null;
    }
  };

  const handleNext = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      // Handle quiz completion
      handleQuizComplete();
    }
  };

  const handleQuizComplete = () => {
    // Calculate final score
    const totalScore = results.reduce((sum, result) => sum + result.points, 0);
    const totalPossibleScore = exercises.reduce((sum, exercise) => sum + exercise.points, 0);
    
    console.log('Quiz completed!');
    console.log(`Final score: ${totalScore}/${totalPossibleScore}`);
    // Here you could navigate to a results page or show a summary
  };

  const handleTimeUp = useCallback(() => {
    // When timer expires, submit a blank answer to get the correct answer
    const currentExercise = exercises[currentExerciseIndex];
    if (currentExercise) {
      let result: ExerciseResult;

      if (currentExercise.type === 'mcq') {
        result = {
          exerciseId: currentExercise.id,
          type: 'mcq',
          isCorrect: false,
          selectedAnswer: '',
          timeTaken: currentExercise.timeLimit,
          points: 0
        };
      } else {
        result = {
          exerciseId: currentExercise.id,
          type: 'text_input',
          isCorrect: false,
          userInput: '',
          timeTaken: currentExercise.timeLimit,
          points: 0
        };
      }

      // Process the result through the server to get the correct answer
      handleExerciseComplete(result);
    }
  }, [currentExerciseIndex, exercises]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;
  if (!exercises.length) return <div className="text-center">No exercises found</div>;

  const currentExercise = exercises[currentExerciseIndex];

  return (
    <ExerciseProvider>
      <TimerProvider 
        onTimeUp={handleTimeUp}
        initialTimeLimit={currentExercise.timeLimit}
        key={currentExercise.id} // Reset timer when exercise changes
      >
        <Layout>
          <div className="max-w-2xl mx-auto p-4">
            <BaseExercise
              exercise={currentExercise}
              onComplete={handleExerciseComplete}
              onNext={handleNext}
            />
          </div>
        </Layout>
      </TimerProvider>
    </ExerciseProvider>
  );
}

export default App;
