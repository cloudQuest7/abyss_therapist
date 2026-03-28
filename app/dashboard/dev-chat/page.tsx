'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Sparkles, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthContext'
import { db } from '@/lib/firebase'
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  doc,
  setDoc,
  Timestamp
} from 'firebase/firestore'

interface Message {
  id: string
  text: string
  from: 'user' | 'dev'
  timestamp: Timestamp | null
  userId: string
  userName?: string
  read?: boolean
}

export default function DevChatPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Real-time listener for messages
  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, 'dev-conversations', user.uid, 'messages'),
      orderBy('timestamp', 'asc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = []
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as Message)
      })
      setMessages(msgs)
      setLoading(false)
    }, (error) => {
      console.error('Error loading messages:', error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const sendMessage = async () => {
    if (!message.trim() || !user) return

    try {
      // Add message to subcollection
      await addDoc(collection(db, 'dev-conversations', user.uid, 'messages'), {
        text: message,
        from: 'user',
        userId: user.uid,
        userName: user.displayName || user.email,
        timestamp: serverTimestamp(),
        read: false
      })

      // Update/create conversation metadata using setDoc
      await setDoc(doc(db, 'dev-conversations', user.uid), {
        lastMessage: message,
        lastMessageTime: serverTimestamp(),
        userId: user.uid,
        userName: user.displayName || user.email || 'Anonymous',
        userEmail: user.email || '',
        unreadCount: messages.filter(m => m.from === 'dev' && !m.read).length
      }, { merge: true })

      setMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const formatTime = (timestamp: Timestamp | null) => {
    if (!timestamp) return ''
    const date = timestamp.toDate()
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-zinc-400">loading chat...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-zinc-800/50">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center gap-4">
            <button
            title='helo'
              onClick={() => router.back()}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all duration-200 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3 flex-1">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center border border-zinc-700/50">
                  <Sparkles className="w-5 h-5 text-zinc-300" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
              </div>
              
              <div className="flex-1">
                <h1 className="text-white text-base font-medium">developer</h1>
                <p className="text-xs text-zinc-500">secret channel • online</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 space-y-4">
          
          {/* Welcome Badge */}
          {messages.length === 0 && (
            <div className="flex justify-center mb-8">
              <div className="bg-zinc-900/60 backdrop-blur-sm px-4 py-2 rounded-full border border-zinc-800/50">
                <p className="text-xs text-zinc-400">you have unlocked a hidden feature 🎉</p>
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, idx) => (
            <div
              key={msg.id}
              className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
            >
              <div className={`flex gap-2 max-w-[85%] md:max-w-[70%] ${msg.from === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {msg.from === 'dev' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center flex-shrink-0 border border-zinc-700/50">
                    <Sparkles className="w-4 h-4 text-zinc-400" />
                  </div>
                )}
                
                <div className="flex flex-col gap-1">
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      msg.from === 'user'
                        ? 'bg-white text-black rounded-tr-md'
                        : 'bg-zinc-900/80 text-zinc-100 border border-zinc-800/50 rounded-tl-md'
                    }`}
                  >
                    <p className="text-[15px] leading-relaxed">{msg.text}</p>
                  </div>
                  <span className={`text-[10px] text-zinc-600 px-2 ${msg.from === 'user' ? 'text-right' : 'text-left'}`}>
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 bg-gradient-to-t from-black via-black to-transparent pt-4 pb-6 md:pb-8">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="flex gap-2 items-end bg-zinc-900/60 backdrop-blur-xl rounded-3xl border border-zinc-800/50 p-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="message the developer..."
              className="flex-1 bg-transparent text-white px-3 py-3 outline-none placeholder:text-zinc-600 text-[15px]"
              autoFocus
            />
            <button
              onClick={sendMessage}
              disabled={!message.trim()}
              title="Send message"
              className={`w-10 h-10 flex items-center justify-center rounded-2xl transition-all duration-200 active:scale-95 ${
                message.trim()
                  ? 'bg-white text-black hover:bg-zinc-200'
                  : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-center text-[11px] text-zinc-600 mt-3">
            messages are delivered directly to the developer
          </p>
        </div>
      </div>

    </div>
  )
}
