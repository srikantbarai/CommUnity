import React from "react"
import { Navigate, Route, Routes } from "react-router-dom"

import useGetMyInfo from "./hooks/useGetMyInfo"

import SignupPage from "./pages/SignupPage"
import LoginPage from "./pages/LoginPage"
import HomePage from "./pages/HomePage"

function App() {
  const { data, isLoading, error } = useGetMyInfo();
  console.log(data,isLoading,error);
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login"/>} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </>
  )
}

export default App