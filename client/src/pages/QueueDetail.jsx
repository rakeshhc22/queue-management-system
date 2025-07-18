import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/queue.css";

const QueueDetail = () => {
  const { id } = useParams();
  const [queue, setQueue] = useState({});
  const [tokens, setTokens] = useState([]);
  const [formData, setFormData] = useState({ name: "", phone: "" });

  const fetchQueueData = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/queues/${id}`);
      setQueue(res.data.queue);
      setTokens(res.data.tokens);
    } catch (err) {
      console.error("Error fetching queue data:", err);
    }
  }, [id]);

  useEffect(() => {
    fetchQueueData();
  }, [fetchQueueData]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/queues/${id}/token`, formData);
      setFormData({ name: "", phone: "" });
      fetchQueueData();
    } catch (err) {
      console.error("Error adding token:", err);
    }
  };

  const moveToken = async (tokenId, direction) => {
    try {
      await axios.post(`http://localhost:5000/api/queues/${id}/token/${tokenId}/move-${direction}`);
      fetchQueueData();
    } catch (err) {
      console.error(`Error moving token ${direction}:`, err);
    }
  };

  const cancelToken = async (tokenId) => {
    try {
      await axios.delete(`http://localhost:5000/api/queues/${id}/token/${tokenId}`);
      fetchQueueData();
    } catch (err) {
      console.error("Error cancelling token:", err);
    }
  };

  const serveTopToken = async () => {
  try {
    await axios.post(`http://localhost:5000/api/queues/${id}/serve`);
    fetchQueueData(); // Refresh queue and token list
  } catch (err) {
    console.error("Error serving top token:", err);
  }
};


  return (
    <>
      <Navbar />
      <div style={{ padding: "1rem" }}>
        <div className="queue-detail-container">
          <h2>{queue.name}</h2>

          <form onSubmit={handleSubmit}>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              required
            />
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              required
            />
            <button type="submit">Add Token</button>
          </form>
          

<button onClick={serveTopToken} className="serve-button">
  ✅ Serve Top Token
</button>



          <h3>Tokens:</h3>
          {tokens.length === 0 ? (
            <p>No tokens in this queue.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {tokens.map((token, index) => (
                <li key={token._id} style={{ marginBottom: "1rem" }}>
                  <strong>#{index + 1}</strong> - {token.name} ({token.phone}) [{token.status}]
                  <div>
                    <button
                      onClick={() => moveToken(token._id, "up")}
                      disabled={index === 0}
                    >
                      ↑ Move Up
                    </button>
                    <button
                      onClick={() => moveToken(token._id, "down")}
                      disabled={index === tokens.length - 1}
                    >
                      ↓ Move Down
                    </button>
                    <button onClick={() => cancelToken(token._id)}>Cancel</button>
                  </div>
                  
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default QueueDetail;
