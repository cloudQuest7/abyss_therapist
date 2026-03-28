'use client'

import { useState, useEffect } from 'react'
import { collection, query, orderBy, limit, onSnapshot, where, getDocs, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Plus, Sparkles } from 'lucide-react'
import PostCard from '@/components/community/PostCard'
import NewPost from '@/components/community/NewPost'
import CrisisBridge from '@/components/community/CrisisBridge'
import PresenceCounter from '@/components/community/PresenceCounter'
import { useAuth } from '@/components/AuthContext'
import { generateAnonymousName } from '@/lib/anonymousNames'

interface Post {
  id: string
  text: string
  anonymousName: string
  mood: string
  moodLabel: string
  supportCount: number
  reactions?: { notAlone: number }
  timestamp: any
  userId: string
  flagCount?: number
  hidden?: boolean
}

export default function CommunityPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewPost, setShowNewPost] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [showCrisisBridge, setShowCrisisBridge] = useState(false)
  const [pendingPostContent, setPendingPostContent] = useState('')

  const filters = [
    { label: 'all', emoji: '✨' },
    { label: 'venting', emoji: '😔' },
    { label: 'advice', emoji: '🤔' },
    { label: 'win', emoji: '💪' },
    { label: 'sharing', emoji: '📝' },
    { label: 'healing', emoji: '✦' },
  ]

  /**
   * Keywords that trigger crisis bridge modal
   */
  const distressKeywords = [
    "end it",
    "can't anymore",
    "no point",
    "want to disappear",
    "done with everything",
    "nobody cares",
    "what's the point"
  ]

  /**
   * Handle proceeding with post after crisis bridge
   * Directly adds post without going through NewPost validation again
   */
  const handlePostAfterCrisisCheck = async () => {
    if (!pendingPostContent.trim() || !user) return

    try {
      await addDoc(collection(db, 'community-posts'), {
        text: pendingPostContent.trim(),
        anonymousName: generateAnonymousName(),
        mood: '💭', // default mood for crisis posts
        moodLabel: 'thought',
        supportCount: 0,
        reactions: { notAlone: 0 },
        flagCount: 0,
        hidden: false,
        userId: user.uid,
        timestamp: serverTimestamp()
      })

      setShowCrisisBridge(false)
      setPendingPostContent('')
      setShowNewPost(false)
    } catch (error) {
      console.error('Error posting:', error)
    }
  }

  /**
   * Check if post content contains distress keywords
   */
  const containsDistressKeywords = (text: string): boolean => {
    const lowerText = text.toLowerCase()
    return distressKeywords.some(keyword => lowerText.includes(keyword))
  }

  /**
   * Track user presence - update online-users collection
   */
  useEffect(() => {
    if (!user) return

    // Initial presence update
    const updatePresence = async () => {
      try {
        await setDoc(doc(db, 'online-users', user.uid), {
          userId: user.uid,
          lastSeen: serverTimestamp()
        }, { merge: true })
      } catch (error) {
        console.error('Error updating presence:', error)
      }
    }

    // Update presence immediately
    updatePresence()

    // Update presence every 30 seconds
    const presenceInterval = setInterval(updatePresence, 30000)

    // Cleanup: remove user from online-users when leaving
    return () => {
      clearInterval(presenceInterval)
      setDoc(doc(db, 'online-users', user.uid), {
        lastSeen: serverTimestamp()
      }, { merge: true }).catch(err => console.error('Error cleaning up presence:', err))
    }
  }, [user])

  useEffect(() => {
    setLoading(true)
    
    if (activeFilter === 'healing') {
      // For healing filter, fetch all posts and filter by bookmark count
      const loadHealingPosts = async () => {
        try {
          const q = query(
            collection(db, 'community-posts'),
            where('hidden', '==', false),
            orderBy('timestamp', 'desc'),
            limit(100)
          )

          const snapshot = await getDocs(q)
          const healingPosts: Post[] = []

          // Count bookmarks for each post
          for (const doc of snapshot.docs) {
            const data = doc.data()
            if (data.timestamp) {
              // Count unique users who saved this post
              const savesSnapshot = await getDocs(
                query(
                  collection(db, 'user-saves'),
                  where('postIds', 'array-contains', doc.id)
                )
              )

              if (savesSnapshot.size >= 3) {
                healingPosts.push({ id: doc.id, ...data } as Post)
              }
            }
          }

          setPosts(healingPosts)
          setLoading(false)
        } catch (error) {
          console.error('Error loading healing posts:', error)
          setLoading(false)
        }
      }
      
      loadHealingPosts()
    } else {
      // Regular filter logic with real-time listener
      let q;
      
      if (activeFilter !== 'all') {
        q = query(
          collection(db, 'community-posts'),
          where('hidden', '==', false),
          where('moodLabel', '==', activeFilter),
          orderBy('timestamp', 'desc'),
          limit(50)
        )
      } else {
        q = query(
          collection(db, 'community-posts'),
          where('hidden', '==', false),
          orderBy('timestamp', 'desc'),
          limit(50)
        )
      }

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const postsData: Post[] = []
        snapshot.forEach((doc) => {
          const data = doc.data()
          if (data.timestamp) {
            postsData.push({ id: doc.id, ...data } as Post)
          }
        })
        setPosts(postsData)
        setLoading(false)
      }, (error) => {
        console.error('Error loading posts:', error)
        setLoading(false)
      })

      return () => unsubscribe()
    }
  }, [activeFilter])


  return (
    <div className="min-h-screen bg-black">
      {/* Crisis Bridge Modal */}
      <CrisisBridge
        isOpen={showCrisisBridge}
        onTalkToAbby={() => setPendingPostContent('')}
        onProceed={handlePostAfterCrisisCheck}
      />

      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-zinc-800/50">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-medium text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                community
              </h1>
              <p className="text-sm text-zinc-500 mt-1">
                <PresenceCounter />
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
          <NewPost 
            onClose={() => setShowNewPost(false)}
            onCrisisDetected={(content) => {
              setPendingPostContent(content)
              setShowCrisisBridge(true)
            }}
          />
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
