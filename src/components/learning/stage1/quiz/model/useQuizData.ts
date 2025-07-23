import { useState, useEffect } from "react";
import { QuizState, QuizResult, Question } from "./quizTypes";
import {
  startCognitionSession,
  getQuizByAttemptId,
  submitQuizResult,
} from "@/shared/lib/api/quiz";

export const useQuizData = () => {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    questions: [],
    results: [],
    isCompleted: false,
    score: 0,
    startTime: new Date(),
    isLoading: true,
    error: undefined,
    attemptId: undefined,
    finalResult: undefined,
  });

  const [questionStartTime, setQuestionStartTime] = useState<Date>(new Date());
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
  const isLastQuestion =
    quizState.currentQuestionIndex === quizState.questions.length - 1;
  const progress =
    ((quizState.currentQuestionIndex + 1) / quizState.questions.length) * 100;

  const initializeQuiz = async () => {
    try {
      setQuizState(prev => ({ ...prev, isLoading: true, error: undefined }));

      const dummyUserId = "cookie-based-user";

      const sessionData = await startCognitionSession(dummyUserId);

      const quizData = await getQuizByAttemptId(sessionData.attemptId);

      const questions: Question[] = [
        {
          quizId: quizData.quizId,
          imageUrl: quizData.imageUrl,
          title: quizData.title,
          options: quizData.options,
          correctAnswer: quizData.correctIndex ?? quizData.correctAnswer,
          explanation: quizData.explanation,
        },
      ];

      setQuizState(prev => ({
        ...prev,
        questions,
        attemptId: sessionData.attemptId,
        isLoading: false,
        startTime: new Date(),
      }));

      setQuestionStartTime(new Date());
    } catch (error) {
      setQuizState(prev => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "퀴즈 초기화에 실패했습니다.",
      }));
    }
  };

  const selectAnswer = async (answerIndex: number) => {
    if (!currentQuestion || !quizState.attemptId) return;

    const endTime = new Date();
    const timeSpent = Math.round(
      (endTime.getTime() - questionStartTime.getTime()) / 1000
    );

    const isCorrectFrontend = answerIndex === currentQuestion.correctAnswer;

    setSelectedAnswer(answerIndex);
    setShowResult(true);

    try {
      const submissionData = {
        quizId: currentQuestion.quizId,
        selectedIndex: answerIndex,
      };

      const result = await submitQuizResult(submissionData);

      const quizResult: QuizResult = {
        quizId: currentQuestion.quizId,
        selectedIndex: answerIndex,
        isCorrect: result.isCorrect ?? isCorrectFrontend,
        timeSpent,
      };

      const newResults = [...quizState.results, quizResult];
      const newScore = newResults.filter(r => r.isCorrect).length;

      setQuizState(prev => ({
        ...prev,
        results: newResults,
        score: newScore,
      }));

      if (result.ended) {
        setQuizState(prev => ({
          ...prev,
          isCompleted: true,
          endTime: new Date(),
        }));
      } else {
        setTimeout(async () => {
          await loadNextQuestion();
        }, 2000);
      }
    } catch {
      setQuizState(prev => ({
        ...prev,
        error: "답안 제출에 실패했습니다.",
      }));
    }
  };

  const loadNextQuestion = async () => {
    if (!quizState.attemptId) return;

    try {
      setSelectedAnswer(null);
      setShowResult(false);

      const nextQuizData = await getQuizByAttemptId(quizState.attemptId);

      const nextQuestion: Question = {
        quizId: nextQuizData.quizId,
        imageUrl: nextQuizData.imageUrl,
        title: nextQuizData.title,
        options: nextQuizData.options,
        correctAnswer: nextQuizData.correctIndex ?? nextQuizData.correctAnswer,
        explanation: nextQuizData.explanation,
      };

      setQuizState(prev => ({
        ...prev,
        questions: [...prev.questions, nextQuestion],
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));

      setQuestionStartTime(new Date());
    } catch {
      setQuizState(prev => ({
        ...prev,
        error: "다음 문제를 불러오는데 실패했습니다.",
      }));
    }
  };

  const nextQuestion = () => {
    if (isLastQuestion) {
      setQuizState(prev => ({ ...prev, isCompleted: true }));
    } else {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));
      setSelectedAnswer(null);
      setShowResult(false);
      setQuestionStartTime(new Date());
    }
  };

  useEffect(() => {
    initializeQuiz();
  }, []);

  return {
    quizState,
    currentQuestion,
    progress,
    selectedAnswer,
    showResult,
    isLastQuestion,
    selectAnswer,
    nextQuestion,
  };
};
