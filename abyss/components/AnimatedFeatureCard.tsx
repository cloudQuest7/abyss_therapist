'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface AnimatedFeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  gradient: string
}

export default function AnimatedFeatureCard({ 
  icon: Icon, 
  title, 
  description,
  gradient 
}: AnimatedFeatureCardProps) {
  return (
    <div className="relative w-[320px] h-[400px] rounded-3xl overflow-hidden">
      {/* Card Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10`} />
      <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800" />
      
      {/* Content */}
      <div className="relative h-full p-8 flex flex-col">
        {/* Icon */}
        <div className="mb-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-800/80 border border-zinc-700">
            <Icon className="h-8 w-8 text-gray-300" />
          </div>
        </div>

        {/* Text */}
        <div>
          <h3 className="text-2xl font-light mb-3 text-white">
            {title}
          </h3>
          <p className="text-gray-400 leading-relaxed text-sm">
            {description}
          </p>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
      </div>
    </div>
  )
}
