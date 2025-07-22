import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    console.log("===== /api/auth/me 시작 =====");
    const authHeader = request.headers.get("Authorization");
    console.log("받은 Authorization 헤더:", authHeader);

    const response = await fetch("https://api2.irang.us/auth/me", {
      method: "GET",
      headers: {
        Accept: "*/*",
        ...(authHeader && { Authorization: authHeader }),
      },
    });

    console.log("백엔드 응답 상태:", response.status);
    console.log(
      "백엔드 응답 헤더:",
      Object.fromEntries(response.headers.entries())
    );

    if (response.ok) {
      const responseText = await response.text();
      console.log("백엔드 응답 텍스트:", responseText);

      try {
        const userData = JSON.parse(responseText);
        console.log("파싱된 사용자 데이터:", userData);

        const result = NextResponse.json(userData, {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("===== /api/auth/me 성공 완료 =====");
        return result;
      } catch (parseError) {
        console.error("JSON 파싱 오류:", parseError);
        console.log("원본 응답:", responseText);

        return NextResponse.json(
          { error: "응답 파싱 오류", originalResponse: responseText },
          { status: 500 }
        );
      }
    } else {
      const errorText = await response.text();
      console.log("API 오류 응답:", errorText);

      return NextResponse.json(
        { error: "사용자 정보를 가져올 수 없습니다.", details: errorText },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("사용자 정보 API 프록시 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다.", details: String(error) },
      { status: 500 }
    );
  }
}
