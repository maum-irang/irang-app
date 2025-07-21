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
  const [isLoading, setIsLoading] = useState(false);

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    if (userId && password && !isLoading) {
      try {
        setIsLoading(true);
        setShowCelebration(true);
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: userId,
            password: password,
            mode: "child",
          }),
        });

        if (response.status === 201) {
          console.log("✅ 로그인 성공!");

          const loginData = await response.json();
          console.log("📥 로그인 응답 전체:", loginData);
          console.log("📄 응답의 모든 키:", Object.keys(loginData));

          if (loginData.id && loginData.name) {
            localStorage.setItem("userInfo", JSON.stringify(loginData));
            console.log("✅ 사용자 정보 저장 완료:", loginData);
          } else {
            console.log("❌ 사용자 정보 불완전:", {
              id: loginData.id,
              name: loginData.name,
            });
          }

          console.log("🔍 토큰 찾는 중...");
          console.log("- loginData.token:", loginData.token);
          console.log("- loginData.accessToken:", loginData.accessToken);
          console.log("- loginData.access_token:", loginData.access_token);

          if (
            loginData.token ||
            loginData.accessToken ||
            loginData.access_token
          ) {
            const token =
              loginData.token ||
              loginData.accessToken ||
              loginData.access_token;
            localStorage.setItem("authToken", token);
            console.log("✅ 토큰 저장 완료:", token);

            const savedToken = localStorage.getItem("authToken");
            console.log("💾 저장된 토큰 확인:", savedToken);
          } else {
            console.log("❌ 로그인 응답에 토큰이 없습니다!");
          }

          setTimeout(() => {
            router.push("/home");
          }, 2000);
        } else {
          console.error("로그인 실패:", response.status);
          setShowCelebration(false);
          alert("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
        }
      } catch (error) {
        console.error("로그인 요청 중 오류:", error);
        setShowCelebration(false);
        alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
      } finally {
        setIsLoading(false);
      }
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
              간단하게 <span className="text-accent-primary">본인확인</span>을
              할게!
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
                disabled={!userId || !password || isLoading}
                className={`w-full py-4 px-6 bg-accent-primary text-white rounded-2xl font-normal text-base transition-all duration-300 ${
                  !userId || !password || isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "active:scale-95"
                }`}
              >
                {isLoading ? "로그인 중..." : "다음"}
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
