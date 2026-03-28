'use client'

import { useState } from 'react'
import { motion, easeOut } from 'framer-motion'
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'

const pricingPlans = [
  {
    name: 'breathing room',
    description: 'start your journey',
    price: 0,
    period: 'forever',
    highlight: false,
    features: [
      'AI companion chat',
      'Journal access',
      'Community features',
      'Crisis resources',
    ],
    cta: 'get started',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    accentColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
  },
  {
    name: 'sanctuary',
    description: 'unlimited peace',
    price: 9.99,
    period: 'monthly',
    highlight: true,
    features: [
      'Unlimited AI chat',
      'Voice check-ins',
      'Guided meditations',
      'Mood tracking',
      'Ad-free experience',
    ],
    cta: 'start sanctuary',
    gradient: 'from-purple-500/20 to-pink-500/20',
    accentColor: 'text-purple-400',
    borderColor: 'border-purple-500/30',
  },
  {
    name: 'abyss pro',
    description: 'deepest care',
    price: 19.99,
    period: 'monthly',
    highlight: false,
    features: [
      'Everything in Sanctuary',
      '1:1 therapist (beta)',
      'Wellness plans',
      'Priority support',
    ],
    cta: 'unlock pro',
    gradient: 'from-red-500/20 to-orange-500/20',
    accentColor: 'text-red-400',
    borderColor: 'border-red-500/30',
  },
]

type BillingCycle = 'monthly' | 'annual'

export default function Pricing({ id }: { id?: string }) {
  const [billing, setBilling] = useState<BillingCycle>('monthly')
  const router = useRouter()

  const getPrice = (price: number) => {
    if (price === 0) return 'free'
    if (billing === 'annual') {
      return `$${(price * 12 * 0.85).toFixed(2)}/yr`
    }
    return `$${price}/mo`
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeOut },
    },
  }

  return (
    <section id={id} className="relative py-10 md:py-14 px-4 md:px-6 bg-black min-h-screen flex items-center">
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-3 text-white font-auralyess">
            simple, honest pricing
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto font-light">
            never a hidden fee. cancel anytime. your peace is priceless.
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center gap-4 mb-10"
        >
          <div className="relative inline-flex gap-2 bg-zinc-900/50 border border-zinc-800 rounded-full p-1 backdrop-blur-xl">
            {(['monthly', 'annual'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setBilling(period)}
                className={`px-6 py-2 rounded-full text-sm font-light transition-all duration-300 relative ${
                  billing === period
                    ? 'text-white'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {billing === period && (
                  <motion.div
                    layoutId="billingBg"
                    className="absolute inset-0 bg-zinc-800 rounded-full -z-10"
                    transition={{ duration: 0.3 }}
                  />
                )}
                {period === 'annual' ? 'annual (save 15%)' : 'monthly'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {pricingPlans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={cardVariants}
              className="group relative"
            >
              {/* Card */}
              <div
                className={`relative rounded-xl overflow-hidden transition-all duration-300 hover:border-opacity-100 border border-zinc-800 ${plan.borderColor}`}
              >
                {/* Background gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
                />
                <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-xl" />

                {/* Content */}
                <div className="relative p-6 flex flex-col h-full">
                  
                  {/* Header */}
                  <div className="mb-5 text-center">
                    <h3 className={`text-lg font-light mb-1 ${plan.accentColor}`}>
                      {plan.name}
                    </h3>
                    <p className="text-gray-400 text-xs font-light">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mb-5 text-center">
                    <motion.div
                      key={`${plan.name}-${billing}`}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-3xl font-light text-white tracking-tight">
                        {getPrice(plan.price)}
                      </div>
                      {plan.price > 0 && (
                        <p className="text-gray-500 text-xs mt-0.5 font-light">
                          {billing === 'annual' ? 'per year' : 'per month'}
                        </p>
                      )}
                    </motion.div>
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push('/login')}
                    className={`w-full py-2.5 px-4 rounded-lg mb-5 font-light text-sm transition-all duration-300 group/btn relative overflow-hidden ${
                      plan.highlight
                        ? `bg-gradient-to-r ${plan.gradient} border ${plan.borderColor} text-white hover:border-opacity-100`
                        : 'bg-zinc-800/50 border border-zinc-700 text-gray-300 hover:bg-zinc-700/50 hover:text-white'
                    }`}
                  >
                    <span className="relative z-10">{plan.cta}</span>
                    {plan.highlight && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                    )}
                  </motion.button>

                  {/* Features */}
                  <div className="space-y-2.5 flex-1">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + featureIndex * 0.05 }}
                        className="flex gap-2 items-start"
                      >
                        <div className={`mt-0.5 flex-shrink-0 ${plan.accentColor}`}>
                          <Check className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-xs text-gray-400 font-light leading-snug">
                          {feature}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Bottom line */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-gray-600 text-xs mt-6 font-light"
        >
          crisis resources always free. always there for you.{' '}
          <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
            see details
          </a>
        </motion.p>
      </div>
    </section>
  )
}
