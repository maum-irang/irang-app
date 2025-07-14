import { useState, useEffect } from "react";
import { QuizState, QuizResult } from "./quizTypes";
import { mockQuestions } from "./mockQuestions";

export const useQuizData = () => {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    questions: mockQuestions,
    results: [],
    isCompleted: false,
    score: 0,
    startTime: new Date(),
  });

  const [questionStartTime, setQuestionStartTime] = useState<Date>(new Date());
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
  const isLastQuestion =
    quizState.currentQuestionIndex === quizState.questions.length - 1;
  const progress =
    ((quizState.currentQuestionIndex + 1) / quizState.questions.length) * 100;

  useEffect(() => {
    setQuestionStartTime(new Date());
    setSelectedAnswer(null);
    setShowResult(false);
  }, [quizState.currentQuestionIndex]);

  const selectAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    const responseTime = (Date.now() - questionStartTime.getTime()) / 1000;
    const isCorrect = answerIndex === currentQuestion.correctAnswer;

    setSelectedAnswer(answerIndex);
    setShowResult(true);

    const result: QuizResult = {
      questionId: currentQuestion.id,
      selectedAnswer: answerIndex,
      isCorrect,
      timeSpent: responseTime,
    };

    const newResults = [...quizState.results, result];
    const newScore = newResults.filter(r => r.isCorrect).length;

    setTimeout(() => {
      if (isLastQuestion) {
        setQuizState(prev => ({
          ...prev,
          results: newResults,
          score: newScore,
          isCompleted: true,
          endTime: new Date(),
        }));
      } else {
        setQuizState(prev => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          results: newResults,
          score: newScore,
        }));
      }
    }, 2000);
  };

  const resetQuiz = () => {
    setQuizState({
      currentQuestionIndex: 0,
      questions: mockQuestions,
      results: [],
      isCompleted: false,
      score: 0,
      startTime: new Date(),
    });
    setQuestionStartTime(new Date());
    setSelectedAnswer(null);
    setShowResult(false);
  };

  return {
    quizState,
    currentQuestion,
    isLastQuestion,
    progress,
    selectedAnswer,
    showResult,
    selectAnswer,
    resetQuiz,
    questionStartTime,
  };
};
