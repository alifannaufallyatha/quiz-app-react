import React, { useState, useEffect } from 'react';
import { Question, QuizState } from '../types';
import Result from './Result';
import { saveQuizState, loadQuizState } from '../utils/storage';

interface QuizProps {
  questions: Question[];
  timeLimit: number;
}

const Quiz: React.FC<QuizProps> = ({ questions, timeLimit }) => {
  const [state, setState] = useState<QuizState>(() => {
    const saved = loadQuizState();
    return saved || {
      currentQuestion: 0,
      score: 0,
      timeLeft: timeLimit,
      answers: [],
      isComplete: false,
      showResult: false,
    };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setState(prev => {
        if (prev.timeLeft <= 0 || prev.isComplete) {
          clearInterval(timer);
          return { ...prev, isComplete: true, showResult: true };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    saveQuizState(state);
  }, [state]);

  // Early return if no questions are available
  if (!questions || questions.length === 0) {
    return (
      <div className="text-center">
        <p className="text-xl text-gray-600">No questions available</p>
      </div>
    );
  }

  const currentQuestion = questions[state.currentQuestion];

  // Early return if current question is undefined
  if (!currentQuestion) {
    return (
      <div className="text-center">
        <p className="text-xl text-red-600">Error loading question</p>
      </div>
    );
  }

  const handleAnswer = (answer: string) => {
    const isCorrect = answer === currentQuestion.correctAnswer;
    setState(prev => ({
      ...prev,
      score: isCorrect ? prev.score + 1 : prev.score,
      answers: [...prev.answers, answer],
      currentQuestion: prev.currentQuestion + 1,
      isComplete: prev.currentQuestion + 1 >= questions.length,
      showResult: prev.currentQuestion + 1 >= questions.length
    }));
  };

  if (state.showResult || state.timeLeft <= 0) {
    return (
      <Result
        score={state.score}
        totalQuestions={questions.length}
        answeredQuestions={state.answers.length}
        timeSpent={timeLimit - state.timeLeft}
        onRetry={() => setState({
          currentQuestion: 0,
          score: 0,
          timeLeft: timeLimit,
          answers: [],
          isComplete: false,
          showResult: false,
        })}
        onLogout={() => {/* Add your logout logic here */}}
      />
    );
  }

  return (
<div className="space-y-6 bg-white p-6 rounded-2xl shadow-xl">
  <div className="flex justify-between items-center text-sm text-gray-600">
    <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
      Question {state.currentQuestion + 1} / {questions.length}
    </div>
    <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-semibold">
      Time Left: {Math.floor(state.timeLeft / 60)}:{(state.timeLeft % 60).toString().padStart(2, '0')}
    </div>
  </div>

  <div className="text-2xl font-semibold text-gray-800">
    {currentQuestion.question}
  </div>

  <div className="grid grid-cols-1 gap-4">
    {currentQuestion.options.map((option) => (
      <button
        key={option}
        onClick={() => handleAnswer(option)}
        className="w-full text-left px-4 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-all duration-200 font-medium text-gray-700 shadow-sm"
      >
        {option}
      </button>
    ))}
  </div>
</div>

  );
};

export default Quiz;