import { useState, useEffect } from 'react';
import { QuizState, Question, QuizResult } from './quizTypes';
import { mockQuestions } from './mockQuestions';

export const useQuizData = () => {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    questions: mockQuestions,
    results: [],
    isCompleted: false,
    score: 0,
    startTime: new Date()
  });

  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
  const isLastQuestion = quizState.currentQuestionIndex === quizState.questions.length - 1;
  const progress = ((quizState.currentQuestionIndex + 1) / quizState.questions.length) * 100;

  const selectAnswer = (answerIndex: number) => {
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    const result: QuizResult = {
      questionId: currentQuestion.id,
      selectedAnswer: answerIndex,
      isCorrect,
      timeSpent: Date.now() - quizState.startTime.getTime()
    };

    const newResults = [...quizState.results, result];
    const newScore = newResults.filter(r => r.isCorrect).length;

    if (isLastQuestion) {
      setQuizState(prev => ({
        ...prev,
        results: newResults,
        score: newScore,
        isCompleted: true,
        endTime: new Date()
      }));
    } else {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        results: newResults,
        score: newScore
      }));
    }
  };

  const resetQuiz = () => {
    setQuizState({
      currentQuestionIndex: 0,
      questions: mockQuestions,
      results: [],
      isCompleted: false,
      score: 0,
      startTime: new Date()
    });
  };

  return {
    quizState,
    currentQuestion,
    isLastQuestion,
    progress,
    selectAnswer,
    resetQuiz
  };
};