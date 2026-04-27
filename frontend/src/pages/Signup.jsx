// src/features/auth/pages/SignupPage.jsx

import React, { useState } from "react";
import { useSignupMutation } from "../features/auth/auth.api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Signup = () => {
  const [formData, setformData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  // const [error, seterror] = useState("");

  const [Signup, { isLoading }] = useSignupMutation();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.password ||
      !formData.email
    ) {
      toast.error("All fields are requied");
      return false;
    }

    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      toast.error("Enter the valid Email");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Password At least 6 char");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    const isValid = validate();
    if (!isValid) return;

    try {
      await Signup(formData).unwrap();

      navigate("/check-email", { state: { email: formData.email } });
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong bro ");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Create Account
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Fill in the details to get started
        </p>

        <div className="flex flex-col gap-4">
          {/* First Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
