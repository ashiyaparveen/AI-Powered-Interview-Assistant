# AI-Powered Interview Assistant

A comprehensive React application that provides an AI-powered interview experience with resume parsing, timed questions, and candidate management.

## Features

### Interviewee Portal
- **Resume Upload**: Support for PDF and DOCX files with automatic information extraction
- **Information Collection**: Chat-based collection of missing candidate information
- **Timed Interview**: 6 questions with different difficulty levels and time limits
  - 2 Easy questions (20 seconds each)
  - 2 Medium questions (60 seconds each)  
  - 2 Hard questions (120 seconds each)
- **AI Evaluation**: Automatic scoring and feedback for each answer
- **Real-time Chat**: Interactive chat interface with the AI assistant

### Interviewer Dashboard
- **Candidate Management**: View all candidates sorted by score
- **Detailed Profiles**: Complete candidate information, answers, and evaluations
- **Search & Filter**: Find candidates by name, email, or sort by various criteria
- **Performance Analytics**: Visual score breakdowns and performance metrics

### Persistence & State Management
- **Redux Toolkit**: Centralized state management
- **Redux Persist**: Automatic state persistence across browser sessions
- **Session Recovery**: "Welcome Back" modal for unfinished interviews
- **Local Storage**: All data saved locally for privacy

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **State Management**: Redux Toolkit + Redux Persist
- **UI Framework**: Ant Design
- **Build Tool**: Vite
- **File Parsing**: pdf-parse, mammoth (for DOCX)
- **Styling**: CSS + Ant Design components

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-interview-assistant
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## Usage

### For Interviewees
1. Upload your resume (PDF or DOCX)
2. Complete any missing information via chat
3. Start the timed interview
4. Answer 6 questions with AI evaluation
5. Receive your final score and feedback

### For Interviewers
1. Switch to the Interviewer tab
2. View all candidates sorted by performance
3. Search and filter candidates
4. Click "View Details" to see complete profiles
5. Review answers, scores, and chat history

## Project Structure

```
src/
├── components/          # React components
│   ├── Layout.tsx       # Main layout with tabs
│   ├── IntervieweeTab.tsx
│   ├── InterviewerTab.tsx
│   ├── ChatInterface.tsx
│   ├── ResumeUpload.tsx
│   ├── InterviewTimer.tsx
│   ├── QuestionCard.tsx
│   ├── CandidateDetailModal.tsx
│   └── WelcomeBackModal.tsx
├── store/               # Redux store configuration
│   ├── index.ts
│   └── slices/
│       ├── interviewSlice.ts
│       ├── candidateSlice.ts
│       └── uiSlice.ts
├── utils/               # Utility functions
│   ├── resumeParser.ts
│   └── questionGenerator.ts
├── hooks/               # Custom hooks
│   └── redux.ts
├── App.tsx
├── main.tsx
└── App.css
```

## Key Features Explained

### Resume Parsing
- Automatically extracts name, email, and phone from uploaded resumes
- Supports both PDF and DOCX formats
- Validates file type and size (5MB limit)
- Falls back to manual input for missing information

### AI Question Generation
- Generates role-specific questions for Full Stack React/Node developers
- Questions cover JavaScript, React, APIs, authentication, and performance
- Difficulty-based scoring with keyword analysis
- Simulated AI evaluation (can be replaced with real AI service)

### State Persistence
- All interview progress saved automatically
- Resume state on page refresh
- "Welcome Back" modal for unfinished sessions
- Complete candidate history maintained

### Responsive Design
- Mobile-friendly interface
- Clean, professional UI using Ant Design
- Accessible components and interactions
- Error handling and validation

## Customization

### Adding New Question Types
Modify `src/utils/questionGenerator.ts` to add new questions or difficulty levels.

### Changing AI Evaluation
Replace the simulated evaluation in `questionGenerator.ts` with calls to your preferred AI service.

### Styling
Customize the theme in `src/App.tsx` or modify `src/App.css` for additional styling.

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## License

MIT License - see LICENSE file for details.
