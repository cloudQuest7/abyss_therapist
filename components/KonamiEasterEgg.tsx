// components/KonamiEasterEgg.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function KonamiEasterEgg() {
  const router = useRouter()

  useEffect(() => {
    const secretCode = ['d', 'e', 'v']
    const userInput: string[] = []

    const handleKeyPress = (e: KeyboardEvent) => {
      userInput.push(e.key.toLowerCase())
      
      // Keep only last 3 keys
      if (userInput.length > secretCode.length) {
        userInput.shift()
      }

      // Check if matches
      if (JSON.stringify(userInput) === JSON.stringify(secretCode)) {
        // Trigger confetti or animation
        document.body.classList.add('easter-egg-active')
        
        setTimeout(() => {
          router.push('/dashboard/dev-chat')
        }, 500)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [router])

  return null
}
