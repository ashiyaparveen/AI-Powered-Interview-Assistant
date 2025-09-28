import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  activeTab: 'interviewee' | 'interviewer'
  showWelcomeBackModal: boolean
  isLoading: boolean
  error: string | null
}

const initialState: UIState = {
  activeTab: 'interviewee',
  showWelcomeBackModal: false,
  isLoading: false,
  error: null
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<'interviewee' | 'interviewer'>) => {
      state.activeTab = action.payload
    },
    showWelcomeBackModal: (state) => {
      state.showWelcomeBackModal = true
    },
    hideWelcomeBackModal: (state) => {
      state.showWelcomeBackModal = false
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    }
  }
})

export const {
  setActiveTab,
  showWelcomeBackModal,
  hideWelcomeBackModal,
  setLoading,
  setError
} = uiSlice.actions

export default uiSlice.reducer
