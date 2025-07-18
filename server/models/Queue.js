const mongoose = require("mongoose");

const queueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  description: {
    type: String,
  },
  manager: {
    type: String, // Optional: could be ObjectId if managers are in DB
  },
  tokens: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Token",
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("Queue", queueSchema);
