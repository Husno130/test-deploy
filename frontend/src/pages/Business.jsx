import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../services/adminService";

export default function Business() {
  const adminId = localStorage.getItem("admin_id");
  const [profile, setProfile] = useState({ business_name: "", business_description: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!adminId) return;
    loadProfile();
  }, [adminId]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const result = await getProfile(adminId);
      if (result.success) {
        setProfile({
          business_name: result.profile.business_name || "",
          business_description: result.profile.business_description || ""
        });
      } else {
        setError(result.message || "Unable to load profile.");
      }
    } catch (err) {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const result = await updateProfile(adminId, profile);
      if (result.success) {
        setMessage("Business profile saved successfully.");
      } else {
        setError(result.message || "Unable to save profile.");
      }
    } catch (err) {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white tracking-tight">Business Profile</h2>
          <p className="text-gray-400 mt-1">Add your company name and description so AI emails and automations use your brand voice.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Business / Company Name</label>
              <input
                type="text"
                value={profile.business_name}
                onChange={(e) => setProfile({ ...profile, business_name: e.target.value })}
                placeholder="Example: Stellar Marketing Co."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Business Description</label>
              <textarea
                value={profile.business_description}
                onChange={(e) => setProfile({ ...profile, business_description: e.target.value })}
                rows={5}
                placeholder="Describe your business, value proposition, or the type of customers you serve."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm resize-none"
              />
            </div>

            {message && (
              <div className="px-4 py-3 rounded-xl bg-emerald-600/10 border border-emerald-600/20 text-emerald-300 text-sm">
                {message}
              </div>
            )}
            {error && (
              <div className="px-4 py-3 rounded-xl bg-rose-600/10 border border-rose-600/20 text-rose-300 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/20 text-sm text-white"
            >
              {saving ? "Saving business profile..." : "Save Business Profile"}
            </button>
          </form>
        </div>

        {loading && (
          <div className="mt-6 text-gray-400 text-sm">Loading current business profile...</div>
        )}
      </div>
    </div>
  );
}
