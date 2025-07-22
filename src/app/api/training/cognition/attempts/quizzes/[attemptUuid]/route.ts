import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ attemptUuid: string }> }
) {
  try {
    console.log("===== 퀴즈 문제 가져오기 API 호출 =====");

    const { attemptUuid } = await params;
    console.log("attemptUuid:", attemptUuid);

    const response = await fetch(
      `https://api2.irang.us/training/cognition/attempts/quizzes/${attemptUuid}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("백엔드 응답 상태:", response.status);

    if (response.ok) {
      const responseText = await response.text();
      console.log("백엔드 응답:", responseText);

      try {
        const quizData = JSON.parse(responseText);
        console.log("파싱된 퀴즈 데이터:", quizData);

        return NextResponse.json(quizData, {
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
      console.log("API 오류 응답:", errorText);

      return NextResponse.json(
        { error: "퀴즈 문제 가져오기에 실패했습니다.", details: errorText },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("퀴즈 문제 가져오기 API 프록시 오류:", error);
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
    console.log("===== POST 요청 수신 =====");

    const { attemptUuid } = await params;
    console.log("attemptUuid:", attemptUuid);

    const body = await request.json();
    console.log("요청 body:", body);
    console.log("body의 타입:", typeof body);
    console.log("body의 키들:", Object.keys(body));

    const isQuizFetch =
      Object.keys(body).length === 0 || (!body.quizId && !body.selectedIndex);
    console.log("퀴즈 가져오기 요청인가?", isQuizFetch);

    if (isQuizFetch) {
      console.log("===== 퀴즈 문제 가져오기 처리 =====");

      const cookieHeader = request.headers.get("cookie");
      console.log("전달할 쿠키:", cookieHeader);

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

      console.log("백엔드 퀴즈 가져오기 응답 상태:", response.status);

      if (response.ok) {
        const responseText = await response.text();
        console.log("백엔드 퀴즈 응답:", responseText);

        try {
          const quizData = JSON.parse(responseText);
          console.log("파싱된 퀴즈 데이터:", quizData);

          return NextResponse.json(quizData, {
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
        console.log("퀴즈 가져오기 API 오류 응답:", errorText);

        return NextResponse.json(
          { error: "퀴즈 문제 가져오기에 실패했습니다.", details: errorText },
          { status: response.status }
        );
      }
    } else {
      console.log("===== 퀴즈 결과 제출 처리 =====");

      const cookieHeader = request.headers.get("cookie");
      console.log("전달할 쿠키:", cookieHeader);

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

      console.log("백엔드 결과 제출 응답 상태:", response.status);

      if (response.ok) {
        const responseText = await response.text();
        console.log("백엔드 결과 제출 응답:", responseText);

        try {
          const resultData = JSON.parse(responseText);
          console.log("파싱된 결과 데이터:", resultData);

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
        console.log("결과 제출 API 오류 응답:", errorText);

        return NextResponse.json(
          { error: "퀴즈 결과 제출에 실패했습니다.", details: errorText },
          { status: response.status }
        );
      }
    }
  } catch (error) {
    console.error("POST API 프록시 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다.", details: String(error) },
      { status: 500 }
    );
  }
}
