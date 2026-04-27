import { useGetProfileQuery } from "../user/user.api";
import { useDispatch } from "react-redux";
import { clearAuth } from "./authSlice";
import { useEffect } from "react";

const AuthBootstrap = ({ children }) => {
  const { isLoading, isError } = useGetProfileQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isError) {
      dispatch(clearAuth()); // 🔥 force logout state
    }
  }, [isError, dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0a]">
        <div className="w-10 h-10 border-[3px] border-[#333] border-t-[#e63946] rounded-full animate-spin" />
      </div>
    );
  }

  return children;
};

export default AuthBootstrap;