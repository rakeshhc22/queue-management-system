import React from "react";
import { Link } from "react-router-dom";

const QueueCard = ({ queue }) => {
  return (
    <div className="queue-card">
      <h3>{queue.name}</h3>
      <p><strong>Location:</strong> {queue.location}</p>
      <p><strong>Created By:</strong> {queue.createdBy}</p>
      <Link to={`/queue/${queue._id}`}>
        <button>View Details</button>
      </Link>
    </div>
  );
};

export default QueueCard;
