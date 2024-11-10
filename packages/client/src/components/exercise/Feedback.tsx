// client/src/components/exercise/Feedback.tsx
import React from 'react';

interface FeedbackProps {
  isCorrect: boolean | null;
  feedback: string;
}

const Feedback: React.FC<FeedbackProps> = ({ isCorrect, feedback }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full px-4 pb-4">
      <div
className={`max-w-screen-md mx-auto p-6 rounded ${
    isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }`}
      >
        <h3 className="text-lg font-bold mb-2">
          {isCorrect ? 'Correct!' : 'Incorrect'}
        </h3>
        <p className="whitespace-normal break-words">
          {feedback}
        </p>
      </div>
    </div>
  );
};

export default Feedback;
