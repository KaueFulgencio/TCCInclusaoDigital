import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyB2h0-B89Udnwc9jK8dZxO9BRx2x7MoJms",
  authDomain: "tcc2-c5833.firebaseapp.com",
  projectId: "tcc2-c5833",
  storageBucket: "tcc2-c5833.appspot.com",
  messagingSenderId: "22595453970",
  appId: "1:22595453970:web:ed9ef4f1fade90ed7344cb",
  measurementId: "G-NCNYNKZ8JN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

export { app, auth, db };