"use client";
import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Volume2, ChevronLeft } from "lucide-react";

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

  const handleBack = () => {
    router.push("/learning/stage3/cam-test");
  };

  const handleNext = () => {
    if (step < expressions.length - 1) {
      setStep(step + 1);
    } else {
      router.push("/learning/stage3/result");
    }
  };

  const handleTTS = () => {
    if (window.speechSynthesis) {
      const utter = new SpeechSynthesisUtterance(expressions[step]);
      utter.lang = "ko-KR";
      utter.rate = 0.8;
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <div
      className="min-h-screen bg-blue-100 p-6 flex items-center"
      style={{
        fontFamily: "SBAggroOTF, Gowun Dodum, Noto Sans KR, sans-serif",
        fontWeight: "300",
        backgroundImage: "url(/images/background.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBack}
            className="mr-4 p-3 bg-white/90 backdrop-blur-sm rounded-2xl transition-all duration-300"
          >
            <ChevronLeft
              size={28}
              className="text-gray-700"
              strokeWidth={2.5}
            />
          </button>
          <h1 className="text-3xl font-black text-black">
            <span className="text-blue-300">3단계 학습</span>
          </h1>
        </div>

        <div className="flex flex-col items-center space-y-8">
          {/* TTS 텍스트 표시 영역 */}
          <div
            className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 w-full max-w-2xl"
            style={{
              borderRadius: "40px 60px 50px 55px",
            }}
          >
            <div className="text-center">
              <h2 className="text-2xl font-black text-gray-800 mb-4">
                지시사항
              </h2>
              <p className="text-2xl font-black text-blue-500 leading-relaxed">
                {expressions[step]}
              </p>
            </div>
          </div>

          {/* 카메라 영역 */}
          <div className="relative w-full max-w-2xl h-[400px] bg-gray-100 rounded-3xl flex items-center justify-center overflow-hidden shadow-lg border-2 border-gray-200">
            {error ? (
              <span className="text-red-500 font-bold text-center">
                {error}
              </span>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover rounded-3xl"
              />
            )}
          </div>

          {/* 버튼 영역 */}
          <div className="flex space-x-4 w-full max-w-2xl">
            <button
              onClick={handleTTS}
              className="flex-1 py-4 bg-purple-500 text-white rounded-2xl font-black text-lg transition-all duration-300 active:scale-95 hover:bg-purple-600 shadow-md flex items-center justify-center space-x-2"
            >
              <Volume2 size={24} />
              <span>다시 듣기</span>
            </button>
            <button
              onClick={handleNext}
              className="flex-1 py-4 bg-blue-500 text-white rounded-2xl font-black text-lg transition-all duration-300 active:scale-95 hover:bg-blue-600 shadow-md"
            >
              {step < expressions.length - 1 ? "다음" : "완료"}
            </button>
          </div>

          {/* 진행 상황 */}
          <div className="text-center">
            <p className="text-gray-600 font-bold text-lg">
              {step + 1} / {expressions.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
