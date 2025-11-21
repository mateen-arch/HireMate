'use client'

import { useEffect, useRef } from 'react'
import { Message } from '@/types/interview'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Bot, Clock, Sparkles, MessageCircle, Volume2 } from 'lucide-react'

interface MessageListProps {
  messages: Message[]
  onSpeakMessage?: (text: string) => void
}

export default function MessageList({ messages, onSpeakMessage }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 30, rotateY: -15 }}
              animate={{ opacity: 1, y: 0, rotateY: 0 }}
              exit={{ opacity: 0, y: -30, rotateY: 15 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex max-w-[80%] ${
                  message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* 3D Avatar */}
                <motion.div
                  initial={{ scale: 0, rotateY: 180 }}
                  animate={{ scale: 1, rotateY: 0 }}
                  transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 200 }}
                  className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl transform ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white ml-4 rotate-3 hover:rotate-0 transition-transform duration-500'
                      : 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white mr-4 -rotate-3 hover:rotate-0 transition-transform duration-500'
                  }`}
                >
                  {message.sender === 'user' ? (
                    <User size={20} />
                  ) : (
                    <Bot size={20} />
                  )}
                  
                  {/* Avatar glow effect */}
                  <div className={`absolute inset-0 rounded-2xl blur-xl opacity-50 ${
                    message.sender === 'user' ? 'bg-slate-400/30' : 'bg-cyan-400/30'
                  }`} />
                </motion.div>

                {/* 3D Message Content */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: index * 0.1 + 0.1, duration: 0.5 }}
                  whileHover={{ 
                    scale: 1.02, 
                    y: -2,
                    rotateY: message.sender === 'user' ? -2 : 2,
                    transition: { duration: 0.2 }
                  }}
                  className={`relative max-w-xs lg:max-w-md px-6 py-4 rounded-3xl shadow-2xl transform ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white rounded-br-xl'
                      : 'bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 text-gray-100 rounded-bl-xl'
                  }`}
                >
                  {/* Message glow effect */}
                  <div className={`absolute inset-0 rounded-3xl blur-xl opacity-30 ${
                    message.sender === 'user' 
                      ? 'bg-gradient-to-r from-cyan-400 to-purple-500' 
                      : 'bg-gradient-to-r from-gray-600 to-gray-700'
                  }`} />
                  
                  {/* Message content */}
                  <div className="relative z-10">
                    <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap">
                      {message.content}
                    </p>
                    
                    {/* Timestamp and actions */}
                    <div className={`flex items-center justify-between mt-3 ${
                      message.sender === 'user' ? 'text-cyan-100' : 'text-gray-400'
                    }`}>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs font-medium">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      
                      {/* Speak button for assistant messages */}
                      {message.sender === 'assistant' && onSpeakMessage && (
                        <motion.button
                          onClick={() => onSpeakMessage(message.content)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 rounded-full bg-gray-700/50 hover:bg-gray-600/50 transition-colors duration-200"
                          title="Speak this message"
                        >
                          <Volume2 className="w-3 h-3 text-gray-300 hover:text-white" />
                        </motion.button>
                      )}
                    </div>
                  </div>
                  
                  {/* Message tail effect */}
                  <div className={`absolute top-4 ${
                    message.sender === 'user' ? '-right-2' : '-left-2'
                  } w-4 h-4 transform rotate-45 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-600'
                      : 'bg-gray-800/80 border-l border-b border-gray-700/50'
                  }`} />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Empty state */}
      {messages.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-16 text-gray-400"
        >
          <motion.div
            initial={{ scale: 0, rotateY: 180 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-r from-gray-700 to-gray-800 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-gray-700/25"
          >
            <MessageCircle className="w-10 h-10 text-gray-500" />
          </motion.div>
          
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-xl font-bold text-gray-300 mb-2"
          >
            No messages yet
          </motion.h3>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="text-gray-500"
          >
            Start the interview to begin the conversation
          </motion.p>
          
          {/* Floating sparkles */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="absolute top-1/4 left-1/4 text-cyan-400/30 animate-bounce">
              <Sparkles size={16} />
            </div>
            <div className="absolute top-1/3 right-1/4 text-purple-400/30 animate-bounce delay-1000">
              <Sparkles size={16} />
            </div>
            <div className="absolute bottom-1/4 left-1/3 text-blue-400/30 animate-bounce delay-2000">
              <Sparkles size={16} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
