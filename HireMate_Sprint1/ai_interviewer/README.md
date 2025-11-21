# AI Interview Assistant

An AI-powered virtual interview assistant that conducts mock interviews using natural voice conversation, evaluates responses, and provides real-time feedback.

## 🎯 Features

### Core Functionality
- **Voice Interaction**: Natural speech-to-text and text-to-speech conversation
- **Multiple Interview Types**: Technical, Behavioral, General, Sales, and HR interviews
- **Role-Specific Questions**: Tailored questions for different job roles
- **Real-time Feedback**: AI-powered evaluation of responses with detailed scoring
- **Interview Timer**: Configurable interview duration with visual progress tracking

### Interview Types
- **Technical Interviews**: Coding challenges, system design, and technical questions
- **Behavioral Interviews**: STAR method questions about past experiences
- **General Interviews**: Mixed questions for overall assessment
- **Sales Interviews**: Sales techniques and customer interaction scenarios
- **HR Interviews**: Culture fit and interpersonal skills assessment

### Supported Roles
- Software Engineer
- Data Scientist
- Product Manager
- Sales Representative
- HR Manager
- Marketing Specialist
- Customer Service
- General

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **AI/ML**: Grok AI (Gemma 2 9B), AssemblyAI for real-time audio transcription
- **Voice**: Web Speech API (Text-to-Speech), MediaRecorder API
- **UI Components**: Lucide React Icons, React Hot Toast

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Grok AI API key
- AssemblyAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-interview-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   GROK_API_KEY=your_grok_api_key_here
   GROK_API_URL=https://api.groq.com/openai/v1
   ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here
   ASSEMBLYAI_API_URL=https://api.assemblyai.com/v2
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### Starting an Interview
1. Select your interview type (Technical, Behavioral, etc.)
2. Choose your target role (Software Engineer, Data Scientist, etc.)
3. Set the interview duration (15, 30, 45, or 60 minutes)
4. Click "Start Interview"

### During the Interview
- **Voice Recording**: Click the microphone button to start recording your response
- **Real-time Feedback**: Receive instant feedback after each response
- **Timer**: Monitor your interview progress with the visual timer
- **Mute**: Stop the AI assistant from speaking if needed

### Interview Features
- **Natural Conversation**: AI asks follow-up questions based on your responses
- **Role-Specific Questions**: Questions tailored to your selected role
- **Scoring System**: Detailed evaluation across multiple criteria:
  - Clarity (1-10)
  - Confidence (1-10)
  - Relevance (1-10)
  - Structure (1-10)

## 🔧 Configuration

### Environment Variables
- `GROK_API_KEY`: Your Grok AI API key for Gemma 2 9B access
- `GROK_API_URL`: Grok AI API endpoint (default: https://api.groq.com/openai/v1)
- `ASSEMBLYAI_API_KEY`: Your AssemblyAI API key for real-time audio transcription
- `ASSEMBLYAI_API_URL`: AssemblyAI API endpoint (default: https://api.assemblyai.com/v2)

### Customization
You can customize interview questions and prompts by modifying:
- `app/api/chat/route.ts` - Grok AI conversation logic
- `app/api/transcribe/route.ts` - AssemblyAI audio transcription
- `components/InterviewSession.tsx` - Initial questions per role
- `types/interview.ts` - Interview types and roles

## 🏗️ Project Structure

```
ai-interview-assistant/
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # AI conversation endpoint
│   │   └── transcribe/route.ts    # Speech-to-text endpoint
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main page
├── components/
│   ├── InterviewSetup.tsx         # Interview configuration
│   ├── InterviewSession.tsx       # Main interview interface
│   ├── VoiceRecorder.tsx          # Voice recording component
│   ├── MessageList.tsx            # Conversation display
│   ├── InterviewTimer.tsx         # Timer component
│   └── FeedbackPanel.tsx          # Feedback display
├── types/
│   └── interview.ts               # TypeScript definitions
├── package.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion for engaging interactions
- **Visual Feedback**: Color-coded scoring and progress indicators
- **Accessibility**: Keyboard navigation and screen reader support
- **Modern Design**: Clean, professional interface with Tailwind CSS

## 🔒 Privacy & Security

- **Local Processing**: Voice recording and playback handled locally
- **Secure API Calls**: Grok AI API calls made server-side
- **No Data Storage**: Interview data not stored permanently
- **HTTPS Required**: Secure communication for production deployment

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Heroku

## 🔮 Future Enhancements

### Phase 2 Features
- [ ] Video interview mode with facial emotion recognition
- [ ] Resume parsing for custom questions
- [ ] Job description analysis for targeted interviews
- [ ] Multi-language support
- [ ] Interview session recording and playback

### Phase 3 Features
- [ ] Advanced analytics dashboard
- [ ] Progress tracking over time
- [ ] Custom voice selection
- [ ] Interview templates
- [ ] Integration with job boards

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Grok AI for Gemma 2 9B API
- AssemblyAI for real-time audio transcription
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first styling
- Framer Motion for smooth animations

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include browser console logs for debugging

---

**Made with ❤️ for better interview preparation**




"# AI-Interview-Assistant-" 
