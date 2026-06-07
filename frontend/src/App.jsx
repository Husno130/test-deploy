import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Chatbot from "./pages/Chatbot";
import Content from "./pages/Content";
import Analytics from "./pages/Analytics";
import Automation from "./pages/Automation";
import Business from "./pages/Business";
import Layout from "./components/Layout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH FLOW */}
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* DASHBOARD & FEATURES */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/customers" element={<Layout><Customers /></Layout>} />
        <Route path="/chatbot" element={<Layout><Chatbot /></Layout>} />
        <Route path="/content" element={<Layout><Content /></Layout>} />
        <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
        <Route path="/automation" element={<Layout><Automation /></Layout>} />
        <Route path="/business" element={<Layout><Business /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}