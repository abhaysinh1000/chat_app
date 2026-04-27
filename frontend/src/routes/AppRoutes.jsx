import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login.jsx";
import Signup from "../pages/Signup.jsx";
import ProtectedRoute from "../features/auth/ProtectedRoute.jsx";
import DashBoard from "../pages/DashBoard.jsx";
import Profile from "../pages/Profile.jsx";
import CheckEmail from "../pages/CheckEmail.jsx";
import VerifyEmailPage from "../pages/VerifyEmailPage.jsx";
import GuestRoute from "../features/auth/GuestRoute.jsx";
import ForgetPassword from "../pages/ForgetPassword.jsx";
import Reset_password from "../pages/Reset_password.jsx";
import Verify_email from "../pages/Verify_email.jsx";
import ChatPage from "../features/chat/ChatPage.jsx";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/check-email" element={<CheckEmail />} />
        </Route>

        {/* public Route  */}
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
        <Route path="/reset-password/:token" element={<Reset_password />} />

        {/* Private Route  */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="verify-email" element={<Verify_email />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route />
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
