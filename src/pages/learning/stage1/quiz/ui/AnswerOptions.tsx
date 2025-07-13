interface AnswerOptionsProps {
    options: string[];
    onSelect: (index: number) => void;
    disabled?: boolean;
  }
  
  export const AnswerOptions: React.FC<AnswerOptionsProps> = ({ 
    options, 
    onSelect, 
    disabled = false 
  }) => {
    return (
      <div className="grid grid-cols-2 gap-4">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            disabled={disabled}
            className={`bg-gray-200 hover:bg-gray-300 rounded-3xl p-6 text-center min-h-[120px] flex items-center justify-center transition-all duration-200 ${
              disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'
            }`}
          >
            <span className="text-2xl font-black text-gray-800">{index + 1}</span>
          </button>
        ))}
      </div>
    );
  };