import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  setToken: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginUrl, setLoginUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loginEndpoint = `${import.meta.env.VITE_SERVER}${import.meta.env.VITE_LOGIN_ENDPOINT}`;
    setLoginUrl(loginEndpoint);
  }, []);

  const handleLogin = async () => {
    if (loginUrl) {
      try {
        // Call your server endpoint to authenticate
        const response = await fetch(loginUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          // Assuming the server responds with a JWT token
          const data = await response.json();
          const token = data.token;

          // Store the token in your application state (or a global state management system)
          setToken(token);

          // Redirect to the home page
          navigate("/home");
        } else {
          // Handle login error
          console.error("Login failed");
        }
      } catch (error) {
        console.error("Error during login:", error);
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card-container">
        <div className="main-card-header">
          <div className="main-card-title">Login</div>
        </div>
        <div className="main-card-text-container">
          <div>
            <form className="login-form">
              <label className="main-card-text">
                Email:
                <input
                  type="text"
                  className="login-form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <br />
              <label className="main-card-text">
                Password:
                <input
                  type="password"
                  className="login-form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <br />
              <button type="button" className="text-font" onClick={handleLogin}>
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
