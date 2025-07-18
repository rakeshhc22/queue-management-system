const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));     // Auth routes
app.use("/api/queues", require("./routes/queue"));  // Queue routes

// Optional: Include analytics routes only if the file exist

const analyticsRoutes = require("./routes/analytics");
app.use("/api/dashboard", analyticsRoutes);


// Root route - health check
app.get("/", (req, res) => {
  res.send("Queue Management API is running ✅");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
