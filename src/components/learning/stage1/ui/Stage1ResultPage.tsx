"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Home, RotateCcw } from "lucide-react";
import Lottie from "lottie-react";
import celebrationAnimation from "../../../../../public/animations/celebration.json";
import { getQuizResult } from "@/shared/lib/api/quiz";

interface UserInfo {
  id: string;
  name: string;
  role: string;
}

interface QuizItem {
  quizId: string;
  isCorrect: boolean;
  selectedOption: string;
  correctOption: string;
  timeTakenSeconds: number;
  answeredAt: string;
  imageUrl: string;
}

interface QuizResultData {
  sessionId: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  averageTimeSeconds: number;
  startTime: string;
  endTime: string;
  duration: number;
  quizzes: QuizItem[];
}

export const Stage1ResultPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [displayText, setDisplayText] = useState("");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [fullText, setFullText] = useState("");
  const [quizResult, setQuizResult] = useState<QuizResultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const score = quizResult?.correctAnswers || 0;
  const total = quizResult?.totalQuestions || 0;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const passThreshold = 60;
  const isPassed = percentage >= passThreshold;

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  useEffect(() => {
    const loadQuizResult = async () => {
      if (!searchParams) {
        setError("URL 파라미터를 읽을 수 없습니다.");
        setIsLoading(false);
        return;
      }

      const attemptId = searchParams.get("attemptId");
      if (!attemptId) {
        setError("attemptId가 없습니다.");
        setIsLoading(false);
        return;
      }

      try {
        const result = await getQuizResult(attemptId);
        setQuizResult(result);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "결과 조회에 실패했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadQuizResult();
  }, [searchParams]);

  useEffect(() => {
    const getUserName = () => {
      if (!userInfo?.name) return "마음아";
      const name = userInfo.name;
      if (name.length > 1 && /^[가-힣]+$/.test(name)) {
        return `${name.substring(1)}아`;
      }
      return `${name.split(" ")[0]}아`;
    };

    const userName = getUserName();
    const text = isPassed
      ? `와! 정말 잘했어 ${userName}!\n1단계 감정 인식 퀴즈를 모두 완료했구나. 표정을 보고 감정을 알아차리는 능력이 많이 늘었을 거야. 이제 감정을 더 잘 이해할 수 있게 되었어!`
      : "아쉽게도 목표 점수에 조금 부족해 ㅜㅜ.\n하지만 괜찮아! 다시 도전해서 더 좋은 결과를 만들어봐. 감정을 이해하는 것은 많은 연습이 필요하니까!";
    setFullText(text);
  }, [userInfo, isPassed]);

  const highlightWords = isPassed
    ? ["감정", "표정", "능력", "이해"]
    : ["목표", "도전", "연습", "감정"];

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
        `<span class="text-accent-primary font-black">$1</span>`
      );
    });
    result = result.replace(/\n/g, "<br>");
    return result;
  };

  const handleRestart = () => {
    router.push("/learning/stage1/quiz");
  };

  const handleHome = () => {
    if (isPassed) {
      router.push("/home?showCompleteAnimation=true");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-green-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-xl font-bold">결과를 불러오고 있어...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-green-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😅</div>
          <p className="text-xl font-bold mb-4 text-red-600">
            결과를 불러올 수 없어요
          </p>
          <p className="text-lg mb-6 text-gray-700">{error}</p>
          <button
            onClick={() => router.push("/learning/stage1/quiz")}
            className="bg-purple-400 hover:bg-purple-500 text-white font-bold py-2 px-6 rounded-full transition-colors"
          >
            다시 시도하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-green-100 p-6 flex items-center relative"
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
          <h1 className="text-3xl font-black text-black font-normal">
            1단계{" "}
            <span className={isPassed ? "text-accent-primary" : "text-red-500"}>
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
              <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-gray-800 mb-2 font-normal">
                  최종 점수
                </h3>
                <div
                  className={`text-4xl font-black mb-2 ${isPassed ? "text-accent-primary" : "text-red-500"}`}
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
                  className="w-full py-3 px-6 bg-blue-400 text-white rounded-2xl font-black text-base transition-all duration-300 active:scale-95 flex items-center justify-center space-x-2 font-normal"
                >
                  <RotateCcw size={20} />
                  <span>다시 도전하기</span>
                </button>

                {isPassed ? (
                  <button
                    onClick={handleHome}
                    className="w-full py-3 px-6 bg-gray-200 text-gray-800 rounded-2xl font-black text-base transition-all duration-300 active:scale-95 flex items-center justify-center space-x-2 font-normal"
                  >
                    <Home size={20} />
                    <span>학습 종료하기</span>
                  </button>
                ) : (
                  <button
                    className="w-full py-3 px-6 bg-gray-300 text-gray-500 rounded-2xl font-black text-base cursor-not-allowed flex items-center justify-center space-x-2 opacity-50 font-normal"
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
