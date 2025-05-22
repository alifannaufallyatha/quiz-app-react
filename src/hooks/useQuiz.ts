import { useState, useCallback } from 'react';
import { Question } from '../types';

interface QuizState {
  currentQuestion: number;
  score: number;
  isFinished: boolean;
  answers: string[];
}

export const useQuiz = (questions: Question[]) => {
  const [state, setState] = useState<QuizState>({
    currentQuestion: 0,
    score: 0,
    isFinished: false,
    answers: [],
  });

  const handleAnswer = useCallback((answer: string) => {
    const currentQuestion = questions[state.currentQuestion];
    const isCorrect = answer === currentQuestion.correctAnswer;

    setState(prev => ({
      ...prev,
      score: isCorrect ? prev.score + 1 : prev.score,
      answers: [...prev.answers, answer],
      currentQuestion: prev.currentQuestion + 1,
      isFinished: prev.currentQuestion + 1 >= questions.length,
    }));
  }, [state.currentQuestion, questions]);

  const resetQuiz = useCallback(() => {
    setState({
      currentQuestion: 0,
      score: 0,
      isFinished: false,
      answers: [],
    });
  }, []);

  return {
    currentQuestion: state.currentQuestion,
    score: state.score,
    isFinished: state.isFinished,
    answers: state.answers,
    handleAnswer,
    resetQuiz,
    totalQuestions: questions.length,
  };
};