interface ResultModalProps {
  isOpen: boolean;
  score: number;
  total: number;
  onClose: () => void;
  onRestart: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  score,
  total,
  onClose,
  onRestart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-black text-center mb-4">퀴즈 완료!</h2>
        <p className="text-lg text-center mb-6">
          {score} / {total} 문제를 맞혔어요!
        </p>
        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-6 bg-gray-200 rounded-2xl font-bold"
          >
            닫기
          </button>
          <button
            onClick={onRestart}
            className="flex-1 py-3 px-6 bg-accent-primary text-white rounded-2xl font-bold"
          >
            다시하기
          </button>
        </div>
      </div>
    </div>
  );
};
