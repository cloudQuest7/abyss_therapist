'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  MessageCircle, 
  BookOpen, 
  TrendingUp,
  AlertCircle,
  Flame,
  Sparkles
} from 'lucide-react';
import { HexagonBackground } from '@/components/animate-ui/components/backgrounds/hexagon';
import { useAuth } from '@/components/AuthContext';
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const moods = [
  { emoji: '😭', value: 1 },
  { emoji: '😔', value: 2 },
  { emoji: '😐', value: 3 },
  { emoji: '🙂', value: 4 },
  { emoji: '😊', value: 5 },
];

const quotes = [
  "healing isn't linear. you're exactly where you need to be",
  "you've survived 100% of your worst days so far",
  "your feelings are valid, every single one",
  "progress > perfection. always",
  "it's okay to not be okay",
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState(3);
  const [quote, setQuote] = useState('');
  const [userName, setUserName] = useState('friend');
  const [moodData, setMoodData] = useState<number[]>([3, 3, 3, 3, 3, 3, 3]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  useEffect(() => {
    if (user) {
      loadUserData();
      loadMoodData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserName(data.displayName || 'friend');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadMoodData = async () => {
    if (!user) return;
    
    try {
      // Get last 7 journal entries with mood
      const journalRef = collection(db, 'users', user.uid, 'journals');
      const q = query(
        journalRef,
        orderBy('createdAt', 'desc'),
        limit(7)
      );
      
      const querySnapshot = await getDocs(q);
      const moods: number[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.mood) {
          moods.push(data.mood);
        }
      });
      
      // Reverse to show oldest to newest
      if (moods.length > 0) {
        setMoodData(moods.reverse());
      }
    } catch (error) {
      console.error('Error loading mood data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMoodAverage = () => {
    const sum = moodData.reduce((a, b) => a + b, 0);
    const avg = sum / moodData.length;
    if (avg >= 4) return 'great';
    if (avg >= 3) return 'good';
    if (avg >= 2) return 'okay';
    return 'tough';
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-20">
        <HexagonBackground />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 pb-20 sm:pb-24">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 sm:mb-10"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-2">
              hey {userName}
            </h1>
            <p className="text-gray-500 text-base sm:text-lg">how you feeling today?</p>
          </motion.div>

          {/* Compact Mood Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-5 mb-6 sm:mb-8"
          >
            <div className="flex items-center justify-center gap-3 sm:gap-6">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`text-2xl sm:text-3xl transition-all duration-300 ${
                    selectedMood === mood.value 
                      ? 'scale-125' 
                      : 'opacity-30 scale-90'
                  }`}
                >
                  {mood.emoji}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            
            {/* Crisis Mode */}
            <Link href="/dashboard/crisis" className="col-span-2 sm:col-span-1 sm:row-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="h-full bg-red-500/10 hover:bg-red-500/20 active:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 text-left transition-all duration-300 cursor-pointer"
              >
                <AlertCircle className="w-7 h-7 sm:w-8 sm:h-8 text-red-400 mb-4 sm:mb-6" />
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-light text-white mb-2 sm:mb-3">
                  crisis mode
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6">
                  need help right now?
                </p>
                <div className="flex items-center gap-2 text-red-400 text-xs">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                  <span>always here</span>
                </div>
              </motion.div>
            </Link>

            {/* Journal */}
            <Link href="/dashboard/journal">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white/5 hover:bg-white/10 active:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 text-left transition-all duration-300 min-h-[140px] sm:min-h-[160px] cursor-pointer"
              >
                <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400 mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg lg:text-xl font-light text-white mb-1 sm:mb-2">journal</h3>
                <p className="text-gray-500 text-xs sm:text-sm">write it out</p>
              </motion.div>
            </Link>

            {/* Chat */}
            <Link href="/dashboard/chat">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 hover:bg-white/10 active:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 text-left transition-all duration-300 min-h-[140px] sm:min-h-[160px] cursor-pointer"
              >
                <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400 mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg lg:text-xl font-light text-white mb-1 sm:mb-2">chat</h3>
                <p className="text-gray-500 text-xs sm:text-sm">talk to abyss</p>
              </motion.div>
            </Link>

            {/* Streak */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 min-h-[140px] sm:min-h-[160px] flex flex-col justify-between"
            >
              <Flame className="w-6 h-6 sm:w-7 sm:h-7 text-orange-400" />
              <div>
                <h3 className="text-3xl sm:text-4xl font-light text-white mb-1">7</h3>
                <p className="text-gray-500 text-xs sm:text-sm">day streak</p>
              </div>
            </motion.div>

            {/* Real-time Mood Graph */}
            <Link href="/analytics" className="col-span-2 sm:col-span-1 sm:row-span-1 lg:row-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="h-full bg-white/5 hover:bg-white/10 active:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 text-left transition-all duration-300 cursor-pointer"
              >
                <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400 mb-4 sm:mb-6" />
                <h3 className="text-base sm:text-lg lg:text-xl font-light text-white mb-1 sm:mb-2">your mood</h3>
                <p className="text-gray-500 text-xs sm:text-sm mb-6 sm:mb-8">last 7 days</p>
                
                {/* Real-time Mood Graph */}
                {loading ? (
                  <div className="flex items-center justify-center h-20 text-gray-600 text-sm">
                    loading...
                  </div>
                ) : (
                  <>
                    <div className="flex items-end gap-1.5 sm:gap-2 h-16 sm:h-20 mb-3 sm:mb-4">
                      {moodData.map((mood, i) => {
                        const height = mood * 20;
                        const colors = [
                          'bg-red-500/70',      // 1
                          'bg-orange-500/70',   // 2
                          'bg-yellow-500/70',   // 3
                          'bg-emerald-500/70',  // 4
                          'bg-green-500/70',    // 5
                        ];
                        
                        return (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                            className={`flex-1 ${colors[mood - 1] || 'bg-gray-500/50'} rounded-md sm:rounded-lg`}
                          />
                        );
                      })}
                    </div>
                    <p className="text-emerald-400 text-xs">
                      {moodData.length > 0 ? `${getMoodAverage()} week` : 'no data yet'}
                    </p>
                  </>
                )}
              </motion.div>
            </Link>

            {/* Quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="col-span-2 sm:col-span-2 lg:col-span-3 bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8"
            >
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-violet-400 mb-3 sm:mb-4" />
              <p className="text-base sm:text-lg lg:text-2xl font-light text-white/80 mb-3 sm:mb-4 leading-relaxed">
                {quote}
              </p>
              <button
                onClick={() => setQuote(quotes[Math.floor(Math.random() * quotes.length)])}
                className="text-xs sm:text-sm text-violet-400 hover:text-violet-300 transition-colors"
              >
                refresh →
              </button>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
