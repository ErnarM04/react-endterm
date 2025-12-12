import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export interface UserProfile {
  photoURL?: string;
  displayName?: string;
  updatedAt: string;
}

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

export async function getProfilePicture(userId: string): Promise<string | null> {
  try {
    const profile = await getUserProfile(userId);
    return profile?.photoURL || null;
  } catch (error) {
    console.error('Error fetching profile picture:', error);
    return null;
  }
}

