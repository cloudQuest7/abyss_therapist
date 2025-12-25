import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  Timestamp
} from 'firebase/firestore'
import { db } from './firebase'

// ==================== USER PROFILE ====================

export async function getUserProfile(userId: string) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId))
    
    if (userDoc.exists()) {
      const data = userDoc.data()
      return {
        success: true,
        profile: {
          displayName: data.displayName || 'anonymous',
          photoURL: data.photoURL || '',
          notifications: data.notifications ?? true,
          dailyReminders: data.dailyReminders ?? true,
          isPremium: data.isPremium || false,
          createdAt: data.createdAt?.toDate() || new Date()
        }
      }
    }
    
    // If document doesn't exist, return default profile
    return { 
      success: true, 
      profile: {
        displayName: 'anonymous',
        photoURL: '',
        notifications: true,
        dailyReminders: true,
        isPremium: false,
        createdAt: new Date()
      }
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return { success: false, profile: null, error }
  }
}

export async function updateUserProfile(userId: string, updates: Partial<Record<string, unknown>>) {
  try {
    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)
    
    if (userDoc.exists()) {
      // Update existing document
      await updateDoc(userRef, updates)
    } else {
      // Create new document with updates
      await setDoc(userRef, {
        displayName: 'anonymous',
        photoURL: '',
        notifications: true,
        dailyReminders: true,
        isPremium: false,
        createdAt: Timestamp.now(),
        ...updates
      })
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error updating profile:', error)
    return { success: false, error }
  }
}

// ==================== JOURNALS ====================

interface Journal {
  id: string
  title: string
  content: string
  mood: string
  createdAt: string
}

interface Chat {
  id: string
  role: string
  content: string
  createdAt: string
}

export async function getUserJournals(userId: string) {
  try {
    const q = query(
      collection(db, 'journals'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    const journals: Journal[] = []
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      journals.push({
        id: doc.id,
        title: data.title,
        content: data.content,
        mood: data.mood,
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString()
      })
    })
    
    return { success: true, journals }
  } catch (error) {
    console.error('Error fetching journals:', error)
    return { success: false, journals: [], error }
  }
}

// ==================== CHATS ====================

export async function getUserChats(userId: string) {
  try {
    const q = query(
      collection(db, 'chats'),
      where('userId', '==', userId),
      orderBy('createdAt', 'asc')
    )
    
    const querySnapshot = await getDocs(q)
    const chats: Chat[] = []
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      chats.push({
        id: doc.id,
        role: data.role,
        content: data.content,
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString()
      })
    })
    
    return { success: true, chats }
  } catch (error) {
    console.error('Error fetching chats:', error)
    return { success: false, chats: [], error }
  }
}

// ==================== STATS ====================

export async function getUserStats(userId: string) {
  try {
    // Get journals
    const journalsResult = await getUserJournals(userId)
    const journalCount = journalsResult.journals.length

    // Get chats
    const chatsResult = await getUserChats(userId)
    const chatCount = Math.ceil(chatsResult.chats.length / 2)

    // Calculate streak
    const streak = calculateStreak(journalsResult.journals)

    return {
      success: true,
      stats: {
        journalCount,
        chatCount,
        streak
      }
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    return {
      success: false,
      stats: { journalCount: 0, chatCount: 0, streak: 0 },
      error
    }
  }
}

function calculateStreak(journals: Journal[]) {
  if (!journals || journals.length === 0) return 0

  const sortedJournals = journals.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  let streak = 0
  const currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)

  for (const journal of sortedJournals) {
    const journalDate = new Date(journal.createdAt)
    journalDate.setHours(0, 0, 0, 0)

    const daysDiff = Math.floor(
      (currentDate.getTime() - journalDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysDiff === streak) {
      streak++
    } else if (daysDiff > streak) {
      break
    }
  }

  return streak
}

// ==================== DATA EXPORT ====================

export async function exportUserData(userId: string, email: string) {
  try {
    const [journalsResult, chatsResult, profileResult] = await Promise.all([
      getUserJournals(userId),
      getUserChats(userId),
      getUserProfile(userId)
    ])

    const exportData = {
      user: {
        email,
        ...profileResult.profile
      },
      journals: journalsResult.journals,
      chats: chatsResult.chats,
      exportedAt: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `abyss-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    return { success: true }
  } catch (error) {
    console.error('Error exporting data:', error)
    return { success: false, error }
  }
}
