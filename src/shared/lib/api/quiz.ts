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

interface QuizResultSummary {
  sessionId: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  averageTimeSeconds: number;
  startTime: string;
  endTime: string;
  duration: number;
  quizzes: {
    quizId: string;
    isCorrect: boolean;
    selectedOption: string;
    correctOption: string;
    timeTakenSeconds: number;
    answeredAt: string;
    imageUrl: string;
  }[];
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
  const response = await fetch(
    `/api/training/cognition/sessions/${childUuid}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

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
  return data;
};

export const getQuizByAttemptId = async (
  attemptUuid: string
): Promise<QuizQuestion> => {
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

    if (!response.ok) {
      const errorText = await response.text();

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
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("퀴즈 가져오기 중 알 수 없는 오류가 발생했습니다.");
  }
};

export const submitQuizResult = async (
  quizData: QuizSubmissionData
): Promise<SubmitQuizResponse> => {
  const response = await fetch(`/api/training/cognition/quizzes/answers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(quizData),
  });

  if (!response.ok) {
    const errorText = await response.text();

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
  return data;
};

export const getUserUuid = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const userInfo = localStorage.getItem("userInfo");

  if (!userInfo) {
    return null;
  }

  try {
    const userData = JSON.parse(userInfo);

    // id 필드 우선 확인
    if (userData.id) {
      return userData.id;
    }

    // 다른 필드들도 확인
    const uuid = userData.uuid || userData.childId || userData.userId;
    if (uuid) {
      return uuid;
    }

    return null;
  } catch {
    return null;
  }
};

// 퀴즈 결과 조회
export const getQuizResult = async (
  attemptId: string
): Promise<QuizResultSummary> => {
  const response = await fetch(
    `/api/training/cognition/attempts/result/${attemptId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    let errorData;
    try {
      errorData = JSON.parse(errorText);
    } catch {
      errorData = { error: errorText };
    }

    throw new Error(
      errorData.error ||
        `퀴즈 결과 조회에 실패했습니다. (상태: ${response.status})`
    );
  }

  const data = await response.json();
  return data;
};

export const createQuizQuestion = getQuizByAttemptId;
