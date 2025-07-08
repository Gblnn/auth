import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
} from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDHM48rqJQKhk7lMTNPm6-7b-jr-TODb0c",
  authDomain: "coffee-pos-aa730.firebaseapp.com",
  projectId: "coffee-pos-aa730",
  storageBucket: "coffee-pos-aa730.firebasestorage.app",
  messagingSenderId: "956277416705",
  appId: "1:956277416705:web:0289d8c6678b533ea07100"
};

// Initialize Firebase with performance settings
export const app = initializeApp(firebaseConfig, {
  automaticDataCollectionEnabled: false, // Only enable data collection when needed
});

// Initialize Firestore with optimized persistence settings
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
    cacheSizeBytes: 50 * 1024 * 1024, // 50MB cache size
  }),
  experimentalForceLongPolling: false, // Use WebSocket when possible
});

// Initialize storage with custom settings
export const storage = getStorage(app);

// Configure storage settings after initialization
storage.maxOperationRetryTime = 15000; // 15 seconds max retry

export const auth = getAuth(app);

// Set default persistence for Auth with error handling
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.error("Error setting auth persistence:", err);
});
