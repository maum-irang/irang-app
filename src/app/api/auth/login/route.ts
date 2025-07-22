import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("===== 로그인 API 프록시 시작 =====");
    const body = await request.json();
    console.log("로그인 요청 body:", body);

    const loginData = {
      ...body,
      password: body.password || "dummy",
      mode: body.mode || "app",
    };
    console.log("백엔드로 전송할 데이터:", loginData);

    const response = await fetch("https://api2.irang.us/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
      credentials: "include",
    });

    console.log("백엔드 로그인 응답 상태:", response.status);
    console.log(
      "백엔드 응답 헤더:",
      Object.fromEntries(response.headers.entries())
    );

    const responseText = await response.text();
    console.log("백엔드 응답 텍스트:", responseText);

    if (response.ok) {
      const setCookieHeaders = response.headers.getSetCookie();
      console.log("백엔드에서 받은 Set-Cookie 헤더들:", setCookieHeaders);

      const nextResponse = new NextResponse(responseText, {
        status: response.status,
        headers: {
          "Content-Type": "application/json",
        },
      });

      setCookieHeaders.forEach(cookie => {
        nextResponse.headers.append("Set-Cookie", cookie);
      });

      return nextResponse;
    } else {
      console.error("❌ 백엔드 로그인 실패:", responseText);
      return NextResponse.json(
        { error: "로그인에 실패했습니다.", details: responseText },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("로그인 API 프록시 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
