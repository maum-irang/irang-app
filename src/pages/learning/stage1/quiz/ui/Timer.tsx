import React from 'react';
import Lottie from 'lottie-react';
import clockAnimation from '../../../../../../public/animations/clock.json';
interface TimerProps {
  startTime: Date;
  isActive: boolean;
}

export const Timer: React.FC<TimerProps> = ({ isActive }) => {
  return (
    <div className="flex items-center justify-center">
      <Lottie 
        animationData={clockAnimation} 
        loop={isActive} 
        autoplay={isActive}
        style={{ width: 60, height: 60 }} 
      />
    </div>
  );
};