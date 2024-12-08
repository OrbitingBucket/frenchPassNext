// packages/client/src/App.tsx

import { useState, useEffect, useCallback } from 'react';
import Layout from './components/layout/Layout';
import MCQExercise from './components/exercise/MCQExercise';
import Feedback from './components/exercise/Feedback';
import { Exercise } from './types/exercise';
import { exerciseService } from './services/exerciseService';

function App() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(true);

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      setLoading(true);
      const fetchedExercises = await exerciseService.getExercises();
      setExercises(fetchedExercises);
    } catch (err) {
      setError('Failed to load exercises');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (exercises[currentExerciseIndex]) {
      const newTimeLimit = exercises[currentExerciseIndex].timeLimit;
      console.log('[App] Starting new exercise:', {
        index: currentExerciseIndex,
        timeLimit: newTimeLimit
      });
      setTimeLeft(newTimeLimit);
      setIsTimerActive(true);
      setSelectedAnswer(null); // Reset selected answer
      setShowFeedback(false); // Reset feedback
      setIsCorrect(null); // Reset correct state
    }
  }, [currentExerciseIndex, exercises]);

  const handleTimeUp = useCallback(() => {
    setIsTimerActive(false);
    setShowFeedback(true);
    const currentExercise = exercises[currentExerciseIndex];
    setSelectedAnswer(currentExercise.correctAnswer);
    setIsCorrect(false);
  }, [currentExerciseIndex, exercises]);

  const handleAnswer = (answer: string) => {
    if (!exercises[currentExerciseIndex] || !isTimerActive) {
      console.log('[App] Answer rejected:', { isTimerActive, answer });
      return;
    }

    console.log('[App] Answer selected:', {
      answer,
      exerciseId: exercises[currentExerciseIndex].id
    });

    setIsTimerActive(false);
    setSelectedAnswer(answer);
    const correct = answer === exercises[currentExerciseIndex].correctAnswer;
    console.log('[App] Answer evaluation:', { correct });
    setIsCorrect(correct);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      console.log('[App] Moving to next exercise:', {
        current: currentExerciseIndex,
        next: currentExerciseIndex + 1,
        totalExercises: exercises.length
      });
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      console.log('[App] Reached end of exercises');
    }
  };

  useEffect(() => {
    console.log('[App] State update:', {
      currentExerciseIndex,
      selectedAnswer,
      showFeedback,
      isCorrect,
      isTimerActive,
      timeLeft
    });
  }, [currentExerciseIndex, selectedAnswer, showFeedback, isCorrect, isTimerActive, timeLeft]);

  if (loading) {
    console.log('[App] Rendering loading state');
    return <div className="text-center">Loading...</div>;
  }
  
  if (error) {
    console.log('[App] Rendering error state:', error);
    return <div className="text-center text-red-500">Error: {error}</div>;
  }
  
  if (!exercises.length) {
    console.log('[App] No exercises available');
    return <div className="text-center">No exercises found</div>;
  }

  const currentExercise = exercises[currentExerciseIndex];

  return (
    <Layout
      timeLimit={currentExercise.timeLimit}
      isActive={isTimerActive}
      onTimeUp={handleTimeUp}
    >
      <MCQExercise
        question={currentExercise}
        onAnswer={handleAnswer}
        selectedAnswer={selectedAnswer}
        disabled={!isTimerActive}
      />

      {showFeedback && selectedAnswer && (
        <div className="mt-6">
          <Feedback
            isCorrect={isCorrect}
            feedback={currentExercise.feedback[selectedAnswer]}
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleNext}
              className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors disabled:bg-primary-300"
              disabled={currentExerciseIndex === exercises.length - 1}
            >
              Next Exercise
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default App;