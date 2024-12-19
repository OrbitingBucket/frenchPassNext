// client/src/contexts/ExerciseContext.tsx
import React, { createContext, useReducer, ReactNode, useCallback, useMemo } from 'react';
import { Exercise, ExerciseState, ExerciseStatus, ExerciseResult, MCQExerciseResult, TextInputExerciseResult } from '../types/exercise';

interface ExerciseContextState {
  exercise: Exercise | null;
  state: ExerciseState | null;
  loading: boolean;
  error: string | null;
}

interface ExerciseContextType extends ExerciseContextState {
  dispatch: React.Dispatch<ExerciseAction>;
}

type ExerciseAction =
  | { type: 'SET_EXERCISE'; payload: Exercise }
  | { type: 'UPDATE_TIME'; payload: number }
  | { type: 'SET_ANSWER'; payload: { answer: string; isCorrect: boolean; points: number } }
  | { type: 'SET_STATUS'; payload: ExerciseStatus }
  | { type: 'SET_RESULT'; payload: ExerciseResult }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
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
    } as ExerciseState;
  } else {
    return {
      ...baseState,
      userInput: '',
    } as ExerciseState;
  }
};

const initialContextState: ExerciseContextState = {
  exercise: null,
  state: null,
  loading: false,
  error: null,
};

function exerciseReducer(
  state: ExerciseContextState,
  action: ExerciseAction
): ExerciseContextState {
  switch (action.type) {
    case 'SET_EXERCISE': {
      return {
        ...state,
        exercise: action.payload,
        state: createInitialState(action.payload.type),
        loading: false,
        error: null,
      };
    }

    case 'UPDATE_TIME': {
      if (!state.state) return state;
      return {
        ...state,
        state: {
          ...state.state,
          timeRemaining: action.payload,
        },
      };
    }

    case 'SET_ANSWER': {
      if (!state.state || !state.exercise) return state;

      const newState = {
        ...state.state,
        isCorrect: action.payload.isCorrect,
        points: action.payload.points,
        status: ExerciseStatus.COMPLETED,
      };

      if ('selectedAnswer' in state.state) {
        return {
          ...state,
          state: {
            ...newState,
            selectedAnswer: action.payload.answer,
          },
        };
      } else {
        return {
          ...state,
          state: {
            ...newState,
            userInput: action.payload.answer,
          },
        };
      }
    }

    case 'SET_STATUS': {
      if (!state.state) return state;
      return {
        ...state,
        state: {
          ...state.state,
          status: action.payload,
        },
      };
    }

    case 'SET_RESULT': {
      if (!state.state) return state;

      const newState = {
        ...state.state,
        isCorrect: action.payload.isCorrect,
        points: action.payload.points,
        status: ExerciseStatus.COMPLETED,
      };

      if ('selectedAnswer' in state.state && 'selectedAnswer' in action.payload) {
        const mcqResult = action.payload as MCQExerciseResult;
        return {
          ...state,
          state: {
            ...newState,
            selectedAnswer: mcqResult.selectedAnswer,
          },
        };
      } else if ('userInput' in state.state && 'userInput' in action.payload) {
        const textInputResult = action.payload as TextInputExerciseResult;
        return {
          ...state,
          state: {
            ...newState,
            userInput: textInputResult.userInput,
          },
        };
      }
      return state;
    }

    case 'SET_LOADING': {
      return {
        ...state,
        loading: action.payload,
      };
    }

    case 'SET_ERROR': {
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    }

    case 'RESET': {
      return initialContextState;
    }

    default:
      return state;
  }
}

export const ExerciseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(exerciseReducer, initialContextState);

  const wrappedDispatch = useCallback((action: ExerciseAction) => {
    console.log('Dispatching action:', action.type);
    dispatch(action);
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      dispatch: wrappedDispatch,
    }),
    [state, wrappedDispatch]
  );

  return (
    <ExerciseContext.Provider value={value}>
      {children}
    </ExerciseContext.Provider>
  );
};

export default ExerciseContext;
