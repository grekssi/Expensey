import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { verifyIdToken } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB6U0vr4qm6xrWFeagpxK_21c5jiunPpx8",
  authDomain: "signal-clone-f6c77.firebaseapp.com",
  projectId: "signal-clone-f6c77",
  storageBucket: "signal-clone-f6c77.appspot.com",
  messagingSenderId: "162810066565",
  appId: "1:162810066565:web:045e72ed14039850209bec",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, auth, storage };
