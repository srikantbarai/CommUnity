import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: loginMutation, isPending, error } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full max-h-[90vh] bg-white shadow-xl rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        <div className="p-6 md:p-8">
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
            <h1 className="text-xl font-semibold mt-4">Welcome back, login to your account</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="flex items-center text-gray-700 font-medium mb-1 gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="john@gmail.com"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
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
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
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
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-md transition duration-200"
            >
              {isPending ? "Logging in..." : "Login"}
            </button>

            <div className="text-center mt-2 text-sm">
              <p>
                Don’t have an account?
                <Link to="/signup" className="text-indigo-600 font-medium ml-1 hover:underline">
                  Create one
                </Link>
              </p>
            </div>
          </form>
        </div>

        <div className="hidden md:flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
          <img
            src="/logo.jpg"
            alt="CommUnity"
            className="w-52 h-52 object-contain mb-6 rounded-full shadow-md"
          />
          <p className="font-semibold text-indigo-600 text-lg mb-2">Join CommUnity Today</p>
          <p className="text-gray-700 text-sm">
            Discover and review trusted local service providers in every city and state — from tech experts to home
            repair professionals. Explore detailed profiles, read real user feedback, and connect with the right people.
            Smart, reliable, and community-powered.
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;