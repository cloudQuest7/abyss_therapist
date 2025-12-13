'use client'

import { useState } from 'react'
import { useAuth } from './AuthContext'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn, signInWithGoogle } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signIn(email, password)
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />
        <button type="submit" className="w-full bg-purple-500 text-white py-2 rounded">
          Sign In
        </button>
      </form>
      
      <button 
        onClick={() => signInWithGoogle()}
        className="w-full mt-4 bg-white border py-2 rounded"
      >
        Sign in with Google
      </button>
    </div>
  )
}
