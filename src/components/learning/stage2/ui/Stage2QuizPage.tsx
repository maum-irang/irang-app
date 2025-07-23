"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Mic, MicOff, Volume2 } from "lucide-react";

export const Stage2QuizPage = () => {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const aiMessages = [
    "우와! 1단계를 통과했구나! 안녕 마음아, 나는 마음이랑이라고 해! 이제 우리 대화하면서 학습해보자. 내가 질문을 수 있게 말을 해볼래?",
    "정말 잘했어! 그런데 혹시 오늘 기분이 어때? 기쁜 목소리로 대답해줄 수 있을까?",
    "와! 정말 기쁜 목소리네! 그럼 이번에는 조금 다른 감정으로 말해볼까? 슬픈 목소리로 '괜찮아요'라고 말해보자.",
    "음성을 잘 인식했어! 감정 표현을 정말 잘하고 있구나. 마지막으로 놀란 목소리로 '정말요?'라고 말해볼래?",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const handleBack = () => {
    router.push("/learning/stage2");
  };

  const typeMessage = (message: string) => {
    setIsTyping(true);
    setDisplayText("");

    let index = 0;
    const timer = setInterval(() => {
      if (index <= message.length) {
        setDisplayText(message.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 50);
  };

  const handleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setTimeout(() => {
        if (currentMessageIndex < aiMessages.length - 1) {
          setCurrentMessageIndex(currentMessageIndex + 1);
          typeMessage(aiMessages[currentMessageIndex + 1]);
        } else {
          router.push("/learning/stage2/result");
        }
      }, 1000);
    } else {
      setIsRecording(true);
    }
  };

  const playTTS = () => {
              // TTS 재생
  };

  useEffect(() => {
    typeMessage(aiMessages[0]);
  }, []);

  return (
    <div
      className="min-h-screen bg-purple-100 p-6 flex items-center"
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
      <div className="max-w-4xl mx-auto w-full">
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
            <span className="text-purple-500">2단계 학습</span>
          </h1>
        </div>

        <div className="mb-8">
          <div
            className="bg-white/95 backdrop-blur-sm rounded-3xl p-8"
            style={{
              minHeight: "200px",
              borderRadius: "40px 60px 50px 55px",
            }}
          >
            <div className="rounded-2xl p-6 relative">
              <p className="text-lg font-medium text-gray-800 leading-relaxed min-h-[60px] text-center font-normal">
                {displayText}
                {isTyping && (
                  <span className="animate-pulse text-purple-500">|</span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={handleRecord}
            className={`p-8 rounded-3xl font-black text-lg transition-all duration-300 active:scale-95 font-normal ${
              isRecording
                ? "bg-red-500 text-white animate-pulse"
                : "bg-white/90 backdrop-blur-sm text-purple-500 hover:bg-white"
            }`}
            style={{
              borderRadius: "30px 40px 35px 25px",
            }}
          >
            <div className="flex flex-col items-center space-y-3">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  isRecording ? "bg-white/20" : "bg-purple-100"
                }`}
              >
                {isRecording ? <MicOff size={32} /> : <Mic size={32} />}
              </div>
              <span>음성 입력</span>
              {isRecording && (
                <p className="text-sm opacity-90 animate-pulse">녹음 중...</p>
              )}
            </div>
          </button>

          <button
            onClick={playTTS}
            className="p-8 bg-purple-500 text-white rounded-3xl font-black text-lg transition-all duration-300 active:scale-95 hover:bg-purple-600 font-normal"
            style={{
              borderRadius: "25px 35px 30px 40px",
            }}
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Volume2 size={32} />
              </div>
              <span>다시 듣기</span>
            </div>
          </button>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3">
            <div
              className={`w-3 h-3 rounded-full ${isTyping ? "bg-purple-500 animate-pulse" : "bg-green-500"}`}
            ></div>
            <span className="font-black text-gray-700 font-normal">
              {isTyping ? "AI가 말하고 있어요..." : "당신의 차례입니다"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
