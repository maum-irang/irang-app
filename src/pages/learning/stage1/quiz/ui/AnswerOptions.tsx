interface AnswerOptionsProps {
  options: string[];
  onSelect: (index: number) => void;
  selectedAnswer: number | null;
  correctAnswer: number;
  showResult: boolean;
  disabled?: boolean;
}

export const AnswerOptions: React.FC<AnswerOptionsProps> = ({
  options,
  onSelect,
  selectedAnswer,
  correctAnswer,
  showResult,
  disabled = false,
}) => {
  const getButtonStyle = (index: number) => {
    const baseStyle =
      "text-gray-800 rounded-3xl p-6 text-center min-h-[120px] flex items-center justify-center transition-all duration-200 border-3 font-black text-xl relative overflow-hidden";

    if (!showResult) {
      return `${baseStyle} bg-white hover:bg-gray-50 border-gray-200 ${disabled ? "opacity-50 cursor-not-allowed" : "active:scale-95 hover:scale-105"}`;
    }

    if (index === correctAnswer) {
      return `${baseStyle} bg-green-500 border-green-400 text-white`;
    } else if (index === selectedAnswer) {
      return `${baseStyle} bg-red-500 border-red-400 text-white`;
    } else {
      return `${baseStyle} bg-gray-400 border-gray-300 opacity-50 text-white`;
    }
  };

  const renderIcon = (index: number) => {
    if (!showResult) return null;

    if (index === correctAnswer) {
      return (
        <div className="absolute top-2 right-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-green-500 text-lg">✓</span>
          </div>
        </div>
      );
    } else if (index === selectedAnswer && index !== correctAnswer) {
      return (
        <div className="absolute top-2 right-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-red-500 text-lg">✗</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          disabled={disabled || showResult}
          className={getButtonStyle(index)}
        >
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 bg-gray-200/50 rounded-full flex items-center justify-center text-sm">
              {index + 1}
            </span>
            <span>{option}</span>
          </div>
          {renderIcon(index)}
        </button>
      ))}
    </div>
  );
};
