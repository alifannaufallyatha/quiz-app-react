import { Question } from '../types';

interface OpenTDBResponse {
  response_code: number;
  results: {
    category: string;
    type: string;
    difficulty: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
  }[];
}

const RETRY_DELAY = 2000; // 2 seconds
const MAX_RETRIES = 3;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchQuizQuestions = async (amount: number = 10): Promise<Question[]> => {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const response = await fetch(
        `https://opentdb.com/api.php?amount=${amount}&type=multiple`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );
      
      if (response.status === 429) {
        retries++;
        console.log(`Rate limited. Attempt ${retries}/${MAX_RETRIES}. Waiting...`);
        await delay(RETRY_DELAY);
        continue;
      }

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const data: OpenTDBResponse = await response.json();

      if (data.response_code !== 0 || !data.results) {
        throw new Error('Failed to fetch questions from API');
      }

      return data.results.map((question) => ({
        id: Math.random(),
        question: decodeHTML(question.question),
        options: shuffleArray([
          ...question.incorrect_answers,
          question.correct_answer
        ].map(decodeHTML)),
        correctAnswer: decodeHTML(question.correct_answer)
      }));
    } catch (error) {
      if (retries >= MAX_RETRIES - 1) {
        console.error('Failed to fetch after multiple retries:', error);
        throw new Error('Failed to load questions after multiple attempts. Please try again later.');
      }
      retries++;
      await delay(RETRY_DELAY);
    }
  }

  throw new Error('Maximum retry attempts reached');
};

const decodeHTML = (html: string): string => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

const shuffleArray = <T>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};