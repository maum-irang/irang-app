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

const STAMP_STORAGE_KEY = "turtle_stamp_data";

export const useStampData = () => {
  const [stampState, setStampState] = useState<StampState>({
    stamps: [],
    completedCount: 0,
    totalCount: 0,
    todayStampId: null,
  });

  // 로컬스토리지에 상태 저장
  const saveToLocalStorage = (state: StampState) => {
    try {
      localStorage.setItem(STAMP_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save stamp data to localStorage:", error);
    }
  };

  // 로컬스토리지에서 상태 불러오기
  const loadFromLocalStorage = (): StampState | null => {
    try {
      const saved = localStorage.getItem(STAMP_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Failed to load stamp data from localStorage:", error);
    }
    return null;
  };

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
    const newState = {
      ...stampState,
      stamps: stampState.stamps.map(stamp =>
        stamp.id === stampId
          ? { ...stamp, completed: true, isToday: false }
          : stamp
      ),
      completedCount: stampState.completedCount + 1,
    };
    setStampState(newState);
    saveToLocalStorage(newState);
  };

  const updateTodayStamp = (stampId: number) => {
    const newState = {
      ...stampState,
      stamps: stampState.stamps.map(stamp => ({
        ...stamp,
        isToday: stamp.id === stampId,
      })),
      todayStampId: stampId,
    };
    setStampState(newState);
    saveToLocalStorage(newState);
  };

  const resetStamps = () => {
    const newStamps = initializeStamps();
    const newState = {
      stamps: newStamps,
      completedCount: newStamps.filter(s => s.completed).length,
      totalCount: newStamps.length,
      todayStampId: newStamps.find(s => s.isToday)?.id || null,
    };
    setStampState(newState);
    saveToLocalStorage(newState);
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

  const moveToNextStamp = () => {
    const currentTurtleStamp = stampState.stamps.find(s => s.isToday);
    if (currentTurtleStamp && !currentTurtleStamp.completed) {
      const updatedStamps = stampState.stamps.map(stamp =>
        stamp.id === currentTurtleStamp.id
          ? { ...stamp, completed: true, isToday: false }
          : stamp
      );

      const nextStamp = updatedStamps.find(s => !s.completed);
      const finalStamps = updatedStamps.map(stamp => ({
        ...stamp,
        isToday: nextStamp ? stamp.id === nextStamp.id : false,
      }));

      const newState = {
        ...stampState,
        stamps: finalStamps,
        completedCount: finalStamps.filter(s => s.completed).length,
        todayStampId: nextStamp?.id || null,
      };

      setStampState(newState);
      saveToLocalStorage(newState);
    }
  };

  const initializeStampsFromAttendanceData = (presentDates: string[]) => {
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

    const attendedDays = presentDates
      .map(dateStr => {
        const date = new Date(dateStr);
        return date.getDate();
      })
      .filter(day => day <= currentDay);

    const newStamps = stampPositions.map((position, index) => {
      const stampDay = index + 1;
      const isCompleted = attendedDays.includes(stampDay);

      return {
        id: stampDay,
        completed: isCompleted,
        position,
        isToday: false,
      };
    });

    const lastAttendedDay = Math.max(...attendedDays, 0);
    const turtlePosition = Math.min(lastAttendedDay + 1, stampPositions.length);

    const stampsWithTurtle = newStamps.map(stamp => ({
      ...stamp,
      isToday: stamp.id === turtlePosition,
    }));

    const completedCount = stampsWithTurtle.filter(s => s.completed).length;

    const newState = {
      stamps: stampsWithTurtle,
      completedCount,
      totalCount: stampsWithTurtle.length,
      todayStampId: turtlePosition,
    };

    setStampState(newState);
    saveToLocalStorage(newState);
  };

  useEffect(() => {
    // 로컬스토리지에서 저장된 데이터 먼저 확인
    const savedState = loadFromLocalStorage();

    if (savedState) {
      // 저장된 데이터가 있으면 그것을 사용
      setStampState(savedState);
    } else {
      // 저장된 데이터가 없으면 초기 데이터로 설정
      const stamps = initializeStamps();
      const completedCount = stamps.filter(s => s.completed).length;
      const todayStamp = stamps.find(s => s.isToday);

      const initialState = {
        stamps,
        completedCount,
        totalCount: stamps.length,
        todayStampId: todayStamp?.id || null,
      };

      setStampState(initialState);
      saveToLocalStorage(initialState);
    }
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
