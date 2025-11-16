// app/firebase.js

import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCztPGAtH1-1iUkGY_bBUXZjxPY_9YB_wI",
    authDomain: "learn-firebase-3f2bc.firebaseapp.com",
    databaseURL: "https://learn-firebase-3f2bc-default-rtdb.firebaseio.com",
  projectId: "learn-firebase-3f2bc",
  storageBucket: "learn-firebase-3f2bc.firebasestorage.app",
  messagingSenderId: "24053450657",
  appId: "1:24053450657:android:c43546d44bae89704dade0",
  measurementId: "G-3T7T0JPKZK",
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getFirestore(app);

const storage = getStorage(app);

export { auth, db, storage };
