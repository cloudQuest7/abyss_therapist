'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  MessageCircle, 
  BookOpen, 
  TrendingUp,
  AlertCircle,
  Flame,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { HexagonBackground } from '@/components/animate-ui/components/backgrounds/hexagon';
import { useAuth } from '@/components/AuthContext';
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getUserStats } from '@/lib/firebase-services';

const moods = [
  { emoji: '😭', value: 1, label: 'terrible' },
  { emoji: '😔', value: 2, label: 'bad' },
  { emoji: '😐', value: 3, label: 'okay' },
  { emoji: '🙂', value: 4, label: 'good' },
  { emoji: '😊', value: 5, label: 'great' },
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
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState(3);
  const [quote, setQuote] = useState('');
  const [userName, setUserName] = useState('friend');
  const [moodData, setMoodData] = useState<number[]>([3, 3, 3, 3, 3, 3, 3]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  useEffect(() => {
    if (user) {
      loadUserData();
      loadMoodData();
      loadUserStats();
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
      
      if (moods.length > 0) {
        setMoodData(moods.reverse());
      }
    } catch (error) {
      console.error('Error loading mood data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    if (!user) return;
    try {
      const statsResult = await getUserStats(user.uid);
      if (statsResult.success) {
        setStreak(statsResult.stats.streak);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
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

  const handleMoodClick = (moodValue: number) => {
    setSelectedMood(moodValue);
    router.push(`/dashboard/journal?mood=${moodValue}`);
  };

  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-10">
        <HexagonBackground />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen px-4 py-6 pb-24 max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-white mb-1 truncate">
                hey {userName}
              </h1>
              <p className="text-gray-400 text-sm sm:text-base flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                how you feeling today?
              </p>
            </div>
            <Link 
              href="/dashboard/analytics"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-emerald-500/50 text-white text-sm whitespace-nowrap"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">analytics</span>
            </Link>
          </div>
        </motion.div>

        {/* Mood Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6">
            <p className="text-gray-400 text-xs sm:text-sm mb-4 uppercase tracking-wide">select your mood</p>
            <div className="grid grid-cols-5 gap-2">
              {moods.map((mood) => (
                <motion.button
                  key={mood.value}
                  onClick={() => handleMoodClick(mood.value)}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center gap-1 p-2 sm:p-3 rounded-xl transition-all ${
                    selectedMood === mood.value 
                      ? 'bg-white/20 border-2 border-white/40' 
                      : 'bg-white/5 border border-white/10'
                  }`}
                >
                  <span className="text-2xl sm:text-3xl">{mood.emoji}</span>
                  <span className="text-xs text-gray-400 hidden sm:block">{mood.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          
          {/* Streak */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-orange-500/20 to-red-500/10 border border-orange-500/30 rounded-2xl p-4"
          >
            <Flame className="w-5 h-5 text-orange-400 mb-2" />
            <h3 className="text-3xl font-light text-white mb-1">{streak}</h3>
            <p className="text-xs text-gray-400">day streak</p>
          </motion.div>

          {/* Journal */}
          <Link href="/dashboard/journal">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 rounded-2xl p-4 h-full"
            >
              <BookOpen className="w-5 h-5 text-purple-400 mb-2" />
              <h3 className="text-base font-light text-white mb-1">journal</h3>
              <p className="text-xs text-gray-400">write it out</p>
            </motion.div>
          </Link>

          {/* Chat */}
          <Link href="/dashboard/chat">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-4 h-full"
            >
              <MessageCircle className="w-5 h-5 text-cyan-400 mb-2" />
              <h3 className="text-base font-light text-white mb-1">chat</h3>
              <p className="text-xs text-gray-400">talk to abyss</p>
            </motion.div>
          </Link>

          {/* Crisis */}
          <Link href="/dashboard/crisis">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-gradient-to-br from-red-500/20 to-rose-500/10 border border-red-500/30 rounded-2xl p-4 h-full"
            >
              <div className="flex items-center justify-between mb-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-base font-light text-white mb-1">crisis</h3>
              <p className="text-xs text-gray-400">need help?</p>
            </motion.div>
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Mood Graph */}
          <Link href="/dashboard/analytics" className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-emerald-500/50 rounded-2xl p-4 sm:p-6 h-full transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-xl font-light text-white">your mood</h2>
                  </div>
                  <p className="text-sm text-gray-500">last 7 days</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-light text-emerald-400">{getMoodAverage()}</p>
                  <p className="text-xs text-gray-500">week trend</p>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-32 text-gray-600 text-sm">
                  loading...
                </div>
              ) : (
                <>
                  <div className="flex items-end gap-2 h-32 mb-4">
                    {moodData.map((mood, i) => {
                      const height = mood * 20;
                      const colors = [
                        'from-red-500/70 to-red-600/50',
                        'from-orange-500/70 to-orange-600/50',
                        'from-yellow-500/70 to-yellow-600/50',
                        'from-emerald-500/70 to-emerald-600/50',
                        'from-green-500/70 to-green-600/50',
                      ];
                      
                      return (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ delay: 0.5 + i * 0.08, duration: 0.6 }}
                          className={`flex-1 bg-gradient-to-t ${colors[mood - 1] || 'bg-gray-500/50'} rounded-t-lg`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>7d ago</span>
                    <span>today</span>
                  </div>
                </>
              )}
            </motion.div>
          </Link>

          {/* Quote Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-gradient-to-br from-violet-500/20 to-pink-500/10 border border-violet-500/30 rounded-2xl p-6 flex flex-col justify-between min-h-[280px]"
          >
            <div>
              <Sparkles className="w-5 h-5 text-violet-400 mb-4" />
              <p className="text-lg font-light text-white/90 leading-relaxed mb-6">
                {quote}
              </p>
            </div>
            <button
              onClick={() => setQuote(quotes[Math.floor(Math.random() * quotes.length)])}
              className="w-full px-4 py-2 rounded-lg bg-violet-500/20 border border-violet-500/30 hover:bg-violet-500/30 text-violet-300 text-sm font-medium transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3 h-3" />
              new thought
            </button>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
