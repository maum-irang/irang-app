import React, { useRef, useEffect, useState } from "react";
import Lottie from "lottie-react";

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
  const [turtleAnimation, setTurtleAnimation] = useState<
    object | string | null
  >(null);

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

    const loadTurtleAnimation = async () => {
      try {
        const animationData = await import(
          "../../../../../public/animations/turtle.json"
        );
        setTurtleAnimation(animationData.default);
      } catch (error) {
        console.warn("거북이 애니메이션 로드 실패:", error);
        setTurtleAnimation("css-fallback");
      }
    };

    loadTurtleAnimation();

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

  const renderNest = () => (
    <div className="w-8 h-6 bg-gradient-to-b from-amber-600 to-amber-800 rounded-full shadow-md relative">
      <div className="absolute inset-x-1 top-1 bottom-1 bg-gradient-to-b from-amber-500 to-amber-700 rounded-full"></div>
      <div className="absolute -top-1 left-1 w-1 h-1 bg-amber-400 rounded-full"></div>
      <div className="absolute -top-1 right-1 w-1 h-1 bg-amber-400 rounded-full"></div>
      <div className="absolute top-0 left-0 w-1 h-1 bg-amber-400 rounded-full"></div>
      <div className="absolute top-0 right-0 w-1 h-1 bg-amber-400 rounded-full"></div>
    </div>
  );

  const renderBubbles = (color: string, count: number = 3) => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`absolute w-2 h-2 ${color} rounded-full opacity-60 animate-bubble`}
          style={{
            left: `${20 + index * 25}%`,
            bottom: "-15px",
            animationDelay: `${index * 0.8}s`,
            animationDuration: "4s",
            animationIterationCount: "infinite",
          }}
        />
      ))}
    </div>
  );

  const renderStamp = (stamp: StampData) => {
    const renderStampIcon = () => {
      if (stamp.completed) {
        return (
          <div className="relative">
            {renderNest()}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 -translate-y-1">
              <div className="w-5 h-6 bg-gradient-to-b from-yellow-200 to-yellow-400 rounded-full border-2 border-yellow-500 shadow-md flex items-center justify-center">
                <div className="absolute top-1 left-1 w-1 h-1 bg-yellow-600 rounded-full"></div>
                <div className="absolute top-2 right-1 w-1 h-1 bg-yellow-600 rounded-full"></div>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-600 rounded-full"></div>
              </div>
            </div>
            {renderBubbles("bg-yellow-300", 4)}
          </div>
        );
      } else if (currentStamp && stamp.id === currentStamp.id) {
        return (
          <div style={{ width: 70, height: 70, position: "relative" }}>
            {turtleAnimation && turtleAnimation !== "css-fallback" ? (
              <div style={{ width: 70, height: 70, position: "relative" }}>
                <Lottie
                  animationData={turtleAnimation}
                  loop={true}
                  autoPlay
                  style={{ width: 70, height: 70 }}
                />
                {renderBubbles("bg-green-300", 5)}
              </div>
            ) : (
              <div className="w-14 h-14 flex items-center justify-center">
                <div className="w-8 h-8 bg-green-500 rounded-full shadow-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-700 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                  </div>
                </div>
                {renderBubbles("bg-green-300", 5)}
              </div>
            )}
          </div>
        );
      } else {
        return (
          <div className="relative opacity-60">
            {renderNest()}
            {renderBubbles("bg-gray-400", 2)}
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

          <div className="mt-2 rounded-lg px-2 py-1">
            <span className="text-gray-800 text-xs font-normal">
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
          <p className="text-black font-normal text-lg">학습 도장 로드맵</p>
          <p className="text-black/90 font-normal text-base">
            거북이와 함께 천천히 달려요!
          </p>
          <p className="text-black/90 font-normal text-base">
            {completedCount}/{totalCount} 완료
          </p>
        </div>
      </div>
    </div>
  );
};

export default StampRoadmap;
