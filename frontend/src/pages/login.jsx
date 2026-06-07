import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await login({ email, password });
      if (res.success) {
        localStorage.setItem("admin_id", res.admin_id);
        navigate("/dashboard");
      } else {
        setError(res.message || "Invalid email or password.");
      }
    } catch (err) {
      setError("Could not connect to the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">

      {/* Brand mark */}
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-500/30">
            M
          </div>
          <span className="text-white font-bold text-lg tracking-wide">Marketo AI</span>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl">

          <h2 className="text-2xl font-bold text-white mb-1 text-center">Welcome back</h2>
          <p className="text-gray-400 text-sm text-center mb-6">Sign in to your admin account</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              placeholder="Email address"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
            />

            <input
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
            />

            {error && (
              <div className="px-4 py-3 rounded-xl bg-rose-600/10 border border-rose-600/20 text-rose-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all text-white py-3 rounded-xl font-semibold text-sm shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : "Sign In"}
            </button>
          </form>

          {/* Switch to Register */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              Create one
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}