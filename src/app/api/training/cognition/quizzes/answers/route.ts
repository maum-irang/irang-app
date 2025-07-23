import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const cookieHeader = request.headers.get("cookie");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (cookieHeader) {
      headers["Cookie"] = cookieHeader;
    }

    const response = await fetch(
      "https://api2.irang.us/training/cognition/quizzes/answers",
      {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        credentials: "include",
      }
    );

    if (response.ok) {
      const responseText = await response.text();

      try {
        const resultData = JSON.parse(responseText);

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
