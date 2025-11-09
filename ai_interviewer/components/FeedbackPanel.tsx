'use client'

import { Feedback } from '@/types/interview'
import { motion } from 'framer-motion'
import { Star, TrendingUp, MessageSquare, Lightbulb, Sparkles, Trophy, Target, Zap } from 'lucide-react'

interface FeedbackPanelProps {
  feedback: Feedback
}

export default function FeedbackPanel({ feedback }: FeedbackPanelProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400'
    if (score >= 6) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 8) return 'Excellent'
    if (score >= 6) return 'Good'
    if (score >= 4) return 'Fair'
    return 'Needs Improvement'
  }

  const getScoreGlow = (score: number) => {
    if (score >= 8) return 'shadow-green-500/25'
    if (score >= 6) return 'shadow-yellow-500/25'
    return 'shadow-red-500/25'
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 8) return 'bg-green-900/30 text-green-400 border-green-500/30'
    if (score >= 6) return 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30'
    return 'bg-red-900/30 text-red-400 border-red-500/30'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="relative"
    >
      <div className="bg-gray-900/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl shadow-black/50">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-3xl" />
        
        <div className="text-center mb-12 relative z-10">
          <motion.div
            initial={{ scale: 0, rotateY: 180 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="relative mx-auto mb-6"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-green-500/25 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="w-full h-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center transform -rotate-3">
                <MessageSquare className="w-10 h-10 text-white" />
              </div>
            </div>
            {/* 3D shadow */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-5 bg-black/50 rounded-full blur-xl" />
          </motion.div>
          
          <motion.h3 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-black text-white mb-3"
          >
            <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 bg-clip-text text-transparent">
              Interview Feedback
            </span>
          </motion.h3>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-gray-300"
          >
            AI-powered analysis of your performance
          </motion.p>
        </div>

        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-12 relative z-10"
        >
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-3xl p-8 border border-gray-600/30 shadow-xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  Overall Score
                </h4>
                <p className="text-gray-300">Based on your responses and communication</p>
              </div>
              
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0, rotateY: 180 }}
                  animate={{ scale: 1, rotateY: 0 }}
                  transition={{ delay: 1.0, type: "spring", stiffness: 200 }}
                  className={`text-5xl font-black mb-3 ${getScoreColor(feedback.score)} ${getScoreGlow(feedback.score)}`}
                >
                  {feedback.score}/10
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 }}
                  className={`inline-block px-4 py-2 rounded-full text-sm font-bold border ${getScoreBadgeColor(feedback.score)}`}
                >
                  {getScoreLabel(feedback.score)}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Performance Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mb-12 relative z-10"
        >
          <h4 className="text-2xl font-bold text-white mb-8 text-center">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
              Performance Breakdown
            </span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { key: 'clarity', label: 'Clarity', icon: '💬', color: 'from-cyan-400 to-blue-500' },
              { key: 'confidence', label: 'Confidence', icon: '💪', color: 'from-purple-400 to-pink-500' },
              { key: 'relevance', label: 'Relevance', icon: '🎯', color: 'from-green-400 to-emerald-500' },
              { key: 'structure', label: 'Structure', icon: '🏗️', color: 'from-orange-400 to-red-500' }
            ].map((area, index) => (
              <motion.div
                key={area.key}
                initial={{ opacity: 0, y: 30, rotateY: -15 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                whileHover={{ 
                  scale: 1.02, 
                  y: -5, 
                  rotateY: 2,
                  transition: { duration: 0.2 }
                }}
                className="relative group"
              >
                <div className="p-6 bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-600/30 shadow-lg hover:shadow-xl transition-all duration-300">
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/5 to-blue-400/0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{area.icon}</span>
                      <span className="text-lg font-bold text-white">{area.label}</span>
                    </div>
                    
                    <span className={`text-lg font-black ${getScoreColor(feedback.areas[area.key as keyof typeof feedback.areas] as number)}`}>
                      {feedback.areas[area.key as keyof typeof feedback.areas]}/10
                    </span>
                  </div>
                  
                  {/* Enhanced Progress Bar */}
                  <div className="w-full h-3 bg-gray-700/50 rounded-full overflow-hidden border border-gray-600/30">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((feedback.areas[area.key as keyof typeof feedback.areas] as number) / 10) * 100}%` }}
                      transition={{ delay: 1.4 + index * 0.1, duration: 1 }}
                      className={`h-full bg-gradient-to-r ${area.color} rounded-full relative`}
                    >
                      {/* Progress glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full" />
                      
                      {/* Floating sparkles on progress */}
                      {((feedback.areas[area.key as keyof typeof feedback.areas] as number) / 10) * 100 > 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.6 + index * 0.1 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <div className="absolute left-1/4 text-white/60 animate-bounce">
                            <Sparkles size={10} />
                          </div>
                          <div className="absolute right-1/4 text-white/60 animate-bounce delay-1000">
                            <Sparkles size={10} />
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Key Observations */}
        {feedback.comments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="mb-12 relative z-10"
          >
            <h4 className="text-2xl font-bold text-white mb-6 flex items-center justify-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Star className="w-4 h-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                Key Observations
              </span>
            </h4>
            
            <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-3xl p-8 border border-blue-500/30">
              <ul className="space-y-4">
                {feedback.comments.map((comment, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.8 + index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-3 h-3 bg-blue-400 rounded-full mt-2 flex-shrink-0 shadow-lg shadow-blue-400/50" />
                    <span className="text-gray-200 font-medium leading-relaxed">{comment}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {/* Suggestions for Improvement */}
        {feedback.suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
            className="relative z-10"
          >
            <h4 className="text-2xl font-bold text-white mb-6 flex items-center justify-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/25">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Suggestions for Improvement
              </span>
            </h4>
            
            <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-3xl p-8 border border-yellow-500/30">
              <ul className="space-y-4">
                {feedback.suggestions.map((suggestion, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.0 + index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mt-2 flex-shrink-0 shadow-lg shadow-yellow-400/50" />
                    <span className="text-gray-200 font-medium leading-relaxed">{suggestion}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* 3D shadow */}
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-96 h-8 bg-black/50 rounded-full blur-xl" />
    </motion.div>
  )
}
