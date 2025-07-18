import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const AllQueues = () => {
  const [queues, setQueues] = useState([]);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchQueues();
  }, []);

  const fetchQueues = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/queues");
      setQueues(res.data);
    } catch (err) {
      console.error("Failed to fetch queues:", err);
    }
  };

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCreateQueue = async (e) => {
    e.preventDefault();
    try {
      const managerId = localStorage.getItem("managerId") || "default-manager";
      await axios.post("http://localhost:5000/api/queues/create", {
        ...formData,
        managerId,
      });
      setFormData({ name: "", description: "" });
      fetchQueues();
    } catch (err) {
      console.error("Error creating queue:", err);
    }
  };

  const handleQueueClick = (queueId) => {
    localStorage.setItem("queueId", queueId);
    navigate(`/queue/${queueId}`);
  };

  // 🎨 Styles
  const containerStyle = {
    padding: "2rem",
    maxWidth: "700px",
    margin: "0 auto",
    background: "linear-gradient(to bottom right, #f9fafe, #eef4ff)",
    borderRadius: "16px",
    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.05)",
  };

  const titleStyle = {
    fontSize: "1.8rem",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: "1.5rem",
    fontWeight: "600",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    marginBottom: "1rem",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    fontSize: "1rem",
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
  };

  const buttonStyle = {
    padding: "0.75rem 1.5rem",
    background: "linear-gradient(to right, #6a9ff8, #4f8df9)",
    color: "white",
    fontWeight: "600",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(79, 141, 249, 0.25)",
    transition: "all 0.3s ease",
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    background: "linear-gradient(to right, #4f8df9, #3370f1)",
  };

  const queueCardStyle = {
    cursor: "pointer",
    marginBottom: "1rem",
    padding: "1rem",
    background: "#f0faff",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  };

  const queueCardHoverStyle = {
    ...queueCardStyle,
    transform: "scale(1.02)",
    boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
  };

  return (
    <>
      <Navbar />
      <div style={containerStyle}>
        <h2 style={titleStyle}>Create New Queue</h2>
        <form onSubmit={handleCreateQueue} style={{ marginBottom: "2rem" }}>
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Queue Name"
            required
            style={inputStyle}
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Queue Description"
            required
            rows={3}
            style={{ ...inputStyle, resize: "none" }}
          />
          <button
            type="submit"
            style={buttonStyle}
            onMouseOver={(e) => (e.currentTarget.style.background = buttonHoverStyle.background)}
            onMouseOut={(e) => (e.currentTarget.style.background = buttonStyle.background)}
          >
            Create Queue
          </button>
        </form>

        <h3 style={{ ...titleStyle, fontSize: "1.5rem" }}>All Queues</h3>
        {queues.length === 0 ? (
          <p style={{ textAlign: "center", color: "#64748b" }}>No queues available.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {queues.map((queue) => (
              <li
                key={queue._id}
                onClick={() => handleQueueClick(queue._id)}
                style={queueCardStyle}
                onMouseOver={(e) => {
                  Object.assign(e.currentTarget.style, queueCardHoverStyle);
                }}
                onMouseOut={(e) => {
                  Object.assign(e.currentTarget.style, queueCardStyle);
                }}
              >
                <strong style={{ fontSize: "1.2rem", color: "#1e3a8a" }}>{queue.name}</strong>
                <p style={{ margin: 0, color: "#475569", fontSize: "0.95rem" }}>{queue.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default AllQueues;
