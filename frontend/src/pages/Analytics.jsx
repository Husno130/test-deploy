import React from "react";
import { useEffect, useState } from "react";
import { getAnalytics } from "../services/analyticsService";

export default function Analytics() {
  const adminId = localStorage.getItem("admin_id");
  const [data, setData] = useState({});

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getAnalytics(adminId);
    setData(res);
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">

    <div className="max-w-6xl mx-auto">

      <h2 className="text-4xl font-bold mb-8">
        Analytics Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg">
          <p className="text-gray-300 text-sm mb-2">
            Total Customers
          </p>
          <h3 className="text-3xl font-bold text-blue-400">
            {data.total_customers || 0}
          </h3>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg">
          <p className="text-gray-300 text-sm mb-2">
            Active Customers
          </p>
          <h3 className="text-3xl font-bold text-green-400">
            {data.active_customers || 0}
          </h3>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg">
          <p className="text-gray-300 text-sm mb-2">
            Total Chats
          </p>
          <h3 className="text-3xl font-bold text-purple-400">
            {data.total_chats || 0}
          </h3>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg">
          <p className="text-gray-300 text-sm mb-2">
            Emails Generated
          </p>
          <h3 className="text-3xl font-bold text-yellow-400">
            {data.emails_generated || 0}
          </h3>
        </div>

      </div>

      <div className="mt-8 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold mb-4">
          Performance Overview
        </h3>

        <p className="text-gray-300">
          Monitor customer growth, engagement, chatbot activity, and generated marketing content from a single dashboard.
        </p>
      </div>

    </div>

  </div>
);
}