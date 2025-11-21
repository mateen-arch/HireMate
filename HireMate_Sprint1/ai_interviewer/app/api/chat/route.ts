import { NextRequest, NextResponse } from 'next/server'
import { InterviewConfig } from '@/types/interview'

// Grok AI configuration
const GROK_API_URL = process.env.GROK_API_URL || 'https://api.groq.com/openai/v1'
const GROK_MODEL = 'gemma2-9b-it' // Using Gemma 2 9B model (currently supported)

// Demo responses for testing without API key
const demoResponses = {
  'software-engineer': [
    "That's interesting! Can you tell me more about your experience with version control systems like Git?",
    "Great! Now let's talk about system design. How would you design a scalable web application?",
    "Excellent! What's your approach to debugging complex issues in production?",
  ],
  'data-scientist': [
    "Good point! Can you walk me through your data preprocessing pipeline?",
    "Interesting! How do you handle missing data in your analysis?",
    "Great! What machine learning algorithms are you most comfortable with?",
  ],
  'product-manager': [
    "That's a good example! How do you prioritize features when resources are limited?",
    "Interesting approach! How do you measure the success of a product feature?",
    "Great! How do you handle conflicting stakeholder requirements?",
  ],
  'sales-representative': [
    "Good strategy! How do you handle price objections from prospects?",
    "Interesting! What's your approach to qualifying leads?",
    "Great! How do you build rapport with potential customers?",
  ],
  'hr-manager': [
    "That's a good approach! How do you handle difficult conversations with employees?",
    "Interesting! What's your strategy for employee retention?",
    "Great! How do you ensure diversity and inclusion in hiring?",
  ],
  'marketing-specialist': [
    "Good insight! How do you measure the ROI of marketing campaigns?",
    "Interesting! What's your approach to content marketing?",
    "Great! How do you stay updated with marketing trends?",
  ],
  'customer-service': [
    "Good approach! How do you handle angry customers?",
    "Interesting! What's your process for escalating issues?",
    "Great! How do you ensure customer satisfaction?",
  ],
  'general': [
    "That's interesting! Can you tell me more about your career goals?",
    "Good point! What motivates you in your work?",
    "Great! How do you handle stress and pressure?",
  ],
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 DEBUG: Chat API - API Key check -', process.env.GROK_API_KEY ? 'API Key FOUND' : 'API Key MISSING')
    console.log('🔍 DEBUG: Chat API - API Key length -', process.env.GROK_API_KEY?.length || 0)
    
    const { messages, userInput, config } = await request.json()

    // Check if we have a Grok AI API key
    if (!process.env.GROK_API_KEY) {
      console.log('🔍 DEBUG: Chat API - Using DEMO mode - no API key found')
      // Demo mode - return predefined responses
      const roleResponses = demoResponses[config.role as keyof typeof demoResponses] || demoResponses.general
      const responseIndex = Math.floor(Math.random() * roleResponses.length)
      const aiResponse = roleResponses[responseIndex]
      
      // Generate demo feedback
      const feedback = generateDemoFeedback(userInput)
      
      return NextResponse.json({
        response: aiResponse,
        feedback,
      })
    }

    console.log('🔍 DEBUG: Chat API - Using REAL AI mode - API key found')
    // Create system prompt based on interview configuration
    const systemPrompt = createSystemPrompt(config)

    // Add the new user input to messages
    const updatedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages,
      { role: 'user', content: userInput }
    ]

    try {
      // Use Grok AI API directly with fetch
      const response = await fetch(`${GROK_API_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: GROK_MODEL,
          messages: updatedMessages,
          max_tokens: 500,
          temperature: 0.7,
        }),
      })

      // Get AI response with timeout
      const completion = await Promise.race([
        response.json(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 30000)
        )
      ]) as any

      if (!response.ok) {
        throw new Error(`Grok AI API error: ${response.status} ${response.statusText}`)
      }

      const aiResponse = completion.choices[0]?.message?.content || 'I apologize, but I need to ask you to repeat that.'

      // Generate feedback for the user's response
      const feedback = await generateFeedback(userInput, config)

      console.log('🔍 DEBUG: Chat API - AI response generated successfully')

      return NextResponse.json({
        response: aiResponse,
        feedback,
      })

    } catch (apiError) {
      console.error('🔍 DEBUG: Chat API - Grok AI API error -', apiError)
      console.log('🔍 DEBUG: Chat API - Falling back to demo mode due to API error')
      
      // If there's an API error (network, timeout, etc.), fall back to demo mode
      const roleResponses = demoResponses[config.role as keyof typeof demoResponses] || demoResponses.general
      const responseIndex = Math.floor(Math.random() * roleResponses.length)
      const aiResponse = roleResponses[responseIndex]
      
      // Generate demo feedback
      const feedback = generateDemoFeedback(userInput)
      
      return NextResponse.json({
        response: aiResponse,
        feedback,
      })
    }

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
}

function createSystemPrompt(config: InterviewConfig): string {
  const rolePrompts = {
    'software-engineer': 'You are a senior software engineer conducting a technical interview. Ask relevant technical questions about programming, algorithms, system design, and software development practices. Be professional but friendly.',
    'data-scientist': 'You are a senior data scientist conducting a technical interview. Ask questions about data analysis, machine learning, statistics, and data engineering. Focus on both theoretical knowledge and practical applications.',
    'product-manager': 'You are a senior product manager conducting a behavioral interview. Ask questions about product strategy, user research, stakeholder management, and decision-making processes. Use the STAR method.',
    'sales-representative': 'You are a sales manager conducting a sales interview. Ask questions about sales techniques, objection handling, customer relationship management, and sales processes.',
    'hr-manager': 'You are an HR manager conducting an HR interview. Ask questions about employee relations, recruitment, performance management, and organizational culture.',
    'marketing-specialist': 'You are a marketing director conducting a marketing interview. Ask questions about marketing strategies, digital marketing, brand management, and campaign execution.',
    'customer-service': 'You are a customer service manager conducting an interview. Ask questions about customer handling, problem-solving, communication skills, and service delivery.',
    'general': 'You are a professional interviewer conducting a general interview. Ask a mix of behavioral, situational, and general questions to assess the candidate\'s skills and fit.',
  }

  const typePrompts = {
    'technical': 'Focus on technical skills, problem-solving abilities, and technical knowledge relevant to the role.',
    'behavioral': 'Use the STAR method (Situation, Task, Action, Result) and ask about past experiences and how they handled various situations.',
    'general': 'Ask a mix of questions to assess overall fit, communication skills, and general competencies.',
    'sales': 'Focus on sales skills, customer interaction, and business development abilities.',
    'hr': 'Focus on interpersonal skills, conflict resolution, and organizational understanding.',
  }

  const basePrompt = rolePrompts[config.role] || rolePrompts.general
  const typePrompt = typePrompts[config.type] || typePrompts.general

  return `${basePrompt} ${typePrompt} Keep your responses concise and professional. Ask follow-up questions when appropriate to dig deeper into the candidate\'s responses.`
}

function generateDemoFeedback(userInput: string) {
  // Generate random but realistic feedback for demo mode
  const score = Math.floor(Math.random() * 4) + 6 // Score between 6-9
  const areas = {
    clarity: Math.floor(Math.random() * 3) + 6,
    confidence: Math.floor(Math.random() * 3) + 6,
    relevance: Math.floor(Math.random() * 3) + 6,
    structure: Math.floor(Math.random() * 3) + 6,
  }
  
  const comments = [
    "Good use of specific examples",
    "Clear communication style",
    "Shows relevant experience",
    "Well-structured response"
  ]
  
  const suggestions = [
    "Consider providing more quantitative results",
    "Try to be more specific about your role",
    "Include more technical details",
    "Add more context to your examples"
  ]
  
  return {
    score,
    areas,
    comments: comments.slice(0, 2),
    suggestions: suggestions.slice(0, 2)
  }
}

async function generateFeedback(userInput: string, config: InterviewConfig) {
  try {
    // Check if we have a Grok AI API key
    if (!process.env.GROK_API_KEY) {
      return generateDemoFeedback(userInput)
    }

    const feedbackPrompt = `
    Analyze the following interview response and provide detailed feedback. Rate the response on a scale of 1-10 and provide specific feedback in these areas:
    
    Response: "${userInput}"
    Interview Type: ${config.type}
    Role: ${config.role}
    
    Please provide:
    1. Overall score (1-10)
    2. Scores for: clarity, confidence, relevance, structure (each 1-10)
    3. 2-3 specific comments about what was good
    4. 2-3 specific suggestions for improvement
    
    Format as JSON:
    {
      "score": number,
      "areas": {
        "clarity": number,
        "confidence": number,
        "relevance": number,
        "structure": number
      },
      "comments": [string],
      "suggestions": [string]
    }
    `

    const response = await fetch(`${GROK_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROK_MODEL,
        messages: [
          { role: 'system', content: 'You are an expert interview coach providing constructive feedback.' },
          { role: 'user', content: feedbackPrompt }
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      throw new Error(`Grok AI API error: ${response.status} ${response.statusText}`)
    }

    const completion = await response.json()

    const feedbackText = completion.choices[0]?.message?.content || ''
    
    // Try to parse JSON from the response
    try {
      const feedback = JSON.parse(feedbackText)
      return feedback
    } catch {
      // Fallback feedback if JSON parsing fails
      return {
        score: 7,
        areas: {
          clarity: 7,
          confidence: 7,
          relevance: 7,
          structure: 7
        },
        comments: ['Good response overall'],
        suggestions: ['Consider providing more specific examples']
      }
    }

  } catch (error) {
    console.error('Feedback generation error:', error)
    return generateDemoFeedback(userInput)
  }
}
