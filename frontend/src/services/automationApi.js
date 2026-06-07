// Small helper to call automation endpoints
import API from "../api";

export async function triggerManual(adminId, customerId) {
  const res = await fetch(`${API}/automation/trigger/manual/${adminId}/${customerId}`, { method: 'POST' });
  return res.json();
}
