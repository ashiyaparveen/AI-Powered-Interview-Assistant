import { Question } from '../store/slices/interviewSlice'

export const generateQuestions = (role: string = 'Full Stack React/Node Developer'): Question[] => {
  const questions: Question[] = [
    // All questions now have 30 seconds each
    {
      id: '1',
      text: 'What is React and what are its main advantages?',
      difficulty: 'easy',
      timeLimit: 30
    },
    {
      id: '2',
      text: 'Explain the difference between let, const, and var in JavaScript.',
      difficulty: 'easy',
      timeLimit: 30
    },
    {
      id: '3',
      text: 'How would you implement a custom hook in React to manage form state?',
      difficulty: 'medium',
      timeLimit: 30
    },
    {
      id: '4',
      text: 'Describe the difference between REST and GraphQL APIs. When would you use each?',
      difficulty: 'medium',
      timeLimit: 30
    },
    {
      id: '5',
      text: 'Design a scalable authentication system for a microservices architecture. Include considerations for security, performance, and user experience.',
      difficulty: 'hard',
      timeLimit: 30
    },
    {
      id: '6',
      text: 'Explain how you would optimize a React application that has performance issues. Include specific techniques and tools you would use.',
      difficulty: 'hard',
      timeLimit: 30
    }
  ]

  return questions
}

export const evaluateAnswer = async (question: Question, answer: string): Promise<{ score: number; evaluation: string }> => {
  // Simulate AI evaluation - in a real app, this would call an AI service
  await new Promise(resolve => setTimeout(resolve, 1000))

  const wordCount = answer.split(' ').length
  let score = 0
  let evaluation = ''

  // Basic scoring based on answer length and content
  if (wordCount < 10) {
    score = 1
    evaluation = 'Answer is too brief. Please provide more detail and examples.'
  } else if (wordCount < 30) {
    score = 3
    evaluation = 'Good start, but could benefit from more technical detail and examples.'
  } else if (wordCount < 60) {
    score = 5
    evaluation = 'Solid answer with good technical understanding. Consider adding more depth.'
  } else {
    score = 7
    evaluation = 'Excellent detailed answer showing strong technical knowledge.'
  }

  // Adjust score based on difficulty
  if (question.difficulty === 'easy') {
    score = Math.min(score + 1, 10)
  } else if (question.difficulty === 'hard') {
    score = Math.max(score - 1, 1)
  }

  // Check for technical keywords based on question
  const technicalKeywords = getTechnicalKeywords(question.text)
  const hasTechnicalContent = technicalKeywords.some(keyword => 
    answer.toLowerCase().includes(keyword.toLowerCase())
  )

  if (hasTechnicalContent) {
    score = Math.min(score + 1, 10)
    evaluation += ' Shows good technical understanding.'
  }

  return { score, evaluation }
}

const getTechnicalKeywords = (questionText: string): string[] => {
  const keywordMap: { [key: string]: string[] } = {
    'react': ['react', 'component', 'jsx', 'virtual dom', 'state', 'props', 'hook'],
    'javascript': ['javascript', 'es6', 'async', 'promise', 'closure', 'scope'],
    'api': ['rest', 'graphql', 'http', 'endpoint', 'json', 'xml'],
    'authentication': ['jwt', 'oauth', 'session', 'token', 'security', 'encryption'],
    'performance': ['optimization', 'bundle', 'lazy', 'memo', 'profiler', 'performance']
  }

  for (const [key, keywords] of Object.entries(keywordMap)) {
    if (questionText.toLowerCase().includes(key)) {
      return keywords
    }
  }

  return []
}
