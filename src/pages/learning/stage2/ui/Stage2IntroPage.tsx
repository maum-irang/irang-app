"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Volume2, VolumeX } from "lucide-react";

export const Stage2IntroPage = () => {
  const router = useRouter();
  const [displayText, setDisplayText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fullText =
    "안녕 마음아!\n 이번에는 2단계 감정 표현 학습이야.\n목소리로 감정을 표현하고 인식하는 연습을 해보자. 준비됐니?";

  const highlightWords = ["2단계", "감정 표현", "목소리", "연습"];

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 60);

    return () => clearInterval(timer);
  }, []);

  const renderHighlightedText = (text: string) => {
    let result = text;
    highlightWords.forEach(word => {
      const regex = new RegExp(`(${word})`, "g");
      result = result.replace(
        regex,
        `<span class="text-purple-500 font-normal">$1</span>`
      );
    });
    result = result.replace(/\n/g, "<br>");
    return result;
  };

  const handleBack = () => {
    router.push("/home");
  };

  const handleStartLearning = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    router.push("/learning/stage2/mic-test");
  };

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
            2단계 <span className="text-purple-500">감정 표현</span> 학습
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 relative">
            <div
              className="bg-white/95 backdrop-blur-sm p-8 flex items-center justify-center transition-all duration-200"
              style={{
                borderRadius: "80px 120px 90px 110px",
                minHeight: "380px",
              }}
            >
              <h2
                className="text-xl font-black text-gray-800 leading-relaxed tracking-wide text-center max-w-2xl transition-all duration-200 font-normal"
                dangerouslySetInnerHTML={{
                  __html: renderHighlightedText(displayText),
                }}
              />
            </div>
          </div>

          <div>
            <div
              className="rounded-3xl p-6 flex flex-col"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(255,255,255,1) 70%, rgba(255,255,255,0.3) 100%)",
                minHeight: "380px",
              }}
            >
              <h3 className="text-lg font-black text-gray-800 mb-6 text-center font-normal">
                학습 정보
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <Volume2 size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="font-black text-gray-800 text-sm font-normal">
                      음성 인식
                    </p>
                    <p className="text-gray-600 text-xs">
                      목소리 톤과 억양 학습
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <VolumeX size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="font-black text-gray-800 text-sm font-normal">
                      실시간 피드백
                    </p>
                    <p className="text-gray-600 text-xs">즉시 결과 확인</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-end">
                <button
                  onClick={handleStartLearning}
                  disabled={isLoading}
                  className={`w-full mt-10 py-4 px-6 bg-accent-primary text-white rounded-2xl font-black text-base transition-all duration-300 font-normal ${
                    isLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "active:scale-95"
                  }`}
                >
                  {isLoading ? "시작 준비 중..." : "2단계 시작하기"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
