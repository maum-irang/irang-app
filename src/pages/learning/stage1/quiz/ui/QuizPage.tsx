"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuizData } from "../model/useQuizData";
import { ProgressBar } from "./ProgressBar";
import { QuestionCard } from "./QuestionCard";
import { AnswerOptions } from "./AnswerOptions";

export const QuizPage = () => {
  const router = useRouter();
  const {
    quizState,
    currentQuestion,
    progress,
    selectedAnswer,
    showResult,
    selectAnswer,
  } = useQuizData();

  useEffect(() => {
    if (quizState.isCompleted) {
      router.push("/learning/stage1/result");
    }
  }, [quizState.isCompleted, router]);

  const handleAnswerSelect = (answerIndex: number) => {
    selectAnswer(answerIndex);
  };

  if (quizState.isCompleted) {
    return (
      <div className="h-screen bg-green-100 p-4 flex flex-col items-center justify-center">
        <p className="text-xl font-bold">
          퀴즈가 완료되었습니다. 곧 결과 페이지로 이동합니다...
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
          <div className="flex-1 mx-4">
            <ProgressBar
              current={quizState.currentQuestionIndex + 1}
              total={quizState.questions.length}
              progress={progress}
            />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center mb-6">
          <QuestionCard
            imageUrl={currentQuestion?.imageUrl || ""}
            questionNumber={quizState.currentQuestionIndex + 1}
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
