"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useQuizData } from '../model/useQuizData';
import { ProgressBar } from './ProgressBar';
import { QuestionCard } from './QuestionCard';
import { AnswerOptions } from './AnswerOptions';
import { ResultModal } from './ResultModal';

export const QuizPage = () => {
  const router = useRouter();
  const { 
    quizState, 
    currentQuestion, 
    progress, 
    selectAnswer, 
    resetQuiz 
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
      className="min-h-screen bg-green-100 p-6"
      style={{ 
        fontFamily: 'SBAggroOTF, Gowun Dodum, Noto Sans KR, sans-serif',
        backgroundImage: 'url(/images/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBack}
            className="mr-4 p-3 bg-white/90 backdrop-blur-sm rounded-2xl transition-all duration-300"
          >
            <ChevronLeft size={28} className="text-gray-700" strokeWidth={2.5} />
          </button>
          <h1 className="text-3xl font-black text-black">
            1단계 <span className="text-accent-primary">감정 인식</span> 퀴즈
          </h1>
        </div>
        <ProgressBar
          current={quizState.currentQuestionIndex + 1}
          total={quizState.questions.length}
          progress={progress}
        />

        <QuestionCard
          imageUrl={currentQuestion?.imageUrl || ''}
          questionNumber={quizState.currentQuestionIndex + 1}
        />

        <AnswerOptions
          options={currentQuestion?.options || []}
          onSelect={handleAnswerSelect}
        />

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