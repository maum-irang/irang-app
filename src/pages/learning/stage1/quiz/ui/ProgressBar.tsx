interface ProgressBarProps {
    current: number;
    total: number;
    progress: number;
  }
  
  export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, progress }) => {
    return (
      <div className="w-full mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-gray-700">
            {current} / {total}
          </span>
          <span className="text-sm font-bold text-gray-700">
            정답고르기 까지 몇초 걸리는지
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-accent-primary h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  };