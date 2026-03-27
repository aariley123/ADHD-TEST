import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, serverTimestamp, getDocFromServer } from 'firebase/firestore';

// Import the Firebase configuration
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Helper to test connection
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Auth Helpers
export const loginAnonymously = () => signInAnonymously(auth);
export const loginWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

// Redemption Code Helpers
export async function validateCode(code: string): Promise<{ success: boolean; message: string }> {
  const path = `redemptionCodes/${code}`;
  try {
    const docRef = doc(db, 'redemptionCodes', code);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return { success: false, message: '无效的兑换码' };
    }

    const data = docSnap.data();
    if (data.isUsed) {
      if (data.usedBy === auth.currentUser?.uid) {
        return { success: true, message: '欢迎回来' };
      }
      return { success: false, message: '该兑换码已被使用' };
    }

    // Claim the code
    await updateDoc(docRef, {
      isUsed: true,
      usedBy: auth.currentUser?.uid
    });

    return { success: true, message: '兑换成功' };
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    return { success: false, message: '验证失败，请重试' };
  }
}

export async function checkUserAccess(uid: string): Promise<boolean> {
  const path = 'redemptionCodes';
  try {
    const q = query(collection(db, 'redemptionCodes'), where('usedBy', '==', uid), where('isUsed', '==', true));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return false;
  }
}

export async function generateNewCode(code: string) {
  const path = `redemptionCodes/${code}`;
  try {
    const docRef = doc(db, 'redemptionCodes', code);
    await setDoc(docRef, {
      code,
      isUsed: false,
      usedBy: null,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}
