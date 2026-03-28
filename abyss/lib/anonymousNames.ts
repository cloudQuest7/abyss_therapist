// lib/anonymousNames.ts
const adjectives = [
  'Silent', 'Midnight', 'Gentle', 'Golden', 'Quiet', 'Peaceful',
  'Brave', 'Calm', 'Serene', 'Kind', 'Soft', 'Warm', 'Cool',
  'Bright', 'Dark', 'Morning', 'Evening', 'Starry', 'Lunar',
  'Solar', 'Mystic', 'Sacred', 'Ancient', 'Modern', 'Hidden'
]

const nouns = [
  'Owl', 'Phoenix', 'Wolf', 'Dove', 'Raven', 'Eagle',
  'Tiger', 'Butterfly', 'Dragon', 'Moon', 'Star', 'Cloud',
  'Ocean', 'River', 'Mountain', 'Forest', 'Flame', 'Wind',
  'Storm', 'Thunder', 'Rain', 'Snow', 'Leaf', 'Petal'
]

export function generateAnonymousName(): string {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const number = Math.floor(Math.random() * 9000) + 1000
  
  return `${adj} ${noun} #${number}`
}

export function formatTimeAgo(timestamp: any | null | { toDate(): Date }): string {
  if (!timestamp) return 'just now'
  
  const date = timestamp && typeof timestamp.toDate === 'function' ? timestamp.toDate() : new Date(timestamp)
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return `${Math.floor(seconds / 604800)}w ago`
}
