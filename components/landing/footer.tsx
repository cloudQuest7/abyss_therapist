'use client'

import React from 'react'
import Link from 'next/link'
import { HexagonBackground } from '@/components/animate-ui/components/backgrounds/hexagon'
import { TextHoverEffect } from '../ui/text-hover-effect'
import { Github, Twitter, Mail, Heart, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Linkedin } from 'lucide-react'

const socialLinks = [
  { icon: Github, href: 'https://github.com/cloudQuest7', label: 'GitHub', color: 'hover:bg-purple-500/20 hover:border-purple-500/50' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/anjali-jayakumar-145902320/', label: 'LinkedIn', color: 'hover:bg-blue-500/20 hover:border-blue-500/50' },
  { icon: Mail, href: 'mailto:anjalijayakumar79@gmail.com', label: 'Email', color: 'hover:bg-green-500/20 hover:border-green-500/50' },
]

const footerLinks = [
  { label: 'privacy', href: '/privacy' },
  { label: 'terms', href: '/terms' },
  { label: 'crisis help', href: '/crisis', highlight: true },
]

export default function Footer({ id }: { id?: string }) {
  return (
    <div id={id} className="relative w-full bg-black">
      {/* Hexagon Background */}
      <div className="absolute inset-0 opacity-10">
        <HexagonBackground className="w-full h-full" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black pointer-events-none" />

      <footer className="relative z-10 w-full">
        
        <div className="max-w-5xl mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-6">
          
         {/* Large Abyss Text - Contained */}
<div className="mb-6 md:mb-8 group cursor-pointer relative h-[80px] md:h-[120px] flex items-center justify-center overflow-hidden">
  {/* Default: Shiny Gray Text */}
  <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-500 group-hover:opacity-0">
    <h2 className="text-6xl md:text-8xl font-auralyess text-center bg-gradient-to-r from-gray-700 via-gray-400 to-gray-700 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
      ABYSS
    </h2>
  </div>
  
  {/* Hover: TextHoverEffect Magic - Contained */}
  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-150 md:scale-[1.8] overflow-hidden">
    <TextHoverEffect text="ABYSS" />
  </div>
</div>


          {/* Main Content */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 mb-6 md:mb-8">
            
            {/* Tagline with glow effect */}
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-gray-400 text-sm md:text-base font-light"
            >
              you are not alone in this. 
            </motion.p>

            {/* Social Icons - Improved */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-10 h-10 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center transition-all duration-300 group ${social.color}`}
                  >
                    <Icon className="h-4 w-4 text-gray-500 group-hover:text-white transition-colors duration-300" />
                  </motion.a>
                )
              })}
            </div>

            {/* Links - Improved */}
            <div className="flex gap-5 text-sm">
              {footerLinks.map((link, index) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    href={link.href}
                    className={`group relative inline-flex items-center gap-1 transition-colors duration-300 ${
                      link.highlight 
                        ? 'text-red-400 hover:text-red-300' 
                        : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    
                    {/* Underline effect */}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-current transition-all duration-300 group-hover:w-full" />
                  </Link>
                </motion.div>
              ))}
            </div>

          </div>

          {/* Bottom Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="pt-6 border-t border-zinc-900/50"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              
              {/* Copyright */}
              <p className="text-gray-600 flex items-center gap-2">
                © 2025 abyss • made with 
                <motion.span
                  animate={{ 
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <Heart className="h-3 w-3 text-red-500" fill="currentColor" />
                </motion.span>
                for you
              </p>

              {/* Additional info */}
              <p className="text-gray-700">
                your safe space, always
              </p>
            </div>
          </motion.div>

        </div>

      </footer>
    </div>
  )
}
