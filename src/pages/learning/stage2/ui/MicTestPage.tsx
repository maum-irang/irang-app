"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Mic, MicOff, CheckCircle } from "lucide-react";

export const MicTestPage = () => {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [testStep, setTestStep] = useState(0);
  const [micTestPassed, setMicTestPassed] = useState(false);

  const testMessages = [
    "안녕! 마이크 테스트 시작할게. 준비되면 마이크 버튼 누르고 '안녕하세요'라고 말해줘.",
    "좋아! 이번엔 좀 더 크게 '테스트입니다'라고 말해줘.",
    "완전 잘했어! 마지막으로 '마음이랑'이라고 말해줘.",
    "마이크 테스트 끝! 이제 진짜 학습 시작하자!",
  ];

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
        if (testStep < testMessages.length - 1) {
          setTestStep(testStep + 1);
          typeMessage(testMessages[testStep + 1]);
        }
        if (testStep + 1 === testMessages.length - 1) {
          setMicTestPassed(true);
        }
      }, 1000);
    } else {
      setIsRecording(true);
    }
  };

  useEffect(() => {
    typeMessage(testMessages[0]);
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
            <span className="text-purple-500">마이크 테스트</span>
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
              <p className="text-lg font-medium text-gray-800 leading-relaxed min-h-[60px] font-normal">
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
            disabled={micTestPassed}
            className={`p-8 rounded-3xl font-black text-lg transition-all duration-300 active:scale-95 font-normal ${
              isRecording
                ? "bg-red-500 text-white animate-pulse"
                : micTestPassed
                  ? "bg-green-500 text-white"
                  : "bg-white/90 backdrop-blur-sm text-purple-500"
            }`}
            style={{
              borderRadius: "30px 40px 35px 25px",
            }}
          >
            <div className="flex flex-col items-center space-y-3">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  isRecording
                    ? "bg-white/20"
                    : micTestPassed
                      ? "bg-white/20"
                      : "bg-purple-100"
                }`}
              >
                {micTestPassed ? (
                  <CheckCircle size={32} />
                ) : isRecording ? (
                  <MicOff size={32} />
                ) : (
                  <Mic size={32} />
                )}
              </div>
              <span className="font-normal">
                {micTestPassed
                  ? "테스트 완료!"
                  : isRecording
                    ? "녹음 중..."
                    : "음성 입력"}
              </span>
              {micTestPassed && (
                <p className="text-sm opacity-90 font-normal">
                  학습으로 이동 가능
                </p>
              )}
            </div>
          </button>

          <button
            onClick={() => router.push("/learning/stage2/quiz")}
            disabled={!micTestPassed}
            className="p-8 bg-purple-500 text-white rounded-3xl font-black text-lg transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-normal"
            style={{
              borderRadius: "25px 35px 30px 40px",
            }}
          >
            <div className="flex flex-col items-center space-y-3 font-normal">
              <span>학습 시작하기</span>
            </div>
          </button>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3">
            <div
              className={`w-3 h-3 rounded-full ${
                isTyping
                  ? "bg-purple-500 animate-pulse"
                  : micTestPassed
                    ? "bg-green-500"
                    : "bg-blue-500"
              }`}
            ></div>
            <span className="font-normal text-gray-700">
              {isTyping
                ? "AI가 말하고 있어요..."
                : micTestPassed
                  ? "테스트 완료! 학습을 시작할 수 있습니다"
                  : "마이크 테스트 중입니다"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
