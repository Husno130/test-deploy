import React, { useEffect, useState } from "react";
import { addCustomer, getCustomers, deleteCustomer, updateCustomer } from "../services/CustomerService";
import { triggerManual } from "../services/automationApi";

const EMPTY_FORM = { name: "", email: "", phone: "", status: "active" };

export default function Customers() {
  const adminId = localStorage.getItem("admin_id");

  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [adding, setAdding] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const data = await getCustomers(adminId);
      setCustomers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error loading customers:", e);
    }
  };

  const add = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setErrorMsg("Name and email are required.");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }
    setAdding(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      await addCustomer({ ...form, admin_id: adminId });
      setForm(EMPTY_FORM);
      setSuccessMsg("✅ Customer added successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
      load();
    } catch (e) {
      setErrorMsg("Failed to add customer. Please try again.");
      setTimeout(() => setErrorMsg(""), 4000);
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (c) => {
    setEditingId(c._id);
    setEditForm({ name: c.name, email: c.email, phone: c.phone, status: c.status });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (customerId) => {
    setSavingId(customerId);
    try {
      await updateCustomer(customerId, editForm);
      setEditingId(null);
      load();
    } catch (e) {
      console.error("Error updating customer:", e);
    } finally {
      setSavingId(null);
    }
  };

  const remove = async (customerId) => {
    if (!window.confirm("Are you sure you want to delete this customer? This cannot be undone.")) return;
    setDeletingId(customerId);
    try {
      await deleteCustomer(customerId);
      load();
    } catch (e) {
      console.error("Error deleting customer:", e);
    } finally {
      setDeletingId(null);
    }
  };

  const runNow = async (customerId) => {
    if (!window.confirm("Run manual workflows for this customer now?")) return;
    try {
      const res = await triggerManual(adminId, customerId);
      if (res && res.success) {
        alert("Workflows triggered successfully.");
      } else {
        alert("Trigger failed: " + (res && res.message ? res.message : "unknown error"));
      }
    } catch (e) {
      console.error("Error triggering workflows:", e);
      alert("Error triggering workflows. See console.");
    }
  };

  const statusColor = (s) =>
    s === "active"
      ? "bg-emerald-600/20 text-emerald-400 border border-emerald-600/30"
      : "bg-gray-600/20 text-gray-400 border border-gray-600/30";

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white tracking-tight">Customer Management</h2>
          <p className="text-gray-400 mt-1">Add, edit, or remove customers from your database.</p>
        </div>

        {/* Add Customer Form */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl mb-8">
          <h3 className="text-xl font-bold text-white mb-5">Add New Customer</h3>

          <form onSubmit={add} className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <input
                value={form.name}
                placeholder="Full Name *"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              />
              <input
                value={form.email}
                placeholder="Email Address *"
                type="email"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              />
              <input
                value={form.phone}
                placeholder="Phone Number"
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              />
            </div>

            {/* Feedback messages */}
            {successMsg && (
              <div className="px-4 py-3 rounded-xl bg-emerald-600/10 border border-emerald-600/20 text-emerald-400 text-sm font-medium">
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="px-4 py-3 rounded-xl bg-rose-600/10 border border-rose-600/20 text-rose-400 text-sm font-medium">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={adding}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/20 text-sm text-white flex items-center gap-2"
            >
              {adding ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Adding to Database...
                </>
              ) : (
                "Add Customer"
              )}
            </button>
          </form>
        </div>

        {/* Customer List */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-bold text-white">
              Customer List
              <span className="ml-2 text-sm font-normal text-gray-400">({customers.length} total)</span>
            </h3>
            <button
              onClick={load}
              className="text-xs text-gray-400 hover:text-white border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>

          {customers.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-400 text-sm">No customers yet. Add your first customer above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/10">
                    <th className="pb-3 pr-4">Name</th>
                    <th className="pb-3 px-4">Email</th>
                    <th className="pb-3 px-4">Phone</th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 pl-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {customers.map((c) => (
                    <tr key={c._id} className="group">
                      {editingId === c._id ? (
                        /* ── Inline Edit Row ── */
                        <>
                          <td className="py-3 pr-4">
                            <input
                              value={editForm.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              className="w-full px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input
                              value={editForm.email}
                              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                              className="w-full px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input
                              value={editForm.phone}
                              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                              className="w-full px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={editForm.status}
                              onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/20 text-white text-sm outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          </td>
                          <td className="py-3 pl-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => saveEdit(c._id)}
                                disabled={savingId === c._id}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-600/30 text-emerald-400 hover:bg-emerald-600/30 text-xs font-semibold transition-all disabled:opacity-50"
                              >
                                {savingId === c._id ? "Saving..." : "Save"}
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white text-xs font-semibold transition-all"
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        /* ── Normal Row ── */
                        <>
                          <td className="py-4 pr-4 font-semibold text-white">{c.name}</td>
                          <td className="py-4 px-4 text-gray-300">{c.email}</td>
                          <td className="py-4 px-4 text-gray-400">{c.phone || "—"}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${statusColor(c.status)}`}>
                              {c.status === "active" ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="py-4 pl-4 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => startEdit(c)}
                                className="px-3 py-1.5 rounded-lg bg-blue-600/20 border border-blue-600/30 text-blue-400 hover:bg-blue-600/30 text-xs font-semibold transition-all"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => runNow(c._id)}
                                className="px-3 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-600/30 text-indigo-400 hover:bg-indigo-600/30 text-xs font-semibold transition-all"
                              >
                                Run Now
                              </button>
                              <button
                                onClick={() => remove(c._id)}
                                disabled={deletingId === c._id}
                                className="px-3 py-1.5 rounded-lg bg-rose-600/20 border border-rose-600/30 text-rose-400 hover:bg-rose-600/30 text-xs font-semibold transition-all disabled:opacity-50"
                              >
                                {deletingId === c._id ? "Deleting..." : "Delete"}
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}