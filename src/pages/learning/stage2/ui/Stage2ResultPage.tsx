"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home, RotateCcw, ArrowRight } from "lucide-react";
import Lottie from "lottie-react";
import celebrationAnimation from "../../../../../public/animations/celebration.json";

export const Stage2ResultPage = () => {
  const router = useRouter();
  const [displayText, setDisplayText] = useState("");

  const score = 2;
  const total = 5;
  const percentage = Math.round((score / total) * 100);
  const passThreshold = 80;
  const isPassed = percentage >= passThreshold;

  const fullText = isPassed
    ? "와! 정말 잘했어 마음아!\n2단계 감정 표현 퀴즈를 모두 완료했구나. 목소리로 감정을 표현하는 능력이 많이 늘었을 거야. 이제 감정을 더 잘 전달할 수 있게 되었어!"
    : "아쉽게도 목표 점수에 조금 부족해 ㅜㅜ.\n하지만 괜찮아! 다시 도전해서 더 좋은 결과를 만들어봐. 감정 표현은 많은 연습이 필요하니까!";

  const highlightWords = isPassed
    ? ["감정", "표현", "목소리", "전달"]
    : ["목표", "도전", "연습", "감정"];

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
  }, [fullText]);

  const renderHighlightedText = (text: string) => {
    let result = text;
    highlightWords.forEach(word => {
      const regex = new RegExp(`(${word})`, "g");
      result = result.replace(
        regex,
        `<span class="text-purple-500 font-black">$1</span>`
      );
    });
    result = result.replace(/\n/g, "<br>");
    return result;
  };

  const handleRestart = () => {
    router.push("/learning/stage2/quiz");
  };

  const handleHome = () => {
    if (isPassed) {
      router.push("/attendance?showStage2CompleteAnimation=true");
    }
  };

  return (
    <div
      className="min-h-screen bg-purple-100 p-6 flex items-center relative"
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
      {isPassed && (
        <div className="absolute inset-0 pointer-events-none z-50">
          <Lottie
            animationData={celebrationAnimation}
            loop={false}
            autoplay={true}
            style={{
              width: "55%",
              height: "50%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
        </div>
      )}

      <div className="max-w-6xl mx-auto w-full relative z-20">
        <div className="flex items-center mb-6">
          <h1 className="text-3xl font-black text-black">
            2단계{" "}
            <span className={isPassed ? "text-purple-500" : "text-red-500"}>
              {isPassed ? "완료" : "재도전"}
            </span>
            !
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
                className="text-xl font-black text-gray-800 leading-relaxed tracking-wide text-center max-w-2xl transition-all duration-200"
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
              <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-gray-800 mb-2">
                  최종 점수
                </h3>
                <div
                  className={`text-4xl font-black mb-2 ${isPassed ? "text-purple-500" : "text-red-500"}`}
                >
                  {score} / {total}
                </div>
                <div className="text-lg text-gray-600">
                  정답률 {percentage}%
                </div>
                {!isPassed && (
                  <div className="text-sm text-red-500 mt-2">
                    목표: {passThreshold}% 이상
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-end space-y-3">
                <button
                  onClick={handleRestart}
                  className="w-full py-3 px-6 bg-blue-400 text-white rounded-2xl font-black text-base transition-all duration-300 active:scale-95 flex items-center justify-center space-x-2"
                >
                  <RotateCcw size={20} />
                  <span>다시 도전하기</span>
                </button>

                {isPassed ? (
                  <>
                    <button
                      onClick={handleHome}
                      className="w-full py-3 px-6 bg-gray-200 text-gray-800 rounded-2xl font-black text-base transition-all duration-300 active:scale-95 flex items-center justify-center space-x-2"
                    >
                      <Home size={20} />
                      <span>학습 종료하기</span>
                    </button>

                    <button
                      onClick={() => router.push("/learning/stage3")}
                      className="w-full py-3 px-6 bg-purple-500 text-white rounded-2xl font-black text-base transition-all duration-300 active:scale-95 flex items-center justify-center space-x-2"
                    >
                      <span>3단계로 이동하기</span>
                      <ArrowRight size={20} />
                    </button>
                  </>
                ) : (
                  <button
                    className="w-full py-3 px-6 bg-gray-300 text-gray-500 rounded-2xl font-black text-base cursor-not-allowed flex items-center justify-center space-x-2 opacity-50"
                    disabled
                  >
                    <Home size={20} />
                    <span>메인으로 돌아가기</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
