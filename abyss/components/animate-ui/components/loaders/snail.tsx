'use client'

import * as React from 'react'
import { motion } from 'framer-motion'

export default function SnailTimer({ className = '' }: { className?: string }) {
  return (
    <div className={"w-full flex items-center justify-center mt-10 " + className}>
      <motion.svg
        width="110"
        height="110"
        viewBox="0 0 110 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <linearGradient id="sgrad" x1="0" x2="1">
            <stop offset="0%" stopColor="#7C8F80" />
            <stop offset="100%" stopColor="#3A3F3A" />
          </linearGradient>
        </defs>

        {/* snail spiral path */}
        <motion.path
          d="M55 55 m-30 0 a 30 30 0 1 0 60 0 a 18 18 0 1 1 -36 0"
          stroke="url(#sgrad)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.8, repeat: Infinity, repeatType: 'loop', ease: 'linear' }}
        />

        {/* moving dot to indicate progress */}
        <motion.circle
          r="4.5"
          fill="#cbd5c2"
          cx="85"
          cy="55"
          animate={{ rotate: [0, 360] }}
          style={{ transformOrigin: '55px 55px' }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
        />
      </motion.svg>
    </div>
  )
}
