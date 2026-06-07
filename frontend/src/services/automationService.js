import API from "../api";

export async function getRules(adminId) {
  const res = await fetch(`${API}/automation/${adminId}`);
  return res.json();
}

export async function createRule(data) {
  const res = await fetch(`${API}/automation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function toggleRule(ruleId) {
  const res = await fetch(`${API}/automation/${ruleId}/toggle`, {
    method: "PUT",
  });
  return res.json();
}

export async function deleteRule(ruleId) {
  const res = await fetch(`${API}/automation/${ruleId}`, {
    method: "DELETE",
  });
  return res.json();
}

export async function getAutomationLogs(adminId) {
  const res = await fetch(`${API}/automation/logs/${adminId}`);
  return res.json();
}
