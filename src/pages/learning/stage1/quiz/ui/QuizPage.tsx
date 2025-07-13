"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useQuizData } from '../model/useQuizData';
import { ProgressBar } from './ProgressBar';
import { QuestionCard } from './QuestionCard';
import { AnswerOptions } from './AnswerOptions';
import { ResultModal } from './ResultModal';
import { Timer } from './Timer';

export const QuizPage = () => {
  const router = useRouter();
  const {
    quizState,
    currentQuestion,
    progress,
    selectedAnswer,
    showResult,
    selectAnswer,
    resetQuiz,
    questionStartTime
  } = useQuizData();

  const handleBack = () => {
    router.back();
  };

  const handleAnswerSelect = (answerIndex: number) => {
    selectAnswer(answerIndex);
  };

  const handleCloseResult = () => {
    router.push('/attendance');
  };

  return (
    <div
      className="h-screen bg-green-100 p-4 flex flex-col"
      style={{
        fontFamily: 'SBAggroOTF, Gowun Dodum, Noto Sans KR, sans-serif',
        backgroundImage: 'url(/images/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-2xl mx-auto w-full h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleBack}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-xl transition-all duration-300"
          >
            <ChevronLeft size={20} className="text-gray-700" strokeWidth={2.5} />
          </button>
          
          <div className="flex-1 mx-4">
            <ProgressBar
              current={quizState.currentQuestionIndex + 1}
              total={quizState.questions.length}
              progress={progress}
            />
          </div>
          
          <Timer 
            startTime={questionStartTime}
            isActive={!showResult}
          />
        </div>

        <div className="flex-1 flex items-center justify-center mb-6">
          <QuestionCard
            imageUrl={currentQuestion?.imageUrl || ''}
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
        <ResultModal
          isOpen={quizState.isCompleted}
          score={quizState.score}
          total={quizState.questions.length}
          onClose={handleCloseResult}
          onRestart={resetQuiz}
        />
      </div>
    </div>
  );
};