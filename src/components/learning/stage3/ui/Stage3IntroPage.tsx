"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Camera, Smile } from "lucide-react";

interface UserInfo {
  id: string;
  name: string;
  role: string;
}

export const Stage3IntroPage = () => {
  const router = useRouter();
  const [displayText, setDisplayText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
    const text = `안녕 ${userName}!\n 이번에는 3단계 감정 표현 학습이야.\n카메라로 표정을 따라 해보는 연습을 해보자. 준비됐니?`;
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

  const highlightWords = ["3단계", "감정 표현", "카메라", "연습"];

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
        `<span class=\"text-purple-500 font-normal\">$1</span>`
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
    router.push("/learning/stage3/cam-test");
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
            3단계 <span className="text-purple-500">감정 표현</span> 학습
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
                    <Camera size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="font-black text-gray-800 text-sm font-normal">
                      캠 테스트
                    </p>
                    <p className="text-gray-600 text-xs">
                      카메라 연결 및 화면 확인
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <Smile size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="font-black text-gray-800 text-sm font-normal">
                      표정 따라하기
                    </p>
                    <p className="text-gray-600 text-xs">
                      안내에 따라 표정 연습
                    </p>
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
                  {isLoading ? "시작 준비 중..." : "3단계 시작하기"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
