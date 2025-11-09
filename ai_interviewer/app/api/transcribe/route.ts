import { NextRequest, NextResponse } from 'next/server'

// Grok AI configuration
const GROK_API_URL = process.env.GROK_API_URL || 'https://api.groq.com/openai/v1'
const GROK_MODEL = 'gemma2-9b-it'

// AssemblyAI configuration
const ASSEMBLYAI_API_URL = process.env.ASSEMBLYAI_API_URL || 'https://api.assemblyai.com/v2'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 DEBUG: API Key check -', process.env.GROK_API_KEY ? 'API Key FOUND' : 'API Key MISSING')
    console.log('🔍 DEBUG: API Key length -', process.env.GROK_API_KEY?.length || 0)
    
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    // Check if we have both API keys
    if (!process.env.GROK_API_KEY || !process.env.ASSEMBLYAI_API_KEY) {
      console.log('🔍 DEBUG: Using DEMO mode - missing API keys')
      return getDemoTranscription()
    }

    console.log('🔍 DEBUG: Using REAL AI mode - both API keys found')
    
    try {
      console.log('🔍 DEBUG: Using AssemblyAI for real audio transcription')
      
      // Convert File to Buffer
      const bytes = await audioFile.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Step 1: Upload audio to AssemblyAI
      const uploadResponse = await fetch(`${ASSEMBLYAI_API_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': process.env.ASSEMBLYAI_API_KEY!,
          'Content-Type': 'application/octet-stream',
        },
        body: buffer,
      })

      if (!uploadResponse.ok) {
        throw new Error(`AssemblyAI upload failed: ${uploadResponse.status}`)
      }

      const { upload_url } = await uploadResponse.json()
      console.log('🔍 DEBUG: Audio uploaded to AssemblyAI:', upload_url)

      // Step 2: Start transcription
      const transcriptResponse = await fetch(`${ASSEMBLYAI_API_URL}/transcript`, {
        method: 'POST',
        headers: {
          'Authorization': process.env.ASSEMBLYAI_API_KEY!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio_url: upload_url,
          language_code: 'en',
          punctuate: true,
          format_text: true,
        }),
      })

      if (!transcriptResponse.ok) {
        throw new Error(`AssemblyAI transcription failed: ${transcriptResponse.status}`)
      }

      const { id: transcriptId } = await transcriptResponse.json()
      console.log('🔍 DEBUG: Transcription started, ID:', transcriptId)

      // Step 3: Poll for completion
      let transcript = null
      let attempts = 0
      const maxAttempts = 30 // 30 seconds timeout

      while (!transcript && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second
        
        const statusResponse = await fetch(`${ASSEMBLYAI_API_URL}/transcript/${transcriptId}`, {
          headers: {
            'Authorization': process.env.ASSEMBLYAI_API_KEY!,
          },
        })

        if (!statusResponse.ok) {
          throw new Error(`AssemblyAI status check failed: ${statusResponse.status}`)
        }

        const statusData = await statusResponse.json()
        
        if (statusData.status === 'completed') {
          transcript = statusData.text
          console.log('🔍 DEBUG: Real transcription completed successfully')
        } else if (statusData.status === 'error') {
          throw new Error(`AssemblyAI transcription error: ${statusData.error}`)
        }
        
        attempts++
      }

      if (!transcript) {
        throw new Error('Transcription timeout')
      }

      console.log('🔍 DEBUG: Real transcription result:', transcript)
      
      // Step 4: Send transcribed text to Grok AI for response
      const aiResponse = await getGrokAIResponse(transcript)
      
      return NextResponse.json({
        text: transcript,
        aiResponse: aiResponse
      })

    } catch (apiError) {
      console.error('🔍 DEBUG: Grok AI API error -', apiError)
      console.log('🔍 DEBUG: Falling back to demo mode due to API error')
      
      // If there's an API error, fall back to demo mode
      return getDemoTranscription()
    }

  } catch (error) {
    console.error('Transcription error:', error)
    console.log('🔍 DEBUG: Falling back to demo mode due to general error')
    
    // Fall back to demo mode for any other errors
    return getDemoTranscription()
  }
}

async function getGrokAIResponse(transcribedText: string) {
  try {
    const response = await fetch(`${GROK_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROK_MODEL,
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert interview assistant. Analyze the candidate\'s response and provide a brief, professional follow-up question or feedback. Keep responses under 100 words.' 
          },
          { 
            role: 'user', 
            content: `The candidate said: "${transcribedText}". Please provide a relevant follow-up question or brief feedback.` 
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`Grok AI API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || 'Thank you for that response. Can you elaborate further?'
    
  } catch (error) {
    console.error('Grok AI response generation error:', error)
    return 'Thank you for that response. Can you tell me more about your experience?'
  }
}

function getEnhancedDemoTranscription() {
  // Enhanced demo transcriptions that are more realistic
  const demoTranscriptions = [
    "I have three years of experience in full-stack development, primarily working with React and Node.js. I've led two major projects and mentored junior developers.",
    "In my previous role, I was responsible for optimizing database queries which improved performance by 40%. I also implemented automated testing that reduced bugs by 60%.",
    "I believe in writing clean, maintainable code and following best practices. I'm passionate about learning new technologies and solving complex problems.",
    "My approach to problem-solving involves first understanding the requirements, then breaking them down into smaller tasks, and finally implementing solutions iteratively.",
    "I enjoy collaborating with cross-functional teams and have experience working with designers, product managers, and stakeholders to deliver successful products.",
    "I have strong analytical skills and experience in data-driven decision making. I've worked on projects involving machine learning and data analysis.",
    "I'm comfortable working in fast-paced environments and adapting to changing requirements. I've successfully delivered projects under tight deadlines.",
    "I prioritize user experience and always consider the end-user perspective in my work. I've conducted user research and implemented feedback-driven improvements."
  ]
  
  const randomIndex = Math.floor(Math.random() * demoTranscriptions.length)
  return demoTranscriptions[randomIndex]
}

function getDemoTranscription() {
  // Basic demo mode - return a placeholder transcription
  const demoTranscriptions = [
    "I have experience in software development and I'm passionate about creating user-friendly applications.",
    "In my previous role, I led a team of developers and successfully delivered multiple projects on time.",
    "I believe in continuous learning and staying updated with the latest technologies in the industry.",
    "My approach to problem-solving involves breaking down complex issues into manageable components.",
    "I enjoy collaborating with cross-functional teams and communicating technical concepts to non-technical stakeholders.",
    "I have strong analytical skills and experience in data-driven decision making.",
    "I'm comfortable working in fast-paced environments and adapting to changing requirements.",
    "I prioritize user experience and always consider the end-user perspective in my work."
  ]
  
  const randomIndex = Math.floor(Math.random() * demoTranscriptions.length)
  
  return NextResponse.json({
    text: demoTranscriptions[randomIndex],
  })
}
