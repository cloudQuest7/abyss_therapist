'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'

/**
 * Real-time presence counter
 * Shows count of users online in last 2 minutes
 * Updates every 30 seconds
 * Subtle, non-intrusive design
 */
export default function PresenceCounter() {
  const [onlineCount, setOnlineCount] = useState(0)

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'online-users'), (snapshot) => {
      const now = Date.now()
      const twoMinutesAgo = now - (2 * 60 * 1000)

      let count = 0
      snapshot.forEach((doc) => {
        const data = doc.data()
        const lastSeen = data.lastSeen?.toMillis?.() || 0

        if (lastSeen > twoMinutesAgo) {
          count++
        }
      })

      setOnlineCount(count)
    })

    return () => unsubscribe()
  }, [])

  return (
    <span className="text-xs text-zinc-600">
      ✦ {onlineCount} {onlineCount === 1 ? 'person' : 'people'} here now
    </span>
  )
}
