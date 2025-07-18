// client/src/components/QueueStats.jsx
import React, { useEffect, useState } from "react";
import "../styles/QueueStats.css";
import axios from "axios";
import CountUp from "react-countup";
import { FaStream, FaUsers, FaClock, FaListUl } from "react-icons/fa";

const QueueStats = () => {
  const [stats, setStats] = useState({
    totalQueues: 0,
    totalTokens: 0,
    avgWaitTime: 0,
    currentQueueLength: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/dashboard/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

  const statData = [
    {
      label: "Total Queues",
      value: stats.totalQueues,
      icon: <FaStream size={28} />,
      color: "#0077b6",
    },
    {
      label: "Total Tokens",
      value: stats.totalTokens,
      icon: <FaUsers size={28} />,
      color: "#0096c7",
    },
    {
      label: "Avg Wait Time (min)",
      value: stats.avgWaitTime,
      icon: <FaClock size={28} />,
      color: "#48cae4",
    },
    {
      label: "Current Queue Length",
      value: stats.currentQueueLength,
      icon: <FaListUl size={28} />,
      color: "#00b4d8",
    },
  ];

  return (
    <div className="stats-container">
      {statData.map((stat, index) => (
        <div className="stat-box" key={index}>
          <div className="icon-circle " style={{ backgroundColor: stat.color }}>
            {stat.icon}
          </div>
          <h3>
            <CountUp end={+stat.value} duration={2} />
          </h3>
          <p>{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default QueueStats;
