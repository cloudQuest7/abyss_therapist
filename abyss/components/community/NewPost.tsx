'use client'

import { useState } from 'react'
import { Send, X } from 'lucide-react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/components/AuthContext'
import { generateAnonymousName } from '@/lib/anonymousNames'

const moodOptions = [
  { emoji: '😔', label: 'venting' },
  { emoji: '🤔', label: 'advice' },
  { emoji: '💪', label: 'win' },
  { emoji: '📝', label: 'sharing' },
  { emoji: '💭', label: 'thought' },
  { emoji: '🌙', label: 'nighttime' },
]

export default function NewPost({ onClose }: { onClose?: () => void }) {
  const { user } = useAuth()
  const [text, setText] = useState('')
  const [selectedMood, setSelectedMood] = useState(moodOptions[0])
  const [loading, setLoading] = useState(false)

 const handlePost = async () => {
  if (!text.trim() || !user || loading) return
  
  if (text.length > 500) {
    alert('Post must be under 500 characters')
    return
  }

  setLoading(true)
  try {
    await addDoc(collection(db, 'community-posts'), {
      text: text.trim(),
      anonymousName: generateAnonymousName(),
      mood: selectedMood.emoji,
      moodLabel: selectedMood.label,
      supportCount: 0,
      flagCount: 0,
      hidden: false,
      userId: user.uid,
      timestamp: new Date() // CHANGED THIS - use client time instead
    })

    setText('')
    if (onClose) onClose()
  } catch (error) {
    console.error('Error creating post:', error)
    alert('Failed to post. Please try again.')
  } finally {
    setLoading(false)
  }
}


  return (
    <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium text-zinc-200">Share anonymously</h3>
        {onClose && (
          <button
          title = "Close"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Mood Selector */}
      <div>
        <p className="text-xs text-zinc-500 mb-2">How are you feeling?</p>
        <div className="flex gap-2 flex-wrap">
          {moodOptions.map((mood) => (
            <button
              key={mood.label}
              onClick={() => setSelectedMood(mood)}
              className={`px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                selectedMood.label === mood.label
                  ? 'bg-zinc-800 border-2 border-zinc-700 scale-105'
                  : 'bg-zinc-900/50 border-2 border-zinc-800/50 hover:bg-zinc-800/50'
              }`}
            >
              <span className="mr-1">{mood.emoji}</span>
              <span className="text-zinc-300">{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Text Area */}
      <div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share what's on your mind... you're safe here"
          maxLength={500}
          className="w-full bg-zinc-900/60 text-zinc-100 px-4 py-3 rounded-xl border border-zinc-800/50 focus:border-zinc-700 outline-none resize-none placeholder:text-zinc-600 text-[15px] leading-relaxed"
          rows={4}
        />
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-zinc-600">{text.length}/500</p>
          <p className="text-xs text-zinc-600">Posted as: {generateAnonymousName()}</p>
        </div>
      </div>

      {/* Guidelines */}
      <div className="bg-zinc-800/30 border border-zinc-800/50 rounded-xl p-3">
        <p className="text-xs text-zinc-500 leading-relaxed">
          💙 Be kind • 🚫 No personal info • 🆘 Crisis? Use crisis tab • 🛡️ Report harmful content
        </p>
      </div>

      {/* Post Button */}
      <button
        onClick={handlePost}
        disabled={!text.trim() || loading}
        className={`w-full py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
          text.trim() && !loading
            ? 'bg-white text-black hover:bg-zinc-200 active:scale-[0.98]'
            : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
        }`}
      >
        <Send className="w-4 h-4" />
        <span>{loading ? 'Posting...' : 'Post anonymously'}</span>
      </button>
    </div>
  )
}
