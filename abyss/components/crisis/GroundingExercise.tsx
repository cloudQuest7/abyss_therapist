'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, Hand, Ear, Droplet, Coffee, ArrowRight } from 'lucide-react';

interface GroundingExerciseProps {
  onClose: () => void;
}

const steps = [
  {
    number: 5,
    sense: 'see',
    icon: Eye,
    prompt: 'name 5 things you can see',
    color: 'from-purple-500 to-pink-500',
  },
  {
    number: 4,
    sense: 'touch',
    icon: Hand,
    prompt: 'name 4 things you can touch',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    number: 3,
    sense: 'hear',
    icon: Ear,
    prompt: 'name 3 things you can hear',
    color: 'from-green-500 to-emerald-500',
  },
  {
    number: 2,
    sense: 'smell',
    icon: Droplet,
    prompt: 'name 2 things you can smell',
    color: 'from-orange-500 to-red-500',
  },
  {
    number: 1,
    sense: 'taste',
    icon: Coffee,
    prompt: 'name 1 thing you can taste',
    color: 'from-pink-500 to-rose-500',
  },
];

export default function GroundingExercise({ onClose }: GroundingExerciseProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [items, setItems] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const current = steps[currentStep];
  const isComplete = currentStep === steps.length;

  const handleAdd = () => {
    if (input.trim()) {
      const newItems = [...items, input.trim()];
      setItems(newItems);
      setInput('');

      // Move to next step if we have enough items
      if (newItems.length >= steps.slice(0, currentStep + 1).reduce((sum, s) => sum + s.number, 0)) {
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          setCurrentStep(steps.length); // Complete
        }
      }
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setItems([]);
    setInput('');
  };

  if (isComplete) {
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
          className="relative max-w-lg w-full text-center"
        >
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center"
          >
            <motion.div
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          </motion.div>

          <h3 className="text-3xl font-light text-white mb-3">well done</h3>
          <p className="text-gray-400 mb-8">you completed the grounding exercise</p>

          <div className="flex gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRestart}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white transition-colors"
            >
              restart
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-6 py-3 bg-white hover:bg-gray-100 rounded-full text-black font-medium transition-colors"
            >
              close
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

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
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all ${
                i <= currentStep ? 'bg-white' : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Icon & Prompt */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className={`w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${current.color} flex items-center justify-center`}
            >
              <current.icon className="w-10 h-10 text-white" />
            </motion.div>

            <h3 className="text-4xl font-light text-white mb-2">{current.number}</h3>
            <p className="text-xl text-gray-300">{current.prompt}</p>
          </motion.div>
        </AnimatePresence>

        {/* Input */}
        <div className="relative mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="type here..."
            className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4 pr-14 text-white placeholder-gray-500 focus:outline-none focus:border-white/40 transition-colors"
            autoFocus
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAdd}
            disabled={!input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white disabled:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <ArrowRight className="w-5 h-5 text-black" />
          </motion.button>
        </div>

        {/* Items List */}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          <AnimatePresence>
            {items.slice(-current.number).map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
              >
                {item}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
