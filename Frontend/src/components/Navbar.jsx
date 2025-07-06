import React from "react";
import { Link } from "react-router-dom";
import { PlusSquare, LogOut } from "lucide-react";

import useGetMyInfo from "../hooks/useGetMyInfo";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const {myInfo} = useGetMyInfo();
  const {mutate: logoutMutation, isPending, error} = useLogout()
  return (
   <nav style={{ border: "2px solid black" }}>
      <div>
        <Link to="/">CommUnity</Link>
      </div>
      <div>
        <Link to="/register-service">
          <PlusSquare /> Register Service
        </Link>
        <Link to="/profile">
          <img src={myInfo.profilePicUrl || "/user.webp"} />
          {myInfo.fullName}
        </Link>
        <button onClick={logoutMutation}>
          <LogOut />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;