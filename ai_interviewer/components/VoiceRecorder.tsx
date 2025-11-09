'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Mic, Sparkles, Square } from 'lucide-react'



interface VoiceRecorderProps {
  onTranscription?: (text: string) => void
  onRecordingComplete?: (audioBlob: Blob) => void
  isRecording: boolean
  onStartRecording: () => void
  onStopRecording: () => void
}

export default function VoiceRecorder({
  onTranscription,
  onRecordingComplete,
  isRecording,
  onStartRecording,
  onStopRecording
}: VoiceRecorderProps) {
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [useWebSpeech, setUseWebSpeech] = useState(false)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const speechRecognitionRef = useRef<any>(null)

  useEffect(() => {
    // Check for MediaRecorder or SpeechRecognition support
    if (typeof window !== 'undefined') {
      if (window.MediaRecorder) {
        setIsSupported(true)
      } else if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        setIsSupported(true)
        setUseWebSpeech(true)
      } else {
        setIsSupported(false)
        setError('Voice recording is not supported in this browser')
      }
    }
  }, [])

  const startWebSpeechRecording = () => {
    try {
      // Use type assertion to handle browser compatibility
      const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognitionConstructor) {
        speechRecognitionRef.current = new SpeechRecognitionConstructor()
        speechRecognitionRef.current.continuous = true
        speechRecognitionRef.current.interimResults = true
        speechRecognitionRef.current.lang = 'en-US'

        speechRecognitionRef.current.onresult = (event: any) => {
          let finalTranscript = ''
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i].transcript
            }
          }
          if (finalTranscript && onTranscription) {
            onTranscription(finalTranscript)
          }
        }

        speechRecognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          setError(`Speech recognition error: ${event.error}`)
        }

        speechRecognitionRef.current.start()
        onStartRecording()
      }
    } catch (err) {
      console.error('Error starting speech recognition:', err)
      setError('Failed to start speech recognition')
    }
  }

  const startMediaRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        if (onRecordingComplete) {
          onRecordingComplete(audioBlob)
        }
        
        // Notify parent that recording has stopped
        onStopRecording()
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorderRef.current.start()
      onStartRecording()
    } catch (err) {
      console.error('Error starting media recording:', err)
      setError('Failed to access microphone')
    }
  }

  const handleStartRecording = () => {
    setError(null)
    if (useWebSpeech) {
      startWebSpeechRecording()
    } else {
      startMediaRecording()
    }
  }

  const handleStopRecording = () => {
    if (useWebSpeech && speechRecognitionRef.current) {
      speechRecognitionRef.current.stop()
      onStopRecording()
    } else if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
      // Don't call onStopRecording here - it will be called in the onstop event with the audio blob
    }
  }

  if (!isSupported) {
    return (
      <div className="text-center p-8">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Square className="w-10 h-10 text-red-400" />
        </div>
        <p className="text-red-400 font-semibold mb-2">Voice Recording Not Supported</p>
        <p className="text-gray-400 text-sm">Your browser doesn't support voice recording</p>
      </div>
    )
  }

  return (
    <div className="text-center space-y-6">
      {/* Recording Button */}
      <motion.button
        onClick={isRecording ? handleStopRecording : handleStartRecording}
        className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 transform ${
          isRecording 
            ? 'bg-gradient-to-r from-red-500 to-pink-600 shadow-2xl shadow-red-500/40 scale-110' 
            : 'bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40'
        }`}
        whileHover={{ 
          scale: isRecording ? 1.1 : 1.05, 
          y: isRecording ? -2 : -5,
          boxShadow: isRecording 
            ? "0 25px 50px -12px rgba(239, 68, 68, 0.5)" 
            : "0 25px 50px -12px rgba(6, 182, 212, 0.4)"
        }}
        whileTap={{ scale: 0.95 }}
        animate={isRecording ? { 
          boxShadow: [
            "0 0 20px rgba(239, 68, 68, 0.3)",
            "0 0 40px rgba(239, 68, 68, 0.5)",
            "0 0 20px rgba(239, 68, 68, 0.3)"
          ]
        } : {}}
        transition={{ 
          duration: 2, 
          repeat: isRecording ? Infinity : 0,
          ease: "easeInOut"
        }}
      >
        {/* Button glow effect */}
        <div className={`absolute inset-0 rounded-full blur-xl opacity-75 ${
          isRecording 
            ? 'bg-gradient-to-r from-red-500 to-pink-600' 
            : 'bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600'
        }`} />
        
        {/* Button content */}
        <div className="relative z-10">
          {isRecording ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Square className="w-16 h-16 text-white" />
            </motion.div>
          ) : (
            <Mic className="w-16 h-16 text-white" />
          )}
        </div>
        
        {/* Recording indicator */}
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center"
          >
            <div className="w-4 h-4 bg-white rounded-full recording-indicator" />
          </motion.div>
        )}
        
        {/* Floating sparkles when recording */}
        {isRecording && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 0, x: 0 }}
              animate={{ opacity: [0, 1, 0], y: [-10, -30], x: [-5, 5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0 }}
              className="absolute top-0 left-1/2 transform -translate-x-1/2 text-yellow-300 text-2xl"
            >
                  
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 0, x: 0 }}
              animate={{ opacity: [0, 1, 0], y: [-10, -30], x: [5, -5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              className="absolute top-0 right-0 text-pink-300 text-2xl"
            >
              
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 0, x: 0 }}
              animate={{ opacity: [0, 1, 0], y: [-10, -30], x: [0, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 2 }}
              className="absolute top-0 left-0 text-cyan-300 text-2xl"
            >
              
            </motion.div>
          </>
        )}
      </motion.button>
      
      {/* Status Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <p className={`text-lg font-semibold mb-2 ${
          isRecording ? 'text-red-400' : 'text-cyan-400'
        }`}>
          {isRecording ? 'Recording...' : 'Click to Start Recording'}
        </p>
        <p className="text-gray-400 text-sm">
          {useWebSpeech ? 'Using Web Speech API' : 'Using MediaRecorder API'}
        </p>
      </motion.div>
      
      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-500/20 border border-red-500/50 rounded-2xl p-4 text-red-400 text-sm"
        >
          <p className="font-semibold mb-1">Recording Error</p>
          <p>{error}</p>
        </motion.div>
      )}
    </div>
  )
}
