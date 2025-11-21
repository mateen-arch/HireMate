# Quick Setup Guide

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

### 3. Open Your Browser
Navigate to: http://localhost:3000

## 🎯 Features Available

### Demo Mode (No API Key Required)
- ✅ Voice recording and playback
- ✅ Interview setup and configuration
- ✅ Real-time feedback system
- ✅ Timer and progress tracking
- ✅ Multiple interview types and roles
- ✅ Beautiful UI with animations

### Full Mode (With OpenAI API Key)
- ✅ AI-powered conversations
- ✅ Speech-to-text transcription
- ✅ Intelligent follow-up questions
- ✅ Detailed AI-generated feedback

## 🔧 Configuration

### For Demo Mode (Default)
No configuration needed! The app works out of the box with demo responses.

### For Full AI Mode
1. Get an OpenAI API key from: https://platform.openai.com/api-keys
2. Create a `.env.local` file in the root directory
3. Add your API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

## 📱 How to Use

1. **Select Interview Type**: Choose from Technical, Behavioral, General, Sales, or HR
2. **Choose Your Role**: Pick from Software Engineer, Data Scientist, Product Manager, etc.
3. **Set Duration**: 15, 30, 45, or 60 minutes
4. **Start Interview**: Click the "Start Interview" button
5. **Record Responses**: Use the microphone button to record your answers
6. **Get Feedback**: View real-time feedback and scores
7. **Continue Conversation**: The AI will ask follow-up questions

## 🎨 Features

- **Voice Recording**: Click microphone to record responses
- **Text-to-Speech**: AI speaks questions and responses
- **Real-time Feedback**: Get scores on clarity, confidence, relevance, and structure
- **Timer**: Visual countdown with progress tracking
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Beautiful animations and professional interface

## 🛠️ Troubleshooting

### If you see "next is not recognized"
```bash
npm install
npm run dev
```

### If voice recording doesn't work
- Make sure you're using HTTPS or localhost
- Allow microphone permissions in your browser
- Try refreshing the page

### If the app doesn't load
- Check that the server is running on http://localhost:3000
- Look for any error messages in the terminal
- Try stopping and restarting the server

## 🎉 You're Ready!

The AI Interview Assistant is now running and ready to help you practice interviews!




