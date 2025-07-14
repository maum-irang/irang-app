"use client";
import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Camera, CameraOff, Volume2 } from "lucide-react";

export const Stage3CamTestPage = () => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState("");
  const [camOn, setCamOn] = useState(true); 
  const [stream, setStream] = useState<MediaStream | null>(null);

  const fullText = "카메라가 잘 나오는지 확인해 주세요!\n화면에 얼굴이 잘 보이면 '다음 단계'를 눌러주세요.";
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let index = 0;
    setIsTyping(true);
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 40);
    return () => clearInterval(timer);
  }, []);

  const playTTS = () => {
    if (window.speechSynthesis) {
      const utter = new window.SpeechSynthesisUtterance(fullText.replace(/\n/g, " "));
      utter.lang = "ko-KR";
      window.speechSynthesis.speak(utter);
    }
  };


  const handleBack = () => {
    router.push("/learning/stage3");
  };



  useEffect(() => {
    let localStream: MediaStream | null = null;
    if (camOn) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(s => {
          setStream(s);
          localStream = s;
        })
        .catch(() => setError("카메라 접근이 불가능합니다. 권한을 허용해 주세요."));
    } else {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [camOn]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const handleToggleCam = () => {
    setCamOn(on => !on);
    setError("");
  };

  const handleNext = () => {
    if (camOn && stream) {
      router.push("/learning/stage3/quiz");
    }
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
          <h1 className="text-3xl font-black text-black">
            <span className="text-blue-300">카메라 테스트</span>
          </h1>
        </div>

        <div className="mb-8">
          <div className="w-full h-[400px] bg-gray-100 rounded-3xl flex items-center justify-center text-2xl text-gray-700 font-black overflow-hidden">
            {error ? (
              <span className="text-red-500 font-bold">{error}</span>
            ) : camOn && stream ? (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover rounded-3xl" 
              />
            ) : (
              <span className="text-3xl text-gray-400">캠</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={handleToggleCam}
            className={`p-8 rounded-3xl font-black text-lg transition-all duration-300 active:scale-95 ${
              camOn
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-white/90 backdrop-blur-sm text-blue-300 hover:bg-white"
            }`}
            style={{
              borderRadius: "30px 40px 35px 25px",
            }}
          >
            <div className="flex flex-col items-center space-y-3">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  camOn ? "bg-white/20" : "bg-blue-100"
                }`}
              >
                {camOn ? <CameraOff size={32} /> : <Camera size={32} />}
              </div>
              <span>{camOn ? "캠 끄기" : "캠 켜기"}</span>
            </div>
          </button>
          
          <button
            onClick={handleNext}
            disabled={!(camOn && stream)}
            className={`p-8 rounded-3xl font-black text-lg transition-all duration-300 active:scale-95 ${
              camOn && stream
                ? "bg-blue-300 text-white hover:bg-blue-300"
                : "bg-white/90 backdrop-blur-sm text-gray-400 cursor-not-allowed opacity-60"
            }`}
            style={{
              borderRadius: "25px 35px 30px 40px",
            }}
          >
            <div className="flex flex-col items-center space-y-3">
              <span>학습 시작하기</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};