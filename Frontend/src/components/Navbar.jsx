import React from "react";
import { Link } from "react-router-dom";
import { PlusSquare, LogOut } from "lucide-react";

import useGetMyInfo from "../hooks/useGetMyInfo";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const { myInfo } = useGetMyInfo();
  const { mutate: logoutMutation, isPending: isPendingLogout } = useLogout();

  return (
    <div className="m-4">
      <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 
                      text-white px-6 py-3 flex justify-between items-center 
                      shadow-lg rounded-xl">
        <div className="text-2xl font-bold tracking-wide">
          <Link to="/" className="hover:text-white/90 transition">CommUnity</Link>
        </div>

        <div className="flex items-center gap-6">
          <Link
            to="/register-service"
            className="flex items-center gap-1 hover:text-white/90 transition"
          >
            <PlusSquare className="w-5 h-5" />
            <span className="hidden sm:inline">Register Service</span>
          </Link>

          <Link
            to="/profile"
            className="flex items-center gap-2 hover:text-white/90 transition"
          >
            <img
              src={myInfo.profilePicUrl || "/user.webp"}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border border-white"
            />
            <span className="hidden sm:inline font-medium">{myInfo.fullName}</span>
          </Link>

          <button
            onClick={logoutMutation}
            className="flex items-center gap-2 hover:text-white/90 transition cursor-pointer"
            disabled={isPendingLogout}
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">{isPendingLogout ? "Logging out..." : "Logout"}</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
