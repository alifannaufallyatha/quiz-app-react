import React, { useState, useEffect, useRef } from 'react';
import Login from './components/Login';
import Quiz from './components/Quiz';
import { fetchQuizQuestions } from './service/quizService';
import './styles/index.css';
import { Question } from './types';

function App() {
  const [user, setUser] = useState<string | null>(() => {
    return localStorage.getItem('user');
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [quizKey, setQuizKey] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer functions
  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimeSpent(0);
    timerRef.current = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const fetchedQuestions = await fetchQuizQuestions(10);
        setQuestions(fetchedQuestions);
        startTimer(); // Start timer when questions are loaded
      } catch (err) {
        setError('Failed to load questions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadQuestions();
    }
  }, [user]);

  const handleLogin = async (username: string) => {
    try {
      if (!username.trim()) {
        throw new Error('Username cannot be empty');
      }
      
      localStorage.setItem('user', username.trim());
      setUser(username.trim());
      
      setLoading(true);
      const fetchedQuestions = await fetchQuizQuestions(10);
      setQuestions(fetchedQuestions);
      setError(null);
      startTimer(); // Start timer on successful login
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      localStorage.removeItem('user');
      setUser(null);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    try {
      stopTimer(); // Stop timer on logout
      localStorage.removeItem('user');
      localStorage.removeItem('quizProgress');
      localStorage.removeItem('timeSpent');
      
      setUser(null);
      setQuestions([]);
      setLoading(false);
      setError(null);
      setTimeSpent(0);
    } catch (err) {
      console.error('Error during logout:', err);
      setUser(null);
      setQuestions([]);
    }
  };

  const handleTryAgain = async () => {
    try {
      setError(null);
      const fetchedQuestions = await fetchQuizQuestions(10);
      setQuestions(fetchedQuestions);
      setQuizKey(prev => prev + 1);
      startTimer(); // Restart timer when trying again
      startTimer(); // Restart timer when trying again
    } catch (err) {
      setError('Failed to load questions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
        <button 
          onClick={handleTryAgain} 
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading questions...</div>
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="flex justify-between items-center mb-4">
            <div>Welcome, {user}!</div>
          </div>
          <Quiz 
            key={quizKey}
            questions={questions} 
            timeLimit={300}
            timeSpent={timeSpent}
            onTryAgain={handleTryAgain}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </div>
  );
}

export default App;