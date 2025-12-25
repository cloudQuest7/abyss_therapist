'use client'

import React from 'react'
import Link from 'next/link'
import { HexagonBackground } from '../animate-ui/components/backgrounds/hexagon'
import { TextHoverEffect } from '../ui/text-hover-effect'
import { Github, Twitter, Mail, Heart } from 'lucide-react'

const socialLinks = [
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Mail, href: 'mailto:hello@abyss.app', label: 'Email' },
]

export default function Footer() {
  return (
    <div className="relative w-full bg-black">
      {/* Hexagon Background */}
      <div className="absolute inset-0 opacity-10">
        <HexagonBackground className="w-full h-full" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black pointer-events-none" />

      <footer className="relative z-10 w-full">
        
        <div className="max-w-5xl mx-auto px-4 md:px-6 pt-16 md:pt-20 pb-8">
          
          {/* Large Abyss Text */}
          <div className="mb-10 md:mb-12">
            <TextHoverEffect text="ABYSS" />
          </div>

          {/* Single Row Layout */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 mb-6 md:mb-8">
            
            {/* Tagline */}
            <p className="text-gray-400 text-sm md:text-base">
              you're not alone in this.
            </p>

            {/* Social Icons - Brighter hover */}
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-center hover:border-zinc-600 hover:bg-zinc-800 transition-all group"
                  >
                    <Icon className="h-4 w-4 text-gray-500 group-hover:text-white transition-colors" />
                  </a>
                )
              })}
            </div>

            {/* Links - Brighter hover */}
            <div className="flex gap-6 text-sm text-gray-600">
              <Link 
                href="/privacy" 
                className="hover:text-white transition-colors"
              >
                privacy
              </Link>
              <Link 
                href="/terms" 
                className="hover:text-white transition-colors"
              >
                terms
              </Link>
              <Link 
                href="/crisis" 
                className="text-red-500/70 hover:text-red-400 transition-colors"
              >
                crisis help
              </Link>
            </div>

          </div>

          {/* Bottom */}
          <div className="pt-6 border-t border-zinc-900 text-center">
            <p className="text-xs text-gray-700 flex items-center justify-center gap-1.5">
              © 2025 abyss • made with <Heart className="h-3 w-3 text-red-500/70" fill="currentColor" /> for you
            </p>
          </div>

        </div>

      </footer>
    </div>
  )
}
