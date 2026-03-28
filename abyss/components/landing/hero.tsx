"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { StarsBackground } from '@/components/animate-ui/components/backgrounds/stars';
import { motion } from 'framer-motion';
import ShinyText from '@/components/ShinyText';

const Hero = ({ id }: { id?: string }) => {
  const router = useRouter();

  return (
    <section id={id} className="relative min-h-screen bg-black flex items-center justify-center px-6 overflow-hidden">
      {/* Stars Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
      <StarsBackground 
        starColor="#9be3ff" 
        pointerEvents={false}
        factor={0.08}
        speed={40}
      />
      </div>

      {/* Content */}
      <div className="max-w-3xl relative z-20 text-center">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-6xl md:text-8xl font-light font-auralyess text-white mb-8 tracking-tight leading-[0.9]"
      >
        your safe space,<br />always
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-lg md:text-xl text-gray-500 mb-12 font-light max-w-md mx-auto"
      >
        AI-powered emotional support that actually gets you
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="flex justify-center"
      >
        <motion.button
        onClick={() => router.push('/login')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="group relative overflow-hidden border border-white/20 px-10 py-5 rounded-full transition-all duration-300 hover:border-white text-lg"
        >
                 
        {/* Shiny Text */}
        <ShinyText text="start feeling better" className="relative z-10 text-white text-lg font-light" />
        </motion.button>
      </motion.div>
      </div>
    </section>
  );
};

export default Hero;
