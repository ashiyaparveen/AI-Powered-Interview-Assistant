import React from 'react'
import { Upload, Typography } from 'antd'
import { FileTextOutlined } from '@ant-design/icons'

const { Text } = Typography

interface ResumeUploadProps {
  onUpload: (file: File) => Promise<boolean>
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onUpload }) => {
  const uploadProps = {
    name: 'file',
    multiple: false,
    accept: '.pdf,.docx',
    beforeUpload: onUpload,
    showUploadList: false,
  }

  return (
    <div className="upload-dragger">
      <Upload.Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <FileTextOutlined />
        </p>
        <p className="ant-upload-text">Click or drag resume file to this area to upload</p>
        <p className="ant-upload-hint">
          Support for PDF and DOCX files only. File size limit: 5MB
        </p>
      </Upload.Dragger>
      
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <Text type="secondary">
          Supported formats: PDF, DOCX
        </Text>
      </div>
    </div>
  )
}

export default ResumeUpload
