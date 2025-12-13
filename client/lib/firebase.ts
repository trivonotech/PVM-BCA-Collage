import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBb3LfSUpqeB3HyJD-Fl0jNpe_yermr6E0",
    authDomain: "pvm-bca-college.firebaseapp.com",
    projectId: "pvm-bca-college",
    storageBucket: "pvm-bca-college.firebasestorage.app",
    messagingSenderId: "761323612048",
    appId: "1:761323612048:web:1346dee241edb3a1613515",
    measurementId: "G-NB03CTWS3Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
