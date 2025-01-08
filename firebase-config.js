import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDmlt1fttkFhvB6Vzrfp3P7IIjaHuKvEUU",
  authDomain: "shaurma-83d4d.firebaseapp.com",
  projectId: "shaurma-83d4d",
  storageBucket: "shaurma-83d4d.firebasestorage.app",
  messagingSenderId: "704648730374",
  appId: "1:704648730374:web:c148e486b8ad6a87ab7087"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };