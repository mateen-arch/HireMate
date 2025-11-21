export interface Review {
  id: string
  name: string
  email: string
  rating: number
  title: string
  comment: string
  interviewType: string
  interviewRole: string
  timestamp: string
  helpful: number
  verified: boolean
}

export interface ReviewStats {
  totalReviews: number
  averageRating: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
  recentReviews: Review[]
}

export interface ReviewFormData {
  name: string
  email: string
  rating: number
  title: string
  comment: string
  interviewType: string
  interviewRole: string
}
