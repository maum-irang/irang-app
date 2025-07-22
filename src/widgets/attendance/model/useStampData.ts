import { useState, useEffect } from "react";

interface StampData {
  id: number;
  completed: boolean;
  position: {
    top: string;
    left: string;
  };
  isToday?: boolean;
}

interface StampState {
  stamps: StampData[];
  completedCount: number;
  totalCount: number;
  todayStampId: number | null;
}

export const useStampData = () => {
  const [stampState, setStampState] = useState<StampState>({
    stamps: [],
    completedCount: 0,
    totalCount: 0,
    todayStampId: null,
  });

  const initializeStamps = (): StampData[] => {
    const stampPositions = [
      { top: "15%", left: "20%" },
      { top: "15%", left: "50%" },
      { top: "15%", left: "80%" },
      { top: "40%", left: "20%" },
      { top: "40%", left: "50%" },
      { top: "40%", left: "80%" },
      { top: "65%", left: "20%" },
      { top: "65%", left: "50%" },
      { top: "65%", left: "80%" },
    ];

    return stampPositions.map((position, index) => ({
      id: index + 1,
      completed: index < 5,
      position,
      isToday: index === 5,
    }));
  };

  const completeStamp = (stampId: number) => {
    setStampState(prev => ({
      ...prev,
      stamps: prev.stamps.map(stamp =>
        stamp.id === stampId
          ? { ...stamp, completed: true, isToday: false }
          : stamp
      ),
      completedCount: prev.completedCount + 1,
    }));
  };

  const updateTodayStamp = (stampId: number) => {
    setStampState(prev => ({
      ...prev,
      stamps: prev.stamps.map(stamp => ({
        ...stamp,
        isToday: stamp.id === stampId,
      })),
      todayStampId: stampId,
    }));
  };

  const resetStamps = () => {
    const newStamps = initializeStamps();
    setStampState({
      stamps: newStamps,
      completedCount: newStamps.filter(s => s.completed).length,
      totalCount: newStamps.length,
      todayStampId: newStamps.find(s => s.isToday)?.id || null,
    });
  };

  const canCompleteStamp = (stampId: number): boolean => {
    const stamp = stampState.stamps.find(s => s.id === stampId);
    return stamp ? !stamp.completed && (stamp.isToday ?? false) : false;
  };

  const activateNextStamp = () => {
    const nextIncompleteStamp = stampState.stamps.find(s => !s.completed);
    if (nextIncompleteStamp) {
      updateTodayStamp(nextIncompleteStamp.id);
    }
  };

  // 출석체크 완료 후 거북이 즉시 이동
  const moveToNextStamp = () => {
    const currentTurtleStamp = stampState.stamps.find(s => s.isToday);
    if (currentTurtleStamp && !currentTurtleStamp.completed) {
      // 현재 스탬프 완료 처리
      const updatedStamps = stampState.stamps.map(stamp =>
        stamp.id === currentTurtleStamp.id
          ? { ...stamp, completed: true, isToday: false }
          : stamp
      );

      // 다음 미완료 스탬프 찾아서 거북이 이동
      const nextStamp = updatedStamps.find(s => !s.completed);
      const finalStamps = updatedStamps.map(stamp => ({
        ...stamp,
        isToday: nextStamp ? stamp.id === nextStamp.id : false,
      }));

      setStampState(prev => ({
        ...prev,
        stamps: finalStamps,
        completedCount: finalStamps.filter(s => s.completed).length,
        todayStampId: nextStamp?.id || null,
      }));

      console.log(`🐢 거북이 이동: ${currentTurtleStamp.id}일차 → ${nextStamp?.id || '완료'}일차`);
    }
  };

  // 실제 출석 데이터를 기반으로 스탬프 상태 초기화
  const initializeStampsFromAttendanceData = (presentDates: string[]) => {
    console.log("🔄 출석 데이터 기반 스탬프 초기화:", presentDates);

    const stampPositions = [
      { top: "15%", left: "20%" },
      { top: "15%", left: "50%" },
      { top: "15%", left: "80%" },
      { top: "40%", left: "20%" },
      { top: "40%", left: "50%" },
      { top: "40%", left: "80%" },
      { top: "65%", left: "20%" },
      { top: "65%", left: "50%" },
      { top: "65%", left: "80%" },
    ];

    const currentDate = new Date();
    const currentDay = currentDate.getDate();

    // 출석한 날짜들을 날짜별로 변환
    const attendedDays = presentDates
      .map(dateStr => {
        const date = new Date(dateStr);
        return date.getDate();
      })
      .filter(day => day <= currentDay); // 현재 날짜까지만

    console.log("📅 출석한 날짜들:", attendedDays);
    console.log("📍 현재 날짜:", currentDay);

    // 스탬프 생성 (1일부터 시작)
    const newStamps = stampPositions.map((position, index) => {
      const stampDay = index + 1;
      const isCompleted = attendedDays.includes(stampDay);

      return {
        id: stampDay,
        completed: isCompleted,
        position,
        isToday: false, // 일단 모두 false로 설정
      };
    });

    // 거북이 위치 결정: 마지막 출석한 다음 날짜
    const lastAttendedDay = Math.max(...attendedDays, 0);
    const turtlePosition = Math.min(lastAttendedDay + 1, stampPositions.length);

    console.log("🐢 마지막 출석일:", lastAttendedDay);
    console.log("🎯 거북이 위치 (날짜):", turtlePosition);

    // 거북이 위치 설정
    const stampsWithTurtle = newStamps.map(stamp => ({
      ...stamp,
      isToday: stamp.id === turtlePosition,
    }));

    const completedCount = stampsWithTurtle.filter(s => s.completed).length;

    setStampState({
      stamps: stampsWithTurtle,
      completedCount,
      totalCount: stampsWithTurtle.length,
      todayStampId: turtlePosition,
    });

    console.log("✅ 스탬프 상태 업데이트 완료");
    console.log("- 완료된 스탬프:", completedCount);
    console.log("- 거북이 위치:", turtlePosition);
  };

  useEffect(() => {
    const stamps = initializeStamps();
    const completedCount = stamps.filter(s => s.completed).length;
    const todayStamp = stamps.find(s => s.isToday);

    setStampState({
      stamps,
      completedCount,
      totalCount: stamps.length,
      todayStampId: todayStamp?.id || null,
    });
  }, []);

  return {
    ...stampState,
    completeStamp,
    updateTodayStamp,
    resetStamps,
    canCompleteStamp,
    activateNextStamp,
    initializeStampsFromAttendanceData,
    moveToNextStamp,
  };
};
