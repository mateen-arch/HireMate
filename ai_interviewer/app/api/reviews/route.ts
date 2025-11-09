import { NextRequest, NextResponse } from 'next/server'
import { Review, ReviewStats } from '@/types/review'

// JSONBin configuration - using a free cloud storage service
const JSONBIN_API_URL = 'https://api.jsonbin.io/v3/b'
const JSONBIN_BIN_ID = '675a1b2e1f5677401f2a3c4d' // This will be created when first review is submitted
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY || 'demo-key'

// Fallback to local storage simulation if no API key
const DEMO_MODE = !process.env.JSONBIN_API_KEY || process.env.JSONBIN_API_KEY === 'demo-key'

// In-memory storage for demo mode
let demoReviews: Review[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    rating: 5,
    title: 'Amazing AI Interview Experience!',
    comment: 'This AI assistant helped me prepare for my software engineering interview. The feedback was incredibly detailed and the voice interaction felt natural. I landed the job!',
    interviewType: 'Technical',
    interviewRole: 'Software Engineer',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 12,
    verified: true
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'm.chen@email.com',
    rating: 4,
    title: 'Great Practice Tool',
    comment: 'The AI provided realistic interview questions and good feedback. The voice recognition worked well most of the time. Would recommend for interview prep.',
    interviewType: 'Behavioral',
    interviewRole: 'Product Manager',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 8,
    verified: true
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.r@email.com',
    rating: 5,
    title: 'Perfect for Remote Interview Prep',
    comment: 'As someone preparing for remote interviews, this tool was perfect. The AI understood my responses well and provided constructive feedback. Highly recommended!',
    interviewType: 'Technical',
    interviewRole: 'Data Scientist',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 15,
    verified: true
  }
]

// Helper function to generate unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Helper function to calculate review stats
function calculateStats(reviews: Review[]): ReviewStats {
  const totalReviews = reviews.length
  const averageRating = totalReviews > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
    : 0

  const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach(review => {
    ratingDistribution[review.rating as keyof typeof ratingDistribution]++
  })

  const recentReviews = reviews
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5)

  return {
    totalReviews,
    averageRating: Math.round(averageRating * 10) / 10,
    ratingDistribution,
    recentReviews
  }
}

// GET - Fetch all reviews
export async function GET() {
  try {
    if (DEMO_MODE) {
      const stats = calculateStats(demoReviews)
      return NextResponse.json({
        reviews: demoReviews,
        stats,
        demo: true
      })
    }

    // Fetch from JSONBin
    const response = await fetch(`${JSONBIN_API_URL}/${JSONBIN_BIN_ID}/latest`, {
      headers: {
        'X-Master-Key': JSONBIN_API_KEY,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      // If bin doesn't exist, return empty data
      if (response.status === 404) {
        return NextResponse.json({
          reviews: [],
          stats: calculateStats([]),
          demo: false
        })
      }
      throw new Error('Failed to fetch reviews')
    }

    const data = await response.json()
    const reviews: Review[] = data.record?.reviews || []
    const stats = calculateStats(reviews)

    return NextResponse.json({
      reviews,
      stats,
      demo: false
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    // Fallback to demo data on error
    const stats = calculateStats(demoReviews)
    return NextResponse.json({
      reviews: demoReviews,
      stats,
      demo: true,
      error: 'Using demo data due to connection error'
    })
  }
}

// POST - Add new review
export async function POST(request: NextRequest) {
  let reviewData: any = null
  
  try {
    reviewData = await request.json()
    
    const newReview: Review = {
      id: generateId(),
      ...reviewData,
      timestamp: new Date().toISOString(),
      helpful: 0,
      verified: false
    }

    if (DEMO_MODE) {
      demoReviews.unshift(newReview)
      const stats = calculateStats(demoReviews)
      return NextResponse.json({
        success: true,
        review: newReview,
        stats,
        demo: true
      })
    }

    // Get existing reviews
    const existingResponse = await fetch(`${JSONBIN_API_URL}/${JSONBIN_BIN_ID}/latest`, {
      headers: {
        'X-Master-Key': JSONBIN_API_KEY,
        'Content-Type': 'application/json'
      }
    })

    let existingReviews: Review[] = []
    if (existingResponse.ok) {
      const existingData = await existingResponse.json()
      existingReviews = existingData.record?.reviews || []
    }

    // Add new review
    const updatedReviews = [newReview, ...existingReviews]
    const stats = calculateStats(updatedReviews)

    // Save to JSONBin
    const saveResponse = await fetch(`${JSONBIN_API_URL}/${JSONBIN_BIN_ID}`, {
      method: 'PUT',
      headers: {
        'X-Master-Key': JSONBIN_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reviews: updatedReviews })
    })

    if (!saveResponse.ok) {
      throw new Error('Failed to save review')
    }

    return NextResponse.json({
      success: true,
      review: newReview,
      stats,
      demo: false
    })
  } catch (error) {
    console.error('Error saving review:', error)
    
    // Fallback to demo mode
    if (reviewData) {
      const newReview: Review = {
        id: generateId(),
        ...reviewData,
        timestamp: new Date().toISOString(),
        helpful: 0,
        verified: false
      }
      
      demoReviews.unshift(newReview)
      const stats = calculateStats(demoReviews)
      
      return NextResponse.json({
        success: true,
        review: newReview,
        stats,
        demo: true,
        error: 'Saved locally due to connection error'
      })
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to process review data' },
      { status: 400 }
    )
  }
}

// PUT - Update review helpfulness
export async function PUT(request: NextRequest) {
  try {
    const { reviewId, helpful } = await request.json()

    if (DEMO_MODE) {
      const reviewIndex = demoReviews.findIndex(r => r.id === reviewId)
      if (reviewIndex !== -1) {
        demoReviews[reviewIndex].helpful += helpful
      }
      const stats = calculateStats(demoReviews)
      return NextResponse.json({
        success: true,
        stats,
        demo: true
      })
    }

    // Get existing reviews
    const existingResponse = await fetch(`${JSONBIN_API_URL}/${JSONBIN_BIN_ID}/latest`, {
      headers: {
        'X-Master-Key': JSONBIN_API_KEY,
        'Content-Type': 'application/json'
      }
    })

    if (!existingResponse.ok) {
      throw new Error('Failed to fetch reviews')
    }

    const existingData = await existingResponse.json()
    const reviews: Review[] = existingData.record?.reviews || []
    
    // Update helpful count
    const reviewIndex = reviews.findIndex(r => r.id === reviewId)
    if (reviewIndex !== -1) {
      reviews[reviewIndex].helpful += helpful
    }

    // Save updated reviews
    const saveResponse = await fetch(`${JSONBIN_API_URL}/${JSONBIN_BIN_ID}`, {
      method: 'PUT',
      headers: {
        'X-Master-Key': JSONBIN_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reviews })
    })

    if (!saveResponse.ok) {
      throw new Error('Failed to update review')
    }

    const stats = calculateStats(reviews)
    return NextResponse.json({
      success: true,
      stats,
      demo: false
    })
  } catch (error) {
    console.error('Error updating review:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update review' },
      { status: 500 }
    )
  }
}
