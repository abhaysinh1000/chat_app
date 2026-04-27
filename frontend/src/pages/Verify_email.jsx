import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSendEmailVerificationMutation } from "../features/auth/auth.api";

const Verify_email = () => {
  const [email, setemail] = useState();

  const handleOnchange = (e) => {
    setemail(e.target.value);
  };

  const [SendVerifyEmail, { isLoading }] = useSendEmailVerificationMutation();

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Email field are required");
    }

    if (!email.includes("@") || !email.includes(".")) {
      toast.error("Not a Valid Email Format ");
    }

    try {
      await SendVerifyEmail({ email }).unwrap();

      toast.success("Verification Email sent Successfull !! Check You Email");
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong ");
    }
  };

  return (
    <div className=" flex justify-center items-center min-h-screen bg-[#f3f4f6]">
      <div className="flex flex-col items-center justify-center  px-10 py-15 rounded-lg bg-[#ffffff]">
        <h2 className="text-xl font-semibold">Enter You Email</h2>
        <input
          className="py-2 border rounded my-3 border-gray-300 w-80 px-10"
          type="email"
          value={email}
          onChange={handleOnchange}
          placeholder="Enter Email"
        />

        <button
          onClick={handleSubmit}
          className=" border px-8 py-2 rounded-lg bg-green-800 text-white cursor-pointer"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Verify_email;
