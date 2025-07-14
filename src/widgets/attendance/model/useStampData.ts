import { useState, useEffect } from 'react';

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
    todayStampId: null
  });

  const initializeStamps = (): StampData[] => {
    const stampPositions = [
      { top: '15%', left: '20%' },
      { top: '15%', left: '50%' },
      { top: '15%', left: '80%' },
      { top: '40%', left: '20%' },
      { top: '40%', left: '50%' },
      { top: '40%', left: '80%' },
      { top: '65%', left: '20%' },
      { top: '65%', left: '50%' },
      { top: '65%', left: '80%' },
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
      completedCount: prev.completedCount + 1
    }));
  };

  const updateTodayStamp = (stampId: number) => {
    setStampState(prev => ({
      ...prev,
      stamps: prev.stamps.map(stamp => ({
        ...stamp,
        isToday: stamp.id === stampId
      })),
      todayStampId: stampId
    }));
  };

  const resetStamps = () => {
    const newStamps = initializeStamps();
    setStampState({
      stamps: newStamps,
      completedCount: newStamps.filter(s => s.completed).length,
      totalCount: newStamps.length,
      todayStampId: newStamps.find(s => s.isToday)?.id || null
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

  useEffect(() => {
    const stamps = initializeStamps();
    const completedCount = stamps.filter(s => s.completed).length;
    const todayStamp = stamps.find(s => s.isToday);
    
    setStampState({
      stamps,
      completedCount,
      totalCount: stamps.length,
      todayStampId: todayStamp?.id || null
    });
  }, []);

  return {
    ...stampState,
    completeStamp,
    updateTodayStamp,
    resetStamps,
    canCompleteStamp,
    activateNextStamp
  };
};