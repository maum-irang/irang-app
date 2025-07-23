import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ attemptUuid: string }> }
) {
  try {
    const { attemptUuid } = await params;

    const response = await fetch(
      `https://api2.irang.us/training/cognition/attempts/quizzes/${attemptUuid}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const responseText = await response.text();

      try {
        const quizData = JSON.parse(responseText);

        return NextResponse.json(quizData, {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch {
        return NextResponse.json(
          { error: "응답 파싱 오류", originalResponse: responseText },
          { status: 500 }
        );
      }
    } else {
      const errorText = await response.text();

      return NextResponse.json(
        { error: "퀴즈 문제 가져오기에 실패했습니다.", details: errorText },
        { status: response.status }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다.", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ attemptUuid: string }> }
) {
  try {
    const { attemptUuid } = await params;

    const body = await request.json();

    const isQuizFetch =
      Object.keys(body).length === 0 || (!body.quizId && !body.selectedIndex);

    if (isQuizFetch) {
      const cookieHeader = request.headers.get("cookie");

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (cookieHeader) {
        headers["Cookie"] = cookieHeader;
      }

      const response = await fetch(
        `https://api2.irang.us/training/cognition/attempts/quizzes/${attemptUuid}`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({}),
          credentials: "include",
        }
      );

      if (response.ok) {
        const responseText = await response.text();

        try {
          const quizData = JSON.parse(responseText);

          return NextResponse.json(quizData, {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          });
        } catch {
          return NextResponse.json(
            { error: "응답 파싱 오류", originalResponse: responseText },
            { status: 500 }
          );
        }
      } else {
        const errorText = await response.text();

        return NextResponse.json(
          { error: "퀴즈 문제 가져오기에 실패했습니다.", details: errorText },
          { status: response.status }
        );
      }
    } else {
      const cookieHeader = request.headers.get("cookie");

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (cookieHeader) {
        headers["Cookie"] = cookieHeader;
      }

      const response = await fetch(
        `https://api2.irang.us/training/cognition/attempts/quizzes/${attemptUuid}`,
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
        } catch {
          return NextResponse.json(
            { error: "응답 파싱 오류", originalResponse: responseText },
            { status: 500 }
          );
        }
      } else {
        const errorText = await response.text();

        return NextResponse.json(
          { error: "퀴즈 결과 제출에 실패했습니다.", details: errorText },
          { status: response.status }
        );
      }
    }
  } catch (error) {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다.", details: String(error) },
      { status: 500 }
    );
  }
}
