'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import InterviewSetup from '@/components/InterviewSetup'
import InterviewSession from '@/components/InterviewSession'
import ReviewSession from '@/components/ReviewSession'
import ReviewList from '@/components/ReviewList'
import { InterviewType, InterviewRole } from '@/types/interview'
import { motion, AnimatePresence } from 'framer-motion'

const DEFAULT_AI_API = process.env.NEXT_PUBLIC_HIREMATE_API_URL || 'http://localhost:5000/api'

export default function Home() {
  const searchParams = useSearchParams()
  const [isInterviewStarted, setIsInterviewStarted] = useState(false)
  const [currentView, setCurrentView] = useState<'main' | 'interview' | 'review-form' | 'review-list'>('main')
  const [interviewConfig, setInterviewConfig] = useState<{
    type: InterviewType
    role: InterviewRole
    duration: number
  } | null>(null)
  const [integrationConfig, setIntegrationConfig] = useState<{
    accessCode: string
    interviewId?: string
    applicationId?: string
    apiBase: string
  } | null>(null)
  const [autoStarted, setAutoStarted] = useState(false)

  const startInterview = (config: {
    type: InterviewType
    role: InterviewRole
    duration: number
  }) => {
    setInterviewConfig(config)
    setIsInterviewStarted(true)
    setCurrentView('interview')
  }

  const endInterview = () => {
    setIsInterviewStarted(false)
    setInterviewConfig(null)
    setCurrentView('main')
  }

  const goToReviewForm = () => {
    setCurrentView('review-form')
  }

  const goToReviewList = () => {
    setCurrentView('review-list')
  }

  const goToMain = () => {
    setCurrentView('main')
  }

  const accessCode = searchParams.get('accessCode')
  const roleParam = searchParams.get('role') as InterviewRole | null
  const typeParam = searchParams.get('type') as InterviewType | null
  const durationParam = searchParams.get('duration')

  useEffect(() => {
    if (accessCode && !autoStarted) {
      const config = {
        type: typeParam || 'technical',
        role: roleParam || 'general',
        duration: durationParam ? Number(durationParam) : 20,
      }
      setIntegrationConfig({
        accessCode,
        interviewId: searchParams.get('interviewId') || undefined,
        applicationId: searchParams.get('applicationId') || undefined,
        apiBase: DEFAULT_AI_API,
      })
      setInterviewConfig(config)
      setIsInterviewStarted(true)
      setCurrentView('interview')
      setAutoStarted(true)
    }
  }, [accessCode, roleParam, typeParam, durationParam, searchParams, autoStarted])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* 3D Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating geometric shapes */}
        <motion.div
          animate={{ 
            rotate: 360,
            y: [0, -20, 0],
            x: [0, 10, 0]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-20 w-32 h-32 border border-cyan-400/30 rounded-lg transform rotate-45"
        />
        
        <motion.div
          animate={{ 
            rotate: -360,
            y: [0, 30, 0],
            x: [0, -15, 0]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-40 right-32 w-24 h-24 border border-purple-400/30 rounded-full"
        />
        
        <motion.div
          animate={{ 
            rotate: 360,
            y: [0, -25, 0],
            x: [0, 20, 0]
          }}
          transition={{ 
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-32 left-1/4 w-20 h-20 border border-blue-400/30 transform rotate-12"
        />
        
        <motion.div
          animate={{ 
            rotate: -360,
            y: [0, 40, 0],
            x: [0, -25, 0]
          }}
          transition={{ 
            duration: 35,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-20 w-28 h-28 border border-pink-400/30 transform -rotate-45"
        />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20" />
        
        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center py-16"
        >
          {/* 3D Logo */}
          <motion.div
            initial={{ scale: 0, rotateY: 180 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 100 }}
            className="relative mx-auto mb-8"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-3xl shadow-2xl shadow-cyan-500/25 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="w-full h-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-3xl flex items-center justify-center transform -rotate-3">
                <div className="text-4xl font-bold text-white"></div>
              </div>
            </div>
            {/* 3D shadow */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-28 h-8 bg-black/50 rounded-full blur-xl" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-6xl md:text-7xl font-black mb-6"
          >
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              AI Interview 
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
              Assistant
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8"
          >
            Master your interviews with <span className="text-cyan-400 font-semibold">AI-powered practice sessions</span>. 
            Get real-time feedback, role-specific questions, and professional guidance to ace your next interview.
          </motion.p>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            {[
              { icon: '', text: 'Real-time Voice', color: 'from-cyan-400 to-blue-500' },
              { icon: '', text: 'AI Feedback', color: 'from-purple-400 to-pink-500' },
              { icon: '', text: 'Instant Results', color: 'from-blue-400 to-cyan-500' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`px-6 py-3 bg-gradient-to-r ${feature.color} rounded-2xl text-white font-semibold shadow-lg shadow-${feature.color.split('-')[1]}-500/25 transform hover:rotate-1 transition-all duration-300`}
              >
                <span className="text-lg mr-2">{feature.icon}</span>
                {feature.text}
              </motion.div>
            ))}
          </motion.div>

          {/* Review Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            <motion.button
              onClick={goToReviewList}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl text-white font-semibold shadow-lg shadow-green-500/25 transform hover:rotate-1 transition-all duration-300 flex items-center gap-2"
            >
              <span className="text-lg"></span>
              View Reviews
            </motion.button>
            
            <motion.button
              onClick={goToReviewForm}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl text-white font-semibold shadow-lg shadow-orange-500/25 transform hover:rotate-1 transition-all duration-300 flex items-center gap-2"
            >
              <span className="text-lg"></span>
              Write Review
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {currentView === 'main' && !integrationConfig && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -50 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <InterviewSetup onStartInterview={startInterview} />
            </motion.div>
          )}
          
          {currentView === 'interview' && (
            <motion.div
              key="active"
              initial={{ opacity: 0, x: 50, rotateY: 15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -50, rotateY: -15 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <InterviewSession 
                config={interviewConfig!}
                onEndInterview={endInterview}
                integration={integrationConfig || undefined}
              />
            </motion.div>
          )}
          
          {currentView === 'review-form' && !integrationConfig && (
            <motion.div
              key="review-form"
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -50 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <ReviewSession 
                onBack={goToMain}
                interviewType={interviewConfig?.type}
                interviewRole={interviewConfig?.role}
              />
            </motion.div>
          )}
          
          {currentView === 'review-list' && !integrationConfig && (
            <motion.div
              key="review-list"
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -50 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <ReviewList onBack={goToMain} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Developer Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mt-20 pb-8"
        >
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.7, duration: 0.5, type: "spring" }}
                className="w-20 h-20 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg shadow-cyan-500/25"
              >
                <span className="text-2xl"></span>
              </motion.div>
              
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 0.6 }}
                className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4"
              >
                Developed by Usman Azhar
              </motion.h3>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.9, duration: 0.6 }}
                className="space-y-3 text-gray-300"
              >
                <p className="text-lg font-semibold text-cyan-400">FAST SE BATCH 24</p>
                
                <div className="flex flex-wrap justify-center gap-6 mt-6">
                  <motion.a
                    href="mailto:i243105@isb.nu.edu.pk"
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl text-white font-medium shadow-lg hover:shadow-red-500/25 transition-all duration-300"
                  >
                    <span></span>
                    <span>i243105@isb.nu.edu.pk</span>
                  </motion.a>
                  
                  <motion.a
                    href="https://instagram.com/usm44n._"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white font-medium shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
                  >
                    <span>insta: </span>
                    <span>@usm44n._</span>
                  </motion.a>
                  
                  <motion.a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white font-medium shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                  >
                    <span></span>
                    <span>Facebook </span>
                  </motion.a>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.1, duration: 0.6 }}
                className="mt-6 pt-6 border-t border-gray-700/50"
              >
                <p className="text-gray-400 text-sm">
                  Built with  using Next.js, TypeScript, and AI Technology
                </p>
              </motion.div>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  )
}
