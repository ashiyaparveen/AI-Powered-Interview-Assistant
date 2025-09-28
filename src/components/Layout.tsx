import React from 'react'
import { Layout as AntLayout, Tabs, Typography } from 'antd'
import { UserOutlined, DashboardOutlined } from '@ant-design/icons'
import IntervieweeTab from './IntervieweeTab'
import InterviewerTab from './InterviewerTab'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { setActiveTab } from '../store/slices/uiSlice'

const { Header, Content } = AntLayout
const { Title } = Typography

const Layout: React.FC = () => {
  const dispatch = useAppDispatch()
  const { activeTab } = useAppSelector(state => state.ui)

  const handleTabChange = (key: string) => {
    dispatch(setActiveTab(key as 'interviewee' | 'interviewer'))
  }

  const tabItems = [
    {
      key: 'interviewee',
      label: (
        <span>
          <UserOutlined />
          Interviewee (Chat)
        </span>
      ),
      children: <IntervieweeTab />
    },
    {
      key: 'interviewer',
      label: (
        <span>
          <DashboardOutlined />
          Interviewer (Dashboard)
        </span>
      ),
      children: <InterviewerTab />
    }
  ]

  return (
    <AntLayout className="layout">
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
          AI Interview Assistant
        </Title>
      </Header>
      <Content className="interview-container">
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={tabItems}
          size="large"
          style={{ marginTop: 24 }}
        />
      </Content>
    </AntLayout>
  )
}

export default Layout
