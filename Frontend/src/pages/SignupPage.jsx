import React, { useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, Shield } from "lucide-react";

import useSignup from "../hooks/useSignup";

const SignupPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: signupMutation, isPending, error } = useSignup();

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full max-h-[90vh] bg-white shadow-xl rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="p-8 md:p-12">
          {error && (
            <div className="text-red-500 text-sm mb-4">
              {error?.response?.data?.data}
            </div>
          )}
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-extrabold text-gray-800">CommUnity</h2>
            <p className="text-sm text-gray-500 mt-1">
              Connect with Trusted Experts Around You !!
            </p>
            <h1 className="text-xl font-semibold mt-4">Create an Account</h1>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="flex items-center text-gray-700 font-medium mb-1 gap-2">
                <User className="w-4 h-4" />
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={signupData.fullName}
                onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label htmlFor="email" className="flex items-center text-gray-700 font-medium mb-1 gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="john@gmail.com"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label htmlFor="password" className="flex items-center text-gray-700 font-medium mb-1 gap-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Choose a strong password"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="flex items-center text-xs text-gray-500 mt-1 gap-1">
                <Shield className="w-3 h-3" />
                Password must be at least 8 characters long
              </p>
            </div>

            <div className="flex items-center text-sm gap-2">
              <input id="terms" type="checkbox" required />
              <label htmlFor="terms" className="text-gray-700">
                I agree to the terms of services and privacy policy
              </label>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-md transition duration-200"
            >
              {isPending ? "Creating Account..." : "Create Account"}
            </button>

            <div className="text-center mt-2 text-sm">
              <p>
                Already have an account?
                <Link to="/login" className="text-indigo-600 font-medium ml-1 hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </form>
        </div>

        <div className="hidden md:flex flex-col items-center justify-center bg-indigo-50 p-10 text-center">
          <img
            src="/logo.jpg"
            alt="CommUnity"
            className="w-52 h-52 object-contain mb-6 rounded-full shadow-md"
          />
          <p className="text-gray-700 text-sm mb-4">
            Discover and review trusted local service providers in every city and state — from tech experts to home
            repair professionals. Explore detailed profiles, read real user feedback, and connect with the right
            people. Smart, reliable, and community-powered.
          </p>
          <p className="font-semibold text-indigo-600 text-lg">Join CommUnity Today</p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;