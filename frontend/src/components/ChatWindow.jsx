import React from "react";
export default function ChatWindow({ chat }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", marginTop: "10px" }}>
      <h3>Chat History</h3>

      {chat.map((msg, i) => (
        <div key={i}>
          <p><b>You:</b> {msg.user}</p>
          <p><b>Bot:</b> {msg.bot}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}