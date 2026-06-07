import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const adminId = localStorage.getItem("admin_id");
  
  useEffect(() => {
    if (!adminId) {
      navigate("/login");
    }
  }, [adminId, navigate]);
  
  if (!adminId) {
    return null;
  }
  
  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-white">
      {/* Sidebar Navigation */}
      <Navbar />
      
      {/* Main Panel */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {children}
      </main>
    </div>
  );
}
