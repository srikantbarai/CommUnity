import React, { useState } from "react";
import {Mail, Lock, Eye, EyeOff, Shield} from "lucide-react"
import {Link} from "react-router-dom"
import useLogin from "../hooks/useLogin"

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false)
  const {mutate: loginMutation, isPending, error} = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  }

  return (
    <div className="signup-container">
      <div className="signup-wrapper">
        {error && ( <span> {error?.response?.data?.data} </span>)}
        <div className="welcome-text">
          <p>CommUnity</p>
          <p>Connect with Trusted Experts Around You !!</p>
          <h1>Welcome back, login to your account</h1>
        </div>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">
              <Mail/>
              Email
            </label>
            <input 
              id="email"
              type="email" 
              placeholder="john@gmail.com" 
              value={loginData.email}
              onChange={(e) => setLoginData({...loginData, email: e.target.value})} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">
              <Lock/>
              Password
            </label>
            <div className="password-input-container">
              <input 
                id="password"
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your password" 
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})} 
                required 
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff/> : <Eye/>}
              </button>
            </div>
          </div>
          <button type="submit" disabled={isPending} className="submit-button">
            {isPending ? "Logging in..." : "Login"}
          </button>
          
          <div className="login-link">
            <p>Don't have an account?
              <Link to="/signup">Create one</Link>
            </p>
          </div>
        </form>
      </div>
      <div>
        <img src="logo.jpg" />
        <div>
          <p><strong>Join CommUnity Today</strong></p>
          <p>Discover and review trusted local service providers in every city and state — from tech experts to home repair professionals. Explore detailed profiles, read real user feedback, and connect with the right people. Smart, reliable, and community-powered.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;