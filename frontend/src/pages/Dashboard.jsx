import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const adminId = localStorage.getItem("admin_id");

  const cards = [
    {
      title: "Customers",
      description: "Manage your client base, view profiles, and register new contacts.",
      path: "/customers",
      icon: (
        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: "from-blue-600/10 to-blue-500/5 border-blue-500/20 hover:border-blue-500/40"
    },
    {
      title: "AI Chatbot Assistant",
      description: "Brainstorm marketing copies or ask strategic questions directly to the chatbot.",
      path: "/chatbot",
      icon: (
        <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      color: "from-teal-600/10 to-teal-500/5 border-teal-500/20 hover:border-teal-500/40"
    },
    {
      title: "AI Content Generator",
      description: "Write promotional letters and templates with an advanced AI generation engine.",
      path: "/content",
      icon: (
        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      color: "from-purple-600/10 to-purple-500/5 border-purple-500/20 hover:border-purple-500/40"
    },
    {
      title: "Workflow Automation",
      description: "Set up triggers and rules to send AI welcome messages automatically.",
      path: "/automation",
      icon: (
        <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      color: "from-amber-600/10 to-amber-500/5 border-amber-500/20 hover:border-amber-500/40"
    },
    {
      title: "Analytics",
      description: "Inspect business growth metrics, message logs, and content statistics.",
      path: "/analytics",
      icon: (
        <svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: "from-rose-600/10 to-rose-500/5 border-rose-500/20 hover:border-rose-500/40"
    }
  ];

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Welcome Banner */}
        <div className="mb-10">
          <h2 className="text-4xl font-extrabold text-white tracking-tight">Welcome Back</h2>
          <p className="text-gray-400 mt-2 text-sm">
            Admin Identifier: <span className="font-mono text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">{adminId}</span>
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <Link
              key={idx}
              to={card.path}
              className={`p-6 rounded-2xl bg-gradient-to-br border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/35 flex flex-col justify-between h-[200px] group ${card.color}`}
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center border border-white/5 mb-4 group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{card.description}</p>
              </div>
              <div className="flex justify-end mt-4">
                <span className="text-xs font-semibold text-gray-400 group-hover:text-white flex items-center gap-1.5 transition-colors">
                  Open Feature
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}