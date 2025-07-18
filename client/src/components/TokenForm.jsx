import React, { useState } from "react";
import axios from "axios";

const TokenForm = ({ queueId, onTokenAdded }) => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !mobile) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`/api/queue/${queueId}/token`, {
        name,
        mobile,
      });
      setName("");
      setMobile("");
      setError("");
      onTokenAdded(); // Trigger a reload in parent
    } catch (err) {
      console.error("Error adding token:", err);
      setError("Failed to add token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ margin: "1rem 0" }}>
      <h3>Add New Token</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Person Name:</label><br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter person's name"
          />
        </div>
        <div style={{ marginTop: "0.5rem" }}>
          <label>Mobile Number:</label><br />
          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter mobile number"
          />
        </div>
        <button type="submit" disabled={loading} style={{ marginTop: "1rem" }}>
          {loading ? "Adding..." : "Add Token"}
        </button>
        {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}
      </form>
    </div>
  );
};

export default TokenForm;
