import React, { useEffect, useRef, useState } from 'react'
import { Card, Input, Button, Typography } from 'antd'
import { SendOutlined } from '@ant-design/icons'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { addChatMessage } from '../store/slices/interviewSlice'

const { Text } = Typography

const ChatInterface: React.FC = () => {
  const dispatch = useAppDispatch()
  const { chatHistory = [] } = useAppSelector(state => state.interview)
  const [message, setMessage] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory])

  const handleSendMessage = () => {
    if (message.trim()) {
      dispatch(addChatMessage({ type: 'user', message }))
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card title="Chat Assistant" style={{ marginBottom: 24 }}>
      <div className="chat-container">
        {chatHistory.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
            <Text type="secondary">
              Upload your resume to get started with the interview process!
            </Text>
          </div>
        ) : (
          chatHistory.map((msg, index) => (
            <div key={msg.id || `msg-${index}`} className={`chat-message ${msg.type}`}>
              <div className={`chat-bubble ${msg.type}`}>
                <Text>{msg.message || 'No message'}</Text>
                <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : 'Unknown time'}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>
      
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={chatHistory.length === 0}
        />
        <Button 
          type="primary" 
          icon={<SendOutlined />} 
          onClick={handleSendMessage}
          disabled={!message.trim() || chatHistory.length === 0}
        >
          Send
        </Button>
      </div>
    </Card>
  )
}

export default ChatInterface
