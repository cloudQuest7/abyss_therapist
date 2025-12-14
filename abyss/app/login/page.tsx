'use client';

import { useState } from 'react';
import { motion, easeOut } from 'framer-motion';
import { MoveRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  FirebaseError
} from 'firebase/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeOut },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.98 },
  };

  const handleEmailPasswordAuth = async () => {
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push('/dashboard');
    } catch (error) {
      const firebaseError = error as FirebaseError;
      if (firebaseError.code === 'auth/email-already-in-use') {
        setError('Email already in use. Try logging in instead.');
      } else if (firebaseError.code === 'auth/user-not-found' || firebaseError.code === 'auth/wrong-password') {
        setError('Invalid email or password');
      } else if (firebaseError.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else {
        setError('Authentication failed. Please try again.');
      }
      console.error(error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error) {
      setError('Failed to sign in with Google');
      console.error(error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-black">
      <div className="relative min-h-screen z-10 flex items-center justify-center p-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          <motion.div
            variants={itemVariants}
            className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
          >
            <motion.div variants={itemVariants} className="text-center mb-8">
              <h1 className="text-3xl font-light text-white mb-2">
                {isSignUp ? 'create account' : 'welcome back'}
              </h1>
              <p className="text-gray-400 text-sm">
                {isSignUp ? 'join your safe space' : 'sign in to your safe space'}
              </p>
            </motion.div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-2xl"
              >
                <p className="text-sm text-red-400 text-center">{error}</p>
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="space-y-4 mb-6">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="enter your email"
                  className="w-full bg-zinc-800/50 border border-white/10 rounded-full px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
              
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleEmailPasswordAuth()}
                  placeholder="enter your password"
                  className="w-full bg-zinc-800/50 border border-white/10 rounded-full px-6 py-4 pr-16 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors"
                />
                <motion.button 
                onClick={handleEmailPasswordAuth}
                whileHover={{ backgroundColor: 'rgba(229, 229, 229, 1)' }}
                whileTap={{ scale: 0.95 }}
                type="button"
                aria-label="Submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-3.5 transition-colors flex items-center justify-center"
                >
                <MoveRight className="w-4 h-4 text-black" strokeWidth={2} />
                </motion.button>

              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="px-4 text-gray-500 text-sm">or</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={handleGoogleSignIn}
                className="w-full bg-zinc-800/50 border border-white/10 rounded-full px-6 py-4 text-white flex items-center justify-between hover:bg-zinc-800 transition-colors group"
              >
                <div className="flex items-center">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 mr-3"
                  >
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>continue with google</span>
                </div>
                <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <p className="text-gray-500 text-sm">
                {isSignUp ? 'already have an account?' : "don't have an account?"}{' '}
                <motion.button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                  }}
                  className="text-white hover:text-gray-300 transition-colors underline"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSignUp ? 'sign in' : 'sign up'}
                </motion.button>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
