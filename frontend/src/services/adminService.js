import API from "../api";

export async function getProfile(adminId) {
  const res = await fetch(`${API}/auth/profile/${adminId}`);
  return res.json();
}

export async function updateProfile(adminId, data) {
  const res = await fetch(`${API}/auth/profile/${adminId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
