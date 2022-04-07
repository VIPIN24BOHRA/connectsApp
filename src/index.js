import { createRoot } from "react-dom/client";
import React from "react";
import Home from "./components/Home/Home.jsx";
import "./index.css";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Profile from "./components/Profile/profile.jsx";
import { auth } from "./components/firebase.js";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

const App = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("user logged in", user);
        // find the details of user from the uid;

        setUser(user);
      } else {
        console.log("user logged out");
        setUser(null);
      }
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="profile" /> : <Home />}
        ></Route>
        <Route
          path="/*"
          element={user ? <Profile user={user} /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
};
const root = createRoot(document.getElementById("root"));
root.render(<App />);
