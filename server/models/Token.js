const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  tokenNumber: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["waiting", "serving", "served", "canceled"],
    default: "waiting",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  servedAt: {
    type: Date, // 🟢 Add this field
  },
});

module.exports = mongoose.model("Token", tokenSchema);
