"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuizData } from "../model/useQuizData";
import { QuestionCard } from "./QuestionCard";
import { AnswerOptions } from "./AnswerOptions";

export const QuizPage = () => {
  const router = useRouter();
  const {
    quizState,
    currentQuestion,
    selectedAnswer,
    showResult,
    selectAnswer,
  } = useQuizData();

  useEffect(() => {
    if (quizState.isCompleted && quizState.attemptId) {
      router.push(`/learning/stage1/result?attemptId=${quizState.attemptId}`);
    }
  }, [quizState.isCompleted, quizState.attemptId, router]);

  const handleAnswerSelect = (answerIndex: number) => {
    selectAnswer(answerIndex);
  };

  const debugLocalStorage = () => {
    console.log("🔍 전체 localStorage 내용:");
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key!);
      console.log(`${key}:`, value);
    }
  };

  if (quizState.isLoading) {
    return (
      <div className="h-screen bg-green-100 p-4 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-xl font-bold font-normal">
            퀴즈를 준비하고 있어요...
          </p>
        </div>
      </div>
    );
  }

  if (quizState.error) {
    return (
      <div className="h-screen bg-green-100 p-4 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😅</div>
          <p className="text-xl font-bold font-normal mb-4 text-red-600">
            앗! 문제가 발생했어요
          </p>
          <p className="text-lg mb-6 text-gray-700">{quizState.error}</p>

          <div className="flex flex-col gap-3 mb-6">
            <button
              onClick={debugLocalStorage}
              className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full transition-colors text-sm"
            >
              🔍 localStorage 확인
            </button>
            <button
              onClick={() => {
                console.log("🗑️ localStorage 초기화");
                localStorage.clear();
                window.location.reload();
              }}
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full transition-colors text-sm"
            >
              🗑️ 데이터 초기화
            </button>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="bg-purple-400 hover:bg-purple-500 text-white font-bold py-2 px-6 rounded-full transition-colors"
          >
            다시 시도하기
          </button>
        </div>
      </div>
    );
  }

  if (!quizState.attemptId) {
    return (
      <div className="h-screen bg-green-100 p-4 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="text-6xl mb-4">🔄</div>
          </div>
          <p className="text-xl font-bold font-normal">
            퀴즈 세션을 초기화하고 있어요...
          </p>
        </div>
      </div>
    );
  }

  if (quizState.isCompleted) {
    return (
      <div className="h-screen bg-green-100 p-4 flex flex-col items-center justify-center">
        <p className="text-xl font-bold font-normal">
          퀴즈를 완료했어! 곧 결과 페이지로 이동될거야...
        </p>
      </div>
    );
  }

  return (
    <div
      className="h-screen bg-green-100 p-4 flex flex-col"
      style={{
        fontFamily: "SBAggroOTF, Gowun Dodum, Noto Sans KR, sans-serif",
        backgroundImage: "url(/images/background.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-2xl mx-auto w-full h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 mx-4"></div>
        </div>

        <div className="flex-1 flex items-center justify-center mb-6">
          <QuestionCard
            imageUrl={currentQuestion?.imageUrl || ""}
            questionNumber={quizState.currentQuestionIndex + 1}
            title={currentQuestion?.title}
          />
        </div>

        <div className="mb-4">
          <AnswerOptions
            options={currentQuestion?.options || []}
            selectedAnswer={selectedAnswer}
            correctAnswer={currentQuestion?.correctAnswer || 0}
            showResult={showResult}
            onSelect={handleAnswerSelect}
          />
        </div>
      </div>
    </div>
  );
};
