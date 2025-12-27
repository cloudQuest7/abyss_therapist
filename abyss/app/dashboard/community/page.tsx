'use client'

import { useState, useEffect } from 'react'
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Plus, Users, Sparkles, Filter } from 'lucide-react'
import PostCard from '@/components/community/PostCard'
import NewPost from '@/components/community/NewPost'

interface Post {
  id: string
  text: string
  anonymousName: string
  mood: string
  moodLabel: string
  supportCount: number
  timestamp: any
  userId: string
  flagCount?: number
  hidden?: boolean
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewPost, setShowNewPost] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [onlineCount] = useState(Math.floor(Math.random() * 50) + 10)

  const filters = [
    { label: 'all', emoji: '✨' },
    { label: 'venting', emoji: '😔' },
    { label: 'advice', emoji: '🤔' },
    { label: 'win', emoji: '💪' },
    { label: 'sharing', emoji: '📝' },
  ]

  useEffect(() => {
    let q = query(
      collection(db, 'community-posts'),
      where('hidden', '==', false),
      orderBy('timestamp', 'desc'),
      limit(50)
    )

    if (activeFilter !== 'all') {
      q = query(
        collection(db, 'community-posts'),
        where('hidden', '==', false),
        where('moodLabel', '==', activeFilter),
        orderBy('timestamp', 'desc'),
        limit(50)
      )
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData: Post[] = []
      snapshot.forEach((doc) => {
        postsData.push({ id: doc.id, ...doc.data() } as Post)
      })
      setPosts(postsData)
      setLoading(false)
    }, (error) => {
      console.error('Error loading posts:', error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [activeFilter])

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-zinc-800/50">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-medium text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                community
              </h1>
              <p className="text-sm text-zinc-500 flex items-center gap-2 mt-1">
                <Users className="w-3.5 h-3.5" />
                {onlineCount} people here now
              </p>
            </div>
            
            <button
              onClick={() => setShowNewPost(!showNewPost)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-black rounded-xl hover:bg-zinc-200 transition-all duration-200 active:scale-95 font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">Post</span>
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {filters.map((filter) => (
              <button
                key={filter.label}
                onClick={() => setActiveFilter(filter.label)}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all duration-200 ${
                  activeFilter === filter.label
                    ? 'bg-zinc-800 text-white border border-zinc-700'
                    : 'bg-zinc-900/50 text-zinc-500 hover:text-zinc-300 border border-zinc-800/50'
                }`}
              >
                <span className="mr-1">{filter.emoji}</span>
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 space-y-4 pb-24 md:pb-8">
        {/* New Post Form */}
        {showNewPost && (
          <NewPost onClose={() => setShowNewPost(false)} />
        )}

        {/* Welcome Message */}
        {!showNewPost && posts.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-zinc-600" />
            </div>
            <h2 className="text-lg font-medium text-zinc-300 mb-2">Welcome to the safe space</h2>
            <p className="text-sm text-zinc-500 mb-6">Share your thoughts anonymously. You're not alone.</p>
            <button
              onClick={() => setShowNewPost(true)}
              className="px-6 py-3 bg-white text-black rounded-xl hover:bg-zinc-200 transition-colors font-medium"
            >
              Make the first post
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-zinc-500">Loading community...</p>
          </div>
        )}

        {/* Posts Feed */}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}

        {/* Empty State for Filters */}
        {!loading && posts.length === 0 && activeFilter !== 'all' && (
          <div className="text-center py-12">
            <p className="text-zinc-500">No posts in this category yet</p>
            <button
              onClick={() => setActiveFilter('all')}
              className="mt-4 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              View all posts
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
