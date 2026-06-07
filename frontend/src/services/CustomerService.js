import API from "../api";

export async function addCustomer(data) {
  const res = await fetch(`${API}/customers/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getCustomers(adminId) {
  const res = await fetch(`${API}/customers/${adminId}`);
  return res.json();
}

export async function deleteCustomer(customerId) {
  const res = await fetch(`${API}/customers/${customerId}`, {
    method: "DELETE",
  });
  return res.json();
}

export async function updateCustomer(customerId, data) {
  const res = await fetch(`${API}/customers/${customerId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}