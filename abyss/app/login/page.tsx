"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const provider = new GoogleAuthProvider();

const LoginPage: React.FC = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }

    // TODO: Replace with real auth call
    router.push('/dashboard')
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard'); // Redirect to dashboard after successful sign-in
    } catch (error) {
      setError('Failed to sign in with Google.');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-gray-900/60 p-8 rounded-lg backdrop-blur-md">
        <h1 className="text-3xl font-semibold text-white mb-6">Sign in to your account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            className="w-full mt-2 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition"
          >
            Sign in
          </button>
        </form>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full mt-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium transition"
        >
          Sign in with Google
        </button>

        <p className="mt-4 text-sm text-gray-400">Don't have an account? <a href="#" className="text-emerald-400">Create one</a></p>
      </div>
    </div>
  )
}

export default LoginPage
