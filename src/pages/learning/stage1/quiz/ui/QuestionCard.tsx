'use client'
import React, { useState } from 'react';
import Image from 'next/image';

interface QuestionCardProps {
  imageUrl: string;
  questionNumber: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ imageUrl, questionNumber }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div 
      className="bg-white rounded-3xl overflow-hidden relative"
      style={{ 
        width: '100%',
        maxWidth: '500px',
        height: '300px',
        border: '3px solid rgba(255,255,255,0.8)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}
    >
      {imageError ? (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-2">😊</div>
            <p className="text-lg font-bold text-gray-600">표정 이미지</p>
          </div>
        </div>
      ) : (
        <>
          <Image
            src={imageUrl}
            alt={`감정 표현 이미지 ${questionNumber}`}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
            priority={questionNumber <= 2}  
          />
        </>
      )}
    </div>
  );
};