// client/src/pages/DashboardPage.js
import React from "react";
import QueueStats from "../components/QueueStats";
import QueueCharts from "../components/QueueCharts";
import "../styles/DashboardPage.css";
import Navbar from '../components/Navbar';


const DashboardPage = () => {
  return (
    <>
    <Navbar />
    <div className="dashboard-container">
      
      <QueueStats />
      <QueueCharts />
    </div>
    </>
  );
};

export default DashboardPage;
