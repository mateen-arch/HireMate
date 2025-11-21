'use client'

import { useState } from 'react'
import { InterviewType, InterviewRole } from '@/types/interview'
import { motion } from 'framer-motion'
import { 
  Briefcase, 
  Clock, 
  Users, 
  Zap, 
  Brain, 
  Target, 
  TrendingUp, 
  Heart,
  Code,
  BarChart3,
  ShoppingCart,
  UserCheck,
  Megaphone,
  Headphones,
  Star,
  Sparkles
} from 'lucide-react'

interface InterviewSetupProps {
  onStartInterview: (config: {
    type: InterviewType
    role: InterviewRole
    duration: number
  }) => void
}

export default function InterviewSetup({ onStartInterview }: InterviewSetupProps) {
  const [selectedType, setSelectedType] = useState<InterviewType>('technical')
  const [selectedRole, setSelectedRole] = useState<InterviewRole>('software-engineer')
  const [selectedDuration, setSelectedDuration] = useState(30)

  const handleStart = () => {
    onStartInterview({
      type: selectedType,
      role: selectedRole,
      duration: selectedDuration,
    })
  }

  const interviewTypes = [
    { id: 'technical', name: 'Technical Interview', description: 'Coding challenges, system design, and technical questions', icon: Code, color: 'from-cyan-400 to-blue-500', glow: 'shadow-cyan-500/25' },
    { id: 'behavioral', name: 'Behavioral Interview', description: 'STAR method questions about past experiences', icon: Brain, color: 'from-purple-400 to-pink-500', glow: 'shadow-purple-500/25' },
    { id: 'general', name: 'General Interview', description: 'Mixed questions for overall assessment', icon: Users, color: 'from-green-400 to-emerald-500', glow: 'shadow-green-500/25' },
    { id: 'sales', name: 'Sales Interview', description: 'Sales techniques and customer interaction', icon: TrendingUp, color: 'from-orange-400 to-red-500', glow: 'shadow-orange-500/25' },
    { id: 'hr', name: 'HR Interview', description: 'Culture fit and interpersonal skills', icon: Heart, color: 'from-pink-400 to-rose-500', glow: 'shadow-pink-500/25' },
  ]

  const interviewRoles = [
    { id: 'software-engineer', name: 'Software Engineer', type: 'technical', icon: Code, color: 'from-cyan-400 to-blue-500' },
    { id: 'data-scientist', name: 'Data Scientist', type: 'technical', icon: BarChart3, color: 'from-purple-400 to-indigo-500' },
    { id: 'product-manager', name: 'Product Manager', type: 'behavioral', icon: Target, color: 'from-green-400 to-emerald-500' },
    { id: 'sales-representative', name: 'Sales Representative', type: 'sales', icon: TrendingUp, color: 'from-orange-400 to-red-500' },
    { id: 'hr-manager', name: 'HR Manager', type: 'hr', icon: Heart, color: 'from-pink-400 to-rose-500' },
    { id: 'marketing-specialist', name: 'Marketing Specialist', type: 'general', icon: Megaphone, color: 'from-yellow-400 to-orange-500' },
    { id: 'customer-service', name: 'Customer Service', type: 'general', icon: Headphones, color: 'from-teal-400 to-cyan-500' },
    { id: 'general', name: 'General', type: 'general', icon: Star, color: 'from-slate-400 to-gray-500' },
  ]

  const durations = [
    { value: 15, label: '15 minutes', description: 'Quick practice session' },
    { value: 30, label: '30 minutes', description: 'Standard interview length' },
    { value: 45, label: '45 minutes', description: 'Comprehensive practice' },
    { value: 60, label: '60 minutes', description: 'Full interview simulation' },
  ]

  const filteredRoles = interviewRoles.filter(role => 
    role.type === selectedType || role.type === 'general'
  )

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ scale: 0, rotateY: 180 }}
          animate={{ scale: 1, rotateY: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="relative mx-auto mb-8"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-3xl shadow-2xl shadow-cyan-500/25 transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <div className="w-full h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-3xl flex items-center justify-center transform -rotate-3">
              <Briefcase className="w-12 h-12 text-white" />
            </div>
          </div>
          {/* 3D shadow */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-black/50 rounded-full blur-xl" />
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl font-bold text-white mb-4"
        >
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Configure Your Interview
          </span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-xl text-gray-300 max-w-3xl mx-auto"
        >
          Customize your interview experience with role-specific questions and AI-powered feedback
        </motion.p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleStart(); }} className="space-y-12">
        {/* Interview Type Selection */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="relative"
        >
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl shadow-black/50">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-3xl" />
            
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <Zap className="w-5 h-5 text-white" />
              </div>
              Interview Type
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
              {interviewTypes.map((type, index) => {
                const Icon = type.icon
                return (
                  <motion.div
                    key={type.id}
                    initial={{ opacity: 0, y: 30, rotateY: -15 }}
                    animate={{ opacity: 1, y: 0, rotateY: 0 }}
                    transition={{ delay: 1.0 + index * 0.1, duration: 0.6 }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -10, 
                      rotateY: 5,
                      transition: { duration: 0.3 }
                    }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative cursor-pointer group ${
                      selectedType === type.id ? 'z-20' : ''
                    }`}
                    onClick={() => setSelectedType(type.id as InterviewType)}
                  >
                    <div className={`relative p-6 rounded-3xl border-2 transition-all duration-500 transform ${
                      selectedType === type.id
                        ? `border-cyan-400 bg-gradient-to-br from-cyan-900/50 to-blue-900/50 shadow-2xl shadow-cyan-500/25`
                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800/70'
                    }`}>
                      
                      {/* Glow effect when selected */}
                      {selectedType === type.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-3xl blur-xl"
                        />
                      )}
                      
                      <div className={`w-16 h-16 bg-gradient-to-r ${type.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg ${type.glow}`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <h4 className="font-bold text-white mb-2 text-lg">{type.name}</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{type.description}</p>
                      
                      {/* Selection indicator */}
                      {selectedType === type.id && (
                        <motion.div
                          initial={{ scale: 0, rotate: 180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                          className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg"
                        >
                          <Sparkles className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                      
                      {/* Hover glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/5 to-blue-400/0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Role Selection */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="relative"
        >
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl shadow-black/50">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-3xl" />
            
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Target className="w-5 h-5 text-white" />
              </div>
              Target Role
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
              {filteredRoles.map((role, index) => {
                const Icon = role.icon
                return (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, y: 30, rotateY: -15 }}
                    animate={{ opacity: 1, y: 0, rotateY: 0 }}
                    transition={{ delay: 1.4 + index * 0.1, duration: 0.6 }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -8, 
                      rotateY: 5,
                      transition: { duration: 0.3 }
                    }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative cursor-pointer group ${
                      selectedRole === role.id ? 'z-20' : ''
                    }`}
                    onClick={() => setSelectedRole(role.id as InterviewRole)}
                  >
                    <div className={`relative p-4 rounded-2xl border-2 transition-all duration-500 transform ${
                      selectedRole === role.id
                        ? `border-purple-400 bg-gradient-to-br from-purple-900/50 to-pink-900/50 shadow-2xl shadow-purple-500/25`
                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800/70'
                    }`}>
                      
                      {/* Glow effect when selected */}
                      {selectedRole === role.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-2xl blur-xl"
                        />
                      )}
                      
                      <div className={`w-12 h-12 bg-gradient-to-r ${role.color} rounded-2xl flex items-center justify-center mb-3 shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      
                      <h4 className="font-semibold text-white text-sm text-center">{role.name}</h4>
                      
                      {/* Selection indicator */}
                      {selectedRole === role.id && (
                        <motion.div
                          initial={{ scale: 0, rotate: 180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                          className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
                        >
                          <Sparkles className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Duration Selection */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="relative"
        >
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl shadow-black/50">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-3xl" />
            
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25">
                <Clock className="w-5 h-5 text-white" />
              </div>
              Interview Duration
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {durations.map((durationOption, index) => (
                <motion.div
                  key={durationOption.value}
                  initial={{ opacity: 0, y: 30, rotateY: -15 }}
                  animate={{ opacity: 1, y: 0, rotateY: 0 }}
                  transition={{ delay: 1.8 + index * 0.1, duration: 0.6 }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -10, 
                    rotateY: 5,
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative cursor-pointer group ${
                    selectedDuration === durationOption.value ? 'z-20' : ''
                  }`}
                  onClick={() => setSelectedDuration(durationOption.value)}
                >
                  <div className={`relative p-6 rounded-3xl border-2 transition-all duration-500 transform ${
                    selectedDuration === durationOption.value
                      ? `border-green-400 bg-gradient-to-br from-green-900/50 to-emerald-900/50 shadow-2xl shadow-green-500/25`
                      : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800/70'
                  }`}>
                    
                    {/* Glow effect when selected */}
                    {selectedDuration === durationOption.value && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-3xl blur-xl"
                      />
                    )}
                    
                    <div className="text-center">
                      <div className={`w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/25 ${
                        selectedDuration === durationOption.value ? 'scale-110' : ''
                      }`}>
                        <span className="text-white font-bold text-2xl">{durationOption.value}</span>
                      </div>
                      <h4 className="font-bold text-white mb-2 text-lg">{durationOption.label}</h4>
                      <p className="text-gray-300 text-sm">{durationOption.description}</p>
                    </div>
                    
                    {/* Selection indicator */}
                    {selectedDuration === durationOption.value && (
                      <motion.div
                        initial={{ scale: 0, rotate: 180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg"
                      >
                        <Sparkles className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0 }}
          className="text-center relative"
        >
          <motion.button
            type="submit"
            whileHover={{ 
              scale: 1.05, 
              y: -5,
              boxShadow: "0 25px 50px -12px rgba(6, 182, 212, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            className="relative px-16 py-8 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white text-2xl font-black rounded-3xl shadow-2xl shadow-cyan-500/25 transform transition-all duration-500 group overflow-hidden"
          >
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Button content */}
            <div className="relative z-10 flex items-center gap-3">
              <span className="text-3xl"></span>
              Start Interview
              <span className="text-3xl"></span>
            </div>
            
            {/* Hover sparkles */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="absolute top-2 left-4 text-yellow-300 animate-bounce"></div>
              <div className="absolute top-4 right-6 text-pink-300 animate-bounce delay-100"></div>
              <div className="absolute bottom-4 left-8 text-cyan-300 animate-bounce delay-200"></div>
            </motion.div>
          </motion.button>
          
          {/* Button shadow */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-48 h-8 bg-black/50 rounded-full blur-xl" />
        </motion.div>
      </form>
    </motion.div>
  )
}
