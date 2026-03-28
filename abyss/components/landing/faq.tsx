'use client'

import { useState } from 'react'
import { motion, AnimatePresence, easeOut } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  id: string
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
  {
    id: '1',
    question: 'Is my data actually private?',
    answer:
      "Yes. All your conversations and journal entries are encrypted end-to-end. We never sell your data, and you can delete everything anytime. Your privacy isn't a feature—it's a promise.",
  },
  {
    id: '2',
    question: 'Is the AI actually helpful or just a chatbot?',
    answer:
      'It\'s trained specifically for emotional support, not medical diagnosis. The AI listens, validates, and offers perspective. It\'s not therapy, but it\'s a real companion for those 3 AM moments.',
  },
  {
    id: '3',
    question: 'What\'s the difference between free and paid?',
    answer:
      'Free gives you limited chat, basic journaling, and full access to crisis resources. Paid unlocks unlimited conversations, voice check-ins, meditation, and mood tracking. Crisis help is always free.',
  },
  {
    id: '4',
    question: 'What happens if I\'m in crisis?',
    answer:
      'You\'ll immediately get access to crisis hotlines, texting services, and emergency resources. You can also ask the AI for grounding techniques. We\'re here 24/7, but if you\'re in danger, call 911.',
  },
  {
    id: '5',
    question: 'Can the AI replace a therapist?',
    answer:
      'No. The AI is support between therapy sessions, not a replacement. If you\'re struggling, we encourage you to talk to a professional. Think of Abyss as your safety net, not your main rope.',
  },
  {
    id: '6',
    question: 'Can I delete my account and data?',
    answer:
      "Yes. Everything's permanently deleted within 30 days. No backups, no recovery. We respect your right to disappear. Export your journal first if you want to keep it.",
  },
]

export default function FAQ({ id }: { id?: string }) {
  const [openId, setOpenId] = useState<string | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: easeOut },
    },
  }

  return (
    <section id={id} className="relative py-20 md:py-32 px-4 md:px-6 bg-black">
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-light mb-4 text-white font-auralyess">
            questions answered
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light">
            everything you need to know about abyss. still have questions? reach out.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-3 mb-12 md:mb-16"
        >
          {faqItems.map((item) => (
            <motion.div
              key={item.id}
              className="group relative"
              variants={itemVariants}
            >
              {/* Accordion Item */}
              <div className="relative border border-zinc-800 rounded-lg overflow-hidden transition-all duration-300 hover:border-zinc-700 bg-zinc-900/30 backdrop-blur-xl">
                
                {/* Question Button */}
                <motion.button
                  onClick={() =>
                    setOpenId(openId === item.id ? null : item.id)
                  }
                  className="relative w-full p-5 md:p-6 flex items-start justify-between gap-4 text-left transition-all duration-300 group"
                >
                  
                  {/* Text */}
                  <h3
                    className={`text-base md:text-lg font-light transition-colors duration-300 flex-1 ${
                      openId === item.id
                        ? 'text-purple-300'
                        : 'text-gray-300 group-hover:text-white'
                    }`}
                  >
                    {item.question}
                  </h3>

                  {/* Chevron */}
                  <motion.div
                    animate={{ rotate: openId === item.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex-shrink-0 transition-colors duration-300 ${
                      openId === item.id
                        ? 'text-purple-400'
                        : 'text-gray-600 group-hover:text-gray-400'
                    }`}
                  >
                    <ChevronDown className="h-5 w-5" />
                  </motion.div>
                </motion.button>

                {/* Answer */}
                <AnimatePresence>
                  {openId === item.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden relative"
                    >
                      <div className="relative px-5 md:px-6 pb-5 md:pb-6 text-gray-400 font-light leading-relaxed text-sm md:text-base border-t border-zinc-700/50">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <p className="text-gray-400 font-light mb-3">
            still curious?
          </p>
          <a
            href="mailto:anjalijayakumar79@gmail.com"
            className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors duration-300 font-light text-sm"
          >
            <span>reach out anytime</span>
            <span></span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
