import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBoSJggPoHfiI2quek_5mV5gPSAhSaXFZE",
  authDomain: "web-wardrobe.firebaseapp.com",
  projectId: "web-wardrobe",
  storageBucket: "web-wardrobe.appspot.com",
  messagingSenderId: "201587857341",
  appId: "1:201587857341:web:044fe04f2503168881a4d4"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
