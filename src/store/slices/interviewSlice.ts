import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// Simple unique ID generator function
const generateUniqueId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 9)}`

export interface Question {
  id: string
  text: string
  difficulty: 'easy' | 'medium' | 'hard'
  timeLimit: number
  answer?: string
  score?: number
  evaluation?: string
}

export interface CandidateInfo {
  name: string
  email: string
  phone: string
  resumeText?: string
  resumeFileName?: string
}

export interface InterviewState {
  currentCandidate: CandidateInfo | null
  questions: Question[]
  currentQuestionIndex: number
  isInterviewActive: boolean
  isInterviewComplete: boolean
  timeRemaining: number
  totalScore: number
  sessionId: string | null
  chatHistory: Array<{
    id: string
    type: 'user' | 'ai'
    message: string
    timestamp: string
  }>
}

const initialState: InterviewState = {
  currentCandidate: null,
  questions: [],
  currentQuestionIndex: 0,
  isInterviewActive: false,
  isInterviewComplete: false,
  timeRemaining: 0,
  totalScore: 0,
  sessionId: null,
  chatHistory: []
}

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    setCandidate: (state, action: PayloadAction<CandidateInfo>) => {
      state.currentCandidate = action.payload
    },
    setQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload
    },
    startInterview: (state) => {
      state.isInterviewActive = true
      state.currentQuestionIndex = 0
      state.sessionId = generateUniqueId()
      state.timeRemaining = state.questions[0]?.timeLimit || 0
    },
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1
        state.timeRemaining = state.questions[state.currentQuestionIndex]?.timeLimit || 0
      } else {
        state.isInterviewActive = false
        state.isInterviewComplete = true
        state.timeRemaining = 0
      }
    },
    setInterviewComplete: (state) => {
      state.isInterviewActive = false
      state.isInterviewComplete = true
      state.timeRemaining = 0
    },
    updateAnswer: (state, action: PayloadAction<{ questionIndex: number; answer: string }>) => {
      const { questionIndex, answer } = action.payload
      if (state.questions[questionIndex]) {
        state.questions[questionIndex].answer = answer
      }
    },
    updateScore: (state, action: PayloadAction<{ questionIndex: number; score: number; evaluation: string }>) => {
      const { questionIndex, score, evaluation } = action.payload
      if (state.questions[questionIndex]) {
        state.questions[questionIndex].score = score
        state.questions[questionIndex].evaluation = evaluation
      }
    },
    setTotalScore: (state, action: PayloadAction<number>) => {
      state.totalScore = action.payload
    },
    updateTimer: (state, action: PayloadAction<number>) => {
      state.timeRemaining = action.payload
    },
    addChatMessage: (state, action: PayloadAction<{ type: 'user' | 'ai'; message: string }>) => {
      state.chatHistory.push({
        id: generateUniqueId(),
        type: action.payload.type,
        message: action.payload.message,
        timestamp: new Date().toISOString()
      })
    },
    resetInterview: (state) => {
      return { ...initialState }
    },
    restoreSession: (state, action: PayloadAction<Partial<InterviewState>>) => {
      Object.assign(state, action.payload)
    },
    clearAllData: () => {
      return { ...initialState }
    }
  }
})

export const {
  setCandidate,
  setQuestions,
  startInterview,
  nextQuestion,
  setInterviewComplete,
  updateAnswer,
  updateScore,
  setTotalScore,
  updateTimer,
  addChatMessage,
  resetInterview,
  restoreSession,
  clearAllData
} = interviewSlice.actions

export default interviewSlice.reducer
