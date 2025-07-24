"use client";
import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Volume2, ChevronLeft, ChevronRight, Check } from "lucide-react";

const expressions = ["웃어보세요!", "찡그려보세요!", "놀란 표정 지어보세요!"];

export const Stage3QuizPage = () => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [isNextEnabled, setIsNextEnabled] = useState(false);

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

  useEffect(() => {
    setIsNextEnabled(false);
    
    const timer = setTimeout(() => {
      setIsNextEnabled(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, [step]);

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
          <h1 className="text-3xl font-black text-black font-normal">
            <span className="text-blue-300">3단계 학습</span>
          </h1>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <div
            className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 w-full max-w-2xl"
            style={{
              borderRadius: "40px 60px 50px 55px",
            }}
          >
            <div className="text-center">
              <p className="text-2xl font-black text-blue-500 leading-relaxed font-normal">
                {expressions[step]}
              </p>
            </div>
          </div>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            <button
              onClick={handleTTS}
              className="p-8 bg-purple-500 text-white rounded-3xl font-black text-lg transition-all duration-300 active:scale-95 hover:bg-purple-600 font-normal"
              style={{
                borderRadius: "25px 35px 30px 40px",
              }}
            >
              <div className="flex flex-col font-normal items-center space-y-3">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Volume2 size={32} />
                </div>
                <span>다시 듣기</span>
              </div>
            </button>
            <button
              onClick={handleNext}
              disabled={!isNextEnabled}
              className={`p-8 rounded-3xl font-black text-lg transition-all duration-300 font-normal ${
                isNextEnabled 
                  ? "bg-blue-500 text-white active:scale-95 hover:bg-blue-600 cursor-pointer" 
                  : "bg-gray-400 text-gray-600 cursor-not-allowed"
              }`}
              style={{
                borderRadius: "30px 40px 35px 25px",
              }}
            >
              <div className="flex flex-col font-normal items-center space-y-3">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  {isNextEnabled ? (
                    step < expressions.length - 1 ? (
                      <ChevronRight size={32} />
                    ) : (
                      <Check size={32} />
                    )
                  ) : null}
                </div>
                <span>
                  {!isNextEnabled 
                      ? "다음" 
                      : "완료"
                  }
                </span>
              </div>
            </button>
          </div>

          <div className="text-center">
            <p className="text-gray-600 font-bold text-lg font-normal">
              {step + 1} / {expressions.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};