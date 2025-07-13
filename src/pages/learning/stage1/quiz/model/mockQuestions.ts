import { Question } from './quizTypes';

export const mockQuestions: Question[] = [
  {
    id: 1,
    imageUrl: '/images/emotions/happy.jpg',
    emotion: '기쁨',
    options: ['기쁨', '슬픔', '화남', '놀람'],
    correctAnswer: 0,
    explanation: '입꼬리가 올라가고 눈이 웃고 있어요!'
  },
  {
    id: 2,
    imageUrl: '/images/emotions/sad.jpg',
    emotion: '슬픔',
    options: ['기쁨', '슬픔', '무서움', '화남'],
    correctAnswer: 1,
    explanation: '눈썹이 내려가고 입꼬리가 아래로 향해 있어요.'
  },
  {
    id: 3,
    imageUrl: '/images/emotions/angry.jpg',
    emotion: '화남',
    options: ['놀람', '기쁨', '화남', '슬픔'],
    correctAnswer: 2,
    explanation: '눈썹이 찌푸려지고 입이 일자로 굳어 있어요.'
  },
  {
    id: 4,
    imageUrl: '/images/emotions/surprised.jpg',
    emotion: '놀람',
    options: ['화남', '놀람', '기쁨', '무서움'],
    correctAnswer: 1,
    explanation: '눈이 크게 뜨이고 입이 동그랗게 벌어져 있어요.'
  },
  {
    id: 5,
    imageUrl: '/images/emotions/scared.jpg',
    emotion: '무서움',
    options: ['슬픔', '화남', '무서움', '놀람'],
    correctAnswer: 2,
    explanation: '눈썹이 올라가고 눈이 커지며 입이 약간 벌어져 있어요.'
  }
];