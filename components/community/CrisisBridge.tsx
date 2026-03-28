'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface CrisisBridgeProps {
  isOpen: boolean
  onProceed: () => void
  onTalkToAbby: () => void
}

/**
 * Soft modal offering support when distress keywords are detected in post
 * Two options: "Talk to Abby" (routes to /dashboard/chat) or "Post anyway"
 * Non-blocking - users can always choose to post
 * Matches dark glassmorphism theme with gentle purple accent
 */
export default function CrisisBridge({
  isOpen,
  onProceed,
  onTalkToAbby
}: CrisisBridgeProps) {
  const router = useRouter()

  const handleTalkToAbby = () => {
    onTalkToAbby()
    router.push('/dashboard/chat')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onProceed}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <div className="w-full max-w-sm bg-zinc-900/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 space-y-4 shadow-2xl">
              {/* Icon */}
              <div className="flex justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center"
                >
                  <Heart className="w-6 h-6 text-purple-400" />
                </motion.div>
              </div>

              {/* Message */}
              <div className="text-center space-y-2">
                <h3 className="text-lg font-light text-white">
                  It sounds like you&apos;re carrying something really heavy
                </h3>
                <p className="text-sm text-zinc-400">
                  Want to talk to Abby privately first? She&apos;s always here to listen.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 pt-4">
                <motion.button
                  onClick={handleTalkToAbby}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-2.5 rounded-lg bg-purple-500/20 border border-purple-500/50 text-purple-300 hover:bg-purple-500/30 transition-all duration-200 font-light text-sm"
                >
                  Talk to Abby
                </motion.button>
                <motion.button
                  onClick={onProceed}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-2.5 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 hover:bg-zinc-800 transition-all duration-200 font-light text-sm"
                >
                  Post anyway
                </motion.button>
              </div>

              {/* Info Text */}
              <p className="text-xs text-zinc-600 text-center">
                Your post stays completely anonymous. No judgment here.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
