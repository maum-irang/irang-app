interface QuestionCardProps {
    imageUrl: string;
    questionNumber: number;
  }
  
  export const QuestionCard: React.FC<QuestionCardProps> = ({ imageUrl, questionNumber }) => {
    return (
      <div className="bg-gray-200 rounded-3xl p-8 flex items-center justify-center mb-8"
           style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="text-6xl mb-4">😊</div>
          <p className="text-lg font-bold text-gray-600">표정 이미지</p>
          <p className="text-sm text-gray-500">문제 {questionNumber}</p>
        </div>
      </div>
    );
  };