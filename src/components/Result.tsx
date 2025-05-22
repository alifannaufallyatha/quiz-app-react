import React from 'react';

interface ResultProps {
  score: number;
  totalQuestions: number;
  answeredQuestions: number;
  timeSpent: number;
  onRetry: () => void;
}

const Result: React.FC<ResultProps> = ({ score, totalQuestions, answeredQuestions, timeSpent, onRetry }) => {
  return (
    <div className="text-center space-y-6 bg-white p-8 rounded-2xl shadow-2xl max-w-md mx-auto">
  <h2 className="text-3xl font-extrabold text-green-600 flex justify-center items-center gap-2">
    🎉 Quiz Complete!
  </h2>

  <p className="text-xl text-gray-800">
    🏆 <span className="font-semibold text-blue-600">{score}</span> out of {totalQuestions}
  </p>

  <p className="text-md text-gray-600">
    ✅ Answered: <span className="font-medium">{answeredQuestions}</span> <br />
    ⏱️ Time Spent: <span className="font-medium">{timeSpent}s</span>
  </p>

  <button
    onClick={onRetry}
    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-lg rounded-xl font-semibold shadow-md hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
  >
    🔁 Try Again
  </button>
</div>

  );
};

export default Result;