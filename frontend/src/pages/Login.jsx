// src/features/auth/pages/LoginPage.jsx

import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLoginMutation } from "../features/auth/auth.api";
import toast from "react-hot-toast";

const Login = () => {
  // Read ?verified=true from the URL
  const [searchParams] = useSearchParams();
  const verified = searchParams.get("verified");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // const [error, setError] = useState("");

  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!formData.email || !formData.password) {
      toast.error("All fields are required");
      return false;
    }
    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      toast.error("Please enter a valid email");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    const isValid = validate();
    if (!isValid) return;

    try {
      await login(formData).unwrap();

      // On success navigate to home page
      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err?.data?.message || "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        {/* VERIFIED SUCCESS BANNER — only shows if ?verified=true */}
        {verified === "true" && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg mb-6">
            ✅ Email verified successfully! You can now log in.
          </div>
        )}

        {/* VERIFIED FAILED BANNER — only shows if ?verified=false */}
        {verified === "false" && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">
            ❌ Verification link is invalid or expired. Please request a new
            one.
          </div>
        )}

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome back</h1>
        <p className="text-gray-500 text-sm mb-6">Login to your account</p>

        <div className="flex flex-col gap-4">
          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
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
              placeholder="Enter your password"
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Forgot password link */}
          <div className="text-right">
            <span
              onClick={() => navigate("/forgot-password")}
              className="text-blue-600 text-xs cursor-pointer hover:underline"
            >
              Forgot password?
            </span>
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
