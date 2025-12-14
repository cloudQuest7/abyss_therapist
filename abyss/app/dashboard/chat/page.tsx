'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Loader2, Sparkles, Trash2 } from 'lucide-react'
import { useAuth } from '@/components/AuthContext'
import dynamic from 'next/dynamic'

// Lazy load stars background to fix LCP
const StarsBackground = dynamic(
  () => import('@/components/animate-ui/components/backgrounds/stars').then(mod => mod.StarsBackground),
  { ssr: false }
)

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

const initialMessage: Message = {
  id: '1',
  role: 'assistant',
  content: "hey there. i'm here to listen. what's on your mind?",
  timestamp: new Date().toISOString(),
}

export default function ChatPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([initialMessage])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleClearChat = () => {
    if (confirm('Clear all messages? This cannot be undone.')) {
      setMessages([initialMessage])
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = input.trim()
    setInput('')
    setIsLoading(true)

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: currentInput, 
          userId: user?.uid 
        }),
      })

      const data = await response.json()

      if (data.success) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message,
          timestamp: new Date().toISOString(),
        }
        setMessages(prev => [...prev, aiMessage])
      } else {
        throw new Error('Failed to get response')
      }
    } catch (error) {
      console.error('Chat error:', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "sorry, i'm having trouble connecting right now. please try again in a moment.",
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement
    target.style.height = 'auto'
    target.style.height = Math.min(target.scrollHeight, 128) + 'px'
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] bg-black">
      
      {/* Header */}
      <div className="flex-shrink-0 backdrop-blur-xl bg-black/30 border-b border-zinc-900">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 md:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 shadow-lg">
                <Sparkles className="h-5 w-5 text-gray-300" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-light text-white">abyss companion</h1>
                <p className="text-xs text-gray-500">always here to listen</p>
              </div>
            </div>

            {messages.length > 1 && (
              <button
                onClick={handleClearChat}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors"
                aria-label="Clear chat history"
                title="Clear chat"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden md:inline">clear</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages Container - Stars background ONLY here */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 md:py-8 relative">
        
        {/* Stars Background - Only in messages area */}
        <div className="absolute inset-0 opacity-50 pointer-events-none">
          <StarsBackground className="w-full h-full" />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

        {/* Messages - positioned above background */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-4 md:space-y-6">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.4,
                delay: index * 0.02,
                ease: [0.25, 0.4, 0.25, 1]
              }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex gap-3 max-w-[85%] md:max-w-[80%]">
                {/* Avatar for AI */}
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 mt-1 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-gray-400" />
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`rounded-3xl px-5 py-4 shadow-2xl ${
                    message.role === 'user'
                      ? 'bg-white text-black'
                      : 'bg-zinc-900/80 backdrop-blur-xl border border-white/10 text-gray-100'
                  }`}
                >
                  <p className="text-[15px] md:text-base leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <p className={`text-[11px] mt-2.5 ${
                    message.role === 'user' ? 'text-gray-500' : 'text-gray-600'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                {/* Avatar for User */}
                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 mt-1 rounded-full bg-white/90 border border-black/10 flex items-center justify-center text-black font-medium text-sm">
                    {user?.email?.[0].toUpperCase() || 'U'}
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="flex justify-start"
            >
              <div className="flex gap-3 max-w-[85%] md:max-w-[80%]">
                <div className="flex-shrink-0 w-8 h-8 mt-1 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-gray-400" />
                </div>
                <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl px-5 py-4 shadow-2xl">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <p className="text-sm text-gray-500 ml-1">thinking</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 backdrop-blur-xl bg-black/30 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 md:py-5">
          <div className="relative flex items-end gap-3 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-3 md:p-4 shadow-2xl">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              onInput={handleInput}
              placeholder="share what's on your mind..."
              rows={1}
              disabled={isLoading}
              aria-label="Chat message input"
              className="flex-1 bg-transparent resize-none outline-none text-[15px] md:text-base text-gray-100 placeholder:text-gray-600 max-h-32 disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                minHeight: '24px',
                height: 'auto',
              }}
            />
            
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
              title="Send message"
              className="flex-shrink-0 flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-white text-black disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 active:scale-95 transition-all shadow-lg"
            >
              <Send className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          </div>

          <p className="text-[11px] text-gray-600 text-center mt-3">
            press <span className="text-gray-500">enter</span> to send · <span className="text-gray-500">shift + enter</span> for new line
          </p>
        </div>
      </div>

    </div>
  )
}
