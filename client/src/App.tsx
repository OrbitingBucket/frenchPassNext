// client/src/App.tsx
import { useState } from 'react';
import Layout from './components/layout/Layout';
import MCQExercise from './components/exercise/MCQExercise';
import Feedback from './components/exercise/Feedback';
import { MCQQuestion } from './types/exercise';
import './App.css';

// Sample question data
const sampleQuestion: MCQQuestion = {
  id: '1',
  instruction: 'Choose the correct article',
  sentence: 'Je vois ___ chat dans le jardin.',
  options: {
    a: 'un',
    b: 'une',
    c: 'le',
    d: 'la'
  },
  correctAnswer: 'a',
  feedback: {
    general: 'Remember: "chat" is a masculine noun, so we use "un" as the indefinite article.'
  }
};

function App() {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setIsCorrect(answer === sampleQuestion.correctAnswer);
    setShowFeedback(true);
  };



  return (
    <Layout>
      <div className="max-w-3xl w-full mx-auto space-y-4 bg-white rounded-lg">
        <MCQExercise
          question={sampleQuestion}
          onAnswer={handleAnswer}
          selectedAnswer={selectedAnswer}
        />
        
        {showFeedback && (
          <Feedback
            isCorrect={isCorrect}
            feedback={sampleQuestion.feedback.general}
          />
        )}
      </div>
    </Layout>
  );
}

export default App;