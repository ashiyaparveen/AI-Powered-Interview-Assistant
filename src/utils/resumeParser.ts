import mammoth from 'mammoth'

export interface ParsedResume {
  text: string
  name?: string
  email?: string
  phone?: string
  fileName?: string
}

export const parsePDF = async (file: File): Promise<ParsedResume> => {
  return new Promise((resolve, reject) => {
    // For now, we'll provide a simple fallback for PDF files
    // In a production app, you'd want to use a proper browser-compatible PDF parser
    resolve({ 
      text: 'PDF file uploaded successfully. Please enter your information manually below.',
      name: '',
      email: '',
      phone: '',
      fileName: file.name
    })
  })
}

export const parseDOCX = async (file: File): Promise<ParsedResume> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer
        const result = await mammoth.extractRawText({ arrayBuffer })
        const parsed = extractInfo(result.value)
        resolve({ text: result.value, fileName: file.name, ...parsed })
      } catch (error) {
        reject(new Error('Failed to parse DOCX file'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read DOCX file'))
    reader.readAsArrayBuffer(file)
  })
}

const extractInfo = (text: string): Partial<ParsedResume> => {
  const info: Partial<ParsedResume> = {}

  // Extract email
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
  const emailMatch = text.match(emailRegex)
  if (emailMatch) {
    info.email = emailMatch[0]
  }

  // Extract phone
  const phoneRegex = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/
  const phoneMatch = text.match(phoneRegex)
  if (phoneMatch) {
    info.phone = phoneMatch[0]
  }

  // Extract name (first line or after "Name:" etc.)
  const nameRegex = /(?:name|full name)[:\s]+([a-zA-Z\s]+)/i
  const nameMatch = text.match(nameRegex)
  if (nameMatch) {
    info.name = nameMatch[1].trim()
  } else {
    // Try to get first line as name
    const firstLine = text.split('\n')[0].trim()
    if (firstLine && firstLine.length < 50 && /^[a-zA-Z\s]+$/.test(firstLine)) {
      info.name = firstLine
    }
  }

  return info
}

export const validateFileType = (file: File): boolean => {
  const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  return allowedTypes.includes(file.type)
}

export const validateFileSize = (file: File, maxSizeMB: number = 5): boolean => {
  return file.size <= maxSizeMB * 1024 * 1024
}
