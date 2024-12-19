// client/src/contexts/ExerciseSessionContext.tsx
import React, { createContext, useReducer, ReactNode, useMemo } from 'react';
import { Exercise } from '../types/exercise';
import { ExerciseSession, ExerciseSessionState, SessionAction, SessionStats } from '../types/session';

interface ExerciseSessionContextType {
  state: ExerciseSessionState;
  dispatch: React.Dispatch<SessionAction>;
  currentExercise: Exercise | null;
  stats: SessionStats | null;
}

const calculateStats = (session: ExerciseSession): SessionStats => {
  const { results, exercises, startTime, endTime = Date.now() } = session;
  const totalExercises = exercises.length;
  const completedExercises = results.length;
  const correctAnswers = results.filter(r => r.isCorrect).length;
  const totalPoints = results.reduce((sum, r) => sum + r.points, 0);
  const totalTime = endTime - startTime;
  
  return {
    totalExercises,
    completedExercises,
    correctAnswers,
    totalPoints,
    averageTimePerExercise: completedExercises ? totalTime / completedExercises : 0,
    accuracy: completedExercises ? (correctAnswers / completedExercises) * 100 : 0,
  };
};

const initialState: ExerciseSessionState = {
  session: null,
  loading: false,
  error: null,
  stats: null,
};

function sessionReducer(state: ExerciseSessionState, action: SessionAction): ExerciseSessionState {
  switch (action.type) {
    case 'START_SESSION': {
      return {
        ...state,
        session: {
          currentExerciseIndex: 0,
          exercises: action.payload,
          results: [],
          totalPoints: 0,
          startTime: Date.now(),
          isComplete: false,
        },
        loading: false,
        error: null,
        stats: null,
      };
    }

    case 'NEXT_EXERCISE': {
      if (!state.session) return state;
      
      const nextIndex = state.session.currentExerciseIndex + 1;
      const isComplete = nextIndex >= state.session.exercises.length;
      const updatedSession = {
        ...state.session,
        currentExerciseIndex: nextIndex,
        isComplete,
        endTime: isComplete ? Date.now() : undefined,
      };
      
      return {
        ...state,
        session: updatedSession,
        stats: isComplete ? calculateStats(updatedSession) : state.stats,
      };
    }

    case 'ADD_RESULT': {
      if (!state.session) return state;
      
      const updatedSession = {
        ...state.session,
        results: [...state.session.results, action.payload],
        totalPoints: state.session.totalPoints + action.payload.points,
      };

      return {
        ...state,
        session: updatedSession,
        stats: updatedSession.isComplete ? calculateStats(updatedSession) : null,
      };
    }

    case 'COMPLETE_SESSION': {
      if (!state.session) return state;
      
      const completedSession = {
        ...state.session,
        isComplete: true,
        endTime: Date.now(),
      };

      return {
        ...state,
        session: completedSession,
        stats: calculateStats(completedSession),
      };
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

    case 'RESET_SESSION': {
      return initialState;
    }

    default:
      return state;
  }
}

export const ExerciseSessionContext = createContext<ExerciseSessionContextType | undefined>(undefined);

export const ExerciseSessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(sessionReducer, initialState);

  const currentExercise = useMemo(() => {
    if (!state.session) return null;
    return state.session.exercises[state.session.currentExerciseIndex] || null;
  }, [state.session]);

  const value = useMemo(() => ({
    state,
    dispatch,
    currentExercise,
    stats: state.stats,
  }), [state, currentExercise]);

  return (
    <ExerciseSessionContext.Provider value={value}>
      {children}
    </ExerciseSessionContext.Provider>
  );
};

export default ExerciseSessionContext;