import { BrowserRouter } from "react-router-dom";
import AuthBootstrap from "./features/auth/AuthBootstrap";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
      <div className="min-h-screen w-full">
        <AuthBootstrap>
          <AppRoutes />
        </AuthBootstrap>
        <Toaster/>
      </div>
    </>
  );
};

export default App;
