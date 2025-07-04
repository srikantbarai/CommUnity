import React from "react";
import useLogout from "../hooks/useLogout";

const HomePage = () => {
    const {logoutMutation, isPending, error} = useLogout()
    return (
        <div>
            <h1>Home</h1>
            <button onClick={logoutMutation}>Logout</button>
        </div>
    )
}

export default HomePage