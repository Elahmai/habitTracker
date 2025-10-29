// config/firebase.js
import { initializeApp } from "firebase/app";

import {
    initializeAuth,
    getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyCztPGAtH1-1iUkGY_bBUXZjxPY_9YB_wI",
    authDomain: "learn-firebase-3f2bc.firebaseapp.com",//not
    databaseURL: "https://learn-firebase-3f2bc-default-rtdb.firebaseio.com",
    projectId: "learn-firebase-3f2bc",
    storageBucket: "learn-firebase-3f2bc.firebasestorage.app",
    messagingSenderId: "24053450657",//not
    appId: "1:24053450657:android:c43546d44bae89704dade0",
    measurementId: "G-3T7T0JPKZK"//not
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Auth with persistence
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});


// Initialize Firestore (optional)
const db = getFirestore(app);

export { auth, db };

export const storage = getStorage(app);
