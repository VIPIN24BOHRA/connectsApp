import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyDqoil0D4HTSknw9cidWEIAQPysQWYmVUQ",
  authDomain: "connectsapp-248c9.firebaseapp.com",
  databaseURL:
    "https://connectsapp-248c9-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "connectsapp-248c9",
  storageBucket: "connectsapp-248c9.appspot.com",
  messagingSenderId: "873324106200",
  appId: "1:873324106200:web:f89f9e14a87e8f7553e2ad",
  measurementId: "G-SZ2PMK04LX",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase();
export { app, auth, database };
