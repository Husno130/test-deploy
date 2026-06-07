import API from "../api";

export async function getAnalytics(adminId) {
  const res = await fetch(`${API}/analytics/${adminId}`);
  return res.json();
}