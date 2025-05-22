
export interface QuizProps {
  questions: Question[];
  timeLimit: number; // in seconds
  timeSpent: number;
  onTryAgain: () => void;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface User {
  username: string;
  isAuthenticated: boolean;
}


export interface QuizState {
  currentQuestion: number;
  score: number;
  timeLeft: number;
  answers: string[];
  isComplete: boolean;
  showResult: boolean;
}


export interface QuizContextType {
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
}

export type QuizAction =
  | { type: 'SET_ANSWER'; payload: string }
  | { type: 'NEXT_QUESTION' }
  | { type: 'RESTART' }
  | { type: 'SET_TIME'; payload: number };