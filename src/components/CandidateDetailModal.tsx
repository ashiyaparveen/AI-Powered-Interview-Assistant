import React from 'react'
import { Modal, Typography, Card, List, Tag, Progress, Divider, Space } from 'antd'
import { TrophyOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons'
import { useAppSelector } from '../hooks/redux'

const { Title, Text, Paragraph } = Typography

interface CandidateDetailModalProps {
  candidateId: string
  onClose: () => void
}

const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidateId,
  onClose
}) => {
  const { candidates } = useAppSelector(state => state.candidates)
  const candidate = candidates.find(c => c.id === candidateId)

  if (!candidate) {
    return null
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return '#52c41a'
    if (score >= 6) return '#faad14'
    if (score >= 4) return '#ff7a45'
    return '#ff4d4f'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 8) return 'Excellent'
    if (score >= 6) return 'Good'
    if (score >= 4) return 'Average'
    if (score >= 2) return 'Below Average'
    return 'Poor'
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#52c41a'
      case 'medium': return '#faad14'
      case 'hard': return '#ff4d4f'
      default: return '#1890ff'
    }
  }

  return (
    <Modal
      title={`Candidate Details - ${candidate.info.name}`}
      open={true}
      onCancel={onClose}
      footer={null}
      width={800}
      style={{ top: 20 }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* Candidate Information */}
        <Card title={<><UserOutlined /> Candidate Information</>}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>Name: </Text>
              <Text>{candidate.info.name}</Text>
            </div>
            <div>
              <Text strong>Email: </Text>
              <Text>{candidate.info.email}</Text>
            </div>
            <div>
              <Text strong>Phone: </Text>
              <Text>{candidate.info.phone}</Text>
            </div>
            <div>
              <Text strong>Resume File: </Text>
              <Text>{candidate.info.resumeFileName || 'No resume uploaded'}</Text>
            </div>
            <div>
              <Text strong>Interview Date: </Text>
              <Text>{new Date(candidate.completedAt).toLocaleString()}</Text>
            </div>
          </Space>
        </Card>

        {/* Overall Score */}
        <Card title={<><TrophyOutlined /> Overall Performance</>}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <Title level={2} style={{ color: getScoreColor(candidate.totalScore) }}>
                {candidate.totalScore}/60
              </Title>
              <Tag color={getScoreColor(candidate.totalScore)} size="large">
                {getScoreLabel(candidate.totalScore)}
              </Tag>
            </div>
            <Progress
              percent={(candidate.totalScore / 60) * 100}
              strokeColor={getScoreColor(candidate.totalScore)}
              showInfo={false}
            />
          </Space>
        </Card>

        {/* Individual Question Responses */}
        <Card title={<><ClockCircleOutlined /> Question Responses</>}>
          <List
            dataSource={candidate.questions}
            renderItem={(question, index) => (
              <List.Item>
                <Card size="small" style={{ width: '100%' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Text strong>Question {index + 1}: </Text>
                      <Tag color={getDifficultyColor(question.difficulty)}>
                        {question.difficulty.toUpperCase()}
                      </Tag>
                      <Tag>{question.timeLimit}s</Tag>
                    </div>
                    
                    <Paragraph>{question.text}</Paragraph>
                    
                    <div>
                      <Text strong>Answer: </Text>
                      <Paragraph>{question.answer || 'No answer provided'}</Paragraph>
                    </div>
                    
                    <div>
                      <Text strong>Score: </Text>
                      <Tag color={getScoreColor(question.score || 0)}>
                        {question.score || 0}/10
                      </Tag>
                    </div>
                    
                    <div>
                      <Text strong>Evaluation: </Text>
                      <Text>{question.evaluation || 'No evaluation available'}</Text>
                    </div>
                  </Space>
                </Card>
              </List.Item>
            )}
          />
        </Card>

        {/* Chat History */}
        <Card title="Chat History">
          <div style={{ maxHeight: 300, overflowY: 'auto' }}>
            {candidate.chatHistory.length === 0 ? (
              <Text type="secondary">No chat history available</Text>
            ) : (
              candidate.chatHistory.map((msg) => (
                <div key={msg.id} style={{ marginBottom: 12 }}>
                  <div style={{ 
                    textAlign: msg.type === 'user' ? 'right' : 'left',
                    marginBottom: 4
                  }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {msg.type === 'user' ? 'Candidate' : 'AI Assistant'} • 
                      {new Date(msg.timestamp).toLocaleString()}
                    </Text>
                  </div>
                  <div style={{
                    backgroundColor: msg.type === 'user' ? '#1890ff' : '#f0f0f0',
                    color: msg.type === 'user' ? 'white' : '#333',
                    padding: '8px 12px',
                    borderRadius: 12,
                    display: 'inline-block',
                    maxWidth: '70%',
                    wordWrap: 'break-word'
                  }}>
                    {msg.message}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </Space>
    </Modal>
  )
}

export default CandidateDetailModal
