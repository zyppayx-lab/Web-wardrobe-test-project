import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseConfig } from "./config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function fetchPosts() {
  const snap = await getDocs(collection(db, "posts"));

  const posts = [];

  snap.forEach(doc => {
    posts.push({
      id: doc.id,
      ...doc.data()
    });
  });

  return posts;
}
