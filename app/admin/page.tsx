'use client'

import { useState, useEffect, useRef } from 'react'
import { db } from '@/lib/firebase'
import { 
  collection, 
  query, 
  onSnapshot,
  orderBy,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  Timestamp
} from 'firebase/firestore'
import { Send, MessageCircle } from 'lucide-react'

interface Conversation {
  id: string
  userId: string
  userName: string
  userEmail: string
  lastMessage: string
  lastMessageTime: Timestamp | null
  unreadCount: number
}

interface Message {
  id: string
  text: string
  from: 'user' | 'dev'
  timestamp: Timestamp
}

export default function AdminDashboard() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConvo, setSelectedConvo] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [reply, setReply] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Real-time listener for all conversations
  useEffect(() => {
    const q = query(collection(db, 'dev-conversations'))
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const convos: Conversation[] = []
      snapshot.forEach((doc) => {
        const data = doc.data()
        convos.push({
          id: doc.id,
          ...data
        } as Conversation)
      })
      
      // Sort by most recent
      convos.sort((a, b) => {
        if (!a.lastMessageTime || !b.lastMessageTime) return 0
        return b.lastMessageTime.seconds - a.lastMessageTime.seconds
      })
      
      setConversations(convos)
    }, (error) => {
      console.error('Error loading conversations:', error)
    })

    return () => unsubscribe()
  }, [])

  // Load messages for selected conversation
  useEffect(() => {
    if (!selectedConvo) return

    const q = query(
      collection(db, 'dev-conversations', selectedConvo, 'messages'),
      orderBy('timestamp', 'asc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = []
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as Message)
      })
      setMessages(msgs)
      
      // Auto scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    })

    return () => unsubscribe()
  }, [selectedConvo])

  const sendReply = async () => {
    if (!reply.trim() || !selectedConvo) return

    try {
      // Add message
      await addDoc(collection(db, 'dev-conversations', selectedConvo, 'messages'), {
        text: reply,
        from: 'dev',
        timestamp: serverTimestamp()
      })

      // Update conversation metadata
      await updateDoc(doc(db, 'dev-conversations', selectedConvo), {
        lastMessage: reply,
        lastMessageTime: serverTimestamp()
      })

      setReply('')
    } catch (error) {
      console.error('Error sending reply:', error)
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

  return (
    <div className="min-h-screen bg-black text-white flex">
      
      {/* Conversations List */}
      <div className="w-80 border-r border-zinc-800 flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <h1 className="text-xl font-medium">Dev Messages</h1>
          <p className="text-sm text-zinc-500">{conversations.length} conversation{conversations.length !== 1 ? 's' : ''}</p>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-zinc-600">
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs mt-2">Users will appear here when they message you</p>
            </div>
          ) : (
            conversations.map((convo) => (
              <button
                key={convo.id}
                onClick={() => setSelectedConvo(convo.id)}
                className={`w-full p-4 border-b border-zinc-900 text-left hover:bg-zinc-900/50 transition-colors ${
                  selectedConvo === convo.id ? 'bg-zinc-900' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{convo.userName}</p>
                    <p className="text-sm text-zinc-500 truncate">{convo.lastMessage}</p>
                    <p className="text-xs text-zinc-600 mt-1">{formatTime(convo.lastMessageTime)}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConvo ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-zinc-800">
              <p className="font-medium">
                {conversations.find(c => c.id === selectedConvo)?.userName}
              </p>
              <p className="text-sm text-zinc-500">
                {conversations.find(c => c.id === selectedConvo)?.userEmail}
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.from === 'dev' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex flex-col gap-1 max-w-[70%]">
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        msg.from === 'dev'
                          ? 'bg-white text-black rounded-tr-md'
                          : 'bg-zinc-900 text-white border border-zinc-800 rounded-tl-md'
                      }`}
                    >
                      <p className="text-[15px]">{msg.text}</p>
                    </div>
                    <span className={`text-[10px] text-zinc-600 px-2 ${msg.from === 'dev' ? 'text-right' : 'text-left'}`}>
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 border-t border-zinc-800">
              <div className="flex gap-2">
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendReply()}
                  placeholder="Type your reply..."
                  className="flex-1 bg-zinc-900 text-white px-4 py-3 rounded-2xl outline-none border border-zinc-800 focus:border-zinc-700"
                />
                <button
                  onClick={sendReply}
                  disabled={!reply.trim()}
                  title="Send reply"
                  className={`p-3 rounded-2xl transition-colors ${
                    reply.trim() 
                      ? 'bg-white text-black hover:bg-zinc-200' 
                      : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-zinc-500">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-zinc-700" />
              <p>Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
