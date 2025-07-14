"use client";
import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Volume2 } from "lucide-react";

const expressions = ["웃어보세요!", "찡그려보세요!", "놀란 표정 지어보세요!"];

export const Stage3QuizPage = () => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(() =>
        setError("카메라 접근이 불가능합니다. 권한을 허용해 주세요.")
      );
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach(track => track.stop());
      }
    };
  }, []);

  const handleNext = () => {
    if (step < expressions.length - 1) {
      setStep(step + 1);
    } else {
      router.push("/learning/stage3/result");
    }
  };

  const handleTTS = () => {
    window.speechSynthesis.speak(
      new SpeechSynthesisUtterance(expressions[step])
    );
  };

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        <div className="mb-4 w-full flex justify-center">
          <span className="text-lg font-black text-gray-700 bg-white/80 rounded-full px-6 py-2 shadow-sm">
            {expressions[step]}
          </span>
        </div>
        <div className="relative w-full flex justify-center mb-8">
          <div className="w-[600px] h-[400px] bg-gray-100 rounded-3xl flex items-center justify-center overflow-hidden shadow-lg border-2 border-gray-200">
            {error ? (
              <span className="text-red-500 font-bold">{error}</span>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover rounded-3xl"
              />
            )}
          </div>
          <button
            onClick={handleTTS}
            className="absolute bottom-4 right-4 bg-purple-500 text-white rounded-full p-3 shadow-md hover:bg-purple-600 transition-all duration-200 flex items-center justify-center"
            style={{ width: 48, height: 48 }}
            title="다시 듣기"
          >
            <Volume2 size={24} />
          </button>
        </div>
        <button
          onClick={handleNext}
          className="w-full max-w-md py-5 bg-blue-500 text-white rounded-2xl font-black text-xl transition-all duration-300 active:scale-95 hover:bg-blue-600 shadow-md"
        >
          {step < expressions.length - 1 ? "다음" : "완료"}
        </button>
      </div>
    </div>
  );
};
