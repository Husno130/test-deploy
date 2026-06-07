import API from "../api";

export async function generateContent(data) {
  const res = await fetch(`${API}/generate-content`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function broadcastContent(data) {
  const res = await fetch(`${API}/generate-content/broadcast`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}