// client/src/App.tsx
import { useState, useEffect } from 'react';
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

  const handleAnswer = (answer: string) => {
    if (!exercises[currentExerciseIndex]) return;

    setSelectedAnswer(answer);
    const correct = answer === exercises[currentExerciseIndex].correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setIsCorrect(null);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!exercises.length) return <div>No exercises found</div>;

  const currentExercise = exercises[currentExerciseIndex];

  return (
    <Layout>
      <div className="bg-white rounded-lg p-6 w-full">
        <MCQExercise
          question={currentExercise}
          onAnswer={handleAnswer}
          selectedAnswer={selectedAnswer}
        />
        
        {showFeedback && selectedAnswer && (
          <>
            <Feedback
              isCorrect={isCorrect}
              feedback={currentExercise.feedback[selectedAnswer]}
            />
            <div className="flex justify-center mt-4">
              <button
                onClick={handleNext}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                disabled={currentExerciseIndex === exercises.length - 1}
              >
                Next Exercise
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default App;
