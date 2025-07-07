"use client"
import React, { useState, useRef } from 'react';
import { PlayIcon } from '@/shared/ui/icons/PlayIcon';
import { VolumeIcon } from '@/shared/ui/icons/VolumeIcon';

interface AudioControlProps {
  variant?: 'default' | 'core';
  playing?: boolean;
  className?: string;
}

export const AudioControl: React.FC<AudioControlProps> = ({
  variant = 'default',
  playing = false,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(playing);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(900); // 15:00 in seconds
  const [isDragging, setIsDragging] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const updateTime = (clientX: number) => {
    if (progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const width = rect.width;
      const newTime = Math.floor((clickX / width) * duration);
      setCurrentTime(Math.max(0, Math.min(newTime, duration)));
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    updateTime(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      updateTime(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  if (variant === 'core') {
    const coreClasses = `inline-flex py-[10px] px-[13px] items-center gap-[14px] rounded-[50px] bg-core-300 ${className}`;
    
    return (
      <div className={coreClasses}>
        <button
          onClick={togglePlay}
          className="text-white hover:opacity-70"
        >
          <PlayIcon />
        </button>

        <span
          className="text-white text-center text-[15px] font-normal leading-[23px] tracking-[-0.3px]"
          style={{ fontFamily: 'Pretendard' }}
        >
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        <div
          ref={progressRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className="w-[200px] h-[5px] bg-white bg-opacity-30 rounded-[40px] cursor-pointer relative select-none"
        >
          <div
            className="h-full bg-white rounded-[40px]"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
          {playing && (
            <div
              className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-sm"
              style={{ left: `${(currentTime / duration) * 100}%` }}
            />
          )}
        </div>

        <button className="text-white hover:opacity-70">
          <VolumeIcon />
        </button>
      </div>
    );
  }

  const defaultClasses = `inline-flex py-[10px] px-[13px] items-center gap-[14px] rounded-[50px] bg-fill-primary ${className}`;

  return (
    <div className={defaultClasses}>
      <button
        onClick={togglePlay}
        className="text-content-primary hover:opacity-70"
      >
        <PlayIcon />
      </button>

      <span
        className="text-content-primary text-center text-[15px] font-normal leading-[23px] tracking-[-0.3px]"
        style={{ fontFamily: 'Pretendard' }}
      >
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>

      <div
        ref={progressRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className="w-[200px] h-[5px] bg-[#DDDFE3] rounded-[40px] cursor-pointer relative select-none"
      >
        <div
          className="h-full bg-grayscale-500 rounded-[40px]"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
        {playing && (
          <div
            className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-system-white rounded-full shadow-sm"
            style={{ left: `${(currentTime / duration) * 100}%` }}
          />
        )}
      </div>

      <button className="text-content-primary hover:opacity-70">
        <VolumeIcon />
      </button>
    </div>
  );
};

// 사용예시:
// <AudioControl variant="default" playing={false} />  // 흰색 컨트롤러 없음
// <AudioControl variant="default" playing={true} />   // 흰색 컨트롤러 있음
// <AudioControl variant="core" playing={false} />     // 보라색 배경, 컨트롤러 없음
// <AudioControl variant="core" playing={true} />      // 보라색 배경, 컨트롤러 있음