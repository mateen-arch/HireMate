export type InterviewType = 'technical' | 'behavioral' | 'general' | 'sales' | 'hr'

export type InterviewRole = 
  | 'software-engineer'
  | 'data-scientist'
  | 'product-manager'
  | 'sales-representative'
  | 'hr-manager'
  | 'marketing-specialist'
  | 'customer-service'
  | 'general'

export interface InterviewConfig {
  type: InterviewType
  role: InterviewRole
  duration: number
}

export interface Message {
  id: string
  content: string
  sender: 'user' | 'assistant'
  timestamp: Date
  audioUrl?: string
}

export interface Feedback {
  score: number
  comments: string[]
  suggestions: string[]
  areas: {
    clarity: number
    confidence: number
    relevance: number
    structure: number
  }
}

export interface InterviewSession {
  id: string
  config: InterviewConfig
  messages: Message[]
  feedback: Feedback | null
  startTime: Date
  endTime?: Date
  status: 'active' | 'completed' | 'paused'
}




