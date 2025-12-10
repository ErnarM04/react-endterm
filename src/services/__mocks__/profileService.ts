export interface UserProfile {
  photoURL?: string;
  displayName?: string;
  updatedAt: string;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  return Promise.resolve({ photoURL: null });
}

export async function saveProfilePicture(userId: string, photoBase64: string): Promise<void> {
  return Promise.resolve();
}

export async function getProfilePicture(userId: string): Promise<string | null> {
  return Promise.resolve(null);
}

