import React, { useRef, useEffect, useState } from 'react';

interface StampData {
  id: number;
  completed: boolean;
  position: {
    top: string;
    left: string;
  };
  isToday?: boolean;
}

interface StampRoadmapProps {
  stamps: StampData[];
  completedCount: number;
  totalCount: number;
}

const StampRoadmap: React.FC<StampRoadmapProps> = ({
  stamps,
  completedCount,
  totalCount,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSvgSize = () => {
      if (containerRef.current) {
        const bbox = containerRef.current.getBoundingClientRect();
        setSvgSize({ width: bbox.width, height: bbox.height });
      }
    };

    updateSvgSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSvgSize();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    const handleResize = () => {
      setTimeout(updateSvgSize, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const connectionCurves = [
    { from: { x: '20%', y: '15%' }, to: { x: '50%', y: '15%' } },
    { from: { x: '50%', y: '15%' }, to: { x: '80%', y: '15%' } },
    { from: { x: '80%', y: '15%' }, to: { x: '20%', y: '40%' } },
    { from: { x: '20%', y: '40%' }, to: { x: '50%', y: '40%' } },
    { from: { x: '50%', y: '40%' }, to: { x: '80%', y: '40%' } },
    { from: { x: '80%', y: '40%' }, to: { x: '20%', y: '65%' } },
    { from: { x: '20%', y: '65%' }, to: { x: '50%', y: '65%' } },
    { from: { x: '50%', y: '65%' }, to: { x: '80%', y: '65%' } },
  ];

  const percentToPx = (percent: string, base: number) =>
    (parseFloat(percent) / 100) * base;

  const renderCurvedPath = (
    from: { x: string; y: string },
    to: { x: string; y: string }
  ) => {
    const x1 = percentToPx(from.x, svgSize.width);
    const y1 = percentToPx(from.y, svgSize.height);
    const x2 = percentToPx(to.x, svgSize.width);
    const y2 = percentToPx(to.y, svgSize.height);

    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;

    return `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`;
  };

  const renderStamp = (stamp: StampData) => {
    const getStampStyle = () => {
      if (stamp.completed) return 'bg-white/90 border-white shadow-2xl backdrop-blur-sm';
      if (stamp.isToday) return 'bg-white/95 border-white shadow-2xl scale-110 backdrop-blur-sm';
      return 'bg-white/20 border-white/30';
    };

    const renderStampIcon = () => {
      if (stamp.completed) {
        return (
          <div className="w-10 h-10 bg-green-500 rounded-full shadow-md flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      } else if (stamp.isToday) {
        return (
          <div className="w-10 h-10 bg-red-500 rounded-full shadow-lg flex items-center justify-center animate-pulse">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        );
      } else {
        return (
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-gray-400 rounded-full"></div>
          </div>
        );
      }
    };

    return (
      <div
        key={stamp.id}
        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
        style={{
          top: stamp.position.top,
          left: stamp.position.left,
        }}
      >
        <div
          className={`w-20 h-20 rounded-full border-3 flex items-center justify-center transition-all duration-500 ${getStampStyle()}`}
        >
          {renderStampIcon()}
        </div>

        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
          <span className="text-white text-sm font-bold">{stamp.id}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      <div 
        ref={containerRef}
        className="bg-blue-200 rounded-3xl p-8 h-[584px] overflow-hidden relative"
      >
        <svg 
          ref={svgRef} 
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          style={{ width: svgSize.width, height: svgSize.height }}
        >
          {svgSize.width > 0 &&
            connectionCurves.map((line, index) => (
              <path
                key={index}
                d={renderCurvedPath(line.from, line.to)}
                fill="none"
                stroke="white"
                strokeWidth="20"
                opacity="0.6"
              />
            ))}
        </svg>

        {stamps.map(renderStamp)}

        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center z-10">
          <p className="text-white font-black text-lg">학습 도장 로드맵</p>
          <p className="text-white/90 font-bold text-base">매일 도장을 모아보세요!</p>
          <p className="text-white/90 font-bold text-base">
            {completedCount}/{totalCount} 완료
          </p>
        </div>
      </div>
    </div>
  );
};

export default StampRoadmap;