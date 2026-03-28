'use client'

import { useState } from 'react'
import { Heart, Flag, Trash2 } from 'lucide-react'
import { formatTimeAgo } from '@/lib/anonymousNames'
import { doc, updateDoc, increment, setDoc, getDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/components/AuthContext'
import ReactionButton from './ReactionButton'
import BookmarkButton from './BookmarkButton'

interface Post {
  id: string
  text: string
  anonymousName: string
  mood: string
  supportCount: number
  reactions?: { notAlone: number }
  timestamp: Date
  userId: string
  flagCount?: number
  hidden?: boolean
}

export default function PostCard({ post }: { post: Post }) {
  const { user } = useAuth()
  const [supported, setSupported] = useState(false)
  const [count, setCount] = useState(post.supportCount)
  const [loading, setLoading] = useState(false)
  const [showReportConfirm, setShowReportConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Check if user already supported this post
  useState(() => {
    const checkSupport = async () => {
      if (!user) return
      const supportDoc = await getDoc(doc(db, 'user-supports', user.uid))
      if (supportDoc.exists()) {
        const supports = supportDoc.data().postIds || []
        setSupported(supports.includes(post.id))
      }
    }
    checkSupport()
  })

  const handleSupport = async () => {
    if (supported || !user || loading) return
    
    setLoading(true)
    try {
      // Update post support count
      await updateDoc(doc(db, 'community-posts', post.id), {
        supportCount: increment(1)
      })

      // Track user's support
      const userSupportRef = doc(db, 'user-supports', user.uid)
      const userSupportDoc = await getDoc(userSupportRef)
      
      if (userSupportDoc.exists()) {
        const postIds = userSupportDoc.data().postIds || []
        await updateDoc(userSupportRef, {
          postIds: [...postIds, post.id]
        })
      } else {
        await setDoc(userSupportRef, {
          postIds: [post.id]
        })
      }

      setSupported(true)
      setCount(count + 1)
    } catch (error) {
      console.error('Error supporting post:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReport = async () => {
    if (!user) return
    
    try {
      await updateDoc(doc(db, 'community-posts', post.id), {
        flagCount: increment(1)
      })
      
      // Auto-hide if 3+ reports
      const postDoc = await getDoc(doc(db, 'community-posts', post.id))
      if (postDoc.exists() && (postDoc.data().flagCount || 0) >= 3) {
        await updateDoc(doc(db, 'community-posts', post.id), {
          hidden: true
        })
      }
      
      setShowReportConfirm(false)
      alert('Post reported. Thank you for keeping the community safe.')
    } catch (error) {
      console.error('Error reporting post:', error)
    }
  }

  const handleDelete = async () => {
    if (!user || user.uid !== post.userId) return
    
    setLoading(true)
    try {
      await deleteDoc(doc(db, 'community-posts', post.id))
      setShowDeleteConfirm(false)
      // The post will disappear from the feed via real-time listener
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (post.hidden && post.userId !== user?.uid) {
    return null
  }

  return (
    <div className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-5 space-y-3 animate-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-500 text-sm">
          <span className="text-lg">{post.mood}</span>
          <span className="text-zinc-400">{post.anonymousName}</span>
          <span>·</span>
          <span>{formatTimeAgo(post.timestamp)}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <BookmarkButton postId={post.id} userId={post.userId} />
          {post.userId === user?.uid && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-zinc-600 hover:text-red-400 transition-colors"
              title="Delete this post"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          {post.userId !== user?.uid && (
            <button
              onClick={() => setShowReportConfirm(true)}
              className="text-zinc-600 hover:text-zinc-400 transition-colors"
              title="Report this post"
            >
              <Flag className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <p className="text-zinc-100 leading-relaxed text-[15px] whitespace-pre-wrap">
        {post.text}
      </p>

      {/* Actions */}
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={handleSupport}
            disabled={supported || loading}
            className={`flex items-center gap-2 text-sm transition-all duration-200 ${
              supported 
                ? 'text-pink-400' 
                : 'text-zinc-500 hover:text-pink-400 active:scale-95'
            }`}
          >
            <Heart 
              className="w-4 h-4" 
              fill={supported ? 'currentColor' : 'none'}
              strokeWidth={2}
            />
            <span className="text-xs">
              {count === 0 ? 'Be the first to support' : `${count} ${count === 1 ? 'person sees you' : 'people see you'}`}
            </span>
          </button>
        </div>

        {/* Reaction Button */}
        {post.userId !== user?.uid && (
          <ReactionButton 
            postId={post.id} 
            userId={post.userId}
            reactionCount={post.reactions?.notAlone || 0}
          />
        )}
      </div>

      {/* Report Confirmation */}
      {showReportConfirm && (
        <div className="mt-3 p-3 bg-zinc-800/50 rounded-xl border border-zinc-700">
          <p className="text-sm text-zinc-300 mb-2">Report this post?</p>
          <div className="flex gap-2">
            <button
              onClick={handleReport}
              className="px-3 py-1.5 text-xs bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Yes, report
            </button>
            <button
              onClick={() => setShowReportConfirm(false)}
              className="px-3 py-1.5 text-xs bg-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="mt-3 p-3 bg-zinc-800/50 rounded-xl border border-red-500/30">
          <p className="text-sm text-zinc-300 mb-2">Delete this post? This cannot be undone.</p>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-3 py-1.5 text-xs bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50"
            >
              {loading ? 'Deleting...' : 'Yes, delete'}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-3 py-1.5 text-xs bg-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {post.hidden && post.userId === user?.uid && (
        <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
          <p className="text-xs text-yellow-500">This post has been hidden due to reports</p>
        </div>
      )}
    </div>
  )
}
