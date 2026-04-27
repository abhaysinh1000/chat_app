import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CheckEmail = () => {
  const location = useLocation();
  const email = location.state?.email;
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
        {/* Icon */}
        <div className="text-5xl mb-4">📧</div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Check your email
        </h1>

        {/* Message */}
        <p className="text-gray-500 text-sm mb-2">
          We sent a verification link to:
        </p>

        {/* Email address — shows what they signed up with */}
        {email && (
          <p className="text-blue-600 font-medium text-sm mb-6">{email}</p>
        )}

        <p className="text-gray-400 text-xs mb-8">
          Click the link in the email to verify your account. Check your spam
          folder if you don't see it.
        </p>

        {/* Back to login */}
        <button
          onClick={() => navigate("/login")}
          className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default CheckEmail;
