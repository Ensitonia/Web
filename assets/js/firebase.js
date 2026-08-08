// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCPfeeFtdmZSouMn4xLSJ78Kp_s8ie7W8I",
  authDomain: "ensintonia-77895.firebaseapp.com",
  projectId: "ensintonia-77895",
  storageBucket: "ensintonia-77895.firebasestorage.app",
  messagingSenderId: "529846177682",
  appId: "1:529846177682:web:723ade0cf8fbeb7b2e3b4b",
  measurementId: "G-3606ETPKHW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);