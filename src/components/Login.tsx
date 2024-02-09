import React from "react";
import AuthForm from "./AuthForm";

interface LoginProps {
  setToken: (token: string) => void;
  setUserId: (userId: number) => void;
}
const Login: React.FC<LoginProps> = ({ setToken, setUserId }) => {
  return (
    <>
      <div className="login-container">
        <AuthForm setToken={setToken} setUserId={setUserId} mode="login" />
        <AuthForm setToken={setToken} setUserId={setUserId} mode="register" />
      </div>
    </>
  );
};

export default Login;
