'use client'

import { useState } from 'react'
import { easeInOut, motion } from 'framer-motion'
import { MessageCircle, BookOpen, Heart, Mic } from 'lucide-react'

const features = [
  {
    icon: MessageCircle,
    title: 'ai companion',
    description: 'talk anytime. someone who listens without judgment, available 24/7.',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    accentColor: 'text-blue-400',
  },
  {
    icon: BookOpen,
    title: 'private journal',
    description: 'write freely. your thoughts are safe here, encrypted and yours alone.',
    gradient: 'from-purple-500/20 to-pink-500/20',
    accentColor: 'text-purple-400',
  },
  {
    icon: Heart,
    title: 'crisis support',
    description: 'need help now? instant access to resources and professional hotlines.',
    gradient: 'from-red-500/20 to-orange-500/20',
    accentColor: 'text-red-400',
  },
  {
    icon: Mic,
    title: 'voice check-ins',
    description: 'speak your truth. record how you feel, whenever you need to let it out.',
    gradient: 'from-green-500/20 to-emerald-500/20',
    accentColor: 'text-green-400',
  },
]

export default function Features({ id }: { id?: string }) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Spread cards horizontally when expanded
  const xAxis = [-450, -150, 150, 450]
  const yAxis = [0, 0, 0, 0] // Keep them level
  const rotateDegree = isExpanded ? [0, 15, -15, 0] : [0, 0, 0, 0] // Add rotation when expanded
  const initialRotation = [0, 3, 6, 9] // Slight stack rotation
  const zIndex = [40, 30, 20, 10]

  return (
    <section id={id} className="relative py-20 md:py-32 px-4 md:px-6 bg-black">
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-light mb-4 text-white">
            your toolkit for peace
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            everything you need to feel a little lighter, one breath at a time.
          </p>
        </motion.div>

        {/* Desktop: Animated Card Stack */}
        <div className="hidden xl:block">
          <div 
            className="relative min-h-[320px] flex justify-center items-center cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {features.map((feature, ind) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={ind}
                  initial={{ x: 0, y: 0 }}
                  animate={
                    isExpanded
                      ? { x: xAxis[ind], y: yAxis[ind], rotate: rotateDegree[ind] }
                      : { x: 0, y: 0, rotate: 0 }
                  }
                  transition={{ ease: easeInOut, duration: 0.6 }}
                  style={{
                    zIndex: isExpanded ? 50 : zIndex[ind],
                    rotate: initialRotation[ind],
                  }}
                  className="absolute"
                >
                  {/* Credit Card Shape: 16:10 aspect ratio (400x250) */}
                  <div className="relative w-[400px] h-[250px] rounded-2xl overflow-hidden shadow-2xl">
                    
                    {/* Card Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient}`} />
                    <div className="absolute inset-0 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800" />
                    
                    {/* Content */}
                    <div className="relative h-full p-8 flex flex-col justify-between">
                      
                      {/* Top: Icon + Title */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-2xl font-light mb-2 text-white">
                            {feature.title}
                          </h3>
                          <p className="text-gray-400 text-sm leading-relaxed pr-4">
                            {feature.description}
                          </p>
                        </div>
                        
                        {/* Icon */}
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-zinc-800/80 border border-zinc-700 flex items-center justify-center">
                          <Icon className={`h-6 w-6 ${feature.accentColor}`} />
                        </div>
                      </div>

                      {/* Bottom: Card details (credit card style) */}
                      <div className="flex items-end justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-zinc-800/50 border border-zinc-700" />
                          <div className="w-8 h-8 rounded-lg bg-zinc-800/50 border border-zinc-700 -ml-4" />
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-600">feature #{ind + 1}</p>
                          <p className="text-xs text-gray-500 font-mono">abyss</p>
                        </div>
                      </div>

                    </div>

                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
                  </div>
                </motion.div>
              )
            })}

            {/* Click hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isExpanded ? 0 : 1 }}
              className="absolute -bottom-16 left-1/2 -translate-x-1/2"
            >
              <p className="text-sm text-gray-600">click to explore features</p>
            </motion.div>
          </div>
        </div>

        {/* Mobile & Tablet: Grid Layout */}
        <div className="xl:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  ease: [0.25, 0.4, 0.25, 1]
                }}
              >
                {/* Credit Card Shape */}
                <div className="relative w-full h-[250px] rounded-2xl overflow-hidden shadow-2xl">
                  
                  {/* Card Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient}`} />
                  <div className="absolute inset-0 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800" />
                  
                  {/* Content */}
                  <div className="relative h-full p-6 flex flex-col justify-between">
                    
                    {/* Top: Icon + Title */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-light mb-2 text-white">
                          {feature.title}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed pr-4">
                          {feature.description}
                        </p>
                      </div>
                      
                      {/* Icon */}
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-zinc-800/80 border border-zinc-700 flex items-center justify-center">
                        <Icon className={`h-6 w-6 ${feature.accentColor}`} />
                      </div>
                    </div>

                    {/* Bottom: Card details */}
                    <div className="flex items-end justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-zinc-800/50 border border-zinc-700" />
                        <div className="w-8 h-8 rounded-lg bg-zinc-800/50 border border-zinc-700 -ml-4" />
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600">feature #{index + 1}</p>
                        <p className="text-xs text-gray-500 font-mono">abyss</p>
                      </div>
                    </div>

                  </div>

                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-20"
        >
            <button 
            onClick={() => window.location.href = '/login'}
            className="px-8 py-4 rounded-full border border-zinc-800 bg-zinc-900/40 text-base text-gray-300 hover:text-white hover:border-zinc-700 hover:bg-zinc-900/60 transition-all"
            >
            get started free →
            </button>
        </motion.div>

      </div>
    </section>
  )
}
