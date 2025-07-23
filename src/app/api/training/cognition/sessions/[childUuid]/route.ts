import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { params }: { params: Promise<{ childUuid: string }> }
) {
  try {
    const cookieHeader = request.headers.get("cookie");

    let userId = null;
    if (cookieHeader) {
      const cookies = cookieHeader
        .split(";")
        .reduce((acc: Record<string, string>, cookie) => {
          const [key, value] = cookie.trim().split("=");
          acc[key] = value;
          return acc;
        }, {});

      if (cookies.userInfo) {
        try {
          const userInfo = JSON.parse(decodeURIComponent(cookies.userInfo));
          userId = userInfo.id;
        } catch {
          console.log("쿠키에서 userInfo 파싱 실패");
        }
      }
    }

    console.log("쿠키에서 추출한 userId:", userId);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (cookieHeader) {
      headers["Cookie"] = cookieHeader;
    }

    const response = await fetch(
      "https://api2.irang.us/training/cognition/sessions",
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
        const sessionData = JSON.parse(responseText);

        return NextResponse.json(sessionData, {
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
        { error: "세션 시작에 실패했습니다.", details: errorText },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("인지 훈련 세션 시작 API 프록시 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다.", details: String(error) },
      { status: 500 }
    );
  }
}
