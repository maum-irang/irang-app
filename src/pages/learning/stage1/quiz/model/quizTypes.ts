export interface Question {
    id: number;
    imageUrl: string;
    emotion: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  }
  
  export interface QuizResult {
    questionId: number;
    selectedAnswer: number;
    isCorrect: boolean;
    timeSpent: number;
  }
  
  export interface QuizState {
    currentQuestionIndex: number;
    questions: Question[];
    results: QuizResult[];
    isCompleted: boolean;
    score: number;
    startTime: Date;
    endTime?: Date;
  }