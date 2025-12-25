'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface BreathingExerciseProps {
  onClose: () => void;
}

export default function BreathingExercise({ onClose }: BreathingExerciseProps) {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [count, setCount] = useState(4);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev === 1) {
          // Switch phase
          if (phase === 'inhale') {
            setPhase('hold');
            return 4;
          } else if (phase === 'hold') {
            setPhase('exhale');
            return 4;
          } else {
            setPhase('inhale');
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, isActive]);

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'breathe in';
      case 'hold':
        return 'hold';
      case 'exhale':
        return 'breathe out';
    }
  };

  const getCircleScale = () => {
    switch (phase) {
      case 'inhale':
        return 1.5;
      case 'hold':
        return 1.5;
      case 'exhale':
        return 1;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-lg w-full"
      >
        {/* Close Button */}
        <button
          type="button"
          aria-label="Close breathing exercise"
          onClick={onClose}
          className="absolute -top-12 right-0 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Breathing Circle */}
        <div className="flex flex-col items-center justify-center">
          <motion.div
            animate={{
              scale: getCircleScale(),
            }}
            transition={{
              duration: 4,
              ease: 'easeInOut',
            }}
            className="relative w-48 h-48 mb-12"
          >
            {/* Multiple circles for depth */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 blur-sm"
                animate={{
                  rotate: i * 60,
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotate: {
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  },
                  scale: {
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.2,
                  },
                }}
              />
            ))}
            
            {/* Center circle */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <span className="text-6xl font-light text-white">{count}</span>
            </div>
          </motion.div>

          {/* Phase Text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              <h3 className="text-3xl font-light text-white mb-2">{getPhaseText()}</h3>
              <p className="text-gray-400">follow the circle</p>
            </motion.div>
          </AnimatePresence>

          {/* Control Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsActive(!isActive)}
            className="mt-12 px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white transition-colors"
          >
            {isActive ? 'pause' : 'resume'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
