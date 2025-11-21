'use client'

import { useState, useEffect, useRef } from 'react'
import { Message, Feedback, InterviewConfig } from '@/types/interview'
import VoiceRecorder from './VoiceRecorder'
import MessageList from './MessageList'
import InterviewTimer from './InterviewTimer'
import FeedbackPanel from './FeedbackPanel'
import { motion } from 'framer-motion'
import { Mic, MicOff, Volume2, VolumeX, Briefcase, Clock, MessageSquare, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

interface IntegrationConfig {
  accessCode: string
  apiBase: string
  interviewId?: string
  applicationId?: string
}

interface InterviewSessionProps {
  config: InterviewConfig
  onEndInterview: () => void
  integration?: IntegrationConfig
}

export default function InterviewSession({ config, onEndInterview, integration }: InterviewSessionProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [sessionStatus, setSessionStatus] = useState<'active' | 'completed' | 'paused'>('active')
  const [startTime] = useState(new Date())
  const [syncingResults, setSyncingResults] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement>(null)

  // Initialize voices for speech synthesis (especially important for mobile)
  useEffect(() => {
    const initializeVoices = () => {
      if ('speechSynthesis' in window) {
        // Load voices if not already loaded
        if (speechSynthesis.getVoices().length === 0) {
          speechSynthesis.addEventListener('voiceschanged', () => {
            console.log('Voices loaded:', speechSynthesis.getVoices().length)
          })
        }
      }
    }
    
    initializeVoices()
  }, [])

  // Initialize interview with first question
  useEffect(() => {
    const initialMessage: Message = {
      id: '1',
      content: getInitialQuestion(config),
      sender: 'assistant',
      timestamp: new Date(),
    }
    setMessages([initialMessage])
    
    // Delay speech slightly to ensure voices are loaded
    setTimeout(() => {
      speakMessage(initialMessage.content)
    }, 500)
  }, [config])

  const getInitialQuestion = (config: InterviewConfig): string => {
    const roleQuestions = {
      'software-engineer': "Hello! I'm conducting a technical interview for a software engineering position. Let's start with a fundamental question: Can you walk me through your experience with object-oriented programming and explain how you would design a simple class hierarchy?",
      'data-scientist': "Welcome to your data science interview! I'd like to begin by understanding your approach to data analysis. Can you describe a project where you had to clean and preprocess a large dataset? What challenges did you face and how did you overcome them?",
      'product-manager': "Thank you for joining us today for the product manager interview. Let's start with a behavioral question: Can you tell me about a time when you had to make a difficult product decision with limited data? What was your process and what was the outcome?",
      'sales-representative': "Welcome to your sales interview! I'd like to understand your sales approach. Can you walk me through how you would handle a prospect who says 'I need to think about it' during a sales call?",
      'hr-manager': "Hello! I'm conducting an HR interview. Let's start with understanding your approach to conflict resolution. Can you describe a situation where you had to mediate a conflict between team members?",
      'marketing-specialist': "Welcome to your marketing interview! I'd like to understand your creative process. Can you tell me about a successful marketing campaign you've worked on? What made it successful?",
      'customer-service': "Hello! I'm conducting a customer service interview. Let's start with a scenario: A customer is very upset about a product defect. How would you handle this situation?",
      'general': "Hello! Welcome to your interview. Let's start with a general question: Can you tell me about yourself and what interests you about this role?",
    }
    
    return roleQuestions[config.role] || roleQuestions.general
  }

  const speakMessage = async (text: string) => {
    if (!text || !voiceEnabled) return
    
    setIsAssistantSpeaking(true)
    
    try {
      // Check if speech synthesis is available
      if ('speechSynthesis' in window) {
        // Stop any ongoing speech
        speechSynthesis.cancel()
        
        // Wait a bit for cancellation to complete
        await new Promise(resolve => setTimeout(resolve, 100))
        
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 0.9
        utterance.pitch = 1
        utterance.volume = 0.8
        
        // Try to use a more compatible voice
        const voices = speechSynthesis.getVoices()
        if (voices.length > 0) {
          // Prefer English voices, especially on mobile
          const englishVoice = voices.find(voice => 
            voice.lang.startsWith('en') && 
            (voice.name.includes('Google') || voice.name.includes('Microsoft') || voice.name.includes('Samantha'))
          ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0]
          
          if (englishVoice) {
            utterance.voice = englishVoice
          }
        }
        
        utterance.onend = () => {
          setIsAssistantSpeaking(false)
        }
        
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event.error)
          setIsAssistantSpeaking(false)
          // Fallback to text display with notification
          toast.error('Voice playback not available. Please read the response.')
        }
        
        // For mobile devices, we need to trigger speech in a user interaction
        speechSynthesis.speak(utterance)
        
        // Fallback timeout for mobile devices
        setTimeout(() => {
          if (isAssistantSpeaking) {
            setIsAssistantSpeaking(false)
          }
        }, text.length * 100 + 2000) // Estimate speaking time + buffer
        
      } else {
        // Fallback for browsers without speech synthesis
        console.warn('Speech synthesis not supported')
        setIsAssistantSpeaking(false)
        toast.error('Voice playback not supported on this device. Please read the response.')
      }
    } catch (error) {
      console.error('Speech synthesis error:', error)
      setIsAssistantSpeaking(false)
      toast.error('Voice playback failed. Please read the response.')
    }
  }

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled)
    if (isAssistantSpeaking) {
      speechSynthesis.cancel()
      setIsAssistantSpeaking(false)
    }
  }

  const speakLastMessage = () => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage && lastMessage.sender === 'assistant') {
      speakMessage(lastMessage.content)
    }
  }

  const handleRealTimeTranscription = (text: string) => {
    // Handle real-time transcription from Web Speech API
    console.log('Real-time transcription:', text)
    
    // You could show this as a preview or process it immediately
    // For now, we'll just log it and let the user finish speaking
  }

  const handleVoiceInput = async (audioBlob: Blob) => {
    if (!audioBlob) {
      console.error('No audio blob received')
      return
    }
    
    try {
      // Convert audio to text using AssemblyAI
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.wav')
      
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Transcription failed')
      }
      
      const { text, aiResponse } = await response.json()
      
      if (text) {
        const userMessage: Message = {
          id: Date.now().toString(),
          content: text,
          sender: 'user',
          timestamp: new Date(),
        }
        
        setMessages(prev => [...prev, userMessage])
        
        // If we got an AI response directly from transcription, use it
        if (aiResponse) {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: aiResponse,
            sender: 'assistant',
            timestamp: new Date(),
          }
          
          setMessages(prev => [...prev, assistantMessage])
          
          // Generate feedback for the user's response
          await generateFeedback(text)
          
          // Speak the response
          speakMessage(aiResponse)
        } else {
          // Fallback: Get AI response through chat API
          await getAIResponse(text)
        }
      }
    } catch (error) {
      console.error('Voice input error:', error)
      toast.error('Failed to process voice input')
    }
  }

  const generateFeedback = async (userInput: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.content,
          })),
          userInput,
          config,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate feedback')
      }
      
      const { feedback: newFeedback } = await response.json()
      
      if (newFeedback) {
        setFeedback(newFeedback)
      }
      
    } catch (error) {
      console.error('Feedback generation error:', error)
      // Don't show error toast for feedback, just log it
    }
  }

  const getAIResponse = async (userInput: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.content,
          })),
          userInput,
          config,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }
      
      const { response: aiResponse, feedback: newFeedback } = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'assistant',
        timestamp: new Date(),
      }
      
      setMessages(prev => [...prev, assistantMessage])
      
      if (newFeedback) {
        setFeedback(newFeedback)
      }
      
      // Speak the response
      speakMessage(aiResponse)
      
    } catch (error) {
      console.error('AI response error:', error)
      toast.error('Failed to get AI response')
    }
  }

  const derivedScore = () => {
    if (feedback?.score) {
      return Math.round(Math.max(0, Math.min(100, feedback.score * 10)))
    }
    if (feedback?.areas) {
      const avg = (feedback.areas.clarity + feedback.areas.confidence + feedback.areas.relevance + feedback.areas.structure) / 4
      return Math.round(Math.max(0, Math.min(100, avg * 10)))
    }
    return 60
  }

  const submitIntegrationResults = async () => {
    if (!integration?.accessCode) return
    try {
      setSyncingResults(true)
      await fetch(`${integration.apiBase}/interviews/external/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessCode: integration.accessCode,
          aiScore: derivedScore(),
          feedback,
          transcript: messages.map(({ sender, content, timestamp }) => ({
            sender,
            content,
            timestamp,
          })),
        }),
      })
      toast.success('Interview results shared with HireMate')
    } catch (error) {
      console.error('Failed to sync results', error)
      toast.error('Could not send results back to HireMate')
    } finally {
      setSyncingResults(false)
    }
  }

  const handleEndInterview = async () => {
    setSessionStatus('completed')
    speechSynthesis.cancel()
    if (integration?.accessCode) {
      await submitIntegrationResults()
    }
    onEndInterview()
  }

  const toggleMute = () => {
    if (isAssistantSpeaking) {
      speechSynthesis.cancel()
      setIsAssistantSpeaking(false)
    } else {
      // If not speaking, try to speak the last assistant message
      speakLastMessage()
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30, rotateX: -15 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        <div className="bg-gray-900/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl shadow-black/50">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-3xl" />
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4 mb-4"
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-cyan-500/25 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    <div className="w-full h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-3xl flex items-center justify-center transform -rotate-3">
                      <Briefcase className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  {/* 3D shadow */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-4 bg-black/50 rounded-full blur-xl" />
                </div>
                
                <div>
                  <h2 className="text-4xl font-black text-white mb-2">
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                      Interview in Progress
                    </span>
                  </h2>
                  
                  <div className="flex items-center gap-3 text-gray-300">
                    <span className="px-4 py-2 bg-gradient-to-r from-cyan-900/50 to-blue-900/50 border border-cyan-400/30 rounded-2xl text-cyan-300 font-semibold text-sm">
                      {config.type.charAt(0).toUpperCase() + config.type.slice(1)}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="flex items-center gap-2 text-gray-300">
                      <Clock className="w-5 h-5 text-cyan-400" />
                      {config.duration} minutes
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ delay: 0.4 }}
            >
              <InterviewTimer 
                duration={config.duration} 
                startTime={startTime}
                onTimeUp={handleEndInterview}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotateX: 15 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ delay: 0.6 }}
        className="relative"
      >
        <div className="bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl shadow-black/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5" />
          
          <div className="p-6 border-b border-gray-700/50 relative z-10">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Conversation
              </span>
            </h3>
          </div>
          
          <div className="h-96 overflow-hidden relative z-10">
            <MessageList messages={messages} onSpeakMessage={speakMessage} />
          </div>
        </div>
      </motion.div>

      {/* Voice Controls */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotateX: 15 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ delay: 0.8 }}
        className="relative"
      >
        <div className="bg-gray-900/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl shadow-black/50">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-3xl" />
          
          <div className="text-center mb-8 relative z-10">
            <h3 className="text-2xl font-bold text-white flex items-center justify-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                Voice Controls
              </span>
            </h3>
            <p className="text-gray-300 text-sm">Record your responses and control the interview flow</p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 relative z-10">
            <VoiceRecorder
              isRecording={isRecording}
              onStartRecording={() => setIsRecording(true)}
              onStopRecording={() => setIsRecording(false)}
              onRecordingComplete={handleVoiceInput}
              onTranscription={handleRealTimeTranscription}
            />
            
            {/* Voice Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.05, y: -5, rotateY: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleVoice}
              className={`p-4 rounded-2xl transition-all duration-300 shadow-lg ${
                voiceEnabled 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-500/25 hover:shadow-green-500/40' 
                  : 'bg-gradient-to-r from-gray-600 to-gray-700 text-gray-300 hover:from-gray-500 hover:to-gray-600 shadow-gray-500/25'
              }`}
              title={voiceEnabled ? 'Voice enabled - Click to disable' : 'Voice disabled - Click to enable'}
            >
              {voiceEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
            </motion.button>

            {/* Speak/Stop Button */}
            <motion.button
              whileHover={{ scale: 1.1, y: -5, rotateY: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMute}
              className={`p-5 rounded-2xl transition-all duration-300 shadow-lg ${
                isAssistantSpeaking 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-red-500/25 hover:shadow-red-500/40' 
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-cyan-500/25 hover:shadow-cyan-500/40'
              }`}
              title={isAssistantSpeaking ? 'Stop speaking' : 'Speak last message'}
            >
              {isAssistantSpeaking ? <VolumeX size={28} /> : <Volume2 size={28} />}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -5, rotateY: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEndInterview}
              disabled={syncingResults}
              className={`px-8 py-5 rounded-2xl font-bold shadow-2xl transition-all duration-300 transform ${
                syncingResults
                  ? 'bg-gray-500 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 hover:from-red-600 hover:via-pink-600 hover:to-rose-600 text-white shadow-red-500/25 hover:shadow-red-500/40'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-xl">⏹️</span>
                {syncingResults ? 'Submitting...' : 'End Interview'}
                <span className="text-xl">🚪</span>
              </span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Feedback Panel */}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <FeedbackPanel feedback={feedback} />
        </motion.div>
      )}
    </div>
  )
}
