import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBiLd7aFBpPOpgj26QSLhFewr7AlKIDDEI",
  authDomain: "d-textbook-a09fb.firebaseapp.com",
  projectId: "d-textbook-a09fb",
  storageBucket: "d-textbook-a09fb.firebasestorage.app",
  messagingSenderId: "22626767658",
  appId: "1:22626767658:web:0bae4470737ceb9b90c453"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google Auth Error:", error);
    throw error;
  }
};

export const logoutFirebase = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout Error:", error);
  }
};
