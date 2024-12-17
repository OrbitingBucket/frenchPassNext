// client/src/components/exercise/Feedback.tsx
import React from 'react';
import { Exercise, ExerciseStatus, MCQExercise, TextInputExercise, MCQExerciseState } from '../../types/exercise';
import { useExercise } from '../../hooks/useExercise';

interface FeedbackProps {
  exercise: Exercise;
  serverFeedback?: string;
  isTimeout?: boolean;
}

export const Feedback: React.FC<FeedbackProps> = ({ exercise, serverFeedback, isTimeout }) => {
  const { state } = useExercise();

  if (!state || (state.status !== ExerciseStatus.ANSWERED && 
                 state.status !== ExerciseStatus.COMPLETED &&
                 state.status !== ExerciseStatus.TIMER_EXPIRED)) {
    return null;
  }

  const getFeedbackContent = () => {
    // Handle timer expiration case
    if (state.status === ExerciseStatus.TIMER_EXPIRED || isTimeout) {
      return {
        title: "Le temps est écoulé...",
        message: `La bonne réponse était : ${
          exercise.type === 'mcq' 
            ? (exercise as MCQExercise).options[(exercise as MCQExercise).correctAnswer]
            : (exercise as TextInputExercise).correctAnswer
        }`,
        isSuccess: false
      };
    }

    const isCorrect = state.isCorrect;
    let feedbackMessage = serverFeedback || '';

    if (exercise.type === 'mcq' && 'selectedAnswer' in state && state.selectedAnswer) {
      // MCQ specific feedback
      const mcqExercise = exercise as MCQExercise;
      const mcqState = state as MCQExerciseState;
      
      if (!feedbackMessage) {
        feedbackMessage = mcqState.selectedAnswer ? mcqExercise.feedback[mcqState.selectedAnswer] : '';
      }
      if (!isCorrect) {
        feedbackMessage += `\nLa bonne réponse était : ${mcqExercise.options[mcqExercise.correctAnswer]}`;
      }
    } else if (exercise.type === 'text_input' && 'userInput' in state) {
      // Text Input specific feedback
      const textInputExercise = exercise as TextInputExercise;
      
      if (!feedbackMessage) {
        feedbackMessage = textInputExercise.feedback;
      }
      if (!isCorrect) {
        feedbackMessage += `\nLa bonne réponse était : ${textInputExercise.correctAnswer}`;
        if (textInputExercise.acceptableAnswers?.length) {
          feedbackMessage += `\nAutres réponses acceptables : ${textInputExercise.acceptableAnswers.join(', ')}`;
        }
      }
    }

    return {
      title: isCorrect ? 'Correct !' : 'Incorrect',
      message: feedbackMessage,
      isSuccess: isCorrect
    };
  };

  const { title, message, isSuccess } = getFeedbackContent();

  return (
    <div className="fixed bottom-4 left-0 right-0 px-4 z-50">
      <div
        className={`mx-auto max-w-3xl p-6 rounded-lg shadow-lg ${
          isSuccess ? 'bg-success-50 text-success-800 border border-success-200' : 
                     'bg-error-50 text-error-800 border border-error-200'
        }`}
      >
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="whitespace-pre-wrap break-words">{message}</p>
      </div>
    </div>
  );
};

export default Feedback;
