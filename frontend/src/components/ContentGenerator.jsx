import React from "react";
export default function ContentGenerator({ output }) {
  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Generated Content</h3>

      <div style={{ background: "#eee", padding: "10px" }}>
        {output || "No content generated yet"}
      </div>
    </div>
  );
}