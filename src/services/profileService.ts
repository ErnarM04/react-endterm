import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export interface UserProfile {
  photoURL?: string;
  displayName?: string;
  updatedAt: string;
}

/**
 * Save profile picture to Firestore
 * @param userId - User ID
 * @param photoBase64 - Compressed image as base64 string
 */
export async function saveProfilePicture(userId: string, photoBase64: string): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(
      userRef,
      {
        photoURL: photoBase64,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error saving profile picture:', error);
    throw error;
  }
}

/**
 * Get user profile from Firestore
 * @param userId - User ID
 * @returns UserProfile or null
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

/**
 * Get profile picture URL from Firestore
 * @param userId - User ID
 * @returns Base64 data URL or null
 */
export async function getProfilePicture(userId: string): Promise<string | null> {
  try {
    const profile = await getUserProfile(userId);
    return profile?.photoURL || null;
  } catch (error) {
    console.error('Error fetching profile picture:', error);
    return null;
  }
}

