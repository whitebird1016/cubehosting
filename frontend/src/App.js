import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Router from "./router";
import { ToastContainer } from "react-toastify";
import "react-coinbase-commerce/dist/coinbase-commerce-button.css";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <BrowserRouter>
      <Router />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  );
};

export default App;
