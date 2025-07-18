const Token = require("../models/Token");
const Queue = require("../models/Queue");
const moment = require("moment");

// GET /api/dashboard/stats
exports.getStats = async (req, res) => {
  try {
    const totalQueues = await Queue.countDocuments();
    const totalTokens = await Token.countDocuments();
    const currentQueueLength = await Token.countDocuments({ status: "waiting" });

    // Compute average wait time from served tokens
    const tokensWithTimes = await Token.aggregate([
      {
        $match: {
          servedAt: { $exists: true },
          createdAt: { $exists: true },
        },
      },
      {
        $project: {
          waitTime: { $subtract: ["$servedAt", "$createdAt"] }, // in ms
        },
      },
      {
        $group: {
          _id: null,
          avgWaitTime: { $avg: "$waitTime" }, // ms
        },
      },
    ]);

    const avgWaitTime = tokensWithTimes.length
      ? (tokensWithTimes[0].avgWaitTime / 60000).toFixed(2) // ms to minutes
      : 0;

    res.status(200).json({
      totalQueues,
      totalTokens,
      avgWaitTime,
      currentQueueLength,
    });
  } catch (error) {
    console.error("Error in getStats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/dashboard/analytics
exports.getAnalytics = async (req, res) => {
  try {
    // 1. Queue Length Over Time (last 7 hours)
    const now = moment();
    const queueTrends = [];

    for (let i = 6; i >= 0; i--) {
      const hour = moment(now).subtract(i, "hours");
      const start = hour.startOf("hour").toDate();
      const end = hour.endOf("hour").toDate();

      const count = await Token.countDocuments({
        createdAt: { $gte: start, $lte: end },
      });

      queueTrends.push({
        time: hour.format("HH:mm"),
        count,
      });
    }

    // 2. Wait Time Distribution (seconds)
    const waitTimeBuckets = await Token.aggregate([
      {
        $match: {
          servedAt: { $exists: true },
          createdAt: { $exists: true },
        },
      },
      {
        $project: {
          waitTimeSeconds: {
            $divide: [{ $subtract: ["$servedAt", "$createdAt"] }, 1000],
          },
        },
      },
      {
        $bucket: {
          groupBy: "$waitTimeSeconds",
          boundaries: [0, 60, 120, 300, 600, 900],
          default: "900+",
          output: {
            count: { $sum: 1 },
          },
        },
      },
    ]);

    const waitTimeData = waitTimeBuckets.map((bucket) => ({
      range: typeof bucket._id === "string"
        ? bucket._id
        : `${bucket._id}-${bucket._id + 59} sec`,
      count: bucket.count,
    }));

    res.status(200).json({ queueTrends, waitTimeData });
  } catch (error) {
    console.error("Error in getAnalytics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
