import { initializeApp, getApps, getApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBoSJggPoHfiI2quek_5mV5gPSAhSaXFZE",

  authDomain: "web-wardrobe.firebaseapp.com",

  projectId: "web-wardrobe",

  storageBucket: "web-wardrobe.firebasestorage.app",

  messagingSenderId: "201587857341",

  appId: "1:201587857341:web:044fe04f2503168881a4d4",

  measurementId: "G-Y1Z06MLGTX",
};

export const app =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
