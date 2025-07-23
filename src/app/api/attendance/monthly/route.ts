import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const childId = url.searchParams.get("childId");

    const currentDate = new Date();
    const year =
      url.searchParams.get("year") || currentDate.getFullYear().toString();
    const month =
      url.searchParams.get("month") || (currentDate.getMonth() + 1).toString();

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

    const response = await fetch(
      `https://api2.irang.us/attendance/monthly?childId=${childId}&year=${year}&month=${month}`,
      {
        method: "GET",
        headers,
      }
    );

    if (response.ok) {
      const monthlyData = await response.json();
      return NextResponse.json(monthlyData);
    } else {
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

      return NextResponse.json(tempData);
    }
  } catch (error) {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다.", details: String(error) },
      { status: 500 }
    );
  }
}
