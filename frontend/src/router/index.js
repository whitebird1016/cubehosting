import { Route, Routes } from "react-router-dom";
import Landing from "../pages";
import Layout from "../components/Layout";
import Contact from "../pages/contact";
import Login from "../pages/Auth/login";
import Register from "../pages/Auth/register";
import Purchase from "../pages/purchase";
import Profile from "../pages/profile";
import Server from "../pages/serverinfo";
import Payment from "../pages/payment";

const Router = () => {
  return (
    <Layout>
      <Routes>
        <Route index element={<Landing />} />
        <Route path="/services" element={<Landing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/server" element={<Server />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </Layout>
  );
};

export default Router;
