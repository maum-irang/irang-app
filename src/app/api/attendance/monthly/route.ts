import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    console.log("===== 월별 출석 데이터 조회 시작 =====");

    const url = new URL(request.url);
    const childId = url.searchParams.get("childId");
    

    const currentDate = new Date();
    const year = url.searchParams.get("year") || currentDate.getFullYear().toString();
    const month = url.searchParams.get("month") || (currentDate.getMonth() + 1).toString();

    console.log("요청 파라미터:", { childId, year, month });
    console.log("현재 날짜 기본값 적용:", { 
      현재년도: currentDate.getFullYear(), 
      현재월: currentDate.getMonth() + 1 
    });

    if (!childId) {
      return NextResponse.json(
        { error: "childId 파라미터가 필요합니다." },
        { status: 400 }
      );
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": "Mozilla/5.0 (compatible; irang-app/1.0)",
    };

    console.log(
      "📤 백엔드 요청 URL:",
      `https://api2.irang.us/attendance/monthly?childId=${childId}&year=${year}&month=${month}`
    );

    const response = await fetch(
      `https://api2.irang.us/attendance/monthly?childId=${childId}&year=${year}&month=${month}`,
      {
        method: "GET",
        headers,
      }
    );

    console.log("📥 월별 출석 API 응답 상태:", response.status);

    if (response.ok) {
      const monthlyData = await response.json();
      console.log("✅ 월별 출석 데이터 성공:", monthlyData);
      return NextResponse.json(monthlyData);
    } else {
      console.error(
        "❌ 월별 출석 데이터 실패:",
        response.status,
        response.statusText
      );

      const tempData = {
        childName: "신이현",
        year: year,
        month: month,
        totalDays: 31,
        presentDates: ["2025-01-22"],
        absentDates: [],
        attendanceRate: 3.23,
        attendanceRecords: [
          {
            date: "2025-01-22",
            isPresent: true,
          },
        ],
      };

      console.log("🔄 임시 월별 출석 데이터 반환:", tempData);
      return NextResponse.json(tempData);
    }
  } catch (error) {
    console.error("월별 출석 API 프록시 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다.", details: String(error) },
      { status: 500 }
    );
  }
}
