// client/src/components/QueueCharts.js
import React, { useEffect, useState } from "react";
import "../styles/QueueCharts.css";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from "recharts";

const QueueCharts = () => {
  const [queueData, setQueueData] = useState([]);
  const [waitTimeData, setWaitTimeData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/dashboard/analytics");
        setQueueData(res.data.queueTrends); // [{ time: '10:00', count: 5 }]
        setWaitTimeData(res.data.waitTimeData); // [{ range: '0-59 sec', count: 3 }]
        console.log("Wait time data:", res.data.waitTimeData);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="charts-container">
      <div className="chart-box">
        <h4>Queue Length Over Time</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={queueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" name="count" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-box">
        <h4>Wait Time Distribution</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={waitTimeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#82ca9d" name="wait" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default QueueCharts;
