import React, { useRef, useEffect, useState } from "react";

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

    window.addEventListener("resize", handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const connectionCurves = [
    { from: { x: "20%", y: "15%" }, to: { x: "50%", y: "15%" } },
    { from: { x: "50%", y: "15%" }, to: { x: "80%", y: "15%" } },
    { from: { x: "80%", y: "15%" }, to: { x: "20%", y: "40%" } },
    { from: { x: "20%", y: "40%" }, to: { x: "50%", y: "40%" } },
    { from: { x: "50%", y: "40%" }, to: { x: "80%", y: "40%" } },
    { from: { x: "80%", y: "40%" }, to: { x: "20%", y: "65%" } },
    { from: { x: "20%", y: "65%" }, to: { x: "50%", y: "65%" } },
    { from: { x: "50%", y: "65%" }, to: { x: "80%", y: "65%" } },
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

  const getCurrentStamp = () => {
    return stamps.find(stamp => !stamp.completed);
  };

  const currentStamp = getCurrentStamp();

  const renderStamp = (stamp: StampData) => {
    const renderStampIcon = () => {
      if (stamp.completed) {
        return (
          <div className="relative flex flex-col items-center">
            <div className="w-1 h-16 bg-gray-600 rounded-full mb-2"></div>
            <div
              className="absolute top-0 left-1 w-12 h-8 bg-green-500 shadow-lg flex items-center justify-center"
              style={{
                clipPath: "polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%)",
              }}
            >
              <svg
                className="w-4 h-4 text-white -ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        );
      } else if (currentStamp && stamp.id === currentStamp.id) {
        return (
          <div className="relative flex flex-col items-center">
            <div className="w-1 h-16 bg-gray-600 rounded-full mb-2"></div>
            <div
              className="absolute top-0 left-1 w-12 h-8 bg-red-500 shadow-lg flex items-center justify-center animate-pulse"
              style={{
                clipPath: "polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%)",
              }}
            >
              <div className="w-2 h-2 bg-white rounded-full -ml-1"></div>
            </div>
          </div>
        );
      } else {
        return (
          <div className="relative flex flex-col items-center">
            <div className="w-1 h-16 bg-gray-400 rounded-full mb-2 opacity-60"></div>
            <div
              className="absolute top-0 left-1 w-12 h-8 bg-gray-300 shadow-md flex items-center justify-center opacity-60"
              style={{
                clipPath: "polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%)",
              }}
            >
              <div className="w-3 h-3 border-2 border-gray-500 rounded-full -ml-1"></div>
            </div>
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
        <div className="flex flex-col items-center">
          {renderStampIcon()}

          <div className="mt-2 backdrop-blur-sm rounded-lg px-2 py-1">
            <span className="text-gray-800 text-xs font-bold">
              {stamp.id}일차
            </span>
          </div>
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
                strokeWidth="8"
                opacity="0.4"
              />
            ))}
        </svg>

        {stamps.map(renderStamp)}

        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center z-10">
          <p className="text-white font-black text-lg">학습 도장 로드맵</p>
          <p className="text-white/90 font-bold text-base">
            매일 깃발을 세워보세요!
          </p>
          <p className="text-white/90 font-bold text-base">
            {completedCount}/{totalCount} 완료
          </p>
        </div>
      </div>
    </div>
  );
};

export default StampRoadmap;
