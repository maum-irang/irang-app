interface StartSessionResponse {
  attemptId: string;
  message: string;
  startTime: string;
}

interface QuizSubmissionData {
  quizId: string;
  selectedIndex: number;
}

interface SubmitQuizResponse {
  isCorrect: boolean;
  selectedOption: string;
  correctOption: string;
  timeTakenSeconds: number;
  ended: boolean;
}

interface QuizQuestion {
  quizId: string;
  imageUrl: string;
  title: string;
  options: string[];
  correctIndex?: number;
  correctAnswer?: number;
  explanation?: string;
}

export const startCognitionSession = async (
  childUuid: string
): Promise<StartSessionResponse> => {
  console.log("🚀 세션 시작 요청:", { childUuid });

  const response = await fetch(
    `/api/training/cognition/sessions/${childUuid}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  console.log("📡 세션 시작 응답 상태:", response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ 세션 시작 API 에러 응답:", errorText);

    let errorData;
    try {
      errorData = JSON.parse(errorText);
    } catch {
      errorData = { error: errorText };
    }

    throw new Error(
      errorData.error || `세션 시작에 실패했습니다. (상태: ${response.status})`
    );
  }

  const data = await response.json();
  console.log("✅ 세션 시작 성공:", data);
  return data;
};

export const getQuizByAttemptId = async (
  attemptUuid: string
): Promise<QuizQuestion> => {
  console.log("🎯 퀴즈 가져오기 요청:", { attemptUuid });

  try {
    const response = await fetch(
      `/api/training/cognition/attempts/quizzes/${attemptUuid}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }
    );

    console.log("📡 퀴즈 가져오기 응답 상태:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ 퀴즈 가져오기 에러 응답:", errorText);

      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText };
      }

      throw new Error(
        errorData.error ||
          `퀴즈 가져오기에 실패했습니다. (상태: ${response.status})`
      );
    }

    const data = await response.json();
    console.log("✅ 퀴즈 가져오기 성공:", data);
    return data;
  } catch (error) {
    console.error("❌ 퀴즈 가져오기 전체 에러:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("퀴즈 가져오기 중 알 수 없는 오류가 발생했습니다.");
  }
};

export const submitQuizResult = async (
  quizData: QuizSubmissionData
): Promise<SubmitQuizResponse> => {
  console.log("📝 퀴즈 결과 제출:", { quizData });

  const response = await fetch(`/api/training/cognition/quizzes/answers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(quizData),
  });

  console.log("📡 결과 제출 응답 상태:", response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ 결과 제출 에러:", errorText);

    let errorData;
    try {
      errorData = JSON.parse(errorText);
    } catch {
      errorData = { error: errorText };
    }

    throw new Error(
      errorData.error ||
        `퀴즈 결과 제출에 실패했습니다. (상태: ${response.status})`
    );
  }

  const data = await response.json();
  console.log("✅ 결과 제출 성공:", data);
  return data;
};

export const getUserUuid = (): string | null => {
  if (typeof window === "undefined") {
    console.log("⚠️ 서버 사이드에서 호출됨");
    return null;
  }

  console.log("👤 localStorage에서 사용자 정보 조회 시작");

  const userInfo = localStorage.getItem("userInfo");
  console.log("👤 localStorage 원본 데이터:", userInfo);

  if (!userInfo) {
    console.log("❌ localStorage에 userInfo가 없습니다");
    return null;
  }

  try {
    const userData = JSON.parse(userInfo);
    console.log("👤 파싱된 사용자 데이터:", JSON.stringify(userData, null, 2));

    // id 필드 우선 확인
    if (userData.id) {
      console.log("✅ userData.id 찾음:", userData.id);
      return userData.id;
    }

    // 다른 필드들도 확인
    const uuid = userData.uuid || userData.childId || userData.userId;
    if (uuid) {
      console.log("✅ 대체 UUID 필드 찾음:", uuid);
      return uuid;
    }

    console.log("❌ 어떤 UUID 필드도 찾을 수 없음");
    return null;
  } catch (error) {
    console.error("❌ 사용자 정보 파싱 오류:", error);
    return null;
  }
};

export const createQuizQuestion = getQuizByAttemptId;
