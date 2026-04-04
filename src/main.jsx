// main.jsx
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

import "./index.css";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import Routes from "./routes.jsx";
import store from "./store/index.js";
import { initializeAuth, selectIsInitialized } from "./store/auth-slice.js";
import { SpaceIcon } from "lucide-react";

function AppInit() {
  const dispatch = useDispatch();
  const isInitialized = useSelector(selectIsInitialized);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center min-h-52 border border-gray-300 h-full">
        <h1>Loading...</h1>
      </div>
    );
  }

  return <Routes />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          pauseOnHover
          theme="colored"
        />
        <AppInit />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
