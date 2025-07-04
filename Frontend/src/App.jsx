import React from "react"
import { Navigate, Route, Routes } from "react-router-dom"

import SignupPage from "./pages/SignupPage"
import LoginPage from "./pages/LoginPage"
import HomePage from "./pages/HomePage"
import useGetMyInfo from "./hooks/useGetMyInfo"

function App() {
  const {myInfo, isLoading, error} = useGetMyInfo();
  const isAuthenticated = Boolean(myInfo)
  if (isLoading) return <div>Loading...</div>;
  return (
    <>
      <Routes>
        <Route path="/" element={isAuthenticated? <HomePage /> : <Navigate to="/login"/>} />
        <Route path="/signup" element={isAuthenticated? <HomePage /> : <SignupPage />} />
        <Route path="/login" element={isAuthenticated? <HomePage /> : <LoginPage />} />
      </Routes>
    </>
  )
}

export default App