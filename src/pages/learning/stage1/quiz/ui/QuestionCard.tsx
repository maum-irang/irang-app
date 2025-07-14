"use client";
import React, { useState } from "react";
interface QuestionCardProps {
  imageUrl: string;
  questionNumber: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  imageUrl,
  questionNumber,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="bg-gray-50 rounded-3xl overflow-hidden relative flex flex-col items-center justify-center"
      style={{
        width: "100%",
        maxWidth: "600px",
        height: "340px",
        boxShadow: "0 8px 32px rgba(168,139,250,0)",
      }}
    >
      <span className="absolute top-4 left-4 bg-purple-400 text-white text-lg font-black px-5 py-2 rounded-full">
        Q{questionNumber}
      </span>
      {imageError ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-7xl mb-2">😊</div>
            <p className="text-xl font-bold text-purple-500">표정 이미지</p>
          </div>
        </div>
      ) : (
        <>
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={imageUrl}
              alt={`감정 표현 이미지 ${questionNumber}`}
              className="object-contain max-h-[220px] mx-auto"
              onError={() => setImageError(true)}
              style={{ maxWidth: "90%", maxHeight: "220px" }}
            />
          </div>
        </>
      )}
    </div>
  );
};
