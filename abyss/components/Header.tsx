'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [logoClicks, setLogoClicks] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)
  const router = useRouter()

  const handleLogoClick = () => {
    const now = Date.now()
    
    // Reset if more than 2 seconds between clicks
    if (now - lastClickTime > 2000) {
      setLogoClicks(1)
    } else {
      const newCount = logoClicks + 1
      setLogoClicks(newCount)
      
      // Trigger on 5 clicks
      if (newCount === 5) {
        router.push('/dashboard/dev-chat')
        setLogoClicks(0)
      }
    }
    
    setLastClickTime(now)
  }

  return (
    <div onClick={handleLogoClick} className="cursor-pointer select-none">
      <h1>abyss</h1>
    </div>
  )
}
