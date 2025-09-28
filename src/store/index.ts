import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from '@reduxjs/toolkit'
import interviewSlice from './slices/interviewSlice'
import candidateSlice from './slices/candidateSlice'
import uiSlice from './slices/uiSlice'
// Simple unique ID generator function
const generateUniqueId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 9)}`

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['interview', 'candidates'],
  version: 1,
  migrate: (state: any) => {
    // Clear old data that might have duplicate keys
    if (state && state.interview && state.interview.chatHistory) {
      // Generate new unique IDs for existing chat messages
      state.interview.chatHistory = state.interview.chatHistory.map((msg: any, index: number) => ({
        ...msg,
        id: generateUniqueId()
      }))
    }
    return state
  }
}

const rootReducer = combineReducers({
  interview: interviewSlice,
  candidates: candidateSlice,
  ui: uiSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
