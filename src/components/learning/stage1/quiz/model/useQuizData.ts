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
      console.log("🚀 퀴즈 초기화 시작 (쿠키 기반)");
      setQuizState(prev => ({ ...prev, isLoading: true, error: undefined }));

      const dummyUserId = "cookie-based-user";

      const sessionData = await startCognitionSession(dummyUserId);
      console.log("✅ 세션 시작 성공:", sessionData);

      const quizData = await getQuizByAttemptId(sessionData.attemptId);
      console.log("✅ 퀴즈 가져오기 성공:", quizData);
      console.log(
        "🎯 correctIndex:",
        quizData.correctIndex,
        "타입:",
        typeof quizData.correctIndex
      );
      console.log(
        "🎯 correctAnswer:",
        quizData.correctAnswer,
        "타입:",
        typeof quizData.correctAnswer
      );

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
      console.error("❌ 퀴즈 초기화 오류:", error);
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
    console.log("🎯 선택한 답안:", answerIndex);
    console.log("🎯 정답 인덱스:", currentQuestion.correctAnswer);
    console.log("🎯 프론트엔드 정답 여부:", isCorrectFrontend);

    setSelectedAnswer(answerIndex);
    setShowResult(true);

    try {
      const submissionData = {
        quizId: currentQuestion.quizId,
        selectedIndex: answerIndex,
      };

      console.log("📝 답안 제출:", submissionData);

      const result = await submitQuizResult(submissionData);
      console.log("✅ 제출 성공:", result);
      console.log("🔍 백엔드 isCorrect:", result.isCorrect);
      console.log("🔍 프론트엔드 isCorrect:", isCorrectFrontend);
      console.log(
        "🔍 둘이 일치하는가?",
        result.isCorrect === isCorrectFrontend
      );

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
        console.log("🎉 퀴즈 완료!");
        setQuizState(prev => ({
          ...prev,
          isCompleted: true,
          endTime: new Date(),
        }));
      } else {
        console.log("➡️ 다음 문제 로딩... (2초 후)");
        setTimeout(async () => {
          await loadNextQuestion();
        }, 2000);
      }
    } catch (error) {
      console.error("❌ 답안 제출 오류:", error);
      setQuizState(prev => ({
        ...prev,
        error: "답안 제출에 실패했습니다.",
      }));
    }
  };

  const loadNextQuestion = async () => {
    if (!quizState.attemptId) return;

    try {
      console.log("🔄 다음 문제 가져오기...");
      setSelectedAnswer(null);
      setShowResult(false);

      const nextQuizData = await getQuizByAttemptId(quizState.attemptId);
      console.log("✅ 다음 문제 로드 성공:", nextQuizData);
      console.log(
        "🎯 다음 문제 correctIndex:",
        nextQuizData.correctIndex,
        "타입:",
        typeof nextQuizData.correctIndex
      );
      console.log(
        "🎯 다음 문제 correctAnswer:",
        nextQuizData.correctAnswer,
        "타입:",
        typeof nextQuizData.correctAnswer
      );

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
    } catch (error) {
      console.error("❌ 다음 문제 로딩 오류:", error);
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
