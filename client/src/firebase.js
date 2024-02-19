// Import the functions you need from the SDKs you need 
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdaV_g3uf9pxqBwzkJ6r04NP_RSbD1l3U",
  authDomain: "tictactalk.firebaseapp.com",
  projectId: "tictactalk",
  storageBucket: "tictactalk.appspot.com",
  messagingSenderId: "379005474410",
  appId: "1:379005474410:web:b9e8236deaeef72efe5c13",
  measurementId: "G-HVCTZH223D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const storage = getStorage(app);
export default app;