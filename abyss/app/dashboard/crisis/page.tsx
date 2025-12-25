'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, Heart, Wind, Users, X, Plus, Trash2 } from 'lucide-react';
import { StarsBackground } from '@/components/animate-ui/components/backgrounds/stars';
import BreathingExercise from '@/components/crisis/BreathingExercise';
import GroundingExercise from '@/components/crisis/GroundingExercise';
import { useAuth } from '@/components/AuthContext';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
}

export default function CrisisPage() {
  const { user } = useAuth();
  const [showBreathing, setShowBreathing] = useState(false);
  const [showGrounding, setShowGrounding] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadContacts();
    }
  }, [user]);

  const loadContacts = async () => {
    if (!user) return;
    
    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        setContacts(data.emergencyContacts || []);
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const addContact = async (contact: Omit<EmergencyContact, 'id'>) => {
    if (!user) return;

    const newContact = {
      ...contact,
      id: Date.now().toString(),
    };

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        emergencyContacts: arrayUnion(newContact)
      });
      
      setContacts([...contacts, newContact]);
      setShowAddContact(false);
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  const deleteContact = async (contactId: string) => {
    if (!user) return;

    const contactToDelete = contacts.find(c => c.id === contactId);
    if (!contactToDelete) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        emergencyContacts: arrayRemove(contactToDelete)
      });
      
      setContacts(contacts.filter(c => c.id !== contactId));
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const emergencyNumbers = [
    { name: 'TELE-MANAS', number: '14416', description: 'Mental Health Helpline (India)' },
    { name: 'iCALL', number: '9152987821', description: 'Psychosocial Helpline' },
    { name: 'AASRA', number: '9820466726', description: 'Mumbai Crisis Line' },
    { name: 'Emergency', number: '112', description: 'Police/Ambulance' },
  ];

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Stars Background */}
      <div className="absolute inset-0">
        <StarsBackground />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen px-3 sm:px-4 py-6 sm:py-8 pb-20 sm:pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-3 sm:mb-4">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 text-xs sm:text-sm font-medium uppercase tracking-wider">
              crisis mode
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-light text-white mb-2 sm:mb-3 px-4">
            you are not alone
          </h1>
          <p className="text-gray-400 text-base sm:text-lg px-4">
            help is here. take a deep breath.
          </p>
        </motion.div>

        {/* 1. Breathing & Grounding Exercises */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-6 sm:mb-8"
        >
          <h2 className="text-lg sm:text-xl font-light text-white mb-3 sm:mb-4 px-1 sm:px-2">calm down now</h2>
          <div className="grid gap-3 sm:gap-4">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowBreathing(true)}
              className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-left transition-all hover:border-white/20 active:scale-95 group"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <Wind className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-medium text-base sm:text-lg truncate">breathing exercise</p>
                    <p className="text-gray-400 text-xs sm:text-sm">4-4-4 pattern • 2 minutes</p>
                  </div>
                </div>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors flex-shrink-0">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full" />
                </div>
              </div>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowGrounding(true)}
              className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-left transition-all hover:border-white/20 active:scale-95 group"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-medium text-base sm:text-lg truncate">grounding (5-4-3-2-1)</p>
                    <p className="text-gray-400 text-xs sm:text-sm">sensory awareness • 5 minutes</p>
                  </div>
                </div>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors flex-shrink-0">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full" />
                </div>
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* 2. Emergency Contacts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl mx-auto mb-6 sm:mb-8"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4 px-1 sm:px-2">
            <h2 className="text-lg sm:text-xl font-light text-white">trusted contacts</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddContact(true)}
              className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>add</span>
            </motion.button>
          </div>

          <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6">
            {loading ? (
              <div className="text-center text-gray-500 py-6 sm:py-8 text-sm">loading...</div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <Users className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 mx-auto mb-2 sm:mb-3" />
                <p className="text-gray-500 mb-3 sm:mb-4 text-sm">no contacts added yet</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddContact(true)}
                  className="px-5 sm:px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white text-xs sm:text-sm transition-colors"
                >
                  add your first contact
                </motion.button>
              </div>
            ) : (
              <div className="space-y-2.5 sm:space-y-3">
                {contacts.map((contact, index) => (
                  <motion.div
                    key={contact.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 group hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center justify-between gap-2 sm:gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-base sm:text-lg truncate">{contact.name}</p>
                        <p className="text-gray-500 text-xs sm:text-sm truncate">{contact.relation}</p>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        <motion.a
                          href={`tel:${contact.phone}`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-9 h-9 sm:w-10 sm:h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors"
                        >
                          <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </motion.a>
                        <motion.a
                          href={`sms:${contact.phone}`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
                        >
                          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </motion.a>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteContact(contact.id)}
                          className="w-9 h-9 sm:w-10 sm:h-10 bg-red-500/20 hover:bg-red-500/30 rounded-full flex items-center justify-center transition-colors sm:opacity-0 sm:group-hover:opacity-100"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* 3. Emergency Hotlines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-lg sm:text-xl font-light text-white mb-3 sm:mb-4 px-1 sm:px-2">emergency hotlines</h2>
          <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6">
            <div className="space-y-2.5 sm:space-y-3">
              {emergencyNumbers.map((item, index) => (
                <motion.a
                  key={index}
                  href={`tel:${item.number}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-between gap-3 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all group active:scale-95"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm sm:text-base truncate">{item.name}</p>
                    <p className="text-gray-500 text-xs sm:text-sm truncate">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    <span className="text-red-400 font-mono text-sm sm:text-lg">{item.number}</span>
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 group-hover:rotate-12 transition-transform" />
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddContact && (
          <AddContactModal
            onClose={() => setShowAddContact(false)}
            onAdd={addContact}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBreathing && (
          <BreathingExercise onClose={() => setShowBreathing(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showGrounding && (
          <GroundingExercise onClose={() => setShowGrounding(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// Add Contact Modal - Mobile Optimized
function AddContactModal({ 
  onClose, 
  onAdd 
}: { 
  onClose: () => void; 
  onAdd: (contact: Omit<EmergencyContact, 'id'>) => void;
}) {
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = () => {
    if (name.trim() && relation.trim() && phone.trim()) {
      onAdd({ name: name.trim(), relation: relation.trim(), phone: phone.trim() });
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-md bg-zinc-900/95 backdrop-blur-xl border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          title="Close"
          className="absolute top-4 sm:top-6 right-4 sm:right-6 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-3 sm:mb-4">
            <Users className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h3 className="text-xl sm:text-2xl font-light text-white mb-2">add trusted contact</h3>
          <p className="text-gray-400 text-sm">someone you can reach out to in crisis</p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="mom, best friend, etc."
              className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors text-base"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">relationship</label>
            <input
              type="text"
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              placeholder="mother, friend, sibling, etc."
              className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors text-base"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">phone number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="+91 98765 43210"
              className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors text-base"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="w-full sm:flex-1 px-6 py-3.5 sm:py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl sm:rounded-2xl text-white transition-colors"
          >
            cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={!name.trim() || !relation.trim() || !phone.trim()}
            className="w-full sm:flex-1 px-6 py-3.5 sm:py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-xl sm:rounded-2xl text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            save contact
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
