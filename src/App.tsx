import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import './Home.css'

interface AppProps {}

const App: React.FC<AppProps> = () => {
  const [token, setToken] = useState<string | null>(() => {
    // Retrieve the token from localStorage on component mount
    return localStorage.getItem('token');
  });

  // Use useEffect to update localStorage when the token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            token ? (
              <Home token={token}/>
            ) : (
              <Login setToken={(newToken) => setToken(newToken)} />
            )
          }
        />
        <Route path="/home" element={<Home token={token}/>} />
      </Routes>
    </Router>
  );
};

export default App;
