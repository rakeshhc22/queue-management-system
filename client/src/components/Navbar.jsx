import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const queueId = localStorage.getItem("queueId");

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('queueId');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-button brand">
      QueueManager
      </div>

      <div className="navbar-buttons">
        <Link to="/dashboard" className="nav-button">Dashboard</Link>
        <Link to="/queue" className="nav-button">All Queues</Link>
        {queueId && (
          <Link to={`/queue/${queueId}`} className="nav-button">Queue Detail</Link>
        )}
        <button onClick={handleLogout} className="nav-button logout">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
