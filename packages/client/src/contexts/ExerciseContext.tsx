// src/contexts/ExerciseContext.tsx

import React, { createContext, useReducer, ReactNode, useCallback } from 'react';
import { Exercise, ExerciseState, ExerciseStatus, ExerciseResult, MCQExerciseState, TextInputExerciseState, MCQExerciseResult, TextInputExerciseResult } from '../types/exercise';

interface ExerciseContextType {
  exercise: Exercise | null;
  state: ExerciseState | null;
  dispatch: React.Dispatch<ExerciseAction>;
}

type ExerciseAction =
  | { type: 'SET_EXERCISE'; payload: Exercise }
  | { type: 'UPDATE_TIME'; payload: number }
  | { type: 'SET_ANSWER'; payload: { answer: string; isCorrect: boolean; points: number } }
  | { type: 'SET_STATUS'; payload: ExerciseStatus }
  | { type: 'SET_RESULT'; payload: ExerciseResult }
  | { type: 'RESET' };

export const ExerciseContext = createContext<ExerciseContextType | undefined>(undefined);

const createInitialState = (type: 'mcq' | 'text_input'): ExerciseState => {
  const baseState = {
    status: ExerciseStatus.INITIAL,
    timeRemaining: 0,
    points: 0,
    isCorrect: null,
  };

  if (type === 'mcq') {
    return {
      ...baseState,
      selectedAnswer: null,
    } as MCQExerciseState;
  } else {
    return {
      ...baseState,
      userInput: '',
    } as TextInputExerciseState;
  }
};

function exerciseReducer(state: ExerciseState, action: ExerciseAction): ExerciseState {
  console.log('Reducer action:', action.type, 'payload:', 
    action.type !== 'RESET' ? action.payload : 'no payload');
  console.log('Current state:', state);
  
  switch (action.type) {
    case 'SET_EXERCISE':
      return {
        ...createInitialState(action.payload.type),
        timeRemaining: action.payload.timeLimit,
        status: ExerciseStatus.IN_PROGRESS,
      };
    case 'UPDATE_TIME':
      return {
        ...state,
        timeRemaining: action.payload,
      };
    case 'SET_ANSWER':
      if ('selectedAnswer' in state) {
        // MCQ Exercise
        return {
          ...state,
          selectedAnswer: action.payload.answer,
          isCorrect: action.payload.isCorrect,
          points: action.payload.points,
          status: ExerciseStatus.COMPLETED,
        } as MCQExerciseState;
      } else {
        // Text Input Exercise
        return {
          ...state,
          userInput: action.payload.answer,
          isCorrect: action.payload.isCorrect,
          points: action.payload.points,
          status: ExerciseStatus.COMPLETED,
        } as TextInputExerciseState;
      }
    case 'SET_STATUS':
      return {
        ...state,
        status: action.payload,
      };
    case 'SET_RESULT':
      if ('selectedAnswer' in state) {
        // MCQ Exercise
        const mcqResult = action.payload as MCQExerciseResult;
        return {
          ...state,
          selectedAnswer: mcqResult.selectedAnswer,
          isCorrect: mcqResult.isCorrect,
          points: mcqResult.points,
          status: ExerciseStatus.COMPLETED,
        } as MCQExerciseState;
      } else {
        // Text Input Exercise
        const textInputResult = action.payload as TextInputExerciseResult;
        return {
          ...state,
          userInput: textInputResult.userInput,
          isCorrect: textInputResult.isCorrect,
          points: textInputResult.points,
          status: ExerciseStatus.COMPLETED,
        } as TextInputExerciseState;
      }
    case 'RESET':
      return createInitialState('mcq'); // Default to MCQ for reset
    default:
      return state;
  }
}

export const ExerciseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [exercise, setExercise] = React.useState<Exercise | null>(null);
  const [state, dispatch] = useReducer(exerciseReducer, createInitialState('mcq'));

  // Memoize the wrapped dispatch function
  const wrappedDispatch = useCallback((action: ExerciseAction) => {
    console.log('Dispatching action:', action.type);
    if (action.type === 'SET_EXERCISE') {
      setExercise(action.payload);
    }
    dispatch(action);
  }, []);

  const value = React.useMemo(() => ({
    exercise,
    state,
    dispatch: wrappedDispatch,
  }), [exercise, state, wrappedDispatch]);

  return (
    <ExerciseContext.Provider value={value}>
      {children}
    </ExerciseContext.Provider>
  );
};

export default ExerciseContext;
