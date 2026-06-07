import React from "react";
export default function AnalyticsCards({ data }) {
  return (
    <div style={{ display: "flex", gap: "10px" }}>
      
      <div style={cardStyle}>
        <h4>Total Customers</h4>
        <p>{data.total_customers}</p>
      </div>

      <div style={cardStyle}>
        <h4>Active Customers</h4>
        <p>{data.active_customers}</p>
      </div>

      <div style={cardStyle}>
        <h4>Total Chats</h4>
        <p>{data.total_chats}</p>
      </div>

      <div style={cardStyle}>
        <h4>Emails Generated</h4>
        <p>{data.emails_generated}</p>
      </div>

    </div>
  );
}

const cardStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  borderRadius: "8px",
  minWidth: "120px",
  background: "white",
};