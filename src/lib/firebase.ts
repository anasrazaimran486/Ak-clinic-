import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc, updateDoc, deleteDoc, onSnapshot, getDocs, query, orderBy } from 'firebase/firestore';

// Firebase configuration from firebase-applet-config.json
const firebaseConfig = {
  projectId: "grand-healer-p40ks",
  appId: "1:507194874320:web:bdf6fb339e9b411e5341d5",
  apiKey: "AIzaSyCNsOB-doGoNrq00E9YO8sg6V-R-X1hSMc",
  authDomain: "grand-healer-p40ks.firebaseapp.com",
  databaseId: "ai-studio-akclinic-d6b33c64-6de5-4c27-ba20-bce4eb9d6d2c",
  storageBucket: "grand-healer-p40ks.firebasestorage.app",
  messagingSenderId: "507194874320"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore (using custom database ID)
export const db = getFirestore(app, firebaseConfig.databaseId);

// Collection references
export const appointmentsRef = collection(db, 'appointments');
export const doctorsRef = collection(db, 'doctors');
export const tokensRef = collection(db, 'tokens');
export const invoicesRef = collection(db, 'invoices');

export { doc, setDoc, updateDoc, deleteDoc, addDoc, onSnapshot, getDocs, query, orderBy };
