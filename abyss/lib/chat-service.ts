import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'

export type ChatMessage = {
  id?: string
  userId: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

// Save message to Firestore
export async function saveChatMessage(message: Omit<ChatMessage, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, 'chats'), {
      ...message,
      createdAt: Timestamp.now(),
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error saving chat:', error)
    return { success: false, error }
  }
}

// Get chat history for user
export async function getUserChats(userId: string) {
  try {
    const q = query(
      collection(db, 'chats'),
      where('userId', '==', userId),
      orderBy('createdAt', 'asc')
    )
    
    const querySnapshot = await getDocs(q)
    const chats: ChatMessage[] = []
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      chats.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
      } as ChatMessage)
    })
    
    return { success: true, chats }
  } catch (error) {
    console.error('Error fetching chats:', error)
    return { success: false, chats: [], error }
  }
}
