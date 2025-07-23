import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const loginData = {
      ...body,
      password: body.password || "dummy",
      mode: body.mode || "app",
    };

    const response = await fetch("https://api2.irang.us/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
      credentials: "include",
    });

    const responseText = await response.text();

    if (response.ok) {
      const setCookieHeaders = response.headers.getSetCookie();

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
      return NextResponse.json(
        { error: "로그인에 실패했습니다.", details: responseText },
        { status: response.status }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
