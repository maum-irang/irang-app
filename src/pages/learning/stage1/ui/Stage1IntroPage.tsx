"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Clock, Target, BookOpen } from "lucide-react";

interface UserInfo {
  id: string;
  name: string;
  role: string;
}

export const Stage1IntroPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [fullText, setFullText] = useState("");

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  useEffect(() => {
    const userName = getUserName();
    const text = `안녕 ${userName}!\n 1단계에서는 사람들의 다양한 표정을 보고 어떤 감정인지 맞춰보는 퀴즈를 할거야. 여러 감정들이 얼굴에 어떻게 나타나는지 함께 배워보자! 표정을 통해서 다른 사람의 마음을 이해하는 능력을 기를 수 있을거야. 준비됐니?`;
    setFullText(text);
  }, [userInfo]);

  const getUserName = () => {
    if (!userInfo?.name) return "마음아";
    const name = userInfo.name;
    if (name.length > 1 && /^[가-힣]+$/.test(name)) {
      return `${name.substring(1)}아`;
    }
    return `${name.split(" ")[0]}아`;
  };

  const highlightWords = [
    "표정",
    "감정",
    "퀴즈",
    "1단계",
    "기쁨",
    "슬픔",
    "화남",
    "놀람",
    "무서움",
  ];

  useEffect(() => {
    if (!fullText) return;

    setDisplayText("");
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
        `<span class="text-accent-primary font-normal">$1</span>`
      );
    });
    result = result.replace(/\n/g, "<br>");
    return result;
  };

  const handleBack = () => {
    router.push("/home");
  };

  const handleStartLearning = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push("/learning/stage1/quiz");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div
      className="min-h-screen bg-green-100 p-6 flex items-center"
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
            1단계 <span className="text-accent-primary">감정 인식</span> 학습
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 relative">
            <div
              className="bg-white/95 backdrop-blur-sm p-8 flex items-center justify-center transition-all duration-200"
              style={{
                borderRadius: "80px 120px 90px 110px",
                minHeight:
                  displayText.length > 0
                    ? `${Math.max(380, displayText.length * 2.5)}px`
                    : "380px",
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
              className="rounded-3xl p-6"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(255,255,255,1) 70%, rgba(255,255,255,0.3) 100%)",
                minHeight: "380px",
              }}
            >
              <h3 className="text-lg font-black text-gray-800 mb-6 text-center font-normal">
                학습 정보
              </h3>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm font-normal">
                      예상 시간
                    </p>
                    <p className="text-gray-600 text-sm">7-12분</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Target size={20} className="text-green-500" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm font-normal">
                      문제 수
                    </p>
                    <p className="text-gray-600 text-sm">8개</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <BookOpen size={20} className="text-purple-500" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm font-normal">
                      난이도
                    </p>
                    <p className="text-gray-600 text-sm">쉬움</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleStartLearning}
                disabled={isLoading}
                className={`w-full mt-10 font-normal py-4 px-6 bg-accent-primary text-white rounded-2xl font-black text-base transition-all duration-300 ${
                  isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "active:scale-95"
                }`}
              >
                {isLoading ? "시작 준비 중..." : "1단계 시작하기"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
