import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export type JournalEntry = {
  id?: string;
  userId: string;
  title: string;
  content: string;
  mood?: string;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
};

// Add new journal entry
export async function addJournalEntry(entry: Omit<JournalEntry, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, 'journals'), {
      ...entry,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding journal:', error);
    return { success: false, error };
  }
}

// Get all entries for a user
export async function getUserJournals(userId: string) {
  try {
    const q = query(
      collection(db, 'journals'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const journals: JournalEntry[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      journals.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
      } as JournalEntry);
    });
    
    return { success: true, journals };
  } catch (error) {
    console.error('Error fetching journals:', error);
    return { success: false, journals: [], error };
  }
}

// Update journal entry
export async function updateJournalEntry(id: string, updates: Partial<JournalEntry>) {
  try {
    const docRef = doc(db, 'journals', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating journal:', error);
    return { success: false, error };
  }
}

// Delete journal entry
export async function deleteJournalEntry(id: string) {
  try {
    await deleteDoc(doc(db, 'journals', id));
    return { success: true };
  } catch (error) {
    console.error('Error deleting journal:', error);
    return { success: false, error };
  }
}
