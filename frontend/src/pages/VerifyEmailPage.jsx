// src/features/auth/pages/VerifyEmailPage.jsx

import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Directly navigate browser to backend verify URL
    // This lets the backend handle verification and redirect
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-email/${token}`;
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
        <div className="text-5xl mb-4">⏳</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Verifying your email...
        </h1>
        <p className="text-gray-400 text-sm">
          Please wait, this will only take a second.
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;