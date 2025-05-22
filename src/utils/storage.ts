import { QuizState } from '../types';



export const loadQuizState = (): QuizState | null => {
    try {
      const saved = localStorage.getItem('quizState');
      if (!saved) return null;
  
      const parsedState = JSON.parse(saved);
      // Ensure all required properties exist
      if (
        'currentQuestion' in parsedState &&
        'score' in parsedState &&
        'timeLeft' in parsedState &&
        'answers' in parsedState &&
        'isComplete' in parsedState &&
        'showResult' in parsedState
      ) {
        return parsedState as QuizState;
      }
      return null;
    } catch (error) {
      console.error('Error loading quiz state:', error);
      return null;
    }
  };
  
  export const saveQuizState = (state: QuizState): void => {
    try {
      localStorage.setItem('quizState', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving quiz state:', error);
    }
  };

export const clearQuizState = (): void => {
  try {
    localStorage.removeItem('quizState');
  } catch (error) {
    console.error('Error clearing quiz state:', error);
  }
};

export const hasSavedQuiz = (): boolean => {
  return localStorage.getItem('quizState') !== null;
};