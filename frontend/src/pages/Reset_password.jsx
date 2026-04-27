import React from "react";
import open_eye from "../assets/open_eye.png";
import close_eye from "../assets/close_eye.png";
import { useState } from "react";
import toast from "react-hot-toast";
import { useResetPasswordMutation } from "../features/auth/auth.api";
import { useNavigate, useParams } from "react-router-dom";

const Reset_password = () => {
  const [show, setShow] = useState(true);
  const [password, setShowpassword] = useState("");

  const [Reset_password, { isLoading }] = useResetPasswordMutation();

  const navigate = useNavigate();

  const { token } = useParams();

  const handleOnchange = (e) => {
    setShowpassword(e.target.value);
  };

  const hanldeShow = () => {
    setShow(!show);
  };

  const handleSubmit = async () => {
    if (!password) {
      return toast.error("password is required");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      await Reset_password({ password, token }).unwrap();

      toast.success("Password Reset Successfull !!  login now ");
      navigate("/login");
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f3f4f6]">
      <div className=" flex flex-col items-center  border-amber-900 px-10 py-15 rounded-lg bg-[#ffffff]">
        <h1 className="text-xl font-semibold py-4">Enter New Password</h1>
        <div className="relative">
          <input
            type={show ? "password" : "text"}
            value={password}
            onChange={handleOnchange}
            className="border py-2 px-4 w-60 rounded-lg my-3 cursor-pointer"
          />
          {show ? (
            <img
              src={open_eye}
              onClick={hanldeShow}
              alt=""
              className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            />
          ) : (
            <img
              src={close_eye}
              onClick={hanldeShow}
              alt=""
              className="w-7 h-9 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            />
          )}
        </div>

        <button
          onClick={handleSubmit}
          className=" border  py-2 rounded-lg px-7 cursor-pointer bg-green-900 text-white"
        >
          {isLoading ? "Re-reseting Password" : "Reset-password"}
        </button>
      </div>
    </div>
  );
};

export default Reset_password;
