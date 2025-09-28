import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ConfigProvider } from 'antd'
import { store, persistor } from './store'
import Layout from './components/Layout'
import WelcomeBackModal from './components/WelcomeBackModal'
import ErrorBoundary from './components/ErrorBoundary'
import ClearDataButton from './components/ClearDataButton'
import { useAppDispatch, useAppSelector } from './hooks/redux'
import { showWelcomeBackModal as showWelcomeBackModalAction } from './store/slices/uiSlice'
import './App.css'

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch()
  const { } = useAppSelector(state => state.ui)
  const { isInterviewActive, sessionId } = useAppSelector(state => state.interview)

  useEffect(() => {
    // Check if there's an active session on app load
    if (isInterviewActive && sessionId) {
      dispatch(showWelcomeBackModalAction())
    }
  }, [dispatch, isInterviewActive, sessionId])

  return (
    <ErrorBoundary>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1890ff',
            borderRadius: 6,
          },
        }}
      >
        <Layout />
        <WelcomeBackModal />
        <ClearDataButton />
      </ConfigProvider>
    </ErrorBoundary>
  )
}

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  )
}

export default App
