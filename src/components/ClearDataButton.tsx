import React from 'react'
import { Button, Popconfirm, message } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { useAppDispatch } from '../hooks/redux'
import { clearAllData } from '../store/slices/interviewSlice'
import { clearAllCandidates } from '../store/slices/candidateSlice'

const ClearDataButton: React.FC = () => {
  const dispatch = useAppDispatch()

  const handleClearData = () => {
    try {
      dispatch(clearAllData())
      dispatch(clearAllCandidates())
      message.success('All data cleared successfully!')
    } catch (error) {
      message.error('Failed to clear data')
    }
  }

  return (
    <Popconfirm
      title="Clear All Data"
      description="This will delete all interview data, candidates, and chat history. Are you sure?"
      onConfirm={handleClearData}
      okText="Yes, Clear All"
      cancelText="Cancel"
    >
      <Button 
        type="text" 
        danger 
        icon={<DeleteOutlined />}
        style={{ position: 'fixed', top: 10, right: 10, zIndex: 1000 }}
      >
        Clear Data
      </Button>
    </Popconfirm>
  )
}

export default ClearDataButton
