import React from "react"
import { Navigate, Route, Routes } from "react-router-dom"

import SignupPage from "./pages/SignupPage"
import LoginPage from "./pages/LoginPage"
import HomePage from "./pages/HomePage"
import useGetMyInfo from "./hooks/useGetMyInfo"
import ServicePage from "./pages/ServicePage"
import ProfilePage from "./pages/ProfilePage"
import CreateServicePage from "./pages/CreateServicePage"
import EditServicePage from "./pages/EditServicePage"

function App() {
    const {myInfo, isLoading, error} = useGetMyInfo();
    const isAuthenticated = Boolean(myInfo);

    if (isLoading) return <div>Loading...</div>;

    return (
      <>
        <Routes>
          <Route path="/" element={isAuthenticated ? <HomePage /> : <Navigate to="/login"/>} />
          <Route path="/signup" element={!isAuthenticated ? <SignupPage /> : <Navigate to="/"/>} />
          <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/"/>} />
          
          <Route path="/services/:serviceId" element={isAuthenticated ? <ServicePage/> : <Navigate to="/login"/>} />
          <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login"/>} />
          <Route path="/register-service" element={isAuthenticated ? <CreateServicePage/> : <Navigate to="/login"/>} />
          <Route path="/edit-service/:serviceId" element={isAuthenticated ? <EditServicePage /> : <Navigate to="/login"/>} />
          
          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
        </Routes>
      </>
    );
}

export default App