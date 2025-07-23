"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Layers, Stamp, Notebook, Mic, Camera, BookOpen } from "lucide-react";
import Lottie from "lottie-react";
import checkAnimation from "../../../../public/animations/check.json";
import stampAnimation from "../../../../public/animations/stamp.json";
import StampRoadmap from "./components/StampRoadmap";
import { useStampData } from "../model/useStampData";

interface UserInfo {
  id: string;
  name: string;
  role: string;
}

interface AttendanceRecord {
  date: string;
  isPresent: boolean;
}

interface MonthlyAttendanceData {
  presentDates?: string[];
  attendanceRecords?: AttendanceRecord[];
}

export const AttendancePage = () => {
  const router = useRouter();
  const [showStudyAnimation, setShowStudyAnimation] = useState(false);
  const [showAttendanceAnimation, setShowAttendanceAnimation] = useState(false);
  const [showNotesAnimation] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [monthlyAttendance, setMonthlyAttendance] =
    useState<MonthlyAttendanceData | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(true);

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    completeStamp,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    canCompleteStamp,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    activateNextStamp,
    initializeStampsFromAttendanceData,
    moveToNextStamp,
  } = useStampData();

  useEffect(() => {
    const loadUserInfo = () => {
      try {
        console.log("=== 사용자 정보 로드 시작 ===");

        const storedUserInfo = localStorage.getItem("userInfo");
        if (storedUserInfo) {
          const userData = JSON.parse(storedUserInfo);
          console.log("저장된 사용자 정보:", userData);
          setUserInfo(userData);
        } else {
          console.log("저장된 사용자 정보가 없습니다");
        }
      } catch (error) {
        console.error("사용자 정보 로드 중 오류:", error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadUserInfo();
  }, []);
  const fetchMonthlyAttendance = async () => {
    if (!userInfo?.id) return;

    try {
      console.log("===== 월별 출석 데이터 조회 시작 =====");

      const currentDate = new Date();
      const year = currentDate.getFullYear().toString();
      const month = (currentDate.getMonth() + 1).toString();

      console.log("🔍 요청 파라미터:", {
        childId: userInfo.id,
        year,
        month,
      });

      const response = await fetch(
        `/api/attendance/monthly?childId=${userInfo.id}&year=${year}&month=${month}`
      );

      if (response.ok) {
        const data = await response.json();
        console.log("✅ 월별 출석 데이터:", data);
        setMonthlyAttendance(data);

        updateStampsFromAttendanceData(data);
      } else {
        console.error("❌ 월별 출석 데이터 실패:", response.status);
      }
    } catch (error) {
      console.error("월별 출석 데이터 조회 오류:", error);
    } finally {
      setIsLoadingAttendance(false);
    }
  };

  useEffect(() => {
    if (userInfo?.id) {
      fetchMonthlyAttendance();
    }
  }, [userInfo]);

  const updateStampsFromAttendanceData = (
    attendanceData: MonthlyAttendanceData
  ) => {
    console.log("🎯 실제 출석 데이터로 스탬프 및 거북이 위치 업데이트");
    console.log("전체 출석 데이터:", attendanceData);

    let presentDates = attendanceData.presentDates || [];

    if (presentDates.length === 0 && attendanceData.attendanceRecords) {
      console.log("🔍 presentDates가 비어있음, attendanceRecords에서 추출");
      presentDates = attendanceData.attendanceRecords
        .filter((record: AttendanceRecord) => record.isPresent === true)
        .map((record: AttendanceRecord) => record.date);

      console.log("📅 attendanceRecords에서 추출한 출석 날짜들:", presentDates);
    } else {
      console.log("📅 presentDates에서 가져온 출석 날짜들:", presentDates);
    }

    initializeStampsFromAttendanceData(presentDates);
  };

  useEffect(() => {
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
      }, 10000);

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
    }, 10000);

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
    }, 10000);

    setClickTimeout(timeout);
    router.push("/learning/stage2");
  };

  const handleAttendanceClick = async () => {
    setShowClickAnimation(false);
    setLastClickTime(Date.now());

    if (clickTimeout) {
      clearTimeout(clickTimeout);
    }

    const timeout = setTimeout(async () => {
      await loadClickAnimation();
      setShowClickAnimation(true);
    }, 10000);

    setClickTimeout(timeout);

    setShowStampAnimation(true);

    try {
      console.log("===== 출석체크 시작 =====");
      console.log("🎯 단순 도장 찍기 - 백엔드에서 자동 데이터 생성");

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      console.log("📤 요청 헤더:", headers);

      const response = await fetch("/api/attendance/check", {
        method: "POST",
        headers,
      });

      if (response.ok) {
        const attendanceData = await response.json();
        console.log("출석체크 성공:", attendanceData);
        console.log("출석 ID:", attendanceData.attendanceId);
        console.log("출석 날짜:", attendanceData.date);
        console.log("출석 상태:", attendanceData.isPresent);

        setTimeout(() => {
          moveToNextStamp();
        }, 2000);
      } else {
        console.error("출석체크 실패:", response.status);
        try {
          const errorData = await response.json();
          console.error("에러 내용:", errorData);
        } catch {
          console.error("에러 응답 파싱 실패");
        }
        alert("출석체크에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("출석체크 요청 중 오류:", error);
      alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    }
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
    }, 10000);

    setClickTimeout(timeout);
    router.push("/learning/stage3");
  };

  const getUserDisplayName = () => {
    console.log("getUserDisplayName 호출:");
    console.log("- isLoadingUser:", isLoadingUser);
    console.log("- userInfo:", userInfo);
    console.log("- userInfo?.name:", userInfo?.name);

    if (isLoadingUser) {
      console.log("-> 로딩 중 반환");
      return "로딩중...";
    }
    if (!userInfo || !userInfo.name) {
      console.log("-> userInfo 없음, 기본값 반환");
      return "마음아";
    }
    const name = userInfo.name;
    if (name.length > 1 && /^[가-힣]+$/.test(name)) {
      const firstName = name.substring(1);
      console.log("- 한국어 이름 처리:", name, "->", firstName);
      const result = `${firstName}아`;
      console.log("-> 최종 결과:", result);
      return result;
    }

    const firstName = name.split(" ")[0];
    console.log("- 영어 이름 처리:", firstName);
    const result = `${firstName}아`;
    console.log("-> 최종 결과:", result);
    return result;
  };

  return (
    <div
      className="min-h-screen p-6 flex items-center relative overflow-hidden"
      style={{
        background:
          "linear-gradient(-45deg, #a8e6cf, #88d8c0, #b8e6b8, #c8e6c9, #dcedc8, #f0f8e8)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 20s ease infinite",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black text-black font-normal">
            안녕{" "}
            <span className="text-accent-primary">{getUserDisplayName()}</span>?
            <br />
            오늘도 재미있게 학습해보자
          </h1>
          <div className="relative">
            <div className="bg-white/80 rounded-2xl px-8 py-4 border-2 border-gray-200 relative shadow-lg">
              <h2 className="text-2xl font-black text-accent-primary text-center font-normal">
                {userInfo && userInfo.name ? userInfo.name : "마음이"}
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
              className="rounded-3xl p-8 relative flex-1 bg-gradient-to-br from-white/90 to-white/70"
              style={{
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-4 left-4 w-16 h-16 bg-blue-200/20 rounded-full animate-pulse"></div>
                <div
                  className="absolute top-8 right-8 w-12 h-12 bg-green-200/20 rounded-full animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div
                  className="absolute bottom-8 left-8 w-10 h-10 bg-purple-200/20 rounded-full animate-pulse"
                  style={{ animationDelay: "2s" }}
                ></div>
                <div
                  className="absolute bottom-4 right-4 w-14 h-14 bg-yellow-200/20 rounded-full animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>

                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"
                  style={{ animationDuration: "8s" }}
                ></div>
              </div>

              <h2 className="text-2xl font-black text-gray-800 mb-6 relative z-10 font-normal">
                매일하는 <span className="text-blue-400">단계별 학습</span>
              </h2>
              <div className="grid grid-cols-3 gap-6 relative z-10">
                <div className="relative">
                  <button
                    onClick={handleStage1Click}
                    className="bg-accent-transparent rounded-3xl p-6 text-center min-h-[140px] flex flex-col justify-center w-full"
                  >
                    <div className="mb-3 text-accent-primary">
                      <Layers size={40} className="mx-auto" strokeWidth={3} />
                    </div>
                    <p className="text-lg font-black text-gray-800 font-normal">
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
                        backgroundColor: "rgba(255,255,255,0.30)",
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
                    <p className="text-lg font-black text-gray-800 font-normal">
                      2단계
                      <br />
                      학습하기
                    </p>
                  </button>
                  {showStudyAnimation && (
                    <div
                      className="absolute inset-0 rounded-3xl flex items-center justify-center z-10 pointer-events-none"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.30)",
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
                    <p className="text-lg font-black text-gray-800 font-normal">
                      3단계
                      <br />
                      학습하기
                    </p>
                  </button>
                  {showNotesAnimation && (
                    <div
                      className="absolute inset-0 rounded-3xl flex items-center justify-center z-10 pointer-events-none"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.30)",
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
              className="rounded-3xl p-8 relative flex-1 bg-gradient-to-br from-white/90 to-white/70"
              style={{
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-4 left-4 w-16 h-16 bg-blue-200/20 rounded-full animate-pulse"></div>
                <div
                  className="absolute top-8 right-8 w-12 h-12 bg-green-200/20 rounded-full animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div
                  className="absolute bottom-8 left-8 w-10 h-10 bg-purple-200/20 rounded-full animate-pulse"
                  style={{ animationDelay: "2s" }}
                ></div>
                <div
                  className="absolute bottom-4 right-4 w-14 h-14 bg-yellow-200/20 rounded-full animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>

                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"
                  style={{ animationDuration: "8s" }}
                ></div>
              </div>

              <h2 className="text-2xl font-black text-gray-800 mb-6 relative z-10 font-normal">
                한 단계 <span className="text-blue-400">UP!</span>
              </h2>
              <div className="grid grid-cols-3 gap-3 relative z-10">
                <div className="relative">
                  <button
                    onClick={handleAttendanceClick}
                    className="bg-accent-transparent rounded-3xl p-6 text-center min-h-[140px] flex flex-col justify-center w-full"
                  >
                    <div className="mb-3 text-accent-primary">
                      <Stamp size={40} className="mx-auto" strokeWidth={3} />
                    </div>
                    <p className="text-lg font-black text-gray-800 font-normal">
                      오늘의 <br />
                      출석하기
                    </p>
                  </button>
                  {showStampAnimation && (
                    <div
                      className="absolute inset-0 rounded-3xl flex items-center justify-center z-10 pointer-events-none"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.30)",
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
                <button className="bg-accent-transparent rounded-3xl p-6 text-center min-h-[140px] flex flex-col justify-center w-full">
                  <div className="mb-3 text-accent-primary">
                    <Notebook size={40} className="mx-auto" strokeWidth={3} />
                  </div>
                  <p className="text-lg font-black text-gray-800 font-normal">
                    오답노트
                  </p>
                </button>
                <button className="bg-accent-transparent rounded-3xl p-6 px-10 text-center min-h-[140px] flex flex-col justify-center w-full">
                  <div className="mb-3 text-accent-primary">
                    <BookOpen size={40} className="mx-auto" strokeWidth={3} />
                  </div>
                  <p className="text-lg font-black text-gray-800 font-normal">
                    데일리
                    <br />
                    학습하기
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
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
      `}</style>
    </div>
  );
};
