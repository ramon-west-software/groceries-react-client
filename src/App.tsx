import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import "./Home.css";

interface AppProps {}

const App: React.FC<AppProps> = () => {
  const [token, setToken] = useState<string | null>(() => {
    // Retrieve the token from localStorage on component mount
    const storedToken = localStorage.getItem("token");
    return storedToken ? storedToken : null;
  });
  const [userId, setUserId] = useState<number | null>(null);

  // Use useEffect to update localStorage when the token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            token && userId ? (
              <Home token={token} userId={userId} />
            ) : (
              <Login
              setToken={(newToken) => setToken(newToken)}
              setUserId={(userId) => setUserId(userId)}
            />
            )
          }
        />
        <Route path="/home" element={<Home token={token} userId={userId} />} />
        <Route
          path="/login"
          element={
            <Login
              setToken={(newToken) => setToken(newToken)}
              setUserId={(userId) => setUserId(userId)}
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
