import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
// import { AuthProvider } from "./context/AuthContext";
import 'react-toastify/dist/ReactToastify.css';
import store from './redux/store.js';
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
        <App />
    </BrowserRouter>
  </Provider>
  // </React.StrictMode>
);