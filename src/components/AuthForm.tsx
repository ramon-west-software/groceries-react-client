import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
interface FormProps {
  setToken: (token: string) => void;
  setUserId: (userId: number) => void;
  mode: "login" | "register";
}

const AuthForm: React.FC<FormProps> = ({ setToken, setUserId, mode }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loginEndpoint = `${import.meta.env.VITE_SERVER}${
      import.meta.env.VITE_LOGIN_ENDPOINT
    }`;
    const registerEndpoint = `${import.meta.env.VITE_SERVER}${
      import.meta.env.VITE_REGISTER_ENDPOINT
    }`;
    setEndpoint(mode === "login" ? loginEndpoint : registerEndpoint);
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (endpoint) {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...(mode === "register" && { username }),
            email,
            password,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const token = data.token;
          const userId = data.userId;

          setToken(token);
          setUserId(userId);

          navigate("/home");
        } else {
          // TODO: add error message to UI
          const data = await response.json();
          console.error("Authentication failed: ", data.message);
        }
      } catch (error) {
        console.error("Error during authentication:", error);
      }
    }
  };

  return (
    <div className="login-card-container">
      <div className="main-card-header">
        <div className="main-card-title">
          {mode === "login" ? "Login" : "Register"}
        </div>
      </div>
      <div className="main-card-text-container">
        <div>
          <form className="login-form" onSubmit={handleSubmit}>
            {mode === "register" && (
              <label className="main-card-text">
                Username:
                <input
                  type="text"
                  className="login-form-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>
            )}
            <br />
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
            <button type="submit" className="text-font">
              {mode === "login" ? "Login" : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default AuthForm;
