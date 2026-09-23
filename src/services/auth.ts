import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { PROFILE_IMAGE } from '../data/mockData';

// Initialize Firebase App only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Google Auth Provider with Google Drive Scopes
export const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive.readonly');
provider.addScope('https://www.googleapis.com/auth/drive.file');

// In-memory access token cache
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export interface CreatorAccount {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  isGoogleUser: boolean;
  walletAddress: string;
  bankAccount: string;
}

const DEFAULT_PROFILE: CreatorAccount = {
  uid: 'default-maya',
  displayName: 'Maya Ardiansyah',
  email: 'maya.ardiansyah@creativetrust.id',
  photoURL: PROFILE_IMAGE,
  isGoogleUser: false,
  walletAddress: '0x7a82C94F98E12a9B3F',
  bankAccount: 'BCA •••• 8821',
};

// Init Auth listener
export const initAuth = (
  onAuthSuccess?: (user: CreatorAccount, token: string | null) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (firebaseUser: User | null) => {
    if (firebaseUser) {
      const creator: CreatorAccount = {
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName || 'Kreator Indonesia',
        email: firebaseUser.email || 'user@gmail.com',
        photoURL: firebaseUser.photoURL || PROFILE_IMAGE,
        isGoogleUser: true,
        walletAddress: `0x${firebaseUser.uid.substring(0, 8)}...${firebaseUser.uid.substring(firebaseUser.uid.length - 4)}`,
        bankAccount: 'BCA •••• 8821',
      };
      if (onAuthSuccess) {
        onAuthSuccess(creator, cachedAccessToken);
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Sign in with Google Popup
export const googleSignIn = async (): Promise<{
  creator: CreatorAccount;
  accessToken: string;
} | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Gagal mendapatkan token otorisasi dari Google');
    }

    cachedAccessToken = credential.accessToken;

    const creator: CreatorAccount = {
      uid: result.user.uid,
      displayName: result.user.displayName || 'Kreator Google',
      email: result.user.email || '',
      photoURL: result.user.photoURL || PROFILE_IMAGE,
      isGoogleUser: true,
      walletAddress: `0x${result.user.uid.substring(0, 8)}...${result.user.uid.substring(result.user.uid.length - 4)}`,
      bankAccount: 'BCA •••• 8821',
    };

    return { creator, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getCachedAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const logoutGoogle = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

export const getDefaultCreator = (): CreatorAccount => {
  return DEFAULT_PROFILE;
};
