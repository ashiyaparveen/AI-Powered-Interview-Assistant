import React from 'react'
import { Modal, Button, Typography } from 'antd'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { hideWelcomeBackModal } from '../store/slices/uiSlice'
import { resetInterview } from '../store/slices/interviewSlice'

const { Text } = Typography

const WelcomeBackModal: React.FC = () => {
  const dispatch = useAppDispatch()
  const { showWelcomeBackModal: isWelcomeBackModalVisible } = useAppSelector(state => state.ui)
  const { currentCandidate, currentQuestionIndex, questions } = useAppSelector(state => state.interview)

  const handleContinue = () => {
    dispatch(hideWelcomeBackModal())
  }

  const handleStartOver = () => {
    dispatch(resetInterview())
    dispatch(hideWelcomeBackModal())
  }

  return (
    <Modal
      title="Welcome Back!"
      open={isWelcomeBackModalVisible}
      onCancel={handleStartOver}
      footer={[
        <Button key="startOver" onClick={handleStartOver}>
          Start Over
        </Button>,
        <Button key="continue" type="primary" onClick={handleContinue}>
          Continue Interview
        </Button>
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        <Text>
          You have an unfinished interview session. Would you like to continue where you left off?
        </Text>
      </div>
      
      {currentCandidate && (
        <div style={{ marginBottom: 16 }}>
          <Text strong>Candidate: </Text>
          <Text>{currentCandidate.name}</Text>
        </div>
      )}
      
      <div>
        <Text strong>Progress: </Text>
        <Text>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Text>
      </div>
    </Modal>
  )
}

export default WelcomeBackModal
