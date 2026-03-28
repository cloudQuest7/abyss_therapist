'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bookmark } from 'lucide-react'
import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/components/AuthContext'

interface BookmarkButtonProps {
  postId: string
  userId: string
}

/**
 * Bookmark button for posts
 * Users can bookmark posts (tracked in user-saves collection)
 * Posts appear in "Healing" tab when 3+ unique users bookmark them
 * Bookmark count updated in post document
 */
export default function BookmarkButton({ postId }: BookmarkButtonProps) {
  const { user } = useAuth()
  const [isSaved, setIsSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  // Check if user already bookmarked this post
  useEffect(() => {
    const checkSave = async () => {
      if (!user) return
      try {
        const userSavesRef = doc(db, 'user-saves', user.uid)
        const userSavesDoc = await getDoc(userSavesRef)
        if (userSavesDoc.exists()) {
          const saves = userSavesDoc.data().postIds || []
          setIsSaved(saves.includes(postId))
        }
      } catch (error) {
        console.error('Error checking bookmark:', error)
      }
    }
    checkSave()
  }, [postId, user])

  /**
   * Handle bookmark save/unsave
   */
  const handleBookmark = async () => {
    if (!user || loading) return

    setLoading(true)
    try {
      const userSavesRef = doc(db, 'user-saves', user.uid)
      const userSavesDoc = await getDoc(userSavesRef)

      if (isSaved) {
        // Remove from saves
        if (userSavesDoc.exists()) {
          const postIds = userSavesDoc.data().postIds || []
          await updateDoc(userSavesRef, {
            postIds: postIds.filter((id: string) => id !== postId)
          })
        }
      } else {
        // Add to saves
        if (userSavesDoc.exists()) {
          const postIds = userSavesDoc.data().postIds || []
          await updateDoc(userSavesRef, {
            postIds: [...postIds, postId]
          })
        } else {
          await setDoc(userSavesRef, {
            postIds: [postId]
          })
        }
      }

      setIsSaved(!isSaved)
    } catch (error) {
      console.error('Error bookmarking post:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.button
      onClick={handleBookmark}
      disabled={loading}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      className={`p-1.5 rounded-lg transition-all duration-200 ${
        isSaved
          ? 'bg-amber-500/20 border border-amber-500/30 text-amber-400'
          : 'bg-zinc-800/50 border border-zinc-700/50 text-zinc-500 hover:text-amber-400 hover:border-amber-500/30'
      }`}
      title={isSaved ? 'Remove from healing corner' : 'Save to healing corner'}
    >
      <Bookmark className='w-3.5 h-3.5' fill={isSaved ? 'currentColor' : 'none'} />
    </motion.button>
  )
}
