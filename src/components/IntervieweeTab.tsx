import React, { useState, useEffect } from 'react'
import { Card, Button, Input, Form, Typography, message, Space } from 'antd'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { 
  setCandidate, 
  setQuestions, 
  startInterview, 
  nextQuestion, 
  setInterviewComplete,
  updateAnswer, 
  updateScore, 
  setTotalScore, 
  addChatMessage 
} from '../store/slices/interviewSlice'
import { addCandidate } from '../store/slices/candidateSlice'
import { generateQuestions, evaluateAnswer } from '../utils/questionGenerator'
import { parsePDF, parseDOCX, validateFileType, validateFileSize } from '../utils/resumeParser'
// Simple unique ID generator function
const generateUniqueId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 9)}`
import ChatInterface from './ChatInterface'
import InterviewTimer from './InterviewTimer'
import QuestionCard from './QuestionCard'
import ResumeUpload from './ResumeUpload'

const { Title, Text } = Typography

const IntervieweeTab: React.FC = () => {
  const dispatch = useAppDispatch()
  const { 
    currentCandidate, 
    questions = [], 
    currentQuestionIndex = 0, 
    isInterviewActive = false, 
    isInterviewComplete = false, 
    timeRemaining = 0,
    totalScore = 0,
    chatHistory = [] 
  } = useAppSelector(state => state.interview)

  const [form] = Form.useForm()
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [isEvaluating, setIsEvaluating] = useState(false)

  useEffect(() => {
    // Initialize questions if not set
    if (questions.length === 0) {
      const generatedQuestions = generateQuestions()
      dispatch(setQuestions(generatedQuestions))
    }
  }, [dispatch, questions.length])

  const handleResumeUpload = async (file: File) => {
    try {
      if (!validateFileType(file)) {
        message.error('Please upload a PDF or DOCX file')
        return false
      }

      if (!validateFileSize(file)) {
        message.error('File size must be less than 5MB')
        return false
      }

      let parsedResume
      if (file.type === 'application/pdf') {
        parsedResume = await parsePDF(file)
      } else {
        parsedResume = await parseDOCX(file)
      }

      const candidateInfo = {
        name: parsedResume.name || '',
        email: parsedResume.email || '',
        phone: parsedResume.phone || '',
        resumeText: parsedResume.text,
        resumeFileName: parsedResume.fileName || file.name
      }

      dispatch(setCandidate(candidateInfo))
      dispatch(addChatMessage({ 
        type: 'ai', 
        message: `Resume uploaded successfully! I found: Name: ${candidateInfo.name || 'Not found'}, Email: ${candidateInfo.email || 'Not found'}, Phone: ${candidateInfo.phone || 'Not found'}` 
      }))

      // Ask for missing information
      if (!candidateInfo.name || !candidateInfo.email || !candidateInfo.phone) {
        dispatch(addChatMessage({ 
          type: 'ai', 
          message: 'I need some additional information before we start the interview. Please provide your name, email, and phone number.' 
        }))
      } else {
        dispatch(addChatMessage({ 
          type: 'ai', 
          message: 'Great! All information is complete. Ready to start the interview?' 
        }))
      }

      return false // Prevent default upload
    } catch (error) {
      message.error('Failed to parse resume file')
      return false
    }
  }

  const handleFormSubmit = (values: any) => {
    const candidateInfo = {
      ...currentCandidate!,
      name: values.name,
      email: values.email,
      phone: values.phone
    }
    dispatch(setCandidate(candidateInfo))
    dispatch(addChatMessage({ 
      type: 'user', 
      message: `Name: ${values.name}, Email: ${values.email}, Phone: ${values.phone}` 
    }))
    dispatch(addChatMessage({ 
      type: 'ai', 
      message: 'Perfect! All information is complete. Ready to start the interview?' 
    }))
    form.resetFields()
  }

  const handleStartInterview = () => {
    try {
      if (!currentCandidate?.name || !currentCandidate?.email || !currentCandidate?.phone) {
        message.error('Please complete all required information first')
        return
      }
      
      // Ensure questions are available
      if (questions.length === 0) {
        const generatedQuestions = generateQuestions()
        dispatch(setQuestions(generatedQuestions))
      }
      
      dispatch(startInterview())
      dispatch(addChatMessage({ 
        type: 'ai', 
        message: 'Interview started! Good luck!' 
      }))
    } catch (error) {
      console.error('Error starting interview:', error)
      message.error('Failed to start interview. Please try again.')
    }
  }

  const handleAnswerSubmit = async () => {
    if (!currentAnswer.trim()) {
      message.error('Please provide an answer')
      return
    }

    setIsEvaluating(true)
    
    // Update answer in store
    dispatch(updateAnswer({ 
      questionIndex: currentQuestionIndex, 
      answer: currentAnswer 
    }))

    // Evaluate answer
    const currentQuestion = questions[currentQuestionIndex]
    const evaluation = await evaluateAnswer(currentQuestion, currentAnswer)
    
    dispatch(updateScore({
      questionIndex: currentQuestionIndex,
      score: evaluation.score,
      evaluation: evaluation.evaluation
    }))

    dispatch(addChatMessage({
      type: 'user',
      message: `Q${currentQuestionIndex + 1}: ${currentAnswer}`
    }))

    dispatch(addChatMessage({
      type: 'ai',
      message: `Score: ${evaluation.score}/10. ${evaluation.evaluation}`
    }))

    setCurrentAnswer('')
    setIsEvaluating(false)

    // Move to next question or complete interview
    if (currentQuestionIndex < questions.length - 1) {
      dispatch(nextQuestion())
    } else {
      // Final question completed - mark interview as complete
      dispatch(setInterviewComplete())
      
      // Calculate total score
      const total = questions.reduce((sum, q) => sum + (q.score || 0), 0)
      dispatch(setTotalScore(total))
      
      // Add candidate to candidates list
      const uniqueId = generateUniqueId()
      dispatch(addCandidate({
        id: uniqueId,
        info: currentCandidate!,
        questions: [...questions], // Create a copy to avoid reference issues
        totalScore: total,
        completedAt: new Date().toISOString(),
        sessionId: uniqueId,
        chatHistory: [...chatHistory] // Create a copy to avoid reference issues
      }))

      dispatch(addChatMessage({
        type: 'ai',
        message: `Interview completed! Your total score is ${total}/60. Great job!`
      }))
    }
  }

  const canStartInterview = currentCandidate?.name && currentCandidate?.email && currentCandidate?.phone

  return (
    <div>
      <Title level={2}>Interviewee Portal</Title>
      
      {/* Resume Upload Section */}
      <Card title="Step 1: Upload Resume" style={{ marginBottom: 24 }}>
        <ResumeUpload onUpload={handleResumeUpload} />
      </Card>

      {/* Candidate Information Form */}
      {currentCandidate && (
        <Card title="Step 2: Complete Information" style={{ marginBottom: 24 }}>
          <Form form={form} onFinish={handleFormSubmit} layout="vertical">
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: 'Please enter your name' }]}
              initialValue={currentCandidate.name}
            >
              <Input placeholder="Enter your full name" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
              initialValue={currentCandidate.email}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Phone"
              rules={[{ required: true, message: 'Please enter your phone number' }]}
              initialValue={currentCandidate.phone}
            >
              <Input placeholder="Enter your phone number" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Update Information
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}

      {/* Start Interview Button */}
      {canStartInterview && !isInterviewActive && !isInterviewComplete && (
        <Card style={{ marginBottom: 24 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text>Ready to start your interview?</Text>
            <Button 
              type="primary" 
              size="large" 
              onClick={handleStartInterview}
              style={{ width: '100%' }}
            >
              Start Interview
            </Button>
          </Space>
        </Card>
      )}

      {/* Chat Interface */}
      <ChatInterface />

      {/* Interview Section */}
      {isInterviewActive && !isInterviewComplete && questions[currentQuestionIndex] && (
        <Card title="Interview in Progress" style={{ marginTop: 24 }}>
          <InterviewTimer />
          <QuestionCard 
            question={questions[currentQuestionIndex]}
            answer={currentAnswer}
            onAnswerChange={setCurrentAnswer}
            onSubmit={handleAnswerSubmit}
            isEvaluating={isEvaluating}
            timeRemaining={timeRemaining}
          />
        </Card>
      )}

      {/* Interview Complete */}
      {isInterviewComplete && (
        <Card title="Interview Complete!" style={{ marginTop: 24 }}>
          <div className="score-display">
            <Title level={3}>Final Score: {totalScore}/60</Title>
            <Text>Congratulations on completing the interview! Check the chat above for detailed results.</Text>
          </div>
        </Card>
      )}
    </div>
  )
}

export default IntervieweeTab
