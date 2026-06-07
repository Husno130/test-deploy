import React, { useEffect, useState } from "react";
import { getRules, createRule, toggleRule, deleteRule, getAutomationLogs } from "../services/automationService";

export default function Automation() {
  const adminId = localStorage.getItem("admin_id");
  const [rules, setRules] = useState([]);
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({
    name: "",
    trigger: "customer_added",
    action: "generate_welcome_email",
    active: true,
    config: {}
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const rulesData = await getRules(adminId);
      const logsData = await getAutomationLogs(adminId);
      setRules(rulesData);
      setLogs(logsData);
    } catch (error) {
      console.error("Error loading automation data:", error);
    }
  };

  const handleCreateRule = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    
    // Validate trigger-specific configs
    if (form.trigger === "customer_inactive" && !form.config.days_inactive) {
      alert("Please specify days inactive");
      return;
    }
    if (form.trigger === "weekly_schedule" && !form.config.day_of_week) {
      alert("Please select a day of week");
      return;
    }
    
    setLoading(true);
    try {
      await createRule({ ...form, admin_id: adminId });
      setForm({
        name: "",
        trigger: "customer_added",
        action: "generate_welcome_email",
        active: true,
        config: {}
      });
      loadData();
    } catch (error) {
      console.error("Error creating rule:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (ruleId) => {
    try {
      await toggleRule(ruleId);
      loadData();
    } catch (error) {
      console.error("Error toggling rule:", error);
    }
  };

  const handleDelete = async (ruleId) => {
    if (!window.confirm("Are you sure you want to delete this rule?")) return;
    try {
      await deleteRule(ruleId);
      loadData();
    } catch (error) {
      console.error("Error deleting rule:", error);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Title */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white tracking-tight">Workflow Automation</h2>
          <p className="text-gray-400 mt-1">Design triggers and automate client interactions with AI content generation.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Create Rule Column */}
          <div className="lg:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl h-fit">
            <h3 className="text-xl font-bold text-white mb-4">Create New Workflow</h3>
            <form onSubmit={handleCreateRule} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Workflow Name</label>
                <input
                  type="text"
                  placeholder="e.g. Welcome Email to New Leads"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Trigger Event</label>
                <select
                  value={form.trigger}
                  onChange={(e) => setForm({ ...form, trigger: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                >
                  <option value="customer_added">On New Customer Added</option>
                  <option value="customer_inactive">On Inactive Customer (X days)</option>
                  <option value="weekly_schedule">Weekly Schedule</option>
                  <option value="daily_digest">Daily Digest</option>
                  <option value="manual_trigger">Manual Trigger Only</option>
                </select>
              </div>

              {form.trigger === "customer_inactive" && (
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Days Since Last Activity</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g., 30"
                    value={form.config.days_inactive || ""}
                    onChange={(e) => setForm({ ...form, config: { ...form.config, days_inactive: parseInt(e.target.value) || 0 } })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  />
                </div>
              )}

              {form.trigger === "weekly_schedule" && (
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Day of Week</label>
                  <select
                    value={form.config.day_of_week || ""}
                    onChange={(e) => setForm({ ...form, config: { ...form.config, day_of_week: e.target.value } })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  >
                    <option value="">Select day...</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>
              )}

              {form.trigger === "daily_digest" && (
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Time (24hr format)</label>
                  <input
                    type="time"
                    value={form.config.time || "09:00"}
                    onChange={(e) => setForm({ ...form, config: { ...form.config, time: e.target.value } })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Action</label>
                <select
                  value={form.action}
                  onChange={(e) => setForm({ ...form, action: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                >
                  <option value="generate_welcome_email">Welcome Email (New Customer)</option>
                  <option value="generate_promotional_email">Promotional Email</option>
                  <option value="generate_followup_email">Follow-up Email</option>
                  <option value="generate_reengage_email">Re-engagement Email</option>
                  <option value="generate_thankyou_email">Thank You Email</option>
                </select>
              </div>

              {form.action === "generate_promotional_email" && (
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Promotional Offer</label>
                  <input
                    type="text"
                    placeholder="e.g., 20% off summer sale"
                    value={form.config.offer || ""}
                    onChange={(e) => setForm({ ...form, config: { ...form.config, offer: e.target.value } })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 px-4 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20 text-sm"
              >
                {loading ? "Creating..." : "Activate Workflow"}
              </button>
            </form>
          </div>

          {/* Active Rules List Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4">Active Workflows</h3>
              
              {rules.length === 0 ? (
                <p className="text-gray-400 text-sm">No workflows configured. Define one on the left.</p>
              ) : (
                <div className="divide-y divide-white/10">
                  {rules.map((rule) => (
                    <div key={rule._id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-white text-sm">{rule.name}</h4>
                        <div className="flex flex-wrap gap-2 mt-1 text-xs">
                          <span className="bg-blue-600/20 border border-blue-600/30 text-blue-400 px-2 py-0.5 rounded-md">
                            Trigger: {
                              rule.trigger === "customer_added" ? "New Customer Added" :
                              rule.trigger === "customer_inactive" ? "Inactive Customer" :
                              rule.trigger === "weekly_schedule" ? "Weekly Schedule" :
                              rule.trigger === "daily_digest" ? "Daily Digest" :
                              rule.trigger === "manual_trigger" ? "Manual Only" :
                              rule.trigger
                            }
                          </span>
                          <span className="bg-purple-600/20 border border-purple-600/30 text-purple-400 px-2 py-0.5 rounded-md">
                            Action: {
                              rule.action === "generate_welcome_email" ? "Welcome Email" :
                              rule.action === "generate_promotional_email" ? "Promotional Email" :
                              rule.action === "generate_followup_email" ? "Follow-up Email" :
                              rule.action === "generate_reengage_email" ? "Re-engagement Email" :
                              rule.action === "generate_thankyou_email" ? "Thank You Email" :
                              rule.action
                            }
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggle(rule._id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            rule.active
                              ? "bg-emerald-600/20 border-emerald-600/30 text-emerald-400"
                              : "bg-gray-600/20 border-gray-600/30 text-gray-400"
                          }`}
                        >
                          {rule.active ? "Active" : "Inactive"}
                        </button>
                        <button
                          onClick={() => handleDelete(rule._id)}
                          className="p-1.5 rounded-lg hover:bg-rose-500/20 border border-transparent hover:border-rose-500/30 text-gray-400 hover:text-rose-400 transition-all"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Run Logs */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4">Automation Activity Logs</h3>
              
              {logs.length === 0 ? (
                <p className="text-gray-400 text-sm">No activity recorded yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="text-gray-400 font-bold border-b border-white/10">
                        <th className="pb-3 pr-2">Workflow</th>
                        <th className="pb-3 px-2">Customer</th>
                        <th className="pb-3 px-2">Status</th>
                        <th className="pb-3 px-2">Result</th>
                        <th className="pb-3 pl-2">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-gray-300">
                      {logs.map((log) => (
                        <tr key={log._id}>
                          <td className="py-3 pr-2 font-medium text-white">{log.rule_name}</td>
                          <td className="py-3 px-2">{log.customer_name}</td>
                          <td className="py-3 px-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                log.status === "success"
                                  ? "bg-emerald-600/20 text-emerald-400 border border-emerald-600/30"
                                  : "bg-rose-600/20 text-rose-400 border border-rose-600/30"
                              }`}
                            >
                              {log.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-gray-400 max-w-[200px] truncate" title={log.message}>
                            {log.message}
                          </td>
                          <td className="py-3 pl-2 text-gray-500">
                            {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
