# quiz-app-react

# Quiz App

A React-based quiz application built with TypeScript and Tailwind CSS that allows users to take timed quizzes and track their progress.

## Features

- **Timer System**: 
  - Countdown timer for each quiz session
  - Auto-submission when time runs out
  - Display of time remaining in minutes and seconds

- **Progress Tracking**:
  - Current question indicator
  - Score calculation
  - Number of questions answered
  - Time spent on quiz

- **State Management**:
  - Local storage integration for saving quiz progress
  - Auto-save feature for answers and progress
  - Resume quiz functionality after page refresh

- **User Interface**:
  - Clean and responsive design using Tailwind CSS
  - Gradient buttons with hover effects
  - Progress indicators and timer displays
  - Result summary screen

- **Quiz Flow**:
  - Multiple choice questions
  - Immediate feedback on answers
  - Final score display
  - Retry functionality with timer reset

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Use API OpenTDB for fetching quis
- React Hooks

## Project Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

### Installation Steps

1. Clone the repository:
```bash
git clone [your-repository-url]
```

2. Navigate to project directory:
```bash
cd quiz-app-react
```

3. Install dependencies:
```bash
npm install
```

4. Install required peer dependencies:
```bash
npm install react react-dom typescript @types/react @types/react-dom
npm install -D tailwindcss postcss autoprefixer
```

5. Initialize Tailwind CSS:
```bash
npx tailwindcss init -p
```

6. Start the development server:
```bash
npm start
```

The application will open in your default browser at `http://localhost:3000`

## Project Structure

```
quiz-app-react/
├── src/
│   ├── components/
│   │   ├── Quiz.tsx
│   │   └── Result.tsx
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── storage.ts
│   └── App.tsx
├── public/
├── package.json
└── tailwind.config.js
```

## Local Storage

The app uses browser's Local Storage to:
- Save current quiz progress
- Store user's answers
- Maintain timer state
- Enable quiz resumption after page refresh
