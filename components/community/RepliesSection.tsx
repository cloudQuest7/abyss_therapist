'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send } from 'lucide-react'
import { collection, onSnapshot, addDoc, serverTimestamp, query, where, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/components/AuthContext'
import { generateAnonymousName, formatTimeAgo } from '@/lib/anonymousNames'

interface Reply {
  id: string
  text: string
  anonymousName: string
  mood: string
  timestamp: Timestamp | Date
}

interface RepliesSectionProps {
  postId: string
}

/**
 * Anonymous reply threads for posts
 * Users can reply to posts (2-level max: post → replies only)
 * Replies stored in Firestore subcollection: posts/{postId}/replies
 * Toggle open/closed with animated height transition
 */
export default function RepliesSection({ postId }: RepliesSectionProps) {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [replies, setReplies] = useState<Reply[]>([])
  const [replyInput, setReplyInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [repliesCount, setRepliesCount] = useState(0)

  // Listen to replies subcollection
  useEffect(() => {
    const repliesQuery = query(
      collection(db, 'community-posts', postId, 'replies'),
      where('hidden', '==', false)
    )

    const unsubscribe = onSnapshot(repliesQuery, (snapshot) => {
      const repliesData: Reply[] = []
      snapshot.forEach((doc) => {
        const data = doc.data()
        if (data.timestamp) {
          repliesData.push({ id: doc.id, ...data } as Reply)
        }
      })
      setReplies(repliesData.sort((a, b) => {
        const aTime = a.timestamp instanceof Date ? a.timestamp.getTime() : a.timestamp.toMillis?.() || 0
        const bTime = b.timestamp instanceof Date ? b.timestamp.getTime() : b.timestamp.toMillis?.() || 0
        return bTime - aTime
      }))
      setRepliesCount(repliesData.length)
    })

    return () => unsubscribe()
  }, [postId])

  /**
   * Submit reply to post
   * Stores in posts/{postId}/replies subcollection
   */
  const handleSubmitReply = async () => {
    if (!replyInput.trim() || !user || loading) return

    setLoading(true)
    try {
      const moodEmojis = ['💙', '✨', '🌙', '💜', '🌟', '💫']
      const randomMood = moodEmojis[Math.floor(Math.random() * moodEmojis.length)]

      await addDoc(collection(db, 'community-posts', postId, 'replies'), {
        text: replyInput.trim(),
        anonymousName: generateAnonymousName(),
        mood: randomMood,
        userId: user.uid,
        timestamp: serverTimestamp(),
        hidden: false
      })

      setReplyInput('')
    } catch (error) {
      console.error('Error submitting reply:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-3 space-y-3">
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 hover:text-zinc-300 transition-colors"
      >
        <MessageCircle className="w-3.5 h-3.5" />
        <span className="text-xs">
          {repliesCount > 0 ? `${repliesCount} ${repliesCount === 1 ? 'reply' : 'replies'}` : 'no replies yet'}
        </span>
      </motion.button>

      {/* Replies Container with Animated Height */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 pt-3 border-t border-zinc-800/30">
              {/* Replies List */}
              {replies.length > 0 && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {replies.map((reply, index) => (
                    <motion.div
                      key={reply.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-2.5 rounded-lg bg-zinc-800/20 border border-zinc-800/50"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-sm">{reply.mood}</span>
                        <span className="text-xs text-zinc-500">{reply.anonymousName}</span>
                        <span className="text-xs text-zinc-600">·</span>
                        <span className="text-xs text-zinc-600">{formatTimeAgo(reply.timestamp)}</span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">
                        {reply.text}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Reply Input */}
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmitReply()}
                  placeholder="write a reply..."
                  disabled={loading}
                  maxLength={280}
                  className="flex-1 px-3 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-xs text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-purple-500/50 transition-colors disabled:opacity-50"
                />
                <motion.button
                  onClick={handleSubmitReply}
                  disabled={!replyInput.trim() || loading}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 disabled:opacity-40 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
