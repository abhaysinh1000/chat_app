import React from "react";
import { useSelector } from "react-redux";
import { useLogoutMutation } from "../features/auth/auth.api";
import { Link } from "react-router-dom";

const DashBoard = () => {
  const user = useSelector((state) => state.auth.user);
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      // clearAuth is already handled inside authApi logout onQueryStarted
      // ProtectedRoute will automatically redirect to login
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center border py-4">
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="border py-2 px-5 rounded-lg cursor-pointer disabled:opacity-50"
        >
          {isLoading ? "Logging out..." : "Logout"}
        </button>

        {user.isVerified ? (
          ""
        ) : (
          <Link to="/verify-email">
            <button className="border mx-10 py-2 px-5 rounded-lg  disabled:opacity-50 cursor-pointer">
              Verify Account
            </button>
          </Link>
        )}
      </div>

      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl text-green-900 font-semibold mb-3">
            Heyy !!! welcome Back
          </h2>
          <div className="flex gap-2 text-4xl font-bold text-amber-900">
            <h1 className="capitalize">{user?.firstName}</h1>
            <h1>{user?.lastName}</h1>
          </div>
          <h1 className="text-lg">{user?.email}</h1>
        </div>
      </div>
    </>
  );
};

export default DashBoard;
