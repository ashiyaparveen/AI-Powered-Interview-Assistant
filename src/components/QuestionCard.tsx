import React from 'react'
import { Card, Input, Button, Typography, Space } from 'antd'
import { SendOutlined } from '@ant-design/icons'
import { Question } from '../store/slices/interviewSlice'

const { Text, Title } = Typography
const { TextArea } = Input

interface QuestionCardProps {
  question: Question
  answer: string
  onAnswerChange: (answer: string) => void
  onSubmit: () => void
  isEvaluating: boolean
  timeRemaining: number
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  answer,
  onAnswerChange,
  onSubmit,
  isEvaluating,
  timeRemaining
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#52c41a'
      case 'medium': return '#faad14'
      case 'hard': return '#ff4d4f'
      default: return '#1890ff'
    }
  }

  return (
    <Card className="question-card">
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Title level={4} style={{ marginBottom: 8 }}>
            {question.text}
          </Title>
          <Text 
            style={{ 
              color: getDifficultyColor(question.difficulty),
              fontWeight: 'bold'
            }}
          >
            {question.difficulty.toUpperCase()} • {question.timeLimit}s
          </Text>
        </div>

        <div className="answer-input">
          <TextArea
            value={answer}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder="Type your answer here..."
            rows={6}
            maxLength={1000}
            showCount
            disabled={isEvaluating}
          />
        </div>

        <div style={{ textAlign: 'right' }}>
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={onSubmit}
            loading={isEvaluating}
            disabled={!answer.trim() && timeRemaining > 0}
            size="large"
          >
            {isEvaluating ? 'Evaluating...' : timeRemaining <= 0 ? 'Submit (Time Up)' : 'Submit Answer'}
          </Button>
        </div>
      </Space>
    </Card>
  )
}

export default QuestionCard
