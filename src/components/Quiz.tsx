import React, { useState, useEffect } from "react";
import { Question } from "../types";
import Result from "./Result";
import { saveQuizState, loadQuizState } from "../utils/storage";



interface QuizState {
  currentQuestion: number;
  score: number;
  timeLeft: number;
  answers: string[];
  isComplete: boolean;
  showResult: boolean; // Add this line
}

interface QuizProps {
  questions: Question[];
  timeLimit: number; // in seconds
  timeSpent: number;
  onTryAgain: () => void;
  
}

const Quiz: React.FC<QuizProps> = ({ questions, timeLimit }) => {
  const [refreshKey, setRefreshKey] = useState(0); // Add this line
  const [state, setState] = useState<QuizState>(() => {
    const saved = loadQuizState();
    return (
      saved || {
        currentQuestion: 0,
        score: 0,
        timeLeft: timeLimit,
        answers: [],
        isComplete: false,
        showResult: false,
      }
    );
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setState((prev) => {
        if (prev.timeLeft <= 0 || prev.isComplete) {
          clearInterval(timer);
          return { ...prev, isComplete: true, showResult: true };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [refreshKey]);

  useEffect(() => {
    saveQuizState(state);
  }, [state]);

  const handleAnswer = (answer: string) => {
    const isCorrect = answer === questions[state.currentQuestion].correctAnswer;
    setState((prev) => ({
      ...prev,
      score: isCorrect ? prev.score + 1 : prev.score,
      answers: [...prev.answers, answer],
      currentQuestion: prev.currentQuestion + 1,
      isComplete: prev.currentQuestion + 1 >= questions.length,
      showResult: prev.currentQuestion + 1 >= questions.length,
    }));
  };

  const handleRetry = () => {
    setState({
      currentQuestion: 0,
      score: 0,
      timeLeft: timeLimit,
      answers: [],
      isComplete: false,
      showResult: false,
    });
    setRefreshKey(prev => prev + 1); // Add this line to trigger useEffect
    window.scrollTo(0, 0); // Optional: scroll to top of page
  };
  

  if (state.showResult || state.timeLeft <= 0) {
    const timeSpentSeconds = timeLimit - state.timeLeft;
    // If timer ran out, show actual time spent. If completed early, show time taken
    const actualTimeSpent = state.timeLeft <= 0 ? timeLimit : timeSpentSeconds;
    
    return (
      <Result
        score={state.score}
        totalQuestions={questions.length}
        answeredQuestions={state.answers.length}
        timeSpent={actualTimeSpent}
        onRetry={handleRetry}
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
    {questions[state.currentQuestion].question}
  </div>

  <div className="grid grid-cols-1 gap-4">
    {questions[state.currentQuestion].options.map((option) => (
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
