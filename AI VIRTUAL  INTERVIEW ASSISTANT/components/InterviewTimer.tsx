'use client'

import { useState, useEffect } from 'react'
import { Clock, AlertTriangle, Zap, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

interface InterviewTimerProps {
  duration: number // in minutes
  startTime: Date
  onTimeUp: () => void
}

export default function InterviewTimer({ duration, startTime, onTimeUp }: InterviewTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60) // Convert to seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          onTimeUp()
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onTimeUp])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getProgressPercentage = () => {
    const totalSeconds = duration * 60
    return ((totalSeconds - timeLeft) / totalSeconds) * 100
  }

  const getTimeColor = () => {
    const percentage = getProgressPercentage()
    if (percentage >= 90) return 'text-red-400'
    if (percentage >= 75) return 'text-yellow-400'
    return 'text-cyan-400'
  }

  const getTimeGlow = () => {
    const percentage = getProgressPercentage()
    if (percentage >= 90) return 'shadow-red-500/25'
    if (percentage >= 75) return 'shadow-yellow-500/25'
    return 'shadow-cyan-500/25'
  }

  const getProgressColor = () => {
    const percentage = getProgressPercentage()
    if (percentage >= 90) return 'from-red-500 via-pink-500 to-rose-500'
    if (percentage >= 75) return 'from-yellow-500 via-orange-500 to-red-500'
    return 'from-cyan-500 via-blue-500 to-purple-500'
  }

  const getTimeStatus = () => {
    const percentage = getProgressPercentage()
    if (percentage >= 90) return 'Critical'
    if (percentage >= 75) return 'Warning'
    return 'Good'
  }

  const getTimeIcon = () => {
    const percentage = getProgressPercentage()
    if (percentage >= 90) return AlertTriangle
    if (percentage >= 75) return Zap
    return Clock
  }

  const TimeIcon = getTimeIcon()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl shadow-black/50">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-3xl" />
        
        <div className="text-center relative z-10">
          {/* 3D Icon */}
          <motion.div
            initial={{ scale: 0, rotateY: 180 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="relative mx-auto mb-4"
          >
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 ${
              getProgressPercentage() >= 90 
                ? 'bg-gradient-to-r from-red-500 to-pink-500 shadow-red-500/25' 
                : getProgressPercentage() >= 75 
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 shadow-yellow-500/25' 
                : 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-cyan-500/25'
            }`}>
              <div className="w-full h-full rounded-3xl flex items-center justify-center transform -rotate-3">
                <TimeIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            {/* 3D shadow */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-4 bg-black/50 rounded-full blur-xl" />
          </motion.div>

          {/* Time Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-4"
          >
            <h4 className="text-sm font-medium text-gray-400 mb-2">Time Remaining</h4>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              className={`text-3xl font-black ${getTimeColor()} ${getTimeGlow()}`}
            >
              {formatTime(timeLeft)}
            </motion.div>
            
            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-2 ${
                getProgressPercentage() >= 90 
                  ? 'bg-red-900/30 text-red-400 border border-red-500/30' 
                  : getProgressPercentage() >= 75 
                  ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30' 
                  : 'bg-cyan-900/30 text-cyan-400 border border-cyan-500/30'
              }`}
            >
              {getTimeStatus()}
            </motion.div>
          </motion.div>
          
          {/* Enhanced Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mb-4"
          >
            <div className="w-full h-4 bg-gray-800/50 rounded-full overflow-hidden border border-gray-700/50">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${getProgressPercentage()}%` }}
                transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
                className={`h-full bg-gradient-to-r ${getProgressColor()} rounded-full relative`}
              >
                {/* Progress glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full" />
                
                {/* Floating sparkles on progress */}
                {getProgressPercentage() > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="absolute left-1/4 text-white/60 animate-bounce">
                      <Sparkles size={12} />
                    </div>
                    <div className="absolute right-1/4 text-white/60 animate-bounce delay-1000">
                      <Sparkles size={12} />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
            
            {/* Progress labels */}
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>0:00</span>
              <span className="text-cyan-400 font-medium">Progress</span>
              <span>{duration}:00</span>
            </div>
          </motion.div>
          
          {/* Time warning for critical phase */}
          {getProgressPercentage() >= 90 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4 }}
              className="bg-red-900/20 border border-red-500/30 rounded-2xl p-3"
            >
              <p className="text-red-400 text-sm font-medium flex items-center justify-center gap-2">
                <AlertTriangle size={16} />
                Time is running out!
              </p>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* 3D shadow */}
      <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-black/50 rounded-full blur-xl" />
    </motion.div>
  )
}
