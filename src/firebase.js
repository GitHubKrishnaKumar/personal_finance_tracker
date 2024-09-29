// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAz7RF65v8NzZxMYdmyg3-bXhxo6NoPjSc",
  authDomain: "finance-tracker-krishna.firebaseapp.com",
  projectId: "finance-tracker-krishna",
  storageBucket: "finance-tracker-krishna.appspot.com",
  messagingSenderId: "213551187000",
  appId: "1:213551187000:web:d2fd45c270ab0e38ddd2cd",
  measurementId: "G-21Y7SN6EWY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider, doc, setDoc };