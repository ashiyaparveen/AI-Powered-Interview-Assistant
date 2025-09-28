import React, { useState } from 'react'
import { Card, List, Typography, Input, Select, Button, Space, Tag, Empty } from 'antd'
import { SearchOutlined, EyeOutlined, TrophyOutlined } from '@ant-design/icons'
import { useAppSelector } from '../hooks/redux'
import CandidateDetailModal from './CandidateDetailModal'

const { Title, Text } = Typography
const { Search } = Input
const { Option } = Select

const InterviewerTab: React.FC = () => {
  const { candidates } = useAppSelector(state => state.candidates)
  const [searchText, setSearchText] = useState('')
  const [sortBy, setSortBy] = useState<'score' | 'name' | 'date'>('score')
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null)

  const filteredAndSortedCandidates = candidates
    .filter(candidate => 
      candidate.info.name.toLowerCase().includes(searchText.toLowerCase()) ||
      candidate.info.email.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.totalScore - a.totalScore
        case 'name':
          return a.info.name.localeCompare(b.info.name)
        case 'date':
          return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
        default:
          return 0
      }
    })

  const getScoreColor = (score: number) => {
    if (score >= 50) return '#52c41a' // Green
    if (score >= 30) return '#faad14' // Orange
    return '#ff4d4f' // Red
  }

  const getScoreLabel = (score: number) => {
    if (score >= 50) return 'Excellent'
    if (score >= 40) return 'Good'
    if (score >= 30) return 'Average'
    if (score >= 20) return 'Below Average'
    return 'Poor'
  }

  return (
    <div>
      <Title level={2}>Interviewer Dashboard</Title>
      
      {/* Search and Filter Controls */}
      <Card style={{ marginBottom: 24 }}>
        <Space style={{ width: '100%' }} direction="vertical">
          <Space wrap>
            <Search
              placeholder="Search candidates by name or email"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
              prefix={<SearchOutlined />}
            />
            <Select
              value={sortBy}
              onChange={setSortBy}
              style={{ width: 150 }}
            >
              <Option value="score">Sort by Score</Option>
              <Option value="name">Sort by Name</Option>
              <Option value="date">Sort by Date</Option>
            </Select>
          </Space>
          
          <Text type="secondary">
            Total Candidates: {candidates.length} | 
            Showing: {filteredAndSortedCandidates.length}
          </Text>
        </Space>
      </Card>

      {/* Candidates List */}
      <Card title="Candidates">
        {filteredAndSortedCandidates.length === 0 ? (
          <Empty 
            description="No candidates found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <List
            dataSource={filteredAndSortedCandidates}
            renderItem={(candidate) => (
              <List.Item
                className="candidate-card"
                actions={[
                  <Button
                    key="view"
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => setSelectedCandidate(candidate.id)}
                  >
                    View Details
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={
                    <Space>
                      <Text strong>{candidate.info.name}</Text>
                      <Tag color={getScoreColor(candidate.totalScore)}>
                        <TrophyOutlined /> {candidate.totalScore}/60
                      </Tag>
                    </Space>
                  }
                  description={
                    <Space direction="vertical" size="small">
                      <Text>{candidate.info.email}</Text>
                      <Text>{candidate.info.phone}</Text>
                      <Text type="secondary">
                        Completed: {new Date(candidate.completedAt).toLocaleString()}
                      </Text>
                      <Tag color={getScoreColor(candidate.totalScore)}>
                        {getScoreLabel(candidate.totalScore)}
                      </Tag>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <CandidateDetailModal
          candidateId={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </div>
  )
}

export default InterviewerTab
