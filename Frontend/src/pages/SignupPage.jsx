import React, { useState } from "react";
import {User, Mail, Lock, Eye, EyeOff, Shield} from "lucide-react"
import {Link} from "react-router-dom"
import useSignup from "../hooks/useSignup"

const SignupPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false)
  const {mutate: signupMutation, isPending, error} = useSignup();

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  }

  return (
    <div className="signup-container">
      <div className="signup-wrapper">
        {error && ( <span> {error?.response?.data?.data} </span>)}
        <div className="welcome-text">
          <p>CommUnity</p>
          <p>Connect with Trusted Experts Around You !!</p>
          <h1>Create an Account</h1>
        </div>
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label htmlFor="fullName">
              <User />
              Full Name
            </label>
            <input 
              id="fullName"
              type="text" 
              placeholder="John Doe" 
              value={signupData.fullName}
              onChange={(e) => setSignupData({...signupData, fullName: e.target.value})} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">
              <Mail/>
              Email
            </label>
            <input 
              id="email"
              type="email" 
              placeholder="john@gmail.com" 
              value={signupData.email}
              onChange={(e) => setSignupData({...signupData, email: e.target.value})} 
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
                placeholder="Choose a strong password" 
                value={signupData.password}
                onChange={(e) => setSignupData({...signupData, password: e.target.value})} 
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
            <p className="password-requirement">
              <Shield className="size-3" />
              Password must be at least 8 characters long
            </p>
          </div>
          
          <div className="form-group">
            <label htmlFor="terms" className="checkbox-label">
              <input 
                id="terms"
                type="checkbox" 
                required
              />
              I agree to the terms of services and privacy policy
            </label>
          </div>
          
          <button type="submit" disabled={isPending} className="submit-button">
            {isPending ? "Creating Account..." : "Create Account"}
          </button>
          
          <div className="login-link">
            <p>Already have an account?
              <Link to="/login">Log in</Link>
            </p>
          </div>
        </form>
      </div>
      <div>
        <img src="logo.jpg" />
        <div>
          <p>Discover and review trusted local service providers in every city and state — from tech experts to home repair professionals. Explore detailed profiles, read real user feedback, and connect with the right people. Smart, reliable, and community-powered.</p>
          <p><strong>Join CommUnity Today</strong></p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;