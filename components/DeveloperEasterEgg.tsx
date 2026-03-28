// components/DeveloperEasterEgg.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeveloperEasterEgg() {
  const [clicks, setClicks] = useState(0)
  const router = useRouter()

  const handleClick = () => {
    const newClicks = clicks + 1
    setClicks(newClicks)
    
    if (newClicks === 3) {
      // Add subtle feedback
      const audio = new Audio('/secret.mp3') // optional sound effect
      audio.play().catch(() => {})
      
      // Navigate to secret dev chat
      setTimeout(() => {
        router.push('/dashboard/dev-chat')
      }, 300)
    }
  }

  return (
    <div
      onClick={handleClick}
      className="fixed bottom-2 left-2 w-3 h-3 opacity-0 hover:opacity-5 cursor-default transition-opacity duration-500 z-50"
      aria-hidden="true"
    >
      {/* Tiny dot that's almost invisible */}
      <div className="w-full h-full rounded-full bg-zinc-700" />
    </div>
  )
}
