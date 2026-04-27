import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./App/store.js";
import { BrowserRouter } from "react-router-dom";
import AuthBootstrap from "./features/auth/AuthBootstrap.jsx";
// import { ThemeProvider, createTheme } from "@mui/material/styles";

// const theme = createTheme({
//   palette: {
//     primary: { main: "#1976d2" },
//     secondary: { main: "#e63946" },
//   },
// });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthBootstrap>
          {/* <ThemeProvider theme={theme}> */}
          <App />
          {/* </ThemeProvider> */}
        </AuthBootstrap>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
