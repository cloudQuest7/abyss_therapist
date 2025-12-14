'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Loader2, Sparkles } from 'lucide-react'
import { useAuth } from '@/components/AuthContext'
import { StarsBackground } from '@/components/animate-ui/components/backgrounds/stars'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export default function ChatPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "hey there. i'm here to listen. what's on your mind?",
      timestamp: new Date().toISOString(),
    }
  ])
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
      // Call your API endpoint
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
      
      // Error message
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
    <div className="relative h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] flex flex-col">
      
      {/* Stars Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <StarsBackground 
          starColor="#9be3ff" 
          pointerEvents={false}
          factor={0.05}
          speed={50}
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-shrink-0 px-4 md:px-6 py-4 md:py-6 border-b border-zinc-900"
      >
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800">
              <Sparkles className="h-5 w-5 text-gray-400" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-light">ai companion</h1>
              <p className="text-xs text-gray-600">always here to listen</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] md:max-w-[75%] rounded-3xl px-5 py-3.5 ${
                  message.role === 'user'
                    ? 'bg-white text-black'
                    : 'bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 text-gray-100'
                }`}
              >
                <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                <p className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-gray-600' : 'text-gray-600'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 rounded-3xl px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  <p className="text-sm text-gray-400">thinking...</p>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex-shrink-0 px-4 md:px-6 py-4 md:py-6 border-t border-zinc-900"
      >
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-end gap-2 md:gap-3 bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 rounded-3xl p-3 md:p-4">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              onInput={handleInput}
              placeholder="type your message..."
              rows={1}
              disabled={isLoading}
              aria-label="Chat message input"
              className="flex-1 bg-transparent resize-none outline-none text-sm md:text-base text-gray-100 placeholder:text-gray-600 max-h-32 disabled:cursor-not-allowed disabled:opacity-50"
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
              className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white text-black disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

          <p className="text-xs text-gray-600 text-center mt-3">
            press enter to send · shift + enter for new line
          </p>
        </div>
      </motion.div>

    </div>
  )
}
