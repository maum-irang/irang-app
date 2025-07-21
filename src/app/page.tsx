"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/shared/ui/Input";
import Lottie from "lottie-react";
import celebrationAnimation from "../../public/animations/celebration.json";

export default function LoginPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    if (userId && password) {
      setShowCelebration(true);
      setTimeout(() => {
        console.log("로그인 처리:", { userId, password });
        // 로그인 성공 후 홈으로 이동
        router.push("/home");
      }, 2000);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(-45deg, #a8e6cf, #88d8c0, #b8e6b8, #c8e6c9, #dcedc8, #f0f8e8)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 20s ease infinite",
      }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-12 relative">
          <div className="bg-white/90 rounded-3xl p-8 border-2 border-gray-200/50 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-4 left-4 w-12 h-12 bg-blue-200/20 rounded-full animate-pulse"></div>
              <div
                className="absolute top-8 right-8 w-8 h-8 bg-green-200/20 rounded-full animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
              <div
                className="absolute bottom-4 left-8 w-10 h-10 bg-purple-200/20 rounded-full animate-pulse"
                style={{ animationDelay: "2s" }}
              ></div>
            </div>

            <h1 className="text-3xl font-normal text-gray-800 relative z-10">
              간단하게 <span className="text-accent-primary">본인확인</span>을 할게!
            </h1>
            <p className="text-lg font-normal text-content-secondary mt-2 relative z-10">
              오늘도 함께 학습해보자
            </p>

            {showCelebration && (
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <Lottie
                  animationData={celebrationAnimation}
                  loop={false}
                  autoPlay
                  style={{ width: 120, height: 120 }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/90 rounded-3xl p-8  border-2 border-gray-200/50 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"
              style={{ animationDuration: "8s" }}
            ></div>
          </div>

          <div className="space-y-6 relative z-10">
            <div>
              <label className="block text-lg font-normal text-gray-800 mb-3">
                아이디
              </label>
              <Input
                placeholder="아이디를 입력하세요"
                value={userId}
                onChange={handleUserIdChange}
                size="medium"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-lg font-normal text-gray-800 mb-3">
                비밀번호
              </label>
              <div className="relative">
                <input
                  type="password"
                  className="flex w-full h-[38px] px-3 rounded-[11px] border border-stroke-primary text-[13px] font-normal leading-5 tracking-[-0.26px] outline-none transition-all focus:border-[1.5px] focus:border-accent-primary text-content-primary"
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={handlePasswordChange}
                  style={{ fontFamily: "Pretendard" }}
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleLogin}
                disabled={!userId || !password}
                className={`w-full py-4 px-6 bg-accent-primary text-white rounded-2xl font-normal text-base transition-all duration-300 ${
                  !userId || !password
                    ? "opacity-50 cursor-not-allowed"
                    : "active:scale-95"
                }`}
              >
                다음
              </button>
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
}
