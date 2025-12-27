// lib/firebase-admin.ts or your existing Firebase setup
import { getFirestore } from 'firebase/firestore'
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore'

interface DevMessage {
  id: string
  userId: string
  message: string
  timestamp: number
  read: boolean
}

export const sendDevMessage = async (userId: string, message: string) => {
  const db = getFirestore()
  await addDoc(collection(db, 'dev-messages'), {
    userId,
    message,
    timestamp: Date.now(),
    read: false
  })
}

// Listen for new messages in your admin panel
export const listenToDevMessages = (callback: (messages: DevMessage[]) => void) => {
  const db = getFirestore()
  const q = query(collection(db, 'dev-messages'), orderBy('timestamp', 'desc'))
  
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as DevMessage))
    callback(messages)
  })
}
