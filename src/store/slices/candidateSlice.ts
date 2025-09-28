import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Question, CandidateInfo } from './interviewSlice'

export interface Candidate {
  id: string
  info: CandidateInfo
  questions: Question[]
  totalScore: number
  completedAt: string
  sessionId: string
  chatHistory: Array<{
    id: string
    type: 'user' | 'ai'
    message: string
    timestamp: string
  }>
}

interface CandidatesState {
  candidates: Candidate[]
  selectedCandidate: Candidate | null
}

const initialState: CandidatesState = {
  candidates: [],
  selectedCandidate: null
}

const candidateSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    addCandidate: (state, action: PayloadAction<Candidate>) => {
      state.candidates.push(action.payload)
      // Sort by score descending
      state.candidates.sort((a, b) => b.totalScore - a.totalScore)
    },
    selectCandidate: (state, action: PayloadAction<string>) => {
      const candidate = state.candidates.find(c => c.id === action.payload)
      state.selectedCandidate = candidate || null
    },
    clearSelectedCandidate: (state) => {
      state.selectedCandidate = null
    },
    updateCandidateScore: (state, action: PayloadAction<{ candidateId: string; score: number }>) => {
      const { candidateId, score } = action.payload
      const candidate = state.candidates.find(c => c.id === candidateId)
      if (candidate) {
        candidate.totalScore = score
        // Re-sort candidates
        state.candidates.sort((a, b) => b.totalScore - a.totalScore)
      }
    },
    clearAllCandidates: (state) => {
      state.candidates = []
      state.selectedCandidate = null
    }
  }
})

export const {
  addCandidate,
  selectCandidate,
  clearSelectedCandidate,
  updateCandidateScore,
  clearAllCandidates
} = candidateSlice.actions

export default candidateSlice.reducer
