'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon } from 'lucide-react'
import { doc, updateDoc, increment, setDoc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/components/AuthContext'

interface ReactionButtonProps {
  postId: string
  userId: string
  reactionCount: number
}

/**
 * Single reaction button for posts: "you're not alone 🌙"
 * Tracks reactions in user-reactions collection and post reactions field
 * Users can react once per post, shows soft "you reacted" state after
 */
export default function ReactionButton({ postId, userId, reactionCount }: ReactionButtonProps) {
  const { user } = useAuth()
  const [hasReacted, setHasReacted] = useState(false)
  const [count, setCount] = useState(reactionCount)
  const [loading, setLoading] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)

  // Check if user already reacted to this post
  useEffect(() => {
    const checkReaction = async () => {
      if (!user) return
      try {
        const userReactionsRef = doc(db, 'user-reactions', user.uid)
        const userReactionsDoc = await getDoc(userReactionsRef)
        if (userReactionsDoc.exists()) {
          const reactions = userReactionsDoc.data().postIds || []
          setHasReacted(reactions.includes(postId))
        }
      } catch (error) {
        console.error('Error checking reaction:', error)
      }
    }
    checkReaction()
  }, [postId, user])

  /**
   * Handle reaction submission
   * Updates post's reaction count and tracks user reaction
   */
  const handleReact = async () => {
    if (hasReacted || !user || loading) return

    setLoading(true)
    setShowAnimation(true)
    try {
      // Update post reaction count
      await updateDoc(doc(db, 'community-posts', postId), {
        'reactions.notAlone': increment(1)
      })

      // Track user's reaction
      const userReactionRef = doc(db, 'user-reactions', user.uid)
      const userReactionDoc = await getDoc(userReactionRef)

      if (userReactionDoc.exists()) {
        const postIds = userReactionDoc.data().postIds || []
        await updateDoc(userReactionRef, {
          postIds: [...postIds, postId]
        })
      } else {
        await setDoc(userReactionRef, {
          postIds: [postId]
        })
      }

      setHasReacted(true)
      setCount(count + 1)
    } catch (error) {
      console.error('Error reacting to post:', error)
    } finally {
      setLoading(false)
      setTimeout(() => setShowAnimation(false), 600)
    }
  }

  // Don't show reaction button on own posts
  if (userId === user?.uid) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <motion.button
        onClick={handleReact}
        disabled={hasReacted || loading}
        whileTap={!hasReacted ? { scale: 0.85 } : undefined}
        whileHover={!hasReacted ? { scale: 1.05 } : undefined}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${
          hasReacted
            ? 'bg-purple-500/10 border border-purple-500/30 text-purple-400 cursor-default'
            : 'bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 hover:border-purple-500/50 hover:text-purple-300 active:scale-95'
        }`}
      >
        <Moon className="w-3.5 h-3.5" />
        <span className="text-xs">
          {hasReacted ? 'you reacted 🌙' : "you're not alone 🌙"}
        </span>
      </motion.button>

      {/* Reaction count pill */}
      <AnimatePresence>
        {count > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="px-2 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs text-purple-400"
          >
            {count}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click animation */}
      <AnimatePresence>
        {showAnimation && (
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute w-8 h-8 text-purple-400 pointer-events-none"
          >
            <Moon className="w-8 h-8" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
