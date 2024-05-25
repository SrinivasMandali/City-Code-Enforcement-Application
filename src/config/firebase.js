import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDitQ5-oa_6XyODyh3IswkUTAu3ZMHXxpQ",
  authDomain: "citycode-6fdca.firebaseapp.com",
  projectId: "citycode-6fdca",
  storageBucket: "citycode-6fdca.appspot.com",
  messagingSenderId: "763335389269",
  appId: "1:763335389269:web:27dc30e6b21241244064dc",
  measurementId: "G-8D3490C3R4",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
