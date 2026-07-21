// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD5L74FBQWaY_YcXj35rPsprUCnm7srRSM",
  authDomain: "auto-e0de8.firebaseapp.com",
  projectId: "auto-e0de8",
  storageBucket: "auto-e0de8.firebasestorage.app",
  messagingSenderId: "562694977295",
  appId: "1:562694977295:web:e7166859beede52f85307a",
  measurementId: "G-8ZQQYYGS1T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);