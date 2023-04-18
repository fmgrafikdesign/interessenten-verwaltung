// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDJbEH-nRdDH6Yuzy46WT7UsRUNC3pdI2E",
    authDomain: "interessenten-verwaltung.firebaseapp.com",
    projectId: "interessenten-verwaltung",
    storageBucket: "interessenten-verwaltung.appspot.com",
    messagingSenderId: "231660254664",
    appId: "1:231660254664:web:8d1f665d0904ff1094bcfd"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

// used for the firestore refs
export const db = getFirestore(firebaseApp)
