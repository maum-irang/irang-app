export interface Question {
  quizId: string;
  imageUrl: string;
  title: string;
  options: string[];
  correctAnswer?: number;
  explanation?: string;
}

export interface QuizResult {
  quizId: string;
  selectedIndex: number;
  isCorrect?: boolean;
  timeSpent?: number;
}

export interface FinalQuizResult {
  sessionId: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  averageTimeSeconds: number;
  startTime: string;
  endTime: string;
  duration: number;
  quizzes: {
    quizId: string;
    isCorrect: boolean;
    selectedOption: string;
    correctOption: string;
    timeTakenSeconds: number;
    answeredAt: string;
  }[];
}

export interface QuizState {
  currentQuestionIndex: number;
  questions: Question[];
  results: QuizResult[];
  isCompleted: boolean;
  score: number;
  startTime: Date;
  endTime?: Date;
  isLoading: boolean;
  error?: string;
  attemptId?: string;
  finalResult?: FinalQuizResult;
}
