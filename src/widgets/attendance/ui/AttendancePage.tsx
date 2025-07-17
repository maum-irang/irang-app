"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Layers, Stamp, Notebook, Mic, Camera } from "lucide-react";
import Lottie from "lottie-react";
import checkAnimation from "../../../../public/animations/check.json";
import stampAnimation from "../../../../public/animations/stamp.json";
import StampRoadmap from "./components/StampRoadmap";
import { useStampData } from "../model/useStampData";

export const AttendancePage = () => {
  const router = useRouter();
  const [showStudyAnimation, setShowStudyAnimation] = useState(false);
  const [showAttendanceAnimation, setShowAttendanceAnimation] = useState(false);
  const [showNotesAnimation] = useState(false);

  const [showStampAnimation, setShowStampAnimation] = useState(false);
  const [showClickAnimation, setShowClickAnimation] = useState(false);
  const [clickAnimation, setClickAnimation] = useState<object | string | null>(
    null
  );
  const [, setLastClickTime] = useState(Date.now());
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);

  const {
    stamps,
    completedCount,
    totalCount,
    todayStampId,
    completeStamp,
    canCompleteStamp,
    activateNextStamp,
  } = useStampData();

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @font-face {
        font-family: 'SBAggroOTF';
        src: url('/fonts/SBAggroOTF-B.otf') format('opentype');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
      
      @keyframes gradientShift {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
      
      @keyframes float {
        0%, 100% {
          transform: translateY(0px) rotate(0deg);
        }
        50% {
          transform: translateY(-20px) rotate(180deg);
        }
      }
      
      @keyframes pulse {
        0%, 100% {
          opacity: 0.3;
          transform: scale(1);
        }
        50% {
          opacity: 0.6;
          transform: scale(1.1);
        }
      }
      
      .animate-float {
        animation: float 6s ease-in-out infinite;
      }
      
      .animate-float-delayed {
        animation: float 6s ease-in-out infinite;
        animation-delay: 3s;
      }
      
      .animate-pulse {
        animation: pulse 4s ease-in-out infinite;
      }
      
      .animate-pulse-delayed {
        animation: pulse 5s ease-in-out infinite reverse;
      }
      
      .click-animation {
        animation: clickPulse 1.5s ease-in-out infinite;
      }
      
      @keyframes clickPulse {
        0%, 100% {
          transform: scale(1);
          opacity: 0.8;
        }
        50% {
          transform: scale(1.1);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);

    const font = new FontFace("SBAggroOTF", "url(/fonts/SBAggroOTF-B.otf)");
    font
      .load()
      .then(f => document.fonts.add(f))
      .catch(() => {});

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("showCompleteAnimation") === "true") {
      setShowAttendanceAnimation(true);
      window.history.replaceState({}, "", window.location.pathname);
    }

    if (urlParams.get("showStage2CompleteAnimation") === "true") {
      setShowStudyAnimation(true);
      window.history.replaceState({}, "", window.location.pathname);
    }

    const loadClickAnimation = async () => {
      try {
        const animationData = await import(
          "../../../../public/animations/click.json"
        );
        setClickAnimation(animationData.default);
      } catch (error) {
        console.warn("클릭 애니메이션 로드 실패, CSS 애니메이션 사용:", error);
        setClickAnimation("css-fallback");
      }
    };

    loadClickAnimation();

    const startClickAnimationTimer = () => {
      if (clickTimeout) {
        clearTimeout(clickTimeout);
      }

      const timeout = setTimeout(async () => {
        await loadClickAnimation();
        setShowClickAnimation(true);
      }, 5000);

      setClickTimeout(timeout);
    };

    startClickAnimationTimer();

    return () => {
      if (clickTimeout) {
        clearTimeout(clickTimeout);
      }
    };
  }, []);

  const loadClickAnimation = async () => {
    try {
      const animationData = await import(
        "../../../../public/animations/click.json"
      );
      setClickAnimation(animationData.default);
    } catch (error) {
      console.warn("클릭 애니메이션 로드 실패, CSS 애니메이션 사용:", error);
      setClickAnimation("css-fallback");
    }
  };

  const handleStage1Click = () => {
    setShowClickAnimation(false);
    setLastClickTime(Date.now());

    if (clickTimeout) {
      clearTimeout(clickTimeout);
    }

    const timeout = setTimeout(async () => {
      await loadClickAnimation();
      setShowClickAnimation(true);
    }, 5000);

    setClickTimeout(timeout);
    router.push("/learning/stage1");
  };

  const handleStudyClick = () => {
    setShowClickAnimation(false);
    setLastClickTime(Date.now());

    if (clickTimeout) {
      clearTimeout(clickTimeout);
    }

    const timeout = setTimeout(async () => {
      await loadClickAnimation();
      setShowClickAnimation(true);
    }, 5000);

    setClickTimeout(timeout);
    router.push("/learning/stage2");
  };

  const handleAttendanceClick = () => {
    setShowClickAnimation(false);
    setLastClickTime(Date.now());

    if (clickTimeout) {
      clearTimeout(clickTimeout);
    }

    const timeout = setTimeout(async () => {
      await loadClickAnimation();
      setShowClickAnimation(true);
    }, 5000);

    setClickTimeout(timeout);

    setShowStampAnimation(true);
    setTimeout(() => {
      if (todayStampId && canCompleteStamp(todayStampId)) {
        completeStamp(todayStampId);
        activateNextStamp();
      }
    }, 1500);
  };

  const handleStage3Click = () => {
    setShowClickAnimation(false);
    setLastClickTime(Date.now());

    if (clickTimeout) {
      clearTimeout(clickTimeout);
    }

    const timeout = setTimeout(async () => {
      await loadClickAnimation();
      setShowClickAnimation(true);
    }, 5000);

    setClickTimeout(timeout);
    router.push("/learning/stage3");
  };

  return (
    <div
      className="min-h-screen p-6 flex items-center relative overflow-hidden"
      style={{
        fontFamily: "SBAggroOTF, Gowun Dodum, Noto Sans KR, sans-serif",
        fontWeight: "300",
        background: "linear-gradient(-45deg, #a8e6cf, #88d8c0, #b8e6b8, #c8e6c9, #dcedc8, #f0f8e8)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 20s ease infinite",
      }}
    >

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black text-black">
            안녕 <span className="text-accent-primary">마음아</span>?<br />{" "}
            오늘도 재미있게 학습해보자
          </h1>
          <div className="relative">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-4 border-2 border-gray-200 relative">
              <h2 className="text-2xl font-black text-accent-primary text-center">
                마음이
              </h2>
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="w-6 h-6 bg-gray-300 rounded-full border-2 border-gray-400 shadow-inner"></div>
              </div>
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-gray-400"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <StampRoadmap
            stamps={stamps}
            completedCount={completedCount}
            totalCount={totalCount}
          />

          <div className="h-[584px] flex flex-col">
            <div
              className="rounded-3xl p-8 relative flex-1"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(255,255,255,1) 70%, rgba(255,255,255,0.3) 100%)",
                boxShadow: "0 8px 32px rgba(0,0,0,0)",
              }}
            >
              <h2 className="text-2xl font-black text-gray-800 mb-6">
                매일하는 <span className="text-blue-300">단계별 학습</span>
              </h2>
              <div className="grid grid-cols-3 gap-6">
                <div className="relative">
                  <button
                    onClick={handleStage1Click}
                    className="bg-accent-transparent rounded-3xl p-6 text-center min-h-[140px] flex flex-col justify-center w-full"
                  >
                    <div className="mb-3 text-accent-primary">
                      <Layers size={40} className="mx-auto" strokeWidth={3} />
                    </div>
                    <p className="text-lg font-black text-gray-800">
                      1단계
                      <br />
                      학습하기
                    </p>
                  </button>
                  {showClickAnimation && (
                    <div className="absolute inset-0 rounded-3xl flex items-center justify-end pt-10 z-10 pointer-events-none">
                      {clickAnimation && clickAnimation !== "css-fallback" ? (
                        <Lottie
                          animationData={clickAnimation}
                          loop={true}
                          autoPlay
                          style={{ width: 100, height: 100 }}
                        />
                      ) : (
                        <div className="click-animation">
                          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {showAttendanceAnimation && (
                    <div
                      className="absolute inset-0 rounded-3xl flex items-center justify-center z-10 pointer-events-none"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.20)",
                        backdropFilter: "blur(2px)",
                      }}
                    >
                      <Lottie
                        animationData={checkAnimation}
                        loop={false}
                        autoPlay
                        style={{ width: 100, height: 100 }}
                      />
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button
                    onClick={handleStudyClick}
                    className={`bg-accent-transparent rounded-3xl p-6 text-center min-h-[140px] flex flex-col justify-center w-full ${
                      todayStampId ? "" : "opacity-50 cursor-not-allowed"
                    }`}
                    disabled={!todayStampId}
                  >
                    <div className="mb-3 text-accent-primary">
                      <Mic size={40} className="mx-auto" strokeWidth={3} />
                    </div>
                    <p className="text-lg font-black text-gray-800">
                      2단계
                      <br />
                      학습하기
                    </p>
                  </button>
                  {showStudyAnimation && (
                    <div
                      className="absolute inset-0 rounded-3xl flex items-center justify-center z-10 pointer-events-none"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.20)",
                        backdropFilter: "blur(2px)",
                      }}
                    >
                      <Lottie
                        animationData={checkAnimation}
                        loop={false}
                        autoPlay
                        style={{ width: 100, height: 100 }}
                      />
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button
                    onClick={handleStage3Click}
                    className="bg-accent-transparent rounded-3xl p-6 text-center min-h-[140px] flex flex-col justify-center w-full"
                  >
                    <div className="mb-3 text-accent-primary">
                      <Camera size={40} className="mx-auto" strokeWidth={3} />
                    </div>
                    <p className="text-lg font-black text-gray-800">
                      3단계
                      <br />
                      학습하기
                    </p>
                  </button>
                  {showNotesAnimation && (
                    <div
                      className="absolute inset-0 rounded-3xl flex items-center justify-center z-10 pointer-events-none"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.20)",
                        backdropFilter: "blur(2px)",
                      }}
                    >
                      <Lottie
                        animationData={checkAnimation}
                        loop={false}
                        autoPlay
                        style={{ width: 100, height: 100 }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="h-2"></div>

            <div
              className="rounded-3xl p-8 relative flex-1"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(255,255,255,1) 70%, rgba(255,255,255,0.3) 100%)",
                boxShadow: "0 8px 32px rgba(0,0,0,0)",
              }}
            >
              <h2 className="text-2xl font-black text-gray-800 mb-6">
                한 단계 <span className="text-blue-300">UP!</span>
              </h2>
              <div className="grid grid-cols-3 gap-6">
                <div className="relative">
                  <button
                    onClick={handleAttendanceClick}
                    className="bg-accent-transparent rounded-3xl p-6 text-center min-h-[140px] flex flex-col justify-center w-full"
                  >
                    <div className="mb-3 text-accent-primary">
                      <Stamp size={40} className="mx-auto" strokeWidth={3} />
                    </div>
                    <p className="text-lg font-black text-gray-800">
                      오늘의 <br />
                      출석하기
                    </p>
                  </button>
                  {showStampAnimation && (
                    <div
                      className="absolute inset-0 rounded-3xl flex items-center justify-center z-10 pointer-events-none"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.20)",
                        backdropFilter: "blur(2px)",
                      }}
                    >
                      <Lottie
                        animationData={stampAnimation}
                        loop={false}
                        autoPlay
                        style={{ width: 140, height: 140 }}
                      />
                    </div>
                  )}
                </div>
                <div className="bg-accent-transparent rounded-3xl p-6 text-center min-h-[140px] flex flex-col justify-center w-full">
                  <div className="mb-3 text-accent-primary">
                    <Notebook size={40} className="mx-auto" strokeWidth={3} />
                  </div>
                  <p className="text-lg font-black text-gray-800">오답노트</p>
                </div>
                <div className="bg-accent-transparent rounded-3xl p-6 text-center min-h-[140px] flex flex-col justify-center w-full">
                  <p className="text-xl font-black text-accent-primary">
                    COMING
                    <br />
                    SOON
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
