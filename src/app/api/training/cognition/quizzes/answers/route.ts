import { NextRequest, NextResponse } from "next/server";

// 퀴즈 답안 제출 (POST)
export async function POST(request: NextRequest) {
  try {
    console.log("===== 퀴즈 답안 제출 API 호출 =====");

    const body = await request.json();
    console.log("제출할 답안 데이터:", JSON.stringify(body, null, 2));

    // 브라우저의 쿠키를 백엔드로 전달
    const cookieHeader = request.headers.get("cookie");
    console.log("전달할 쿠키:", cookieHeader);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // 쿠키가 있으면 백엔드 요청에 포함
    if (cookieHeader) {
      headers["Cookie"] = cookieHeader;
    }

    console.log("백엔드로 전송할 최종 데이터:", {
      url: "https://api2.irang.us/training/cognition/quizzes/answers",
      headers,
      body: JSON.stringify(body),
    });

    const response = await fetch(
      "https://api2.irang.us/training/cognition/quizzes/answers",
      {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        credentials: "include", // 쿠키 포함
      }
    );

    console.log("백엔드 답안 제출 응답 상태:", response.status);
    console.log(
      "백엔드 응답 헤더:",
      Object.fromEntries(response.headers.entries())
    );

    if (response.ok) {
      const responseText = await response.text();
      console.log("백엔드 답안 제출 원본 응답:", responseText);

      try {
        const resultData = JSON.parse(responseText);
        console.log("파싱된 결과 데이터:", JSON.stringify(resultData, null, 2));
        console.log(
          "isCorrect 값:",
          resultData.isCorrect,
          "타입:",
          typeof resultData.isCorrect
        );
        console.log(
          "ended 값:",
          resultData.ended,
          "타입:",
          typeof resultData.ended
        );

        return NextResponse.json(resultData, {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (parseError) {
        console.error("JSON 파싱 오류:", parseError);
        return NextResponse.json(
          { error: "응답 파싱 오류", originalResponse: responseText },
          { status: 500 }
        );
      }
    } else {
      const errorText = await response.text();
      console.log("답안 제출 API 오류 응답:", errorText);

      return NextResponse.json(
        { error: "퀴즈 답안 제출에 실패했습니다.", details: errorText },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("답안 제출 API 프록시 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다.", details: String(error) },
      { status: 500 }
    );
  }
}
