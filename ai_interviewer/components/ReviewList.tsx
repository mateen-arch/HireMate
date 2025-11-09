'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ThumbsUp, User, Calendar, Award, MessageSquare, ArrowLeft, Filter, Search } from 'lucide-react'
import { Review, ReviewStats } from '@/types/review'

interface ReviewListProps {
  onBack: () => void
}

export default function ReviewList({ onBack }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [ratingFilter, setRatingFilter] = useState(0)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating' | 'helpful'>('newest')

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews')
      const data = await response.json()
      setReviews(data.reviews || [])
      setStats(data.stats || null)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleHelpful = async (reviewId: string) => {
    try {
      await fetch('/api/reviews', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewId, helpful: 1 }),
      })
      // Refresh reviews to get updated helpful count
      fetchReviews()
    } catch (error) {
      console.error('Error updating helpful count:', error)
    }
  }

  const filteredAndSortedReviews = reviews
    .filter(review => {
      const matchesSearch = review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           review.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRating = ratingFilter === 0 || review.rating === ratingFilter
      return matchesSearch && matchesRating
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        case 'oldest':
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        case 'rating':
          return b.rating - a.rating
        case 'helpful':
          return b.helpful - a.helpful
        default:
          return 0
      }
    })

  const renderStars = (rating: number, size: 'sm' | 'md' = 'md') => {
    const starSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`${starSize} ${
          index < rating 
            ? 'text-yellow-400 fill-yellow-400' 
            : 'text-gray-400'
        }`}
      />
    ))
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-300 rounded-xl hover:bg-gray-600/50 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </motion.button>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
              User Reviews
            </h2>
            <p className="text-gray-400">
              See what others are saying about their interview experience
            </p>
          </div>
          
          <div className="w-24" /> {/* Spacer for centering */}
        </div>

        {/* Stats */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="text-center p-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl border border-cyan-500/30">
              <div className="text-2xl font-bold text-cyan-400">{stats.totalReviews}</div>
              <div className="text-sm text-gray-400">Total Reviews</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl border border-yellow-500/30">
              <div className="text-2xl font-bold text-yellow-400">{stats.averageRating}</div>
              <div className="text-sm text-gray-400">Average Rating</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl border border-green-500/30">
              <div className="text-2xl font-bold text-green-400">{stats.ratingDistribution[5]}</div>
              <div className="text-sm text-gray-400">5-Star Reviews</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30">
              <div className="text-2xl font-bold text-purple-400">
                {Math.round((stats.ratingDistribution[5] + stats.ratingDistribution[4]) / stats.totalReviews * 100)}%
              </div>
              <div className="text-sm text-gray-400">Positive Reviews</div>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-4"
        >
          {/* Search */}
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
              />
            </div>
          </div>

          {/* Rating Filter */}
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(Number(e.target.value))}
            className="px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
          >
            <option value={0}>All Ratings</option>
            <option value={5}>5 Stars</option>
            <option value={4}>4 Stars</option>
            <option value={3}>3 Stars</option>
            <option value={2}>2 Stars</option>
            <option value={1}>1 Star</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="rating">Highest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </motion.div>
      </motion.div>

      {/* Reviews List */}
      <div className="space-y-6">
        <AnimatePresence>
          {filteredAndSortedReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{review.name}</h3>
                      {review.verified && (
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(review.timestamp)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        {review.interviewType} • {review.interviewRole}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating, 'sm')}
                  </div>
                </div>
              </div>

              <h4 className="text-lg font-semibold text-white mb-3">{review.title}</h4>
              <p className="text-gray-300 leading-relaxed mb-4">{review.comment}</p>

              <div className="flex items-center justify-between">
                <motion.button
                  onClick={() => handleHelpful(review.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-300 rounded-xl hover:bg-gray-600/50 transition-all duration-300"
                >
                  <ThumbsUp className="w-4 h-4" />
                  Helpful ({review.helpful})
                </motion.button>

                <div className="text-sm text-gray-400">
                  {review.rating === 5 && '⭐⭐⭐⭐⭐ Excellent!'}
                  {review.rating === 4 && '⭐⭐⭐⭐ Very Good'}
                  {review.rating === 3 && '⭐⭐⭐ Good'}
                  {review.rating === 2 && '⭐⭐ Fair'}
                  {review.rating === 1 && '⭐ Poor'}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredAndSortedReviews.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <MessageSquare className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No reviews found</h3>
            <p className="text-gray-500">
              {searchTerm || ratingFilter > 0 
                ? 'Try adjusting your search or filter criteria'
                : 'Be the first to share your experience!'
              }
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
