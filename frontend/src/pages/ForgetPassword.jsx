import React, { useState } from "react";
import toast from "react-hot-toast";
import { useForgetPasswordMutation } from "../features/auth/auth.api";

const ForgetPassword = () => {
  const [email, setemail] = useState("");

  const handleOnchange = (e) => {
    setemail(e.target.value);
  };

  //   const resetPassword=useForgetPasswordMutation()
  const [resetPassword, { isLoading }] = useForgetPasswordMutation();

  const handleSubmit = async () => {
    if (!email) {
      return toast.error("Email is required");
    }

    try {
      await resetPassword({ email }).unwrap();
      toast.success("Reset link sent to your email ✅");
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <div className=" flex justify-center items-center min-h-screen bg-[#f3f4f6]">
      <div className="flex flex-col items-center  border-amber-900 px-10 py-15 rounded-lg bg-[#ffffff]">
        <h1 className="text-lg font-bold">
          Enter your email and we’ll send you a reset link
        </h1>
        <input
          type="email"
          onChange={handleOnchange}
          placeholder="Enter email "
          className="border py-2 px-4 w-90 rounded-lg my-3 cursor-pointer"
        />
        <button
          onClick={handleSubmit}
          className=" border  py-2 rounded-lg px-7 cursor-pointer bg-green-900 text-white"
        >
          {isLoading ? "Sending.. " : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default ForgetPassword;
