interface ProgressBarProps {
  current: number;
  total: number;
  progress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  progress,
}) => {
  return (
    <div className="w-full mt-10 mb-5">
      <div className="flex justify-center items-center mb-2"></div>
      <div className="w-full bg-white rounded-full h-5 shadow-inner">
        <div
          className="h-5 rounded-full transition-all duration-300 bg-purple-400"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
