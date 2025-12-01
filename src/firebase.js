// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzuy_ZurVjpT4vAdmL_J8Fh9SrA4w9-14",
  authDomain: "react-endterm-d48df.firebaseapp.com",
  projectId: "react-endterm-d48df",
  storageBucket: "react-endterm-d48df.firebasestorage.app",
  messagingSenderId: "192236978886",
  appId: "1:192236978886:web:53e8253408d72175f54dc7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;

