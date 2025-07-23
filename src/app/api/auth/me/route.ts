import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");

    const response = await fetch("https://api2.irang.us/auth/me", {
      method: "GET",
      headers: {
        Accept: "*/*",
        ...(authHeader && { Authorization: authHeader }),
      },
    });

    if (response.ok) {
      const responseText = await response.text();

      try {
        const userData = JSON.parse(responseText);

        const result = NextResponse.json(userData, {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });

        return result;
      } catch {
        return NextResponse.json(
          { error: "응답 파싱 오류", originalResponse: responseText },
          { status: 500 }
        );
      }
    } else {
      const errorText = await response.text();

      return NextResponse.json(
        { error: "사용자 정보를 가져올 수 없습니다.", details: errorText },
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
