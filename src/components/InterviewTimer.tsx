import React, { useEffect, useState } from 'react'
import { Progress, Typography } from 'antd'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { updateTimer, nextQuestion, updateAnswer, updateScore } from '../store/slices/interviewSlice'

const { Text } = Typography

const InterviewTimer: React.FC = () => {
  const dispatch = useAppDispatch()
  const { timeRemaining = 0, questions = [], currentQuestionIndex = 0, isInterviewActive = false, isInterviewComplete = false } = useAppSelector(state => state.interview)
  const [localTime, setLocalTime] = useState(timeRemaining)

  useEffect(() => {
    setLocalTime(timeRemaining)
  }, [timeRemaining])

  useEffect(() => {
    // Stop timer if interview is not active or completed
    if (!isInterviewActive || isInterviewComplete) {
      return
    }

    // Don't auto-submit when time runs out - let user submit manually
    if (localTime <= 0) {
      return
    }

    const timer = setTimeout(() => {
      setLocalTime(prev => prev - 1)
      dispatch(updateTimer(localTime - 1))
    }, 1000)

    return () => clearTimeout(timer)
  }, [localTime, dispatch, currentQuestionIndex, questions.length, isInterviewActive, isInterviewComplete])

  const currentQuestion = questions[currentQuestionIndex]
  const progressPercent = currentQuestion && currentQuestion.timeLimit
    ? ((currentQuestion.timeLimit - localTime) / currentQuestion.timeLimit) * 100 
    : 0

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getTimerColor = () => {
    if (localTime <= 10) return '#ff4d4f' // Red
    if (localTime <= 30) return '#faad14' // Orange
    return '#52c41a' // Green
  }

  // Don't render timer if interview is completed
  if (isInterviewComplete) {
    return null
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <Text strong style={{ fontSize: 18 }}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Text>
        <div style={{ fontSize: 24, fontWeight: 'bold', color: getTimerColor(), marginTop: 8 }}>
          {formatTime(localTime)}
        </div>
      </div>
      
      <Progress
        percent={progressPercent}
        strokeColor={getTimerColor()}
        showInfo={false}
        style={{ marginBottom: 8 }}
      />
      
      <div style={{ textAlign: 'center' }}>
        <Text type="secondary">
          Difficulty: {currentQuestion?.difficulty?.toUpperCase()} | 
          Time Limit: {formatTime(currentQuestion?.timeLimit || 0)}
        </Text>
      </div>
    </div>
  )
}

export default InterviewTimer
